Maintenance Tracker v1.1

Replace these four files in the root of your GitHub repository:
- app.js
- index.html
- styles.css
- sw.js

Do not rename the files: the app references these exact filenames.

Version tracking:
- The app footer displays v1.1.
- Each source file is marked v1.1.
- The service worker cache is maintenance-pwa-v1.1.

Existing task data is preserved:
- The localStorage key remains maintenance-tracker-v1.
- Do not clear Safari website data or delete the existing Home Screen app data during the update.

Changes:
- Removed the "Due soon" status and filter.
- Tasks with a due date today or in the future show "On track".
- Past-due tasks show "Overdue".
- The days remaining/overdue counter and progress bar remain.
