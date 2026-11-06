# Production Deployment

**De-Greenacres now deploys to Render.** Vercel is no longer the deployment target.

Use the complete, current guide in **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)**. It covers:

- Render Blueprint setup with `render.yaml`
- Required Supabase, Resend, and public environment variables
- Node.js 22 build and start commands
- The `/api/health` health check
- Supabase authentication redirect URLs
- Production smoke tests
- Custom-domain DNS and TLS cutover
- Safe retirement of the previous Vercel deployment

## Deployment summary

| Setting | Value |
| --- | --- |
| Service type | Render Web Service |
| Runtime | Node.js 22 (`22.23.4` in `.nvmrc`) |
| Region | Frankfurt |
| Branch | `main` |
| Build command | `npm ci && npm run build` |
| Start command | `npm run start` |
| Health check | `/api/health` |
| Database, Auth, Storage | Existing Supabase project |
| Transactional email | Resend |

Do not use a Render Static Site: this application requires the Next.js Node.js server for dynamic pages, API route handlers, authentication, and `proxy.ts`.

Do not commit real environment values. Values marked `sync: false` in `render.yaml` are entered through the Render dashboard.
