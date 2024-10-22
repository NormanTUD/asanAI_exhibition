kill $(lsof -t -i:8999)
# local server 
cd ~/asanai_exhibition
php -S 127.0.0.1:8999
sleep 5