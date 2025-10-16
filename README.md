# Campus Lost & Found

Campus Lost & Found is a simple digital bulletin board for university communities. Students can publish lost or found items, browse the latest reports, and reconnect belongings with their owners.

## Monorepo layout

- `client/` – React + Vite frontend styled with Tailwind CSS.
- `server/` – Express + MongoDB backend powered by Mongoose.

## Getting started

1. **Install dependencies**
	```bash
	npm install --workspace client
	npm install --workspace server
	```
2. **Configure environment variables**
	- Duplicate `server/.env.example` to `server/.env` and supply your MongoDB Atlas connection string.
	- Optionally add `VITE_API_BASE_URL` in `client/.env` when pointing to a remote API (defaults to `http://localhost:4000`).
3. **Run the backend**
	```bash
	npm run dev:server
	```
4. **Run the frontend**
	```bash
	npm run dev:client
	```

Frontend runs on <http://localhost:5173> and expects the API at <http://localhost:4000> during local development.

## Deployment notes

- **Frontend (Vercel)**: Configure a new Vercel project pointing to `/client` with the build command `npm run build` and output directory `dist`. Provide `VITE_API_BASE_URL` in the Vercel dashboard so the UI can reach the hosted API.
- **Backend (Zeabur)**: Deploy the `server` folder. Set environment variables `MONGODB_URI` and `PORT` (Zeabur often provides `PORT`). Use the start command `npm run start`.

## API overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/posts` | Create a lost/found post |
| `GET` | `/api/posts` | List posts (optional `status=lost|found`) |
| `GET` | `/api/posts/:id` | Get a post by ID |

All responses are JSON. Validation errors return HTTP 400; missing records return HTTP 404.