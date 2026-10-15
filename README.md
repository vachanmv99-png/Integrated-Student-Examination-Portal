# Student Exam Portal

## Run locally
`npm install && npm run dev`

Without Firebase environment variables the app runs in a fully functional seeded demo mode. Login as **student@demo.edu** or **admin@demo.edu** with any password. Data is retained in browser local storage.

## Firebase production setup
Copy `.env.example` to `.env` and provide Firebase web configuration. Create Auth users and set their custom claim `role` to `student` or `admin`; create matching `students/{uid}` documents. Deploy rules and Cloud Functions using the Firebase CLI. The client deliberately has no direct write access to applications/payments—submission belongs in the callable function.

The demo account mechanism is local only; no credentials are shipped for production.
