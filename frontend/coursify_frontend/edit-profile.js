const API_BASE='http://localhost:8080/api';
const username=localStorage.getItem('username');
const form=document.getElementById('editProfileForm'),statusEl=document.getElementById('editStatus'),msg=document.getElementById('formMessage'),save=document.getElementById('saveProfileButton'),saveText=document.getElementById('saveProfileText');
function message(text,type)
{
    msg.textContent=text;
    msg.className=`form-message ${type} show`;
}

async function load()
{
    if(!username)
        {
            location.href='../login/login.html';
            return;
        }
        try
        {
            const r=await fetch(`${API_BASE}/auth/profile/${encodeURIComponent(username)}`,{headers:{Accept:'application/json'}});
            if(!r.ok)throw new Error(r.status===404?'We could not find your profile.':`Unable to load your profile (HTTP ${r.status}).`);
            const p=await r.json();document.getElementById('sidebarProfileName').textContent=p.name||username;
            document.getElementById('name').value=p.name??username;
            document.getElementById('age').value=p.age??'';
            document.getElementById('mobileNo').value=p.mobileNo??'';
            document.getElementById('address').value=p.address??'';
            statusEl.textContent='Update your details below. Your name and password remain unchanged.';
            form.hidden=false;
        }
        catch(e)
        {
            console.error(e);
            statusEl.textContent='We could not load your profile.';
            message(e.message||'Unable to load your profile.','error');
            document.getElementById('editErrorActions').hidden=false;
        }
    }

form.addEventListener('submit',async e=>{
    e.preventDefault();
    const age=Number(document.getElementById('age').value),mobileNo=document.getElementById('mobileNo').value.trim(),address=document.getElementById('address').value.trim();
    if(!Number.isInteger(age)||age<1||age>150)
        {
            message('Please enter a valid age.','error');
            return;
        }
        if(!mobileNo||!address)
            {
                message('Please complete all editable profile fields.','error');
                return;
            }
            save.disabled=true;
            saveText.textContent='Saving...';
            msg.className='form-message';
            try
            {
                const r=await fetch(`${API_BASE}/auth/profile/${encodeURIComponent(username)}`,{method:'PUT',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({age,mobileNo,address})});
                if(!r.ok)
                    {
                        let m=`Profile update failed (HTTP ${r.status}).`;
                        try
                        {
                            const d=await r.json();
                            m=d.message||d.error||m;
                        }
                        catch{}throw new Error(m);
                    }
                    message('Profile updated successfully. Redirecting...','success');
                    setTimeout(()=>location.href='profile.html',900);
                }catch(e)
                {
                    console.error(e);
                    message(e.message||'Unable to update your profile.','error');
                }finally
                {
                    save.disabled=false;
                    saveText.textContent='Save Changes';
                }});
                
document.addEventListener('DOMContentLoaded',load);
