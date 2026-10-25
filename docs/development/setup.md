# Development setup

## Prerequisites

| Tool           | Version                      | Check         |
| -------------- | ---------------------------- | ------------- |
| Node.js        | 24 LTS                       | node -v       |
| npm            | 11 (bundled with Node.js 24) | npm -v        |
| Docker Desktop | Engine 27 or later, running  | docker info   |
| Git            | 2.41 or later                | git --version |

npm refuses to install on other Node.js versions because .npmrc sets engine-strict.

## Installing Node.js 24 on Windows with nvm for Windows

nvm for Windows has one active version for the whole machine. Choose one of these two approaches.

### Option A: Node.js 24 for this project only (recommended when other projects need older versions)

Install the version without activating it. This does not change the active version used by other projects:

    nvm install 24.22.1

Then create .vscode/settings.json in the project (it is ignored by Git, so it stays on your machine):

    {
      "terminal.integrated.env.windows": {
        "PATH": "${env:LOCALAPPDATA}\\nvm\\v24.22.1;${env:PATH}",
        "NPM_CONFIG_PREFIX": "${env:LOCALAPPDATA}\\nvm\\v24.22.1"
      }
    }

Open a new terminal in VS Code and check:

    node -v
    npm -v

Expected output: v24.22.1 and an npm 11 version. The NPM_CONFIG_PREFIX line matters: without it, npm can pick up an older npm installed globally in %APPDATA%\npm. This setting affects only terminals opened in this VS Code workspace; other terminals and projects keep the machine default.

### Option B: Node.js 24 for every project

nvm for Windows switches versions by changing a link, so the switch must run in a PowerShell window opened with Run as administrator:

    nvm install 24.22.1
    nvm use 24.22.1
    node -v
    npm -v

Expected output: v24.22.1 and an npm 11 version. This changes the version for every project on the machine. To return to an older version later, run nvm use with that version.

If node -v still shows an old version, check the PATH order with:

    where.exe node

The nvm link folder (for example C:\nvm4w\nodejs) must come before any standalone installation such as C:\Program Files\nodejs. A standalone installation can be removed from Windows Settings, Apps, if it is no longer needed.

On macOS or Linux, use nvm or fnm with the version in .nvmrc.

## First run

    npm ci
    Copy-Item .env.example .env
    npm run db:up
    npm run test:integration
    npm run dev

On macOS or Linux, use cp .env.example .env instead of Copy-Item.

Before npm run db:up, edit .env: choose a local database password and use the same password in POSTGRES_PASSWORD and DATABASE_URL. npm ci runs prisma generate automatically; the generated client is written to src/generated and is not committed.

## Browser tests

    npx playwright install chromium
    npm run build
    npm run test:e2e

The tests start the production server on port 3100. HTML reports are written to playwright-report.

## Everyday checks

    npm run verify

This runs lint, format check, type check, writing rules, module boundaries and unit tests. Run integration and browser tests as well before opening a pull request when a change touches the database or the interface.

## Stopping services

    npm run db:down

Data stays in the Docker volume postgres-data. To remove it as well, run docker compose down --volumes.
