# College Discovery Platform

A Next.js + Tailwind CSS application for browsing, comparing, and saving colleges.
The app uses Prisma with a PostgreSQL database and NextAuth for authentication.

## Features

- Browse and search colleges
- Compare up to three colleges side-by-side
- Save favorite colleges to your dashboard
- Student reviews, courses, and placement insights
- Responsive mobile-friendly UI with hamburger navigation

## Prerequisites

- Node.js 20+ installed
- npm or yarn
- PostgreSQL database accessible via a connection string

## Local setup

1. Clone the repo

```bash
git clone <repo-url>
cd task
```

2. Install dependencies

```bash
npm install
```

3. Create environment variables

Create a `.env.local` file at the project root with the following values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"
```

- Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your PostgreSQL values.
- `NEXTAUTH_SECRET` should be a long random string.

4. Generate Prisma client

```bash
npm run prisma:generate
```

5. Run database migrations

```bash
npm run prisma:migrate
```

6. Seed sample data

```bash
npm run prisma:seed
```

## Development

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build for production

```bash
npm run build
npm run start
```

## Useful scripts

- `npm run dev` — start the development server
- `npm run build` — build the application for production
- `npm run start` — start the production server
- `npm run lint` — run ESLint
- `npm run format` — run Prettier formatting
- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:migrate` — apply Prisma migrations
- `npm run prisma:seed` — seed the database with example colleges and reviews

## Notes

- The project uses PostgreSQL as the Prisma datasource.
- If you want to use a different database, update `prisma/schema.prisma` and the `DATABASE_URL` accordingly.
- For NextAuth to work correctly, make sure `NEXTAUTH_URL` matches the URL you visit in the browser.

## Troubleshooting

- If `npm run prisma:migrate` fails, verify `DATABASE_URL` and that PostgreSQL is running.
- If auth fails, make sure `NEXTAUTH_SECRET` is set and the application is restarted.

## Project structure

- `src/app` — Next.js App Router pages and API routes
- `src/components` — reusable UI components
- `src/lib` — shared utilities and auth helpers
- `prisma` — database schema and seed script

---

Enjoy building with the College Discovery Platform!
