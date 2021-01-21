# 1 create .env file
cp .env.example .env

# 2 replace parameters with real
nano .env

# 3 install dependencies
npm i

# 4 start docker-compose
docker-compose up -d

# 5 create seeds
npm run seeds:create

# 6 run
npm start
