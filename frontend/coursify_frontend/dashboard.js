const API_BASE='http://localhost:8080/api';
const username=localStorage.getItem('username');
if(!username) window.location.href='../login/login.html';
const allGrid=document.getElementById('allCoursesGrid'), enrollGrid=document.getElementById('enrollCoursesGrid');
const allStatus=document.getElementById('allCoursesStatus'), enrollStatus=document.getElementById('enrollCoursesStatus');
document.getElementById('sidebarProfileName').textContent=username||'Student';

function status(el,msg='',type='')
{
    el.className='section-status'+(type?' status-'+type:'');
    el.textContent=msg;
}

function icon(type='')
{
    type=String(type).toLowerCase();
    if(type.includes('java'))return'fa-brands fa-java';
    if(type.includes('python'))return'fa-brands fa-python';
    if(type.includes('web'))return'fa-brands fa-html5';
    if(type.includes('sql')||type.includes('database'))return'fa-solid fa-database';
    if(type.includes('cloud'))return'fa-solid fa-cloud';return'fa-solid fa-book-open';
}

function card(c,enroll=false)
{
    const el=document.createElement('article');
    el.className='course-card';
    el.dataset.courseId=String(c.courseId);
    el.innerHTML=`<div class="featured-ribbon">${enroll?'Available Course':'Course'}</div><div class="course-image-placeholder"><i class="${icon(c.courseType)}"></i></div><h2 class="course-title"></h2><div class="course-metadata"><span class="course-type"><i class="fa-solid fa-tag"></i><span></span></span><span class="duration"><i class="fa-regular fa-clock"></i><span></span></span></div>${enroll?'<div class="enroll-area"><button type="button" class="btn-enroll">Enroll Now <i class="fa-solid fa-arrow-right"></i></button><div class="enroll-error" hidden></div></div>':''}`;
el.querySelector('.course-title').textContent=c.courseName??'Unnamed Course';
el.querySelector('.course-type span').textContent=c.courseType??'Course';
el.querySelector('.duration span').textContent=`${c.durationDays??0} days`;
if(enroll)
    {
        const b=el.querySelector('.btn-enroll'),e=el.querySelector('.enroll-error');
        b.addEventListener('click',()=>enrollCourse(el,b,e));
    }
    return el;
}
async function loadCourses(grid,st,enroll=false){
    grid.replaceChildren();
    status(st,'Loading courses...','loading');
    try{
        const r=await fetch(`${API_BASE}/courses`,{headers:{Accept:'application/json'}});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    const courses=await r.json();
    if(!Array.isArray(courses)||!courses.length){status(st,'No courses available.','empty');
        return;
    }
    status(st);
    courses.forEach(c=>grid.appendChild(card(c,enroll)));
}catch(e)
{console.error(e);
    status(st,'Unable to load courses right now. Please try again.','error');
}
}
async function enrollCourse(cardEl,button,errorEl)
{
    const studentName=localStorage.getItem('username');
    if(!studentName)
        {errorEl.textContent='Your session information is missing. Please log in again.';
            errorEl.hidden=false;
            return;
        }
        const raw=cardEl.dataset.courseId,n=Number(raw),courseId=Number.isNaN(n)?raw:n;
        button.disabled=true;
        button.innerHTML='Enrolling... <i class="fa-solid fa-spinner fa-spin"></i>';
        errorEl.hidden=true;
        try
        {
            const r=await fetch(`${API_BASE}/courses/register`,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({studentName,courseId})});
            if(!r.ok)
                {
                    let msg=`Enrollment failed (HTTP ${r.status}).`;
            try
            {
                const d=await r.json();
                msg=d.message||d.error||msg;
            }catch{

            }throw new Error(msg);
        }
        button.innerHTML='Enrolled <i class="fa-solid fa-check"></i>';
        button.classList.add('enrolled');
    }catch(e)
    {
        button.disabled=false;
        button.innerHTML='Enroll Now <i class="fa-solid fa-arrow-right"></i>';
        errorEl.textContent=e.message||'Unable to enroll in this course.';
        errorEl.hidden=false;
    }
}

async function openTab(id)
{
    document.querySelectorAll('.dashboard-view').forEach(v=>v.classList.toggle('active',v.id===id));
    document.querySelectorAll('.nav-item[data-tab]').forEach(a=>a.classList.toggle('active',a.dataset.tab===id));
    if(id==='show-all-courses')await loadCourses(allGrid,allStatus,false);
    if(id==='enroll-courses')await loadCourses(enrollGrid,enrollStatus,true);
}

document.querySelectorAll('.nav-item[data-tab]')
.forEach(a=>a.addEventListener('click',e=>
    {
        e.preventDefault();
        openTab(a.dataset.tab)
}));

document.getElementById('exploreCoursesButton')
.addEventListener('click',()=>openTab('enroll-courses'));

document.getElementById('browseCoursesFromYourCourses')
.addEventListener('click',()=>openTab('enroll-courses'));

document.getElementById('logoutLink')
.addEventListener('click',e=>{
    e.preventDefault();
    ['username','token','accessToken','refreshToken','user'].forEach(k=>localStorage.removeItem(k));
    location.href='../login/login.html';
});

window.addEventListener('hashchange',()=>
    {
        const id=location.hash.slice(1);
        if(['show-all-courses','enroll-courses','your-courses'].includes(id))openTab(id);
    });
    
document.addEventListener('DOMContentLoaded',()=>openTab(['show-all-courses','enroll-courses','your-courses'].includes(location.hash.slice(1))?location.hash.slice(1):'show-all-courses'));
