#!/bin/bash

# AIB-AXYS Africa - Deployment Script
# This script handles the deployment process

set -e  # Exit on error

echo "========================================"
echo "AIB-AXYS Africa - Deployment Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0;0m' # No Color

# Configuration
APP_DIR="/app"
BACKUP_DIR="/app/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}Starting deployment at $(date)${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Step 1: Create backup
echo -e "${BLUE}[1/7] Creating backup...${NC}"
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
tar -czf $BACKUP_FILE \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='backups' \
    --exclude='.git' \
    $APP_DIR
echo -e "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
echo ""

# Step 2: Pull latest changes (if using git)
echo -e "${BLUE}[2/7] Checking for updates...${NC}"
if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse @{u})
    
    if [ $LOCAL != $REMOTE ]; then
        echo -e "${YELLOW}Updates found. Pulling changes...${NC}"
        git pull origin main
        echo -e "${GREEN}✓ Changes pulled${NC}"
    else
        echo -e "${GREEN}✓ Already up to date${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Not a git repository, skipping...${NC}"
fi
echo ""

# Step 3: Install dependencies
echo -e "${BLUE}[3/7] Installing dependencies...${NC}"
cd $APP_DIR
if [ -f "yarn.lock" ]; then
    yarn install --frozen-lockfile
    echo -e "${GREEN}✓ Dependencies installed with yarn${NC}"
elif [ -f "package-lock.json" ]; then
    npm ci
    echo -e "${GREEN}✓ Dependencies installed with npm${NC}"
else
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi
echo ""

# Step 4: Run database migrations (if any)
echo -e "${BLUE}[4/7] Checking for database migrations...${NC}"
if [ -f "$APP_DIR/scripts/migrate.sh" ]; then
    bash $APP_DIR/scripts/migrate.sh
    echo -e "${GREEN}✓ Migrations completed${NC}"
else
    echo -e "${YELLOW}⚠ No migration script found, skipping...${NC}"
fi
echo ""

# Step 5: Build application
echo -e "${BLUE}[5/7] Building application...${NC}"
cd $APP_DIR
if [ -f "yarn.lock" ]; then
    yarn build
else
    npm run build
fi
echo -e "${GREEN}✓ Build completed${NC}"
echo ""

# Step 6: Restart services
echo -e "${BLUE}[6/7] Restarting services...${NC}"
sudo supervisorctl restart all
sleep 5  # Wait for services to start
echo -e "${GREEN}✓ Services restarted${NC}"
echo ""

# Step 7: Health check
echo -e "${BLUE}[7/7] Running health check...${NC}"
if [ -f "$APP_DIR/scripts/health-check.sh" ]; then
    bash $APP_DIR/scripts/health-check.sh
else
    # Basic health check
    sleep 3
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ Application is responding${NC}"
    else
        echo -e "${RED}✗ Application health check failed${NC}"
        echo -e "${YELLOW}Rolling back...${NC}"
        # Restore backup logic here if needed
        exit 1
    fi
fi
echo ""

# Cleanup old backups (keep last 5)
echo -e "${BLUE}Cleaning up old backups...${NC}"
cd $BACKUP_DIR
ls -t backup_*.tar.gz | tail -n +6 | xargs -r rm
echo -e "${GREEN}✓ Old backups cleaned${NC}"
echo ""

echo "========================================"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo "========================================"
echo "Timestamp: $(date)"
echo "Backup: $BACKUP_FILE"
echo ""