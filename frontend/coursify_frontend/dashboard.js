const API_BASE = 'http://localhost:8080/api';
const username = localStorage.getItem('username');
if (!username) window.location.href = '../login/login.html';

const allGrid = document.getElementById('allCoursesGrid');
const enrollGrid = document.getElementById('enrollCoursesGrid');
const yourGrid = document.getElementById('yourCoursesGrid');

const allStatus = document.getElementById('allCoursesStatus');
const enrollStatus = document.getElementById('enrollCoursesStatus');
const yourStatus = document.getElementById('yourCoursesStatus');
const yourEmpty = document.getElementById('yourCoursesEmpty');

document.getElementById('sidebarProfileName').textContent = username || 'Student';

// Keep track of enrolled course IDs so the Enroll tab knows which ones are already registered
let enrolledCourseIds = new Set();

function status(el, msg = '', type = '') {
    if (!el) return;
    el.className = 'section-status' + (type ? ' status-' + type : '');
    el.textContent = msg;
}

function icon(type = '') {
    type = String(type).toLowerCase();
    if (type.includes('java')) return 'fa-brands fa-java';
    if (type.includes('python')) return 'fa-brands fa-python';
    if (type.includes('web')) return 'fa-brands fa-html5';
    if (type.includes('sql') || type.includes('database')) return 'fa-solid fa-database';
    if (type.includes('cloud')) return 'fa-solid fa-cloud';
    return 'fa-solid fa-book-open';
}

function card(c, mode = 'all') {
    const isEnrollTab = mode === 'enroll';
    const isYourCoursesTab = mode === 'enrolled';
    const isAlreadyEnrolled = enrolledCourseIds.has(Number(c.courseId)) || enrolledCourseIds.has(String(c.courseId));

    const el = document.createElement('article');
    el.className = 'course-card';
    el.dataset.courseId = String(c.courseId ?? '');

    let ribbonText = 'Course';
    if (isEnrollTab) ribbonText = 'Available Course';
    if (isYourCoursesTab) ribbonText = 'Enrolled';

    el.innerHTML = 
        `<div class="featured-ribbon">${ribbonText}</div>
        <div class="course-image-placeholder"><i class="${icon(c.courseType)}"></i></div>
        <h2 class="course-title"></h2>
        <div class="course-metadata">
            <span class="course-type"><i class="fa-solid fa-tag"></i><span></span></span>
            <span class="duration"><i class="fa-regular fa-clock"></i><span></span></span>
        </div>
        ${isEnrollTab ? `
            <div class="enroll-area">
                <button type="button" class="btn-enroll ${isAlreadyEnrolled ? 'enrolled' : ''}" ${isAlreadyEnrolled ? 'disabled' : ''}>
                    ${isAlreadyEnrolled ? 'Enrolled <i class="fa-solid fa-check"></i>' : 'Enroll Now <i class="fa-solid fa-arrow-right"></i>'}
                </button>
                <div class="enroll-error" hidden></div>
            </div>
         `: ''}
            ${isYourCoursesTab ? `
        <div class="enroll-area">
            <button type="button" class="btn-enroll btn-unenroll">
                Cancel Enrollment <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    `: ''}
    `;

    el.querySelector('.course-title').textContent = c.courseName ?? 'Unnamed Course';
    el.querySelector('.course-type span').textContent = c.courseType ?? 'Course';
    el.querySelector('.duration span').textContent = `${c.durationDays ?? 0} days`;

    if (isEnrollTab && !isAlreadyEnrolled) {
        const b = el.querySelector('.btn-enroll');
        const e = el.querySelector('.enroll-error');
        b.addEventListener('click', () => enrollCourse(el, b, e));
    }

        if (isYourCoursesTab) {
        const unenrollBtn = el.querySelector('.btn-unenroll');
        unenrollBtn.addEventListener('click', async () => {
            if (!confirm(`Cancel your enrollment in "${c.courseName}"?`)) return;
            unenrollBtn.disabled = true;
            unenrollBtn.textContent = 'Cancelling...';
            
            try {
                const res = await fetch(
                    `${API_BASE}/courses/unenroll?studentName=${encodeURIComponent(username)}&courseId=${c.courseId}`,
                    { method: 'DELETE' }
                );
                if (res.ok) {
                    enrolledCourseIds.delete(Number(c.courseId));
                    await loadYourCourses(); // Refresh Your Courses tab instantly
                } else {
                    alert('Unable to cancel enrollment.');
                    unenrollBtn.disabled = false;
                    unenrollBtn.innerHTML = 'Cancel Enrollment <i class="fa-solid fa-xmark"></i>';
                }
            } catch (err) {
                console.error(err);
                alert('Server error while cancelling enrollment.');
                unenrollBtn.disabled = false;
                unenrollBtn.innerHTML = 'Cancel Enrollment <i class="fa-solid fa-xmark"></i>';
            }
        });
    }
    
    return el;

}

// Fetch enrolled courses from the backend for the logged-in student
async function fetchEnrolledCourses() {
    const endpointsToTry = [
        `${API_BASE}/courses/student/${encodeURIComponent(username)}`,
        `${API_BASE}/courses/enrolled/${encodeURIComponent(username)}`,
        `${API_BASE}/auth/profile/${encodeURIComponent(username)}`
    ];
for (const url of endpointsToTry) {
        try {
            const r = await fetch(url, { headers: { Accept: 'application/json' } });
            if (r.ok) {
                const data = await r.json();
                // Handle either a direct array of courses or { enrolledCourses: [...] } / { courses: [...] }
                if (Array.isArray(data)) return data;
                if (Array.isArray(data.enrolledCourses)) return data.enrolledCourses;
                if (Array.isArray(data.courses)) return data.courses;
            }
        } catch (err) {
            // Continue to next candidate endpoint if one fails
        }
    }
    return null;
}

async function loadCourses(grid, st, enroll = false) {
    grid.replaceChildren();
    status(st, 'Loading courses...', 'loading');
    try {
        if (enroll) {
            const enrolledList = await fetchEnrolledCourses();
            if (Array.isArray(enrolledList)) {
                enrolledCourseIds = new Set(enrolledList.map(item => item.courseId ?? item.course?.courseId));
            }
        }

        const r = await fetch(`${API_BASE}/courses`, { headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const courses = await r.json();
        if (!Array.isArray(courses) || !courses.length) {
            status(st, 'No courses available.', 'empty');
            return;
        }
        status(st);
        courses.forEach(c => grid.appendChild(card(c, enroll ? 'enroll' : 'all')));
    } catch (e) {
        console.error(e);
        status(st, 'Unable to load courses right now. Please try again.', 'error');
    }
}

async function loadYourCourses() {
    if (!yourGrid) return;
    yourGrid.replaceChildren();
    if (yourEmpty) yourEmpty.hidden = true;
    status(yourStatus, 'Loading your enrolled courses...', 'loading');

    try {
        const [enrolledData, allCoursesRes] = await Promise.all([
            fetchEnrolledCourses(),
            fetch(`${API_BASE}/courses`, { headers: { Accept: 'application/json' } })
        ]);

        if (!enrolledData) {
            status(yourStatus);
            if (yourEmpty) yourEmpty.hidden = false;
            return;
        }

        const allCourses = allCoursesRes.ok ? await allCoursesRes.json() : [];
        const courseMap = new Map(allCourses.map(c => [Number(c.courseId), c]));

        // Normalize in case backend returns StudentCourse rows (with only courseId) or nested Course objects
        const normalizedCourses = enrolledData.map(item => {
            if (item.courseName) return item;
            if (item.course && item.course.courseName) return item.course;
            return courseMap.get(Number(item.courseId)) || null;
        }).filter(Boolean);

        enrolledCourseIds = new Set(normalizedCourses.map(c => c.courseId));

        status(yourStatus);
        if (normalizedCourses.length === 0) {
            if (yourEmpty) yourEmpty.hidden = false;
            return;
        }

        normalizedCourses.forEach(c => yourGrid.appendChild(card(c, 'enrolled')));
    } catch (e) {
        console.error(e);
        status(yourStatus, 'Unable to load your enrolled courses right now.', 'error');
    }
}

async function enrollCourse(cardEl, button, errorEl) {
    const studentName = localStorage.getItem('username');
    if (!studentName) {
        errorEl.textContent = 'Your session information is missing. Please log in again.';
        errorEl.hidden = false;
        return;
    }
    const raw = cardEl.dataset.courseId;
    const n = Number(raw);
    const courseId = Number.isNaN(n) ? raw : n;

    button.disabled = true;
    button.innerHTML = 'Enrolling... <i class="fa-solid fa-spinner fa-spin"></i>';
    errorEl.hidden = true;

    try {
        const r = await fetch(`${API_BASE}/courses/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ studentName, courseId })
        });
        if (!r.ok) {
            let msg = `Enrollment failed (HTTP ${r.status}).`;
            try {
                const d = await r.json();
                msg = d.message || d.status || d.error || msg;
            } catch {}
            throw new Error(msg);
        }
        enrolledCourseIds.add(courseId);
        button.innerHTML = 'Enrolled <i class="fa-solid fa-check"></i>';
        button.classList.add('enrolled');
    } catch (e) {
        button.disabled = false;
        button.innerHTML = 'Enroll Now <i class="fa-solid fa-arrow-right"></i>';
        errorEl.textContent = e.message || 'Unable to enroll in this course.';
        errorEl.hidden = false;
    }
}

async function openTab(id) {
    document.querySelectorAll('.dashboard-view').forEach(v => v.classList.toggle('active', v.id === id));
    document.querySelectorAll('.nav-item[data-tab]').forEach(a => a.classList.toggle('active', a.dataset.tab === id));
    if (id === 'show-all-courses') await loadCourses(allGrid, allStatus, false);
    if (id === 'enroll-courses') await loadCourses(enrollGrid, enrollStatus, true);
    if (id === 'your-courses') await loadYourCourses();
}

document.querySelectorAll('.nav-item[data-tab]').forEach(a =>
    a.addEventListener('click', e => {
        e.preventDefault();
        openTab(a.dataset.tab);
    })
);

document.getElementById('exploreCoursesButton').addEventListener('click', () => openTab('enroll-courses'));
document.getElementById('browseCoursesFromYourCourses').addEventListener('click', () => openTab('enroll-courses'));

document.getElementById('logoutLink').addEventListener('click', e => {
    e.preventDefault();
    ['username', 'token', 'accessToken', 'refreshToken', 'user'].forEach(k => localStorage.removeItem(k));
    location.href = '../login/login.html';
});

window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (['show-all-courses', 'enroll-courses', 'your-courses'].includes(id)) openTab(id);
});

document.addEventListener('DOMContentLoaded', () =>
    openTab(['show-all-courses', 'enroll-courses', 'your-courses'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'show-all-courses')
);