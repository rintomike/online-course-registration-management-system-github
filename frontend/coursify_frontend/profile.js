const API_BASE='http://localhost:8080/api';
const username=localStorage.getItem('username');
const statusEl=document.getElementById('profileStatus'),errorEl=document.getElementById('profileError'),grid=document.getElementById('profileGrid'),actions=document.getElementById('profileActions'),errorActions=document.getElementById('errorActions');
function fail(msg)
{
    statusEl.textContent='We could not load your profile.';
    errorEl.textContent=msg;
    errorEl.classList.add('show');
    errorActions.hidden=false;
    grid.hidden=true;
    actions.hidden=true;
}
async function load()
{
    if(!username)
        {
            location.href='../login/login.html';
            return;
        }
        document.getElementById('sidebarProfileName').textContent=username;
        try
        {
            const r=await fetch(`${API_BASE}/auth/profile/${encodeURIComponent(username)}`,{headers:{Accept:'application/json'}});
            if(!r.ok)throw new Error(r.status===404?'We could not find a profile for this account.':`Unable to load your profile (HTTP ${r.status}).`);
            const p=await r.json();
            document.getElementById('profileName').textContent=p.name??'—';document.getElementById('profileAge').textContent=p.age??'—';
            document.getElementById('profileMobile').textContent=p.mobileNo??'—';document.getElementById('profileAddress').textContent=p.address??'—';
            document.getElementById('sidebarProfileName').textContent=p.name||username;statusEl.textContent='Here are your current account details.';
            grid.hidden=false;
            actions.hidden=false;
        }catch(e)
        {
            console.error(e);
            fail(e.message||'Something went wrong while loading your profile.');
        }
    }
    
document.addEventListener('DOMContentLoaded',load);
