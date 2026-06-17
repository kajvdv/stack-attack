# stack-attack
Portfolio project that demostrates my knowledge about full-stack web development. This includes:
- backend development with Fastapi
- frontend development with React and Vue
- deployment with Docker
- code organization
- other DevOps practices


## Testing
In /frontend
```
npm run dev
```
In /accept:
```
uv run uvicorn app.main:app --reload --reload-dir ../backend --env-file .env
accept startbrowser 5001 user1
accept startbrowser 5002 user2
pytest
```

## Run
`docker compose up`

Graceful reloads can then be conducted via `docker compose exec -w /etc/caddy frontend caddy reload`.

# Deployment