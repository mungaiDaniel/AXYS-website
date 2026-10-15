#!/bin/bash

# AIB-AXYS Africa - Health Check Script
# This script checks the health of all services

echo "========================================"
echo "AIB-AXYS Africa - Health Check"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0;0m' # No Color

# Check Next.js Service
echo "Checking Next.js Service..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ Next.js is running${NC}"
else
    echo -e "${RED}✗ Next.js is not responding${NC}"
    echo "Checking supervisor status..."
    sudo supervisorctl status nextjs
fi
echo ""

# Check MongoDB Connection
echo "Checking MongoDB Connection..."
if sudo supervisorctl status mongodb | grep -q "RUNNING"; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
    # Test connection
    if mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ MongoDB connection successful${NC}"
    else
        echo -e "${YELLOW}⚠ MongoDB running but connection test failed${NC}"
    fi
else
    echo -e "${RED}✗ MongoDB is not running${NC}"
    sudo supervisorctl status mongodb
fi
echo ""

# Check Disk Space
echo "Checking Disk Space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    echo -e "${GREEN}✓ Disk usage: ${DISK_USAGE}%${NC}"
elif [ $DISK_USAGE -lt 90 ]; then
    echo -e "${YELLOW}⚠ Disk usage: ${DISK_USAGE}% (Warning)${NC}"
else
    echo -e "${RED}✗ Disk usage: ${DISK_USAGE}% (Critical)${NC}"
fi
echo ""

# Check Memory Usage
echo "Checking Memory Usage..."
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ $MEM_USAGE -lt 80 ]; then
    echo -e "${GREEN}✓ Memory usage: ${MEM_USAGE}%${NC}"
elif [ $MEM_USAGE -lt 90 ]; then
    echo -e "${YELLOW}⚠ Memory usage: ${MEM_USAGE}% (Warning)${NC}"
else
    echo -e "${RED}✗ Memory usage: ${MEM_USAGE}% (Critical)${NC}"
fi
echo ""

# Check API Health
echo "Checking API Health..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/page-visibility)
if [ "$API_RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ API is responding correctly${NC}"
else
    echo -e "${RED}✗ API returned status code: $API_RESPONSE${NC}"
fi
echo ""

# Check Recent Logs for Errors
echo "Checking Recent Logs for Errors..."
ERROR_COUNT=$(tail -n 100 /var/log/supervisor/nextjs.err.log 2>/dev/null | grep -i "error" | wc -l)
if [ $ERROR_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ No recent errors in logs${NC}"
else
    echo -e "${YELLOW}⚠ Found $ERROR_COUNT error(s) in recent logs${NC}"
    echo "Latest errors:"
    tail -n 100 /var/log/supervisor/nextjs.err.log 2>/dev/null | grep -i "error" | tail -n 5
fi
echo ""

# Summary
echo "========================================"
echo "Health Check Complete"
echo "========================================"
echo "Timestamp: $(date)"
echo ""