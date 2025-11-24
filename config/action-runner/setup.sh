#!/bin/bash

cp config/action-runner/signapse-action-runner.service /etc/systemd/system/signapse-action-runner.service

systemctl daemon-reload
systemctl enable signapse-action-runner.service
systemctl start signapse-action-runner.service
sleep 2
systemctl status signapse-action-runner.service
journalctl -u signapse-action-runner.service -n 50 --no-pager