COURSIFY FRONTEND UPDATE

Files:
- dashboard.html
- dashboard.js
- styles.css
- profile.html
- profile.js
- edit-profile.html
- edit-profile.js
- backend-changes.txt

Replace the current dashboard.html with this version and keep the listed files in the same frontend directory.
The dashboard calls GET /api/courses on initial load and whenever Show All Courses or Enroll for Courses is opened.
Enrollment uses POST /api/courses/register with {studentName, courseId}.
Profile pages use localStorage["username"] and do not require a token.
