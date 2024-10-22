sudo pacman -S php

# copy and enable services
sudo cp startWebserver.service /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable startWebserver.service