docker compose down
docker compose build api --no-cache
docker compose up -d --force-recreate api
docker compose up -d --force-recreate ngrok
docker logs -f badminton-api