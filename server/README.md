# Machiko API

The shop's own customer database: the founding list with a record of every
consent, reservation requests, and the export for email and SMS. Node.js
(Express) and MySQL, made to run as a **Node.js project on SiteGround**.

The website works without it. Once it is running and the website knows its
address, the form at machiko.rs/join and the app's Reserve screen send here.

## What it does

| Address | What |
| --- | --- |
| `POST /api/join` | A sign-up. Checks it, stores the person and the consents given (email, and SMS if ticked), sends an email asking them to confirm. |
| `GET /api/confirm?token=…` | The button in that email. Marks the person confirmed, copies them to Brevo if Brevo is set up, and returns them to machiko.rs/join. |
| `GET /api/unsubscribe?c=…` | The "leave the list" link. Withdraws both consents and records it. |
| `POST /api/reservations` | A table or workshop request. Stored, and emailed to the shop. |
| `/admin` | A page for John and Katarina: the numbers, where people came from, the latest sign-ups and reservations, CSV downloads, and "show or delete one person". Opens with `ADMIN_TOKEN`. |
| `GET /api/health` | Says whether the database, email and Brevo are set up. |

What is stored: email, first name, mobile (only with SMS consent), language,
where the sign-up came from, and dates. Every consent given, confirmed or
withdrawn is one line in `consent_log`, with the wording version shown at the
time. The visitor's network address is kept only as a one-way hash.

Built in: a limit of 8 sign-ups an hour per connection, a hidden field that
catches form bots, calls accepted only from the sites in `ALLOWED_ORIGINS`,
CSV cells that cannot run as spreadsheet formulas.

## Put it on SiteGround (once)

SiteGround runs Node.js projects on GrowBig, GoGeek and Cloud plans.

1. **Create the project.** Client Area → Websites → Node.js Projects → add a
   project from GitHub: repository `DaDuckDiveDev/matcha-shop`, branch
   **`api`**. Node 22, npm, no build command. (The `api` branch holds only this
   folder; the workflow `.github/workflows/api.yml` rebuilds it from `server/`
   on `main` whenever the code changes, after the tests pass.)
2. **Create the database.** In the project's Site Tools → MySQL: one database,
   one user, give the user all rights on it. Note the names and the password.
3. **Create the mailbox** the confirmations come from, for example
   hello@machiko.rs: Site Tools of machiko.rs → Email → Accounts. The same page
   shows the SMTP host and port.
4. **Enter the settings.** Site Tools → Node.js → Environment variables. The
   names and what each is for are in `.env.example`. Two of them are passwords
   you invent: run `openssl rand -hex 32` twice, once for `ADMIN_TOKEN` and
   once for `TOKEN_SECRET`.
5. **Check it.** Open the project's temporary address followed by
   `/api/health`. You want `"ok": true`, `"database": true`, `"email": true`.
6. **Give it its address.** Point `api.machiko.rs` at the project (Client Area →
   Node.js Projects → the project's domain) and let SSL install.
7. **Tell the website.** In the GitHub repository: Settings → Secrets and
   variables → Actions → Variables → `API_URL` = `https://api.machiko.rs`. Then
   run the workflow "Deploy to SiteGround" (or push anything to `main`).
8. **Try it.** Sign up at machiko.rs/join with your own address, tap the
   button in the email, and look at `https://api.machiko.rs/admin`.

The server starts with `npm start` and listens on the port the platform
passes in `PORT` (3000 if none). SiteGround's pages do not say how their
platform passes the port, so step 5 is the test; if the health address does
not answer, the build log in Site Tools → Node.js → Logs says why.

The app writes its own log to `logs/app.log` (SiteGround's panel does not
show an app's console output). It never logs an email address or a phone
number.

## Brevo (optional)

Set `BREVO_API_KEY` and `BREVO_LIST_ID` and every confirmed sign-up is copied
to that Brevo list with the attributes FIRSTNAME, SMS, LANG, SOURCE, OPT_IN and
SMS_OPT_IN (create them in Brevo first). People who leave are blocked in Brevo
too. Without it, download the list from `/admin` and import the file.

## Work on it

```bash
cd server
npm install
cp .env.example .env        # point it at a local MySQL or MariaDB
npm run dev                 # http://localhost:3000/api/health
npm test                    # needs TEST_DATABASE_URL=mysql://user:pass@127.0.0.1:3306/a_test_database
```

To try the website against it, start the site with
`VITE_API_URL=http://localhost:3000 npm run dev` and add
`http://localhost:5173` to `ALLOWED_ORIGINS`.

## Not here yet

Orders, payment and stamps still live on the guest's phone. Moving them here
needs a staff screen and a decision about the till (POS); the tables are
laid out so that `customers` is the one place a person lives.
