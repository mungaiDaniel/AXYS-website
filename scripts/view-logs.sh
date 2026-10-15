#!/bin/bash

# AIB-AXYS Africa - Log Viewer Script
# Quick script to view application logs

echo "========================================"
echo "AIB-AXYS Africa - Log Viewer"
echo "========================================"
echo ""

if [ "$1" == "error" ] || [ "$1" == "err" ]; then
    echo "Viewing ERROR logs (last 50 lines):"
    echo "========================================"
    tail -n 50 /var/log/supervisor/nextjs.err.log
elif [ "$1" == "live" ] || [ "$1" == "follow" ]; then
    echo "Following logs (Ctrl+C to stop):"
    echo "========================================"
    tail -f /var/log/supervisor/nextjs.out.log
else
    echo "Viewing OUTPUT logs (last 50 lines):"
    echo "========================================"
    tail -n 50 /var/log/supervisor/nextjs.out.log
    echo ""
    echo "Usage:"
    echo "  ./view-logs.sh           - View standard output logs"
    echo "  ./view-logs.sh error     - View error logs"
    echo "  ./view-logs.sh live      - Follow logs in real-time"
fi

echo ""