#!/bin/bash

# AIB-AXYS Africa - Service Restart Script
# Quick script to restart all services

echo "Restarting all services..."
sudo supervisorctl restart all

echo "Waiting for services to start..."
sleep 3

echo "Checking service status:"
sudo supervisorctl status

echo ""
echo "Services restarted. Checking health..."
sleep 2

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo "✓ Application is responding"
else
    echo "✗ Application is not responding"
    echo "Check logs with: tail -n 50 /var/log/supervisor/nextjs.err.log"
fi