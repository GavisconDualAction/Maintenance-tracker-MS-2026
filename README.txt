MAINTENANCE TRACKER — INSTALLATION

This is a Progressive Web App (PWA). It is designed for iPhone Safari and does not require a Mac.

IMPORTANT
- The app stores tasks and completion history in the browser's local storage on this device.
- Clearing Safari website data can erase the app's saved tasks. Export/backup is not yet included.
- To install as a Home Screen app, the files must be hosted on an HTTPS website.
- The app is not currently published to the App Store.

EASIEST HOSTING METHOD: GITHUB PAGES
1. On an iPhone or computer, create/sign in to a GitHub account at https://github.com
2. Create a new public repository, for example: maintenance-tracker
3. Upload all files in this ZIP to the repository's top level (not inside another folder).
4. In the repository, open Settings → Pages.
5. Under Build and deployment, choose Deploy from a branch.
6. Select the main branch and /(root), then Save.
7. Wait for GitHub Pages to publish. The site address will appear on the Pages settings screen.
8. Open that HTTPS address in Safari on your iPhone.
9. Tap Share → Add to Home Screen → Add.

USAGE
- Tap Add task to create a task.
- Choose an interval in days, weeks, months or years.
- Set Last completed to the last date the task was actually done. For a task never done, use today's date.
- Tap a task to view its details, completion count and history.
- Tap Task complete to record today's date and start the next interval.
- The dashboard shows remaining days or overdue days. The bar indicates progress through the current interval.

DATE BEHAVIOUR
Monthly and yearly intervals use calendar arithmetic. If a target month does not contain the original day (for example, adding one month to 31 January), the due date is the last day of the target month.
