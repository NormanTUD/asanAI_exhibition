sudo pacman -S php

# copy and enable services
chmod +x startWebserver.sh
sudo cp startWebserver.service /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable startWebserver.service