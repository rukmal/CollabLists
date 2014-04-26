# Script to start MongoDB on a separate thread, and start node

npm install
mongod --fork --dbpath /mnt/database/db/
sudo forever start app.js