# AIB-AXYS Africa - Utility Scripts

This directory contains utility scripts for managing the AIB-AXYS Africa application.

## Available Scripts

### 1. health-check.sh
Performs a comprehensive health check of all services.

**Usage:**
```bash
bash scripts/health-check.sh
```

**Checks:**
- Next.js service status
- MongoDB connection
- Disk space usage
- Memory usage
- API health
- Recent error logs

---

### 2. deploy.sh
Handles the complete deployment process with automatic backup and rollback.

**Usage:**
```bash
bash scripts/deploy.sh
```

**Steps:**
1. Creates backup
2. Pulls latest changes (if git repository)
3. Installs dependencies
4. Runs migrations
5. Builds application
6. Restarts services
7. Performs health check
8. Cleans up old backups

---

### 3. restart-services.sh
Quickly restarts all services and checks health.

**Usage:**
```bash
bash scripts/restart-services.sh
```

---

### 4. view-logs.sh
Views application logs with various options.

**Usage:**
```bash
# View standard output logs
bash scripts/view-logs.sh

# View error logs
bash scripts/view-logs.sh error

# Follow logs in real-time
bash scripts/view-logs.sh live
```

---

## Making Scripts Executable

To make all scripts executable:
```bash
chmod +x scripts/*.sh
```

## Best Practices

1. **Always run health-check.sh** after making changes
2. **Use deploy.sh** for production deployments (includes automatic backup)
3. **Check logs regularly** using view-logs.sh
4. **Monitor disk space** - backups are kept in /app/backups

## Backup Management

Backups are stored in `/app/backups/` and follow the naming pattern:
```
backup_YYYYMMDD_HHMMSS.tar.gz
```

The deploy script automatically keeps the last 5 backups and removes older ones.

## Troubleshooting

If services fail to start:
```bash
# Check service status
sudo supervisorctl status

# View error logs
bash scripts/view-logs.sh error

# Restart services
bash scripts/restart-services.sh
```

## Environment Variables

Make sure the following are set in `/app/.env`:
- `MONGO_URL`
- `DB_NAME`
- `JWT_SECRET`
- `NEXT_PUBLIC_BASE_URL`

## Support

For issues or questions, contact the development team.