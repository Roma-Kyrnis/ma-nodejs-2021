# 1 create .env and admins.json file
cp .env.example .env
cp admins.example.json admins.json

# 2 replace parameters with real
nano .env
nano admins.json

# 3 install dependencies
npm i

# 4 start docker-compose
docker-compose up -d

# 5 start migrations
knex:migrate:latest || pg:migrate:up

# 6 run
npm start
