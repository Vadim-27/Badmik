docker compose down
docker builder prune -a -f
docker compose build --no-cache api
docker compose up -d api ngrok
docker logs ngrok