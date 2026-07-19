# Deploying Green Idea to Render

This guide walks through deploying the `green-idea-app` repository to Render using the existing `render.yaml` configuration.

Preconditions
- Your code is pushed to GitHub at https://github.com/METHUNSM001/green-idea-app
- You have a Render account and access to the project: https://dashboard.render.com/project/prj-d9egc7t7vvec7394tij0

High-level steps
1. Connect the GitHub repository to Render (if not already connected).
2. Ensure Render picks up the repository's `render.yaml` file — it defines both the backend web service and the frontend static site and a MySQL database.
3. Configure environment variables for the backend and frontend in the Render dashboard.
4. Trigger a deploy and watch logs for errors.

Backend env vars (set in the `green-idea-backend` service settings)
- `JWT_SECRET` — strong random secret
- `MAIL_USERNAME` — SMTP username (Gmail address if using Gmail)
- `MAIL_PASSWORD` — SMTP password or app password
- `GROQ_API_KEY` — Groq AI key
- `OPENWEATHER_API_KEY` — OpenWeather API key
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — MySQL connection details (Render DB details or external DB)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — admin credentials (optional but present in code)

Frontend env vars (set in the `green-idea-frontend` static site settings)
- `VITE_API_URL` — URL of the deployed backend, e.g. `https://green-idea-backend.onrender.com`

Database
- The repository's `render.yaml` contains a `green-idea-mysql` database. If you create it in the same Render project, copy the generated host, user, password and database name into the backend env vars.

Local testing commands
1. Backend (from repository root)
```bash
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
export $(cat .env.example | xargs)   # on Windows use a .env loader or set vars in PowerShell
python app.py
```

2. Frontend
```bash
cd frontend
npm ci
npm run dev   # or npm run build to create production build
```

Notes and fixes applied in this repo copy
- Added `backend/.env.example` listing required env vars.
- Normalized `backend/requirements.txt` to UTF-8 plain text (previous file appeared encoded) and listed core dependencies.

Troubleshooting
- If builds fail due to dependency versions, open the service logs in Render to see pip errors; pin versions in `backend/requirements.txt` if necessary.
- If the backend cannot connect to MySQL, verify `DB_HOST` is reachable from Render (use the internal Render DB host or allow external access for an external DB).

I implemented (A) and prepared helpers for (B):


To complete full automation, do the following in GitHub:

1. Add repository secrets:
	- `RENDER_API_KEY` — your Render API key
	- `RENDER_BACKEND_SERVICE_ID` — the Render service id for the backend (format `srv-...`)
	- `RENDER_FRONTEND_SERVICE_ID` — the Render service id for the frontend (format `srv-...`)

2. The workflow `.github/workflows/render_deploy.yml` will now run on pushes to `main` and trigger deploys for the two services using the above secrets.

3. Optional: If you want CI to also set env vars in Render from a file, create `.render_env.json` (not committed with secrets) and use `tools/render_api.py set-env --service-id srv-... --env-file .render_env.json` locally or in a protected runner.

Let me know if you want me to add a GitHub Actions step that reads `.render_env.json` from the repo and sets env vars automatically (not recommended because it may contain secrets). I can also prepare an alternative that reads env values from GitHub Secrets and sets them via the Render API during CI.
```bash
python tools/render_env_helper.py --project prj-d9egc7t7vvec7394tij0 --file .render_env.json
```

This prints `curl` templates to set env vars for each service. You must replace `{service_id}` with the real service id (available in the Render dashboard) and set `RENDER_API_KEY` in your shell. Example curl output looks like:

```bash
curl -X POST https://api.render.com/v1/services/{service_id}/env-vars \
	-H "Accept: application/json" -H "Authorization: Bearer $RENDER_API_KEY" \
	-H "Content-Type: application/json" -d '[{"key":"JWT_SECRET","value":"...","sync":false}, ...]'
```

If you'd like, I can prepare a fully automated Render API script that creates services and sets env vars — you'll need to provide a Render API key or run it locally.
