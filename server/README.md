# Server Setup

## MongoDB (Docker)

From repository root:

```bash
docker compose up -d mongodb mongo-express
```

- MongoDB: `localhost:27017`
- Mongo Express UI: `http://localhost:8081`

This project reads the DB connection string from `server/.env` via `DB=...`.

## Run the server

```bash
cd server
npm run dev
```

If MongoDB is not reachable, the server exits with an error so startup failures are clear.
