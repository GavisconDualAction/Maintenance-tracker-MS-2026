// Maintenance Tracker — v1.1
// Data key intentionally unchanged from v1.0 so existing tasks and history are preserved.
const APP_VERSION = "1.1";
const $=id=>document.getElementById(id);
const KEY="maintenance-tracker-v1";
let tasks=load(), selectedId=null;
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
function save(){localStorage.setItem(KEY,JSON.stringify(tasks))}
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function parseDate(s){const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d,12)}
function addInterval(date,n,unit){let d=new Date(date);if(unit==="days")d.setDate(d.getDate()+n);if(unit==="weeks")d.setDate(d.getDate()+7*n);if(unit==="months"){const day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+n);const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(day,last))}if(unit==="years"){const month=d.getMonth(),day=d.getDate();d.setDate(1);d.setFullYear(d.getFullYear()+n);d.setMonth(month);const last=new Date(d.getFullYear(),month+1,0).getDate();d.setDate(Math.min(day,last))}return d}
function dayDiff(a,b){return Math.round((a-b)/86400000)}
function fmt(d){return d.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"})}
function dueInfo(t){const due=addInterval(parseDate(t.lastDone),t.interval,t.unit),now=parseDate(today()),remaining=dayDiff(due,now),total=Math.max(1,dayDiff(due,parseDate(t.lastDone))),elapsed=dayDiff(now,parseDate(t.lastDone));return {due,remaining,total,progress:Math.max(0,Math.min(100,elapsed/total*100))}}
function frequency(t){return `Every ${t.interval} ${t.unit.replace(/s$/,"")}${t.interval===1?"":"s"}`}
function render(){
  const filter=$("filter").value,list=$("taskList");list.innerHTML="";
  let completed=0;tasks.forEach(t=>completed+=t.history.length);
  $("taskCount").textContent=tasks.length;$("completionCount").textContent=completed;
  const sorted=[...tasks].sort((a,b)=>dueInfo(a).remaining-dueInfo(b).remaining);
  const shown=sorted.filter(t=>filter==="overdue"?dueInfo(t).remaining<0:filter==="ontrack"?dueInfo(t).remaining>=0:true);
  $("overdueCount").textContent=tasks.filter(t=>dueInfo(t).remaining<0).length;
  $("empty").classList.toggle("hide",shown.length>0);
  shown.forEach(t=>{
    const x=dueInfo(t),late=x.remaining<0,kind=late?"late":"ok";
    const card=document.createElement("article");card.className="task-card";
    card.innerHTML=`<div class="task-top"><div><p class="task-name"></p><span class="category"></span></div><span class="status ${kind}">${late?"Overdue":"On track"}</span></div><div class="countline"><span class="count ${kind}">${Math.abs(x.remaining)} ${Math.abs(x.remaining)===1?"day":"days"}</span><span class="count-caption">${late?"overdue":"remaining"}</span></div><div class="track"><div class="fill ${kind}" style="width:${late?100:x.progress}%"></div></div><p class="due-line">${late?"Was due":"Due"} ${fmt(x.due)} · ${frequency(t)}</p>`;
    card.querySelector(".task-name").textContent=t.name;
    card.querySelector(".category").textContent=t.category||"Uncategorised";
    card.addEventListener("click",()=>openDetail(t.id));list.append(card);
  });
}
function openForm(t=null){$("taskForm").reset();$("taskId").value=t?.id||"";$("dialogTitle").textContent=t?"Edit maintenance task":"Add maintenance task";$("name").value=t?.name||"";$("category").value=t?.category||"";$("interval").value=t?.interval||6;$("unit").value=t?.unit||"months";$("lastDone").value=t?.lastDone||today();$("notes").value=t?.notes||"";$("taskDialog").showModal()}
function openDetail(id){selectedId=id;const t=tasks.find(x=>x.id===id),x=dueInfo(t);$("detailTitle").textContent=t.name;const hist=[...t.history].reverse();$("detailBody").innerHTML=`<div class="detail-stat"><span class="muted">Next due date</span><strong>${fmt(x.due)}</strong><span class="muted">${x.remaining<0?`${Math.abs(x.remaining)} days overdue`:`${x.remaining} days remaining`}</span></div><p class="muted">Frequency: ${frequency(t)} · Last completed: ${fmt(parseDate(t.lastDone))}</p><div class="detail-stat"><span class="muted">Total completions</span><strong>${t.history.length}</strong></div>${t.notes?'<p class="note"></p>':""}<h3 class="history-heading">Completion history</h3>${hist.length?`<ol class="history">${hist.map(d=>`<li>${fmt(parseDate(d))}</li>`).join("")}</ol>`:'<p class="muted">No completions recorded yet.</p>'}`;const note=$("detailBody").querySelector(".note");if(note)note.textContent=t.notes;$("detailDialog").showModal()}
$("addBtn").onclick=()=>openForm();
$("closeDialog").onclick=$("cancelBtn").onclick=()=>$("taskDialog").close();
$("closeDetail").onclick=()=>$("detailDialog").close();
$("filter").onchange=render;
$("taskForm").onsubmit=e=>{e.preventDefault();const id=$("taskId").value;const data={id:id||crypto.randomUUID(),name:$("name").value.trim(),category:$("category").value.trim(),interval:Number($("interval").value),unit:$("unit").value,lastDone:$("lastDone").value,notes:$("notes").value.trim()};if(!data.name||!data.lastDone||data.interval<1)return;if(id){const old=tasks.find(t=>t.id===id);Object.assign(old,data)}else{data.history=[];tasks.push(data)}save();$("taskDialog").close();render()};
$("completeBtn").onclick=()=>{const t=tasks.find(x=>x.id===selectedId);if(!t)return;const d=today();t.lastDone=d;t.history.push(d);save();$("detailDialog").close();render()};
$("editBtn").onclick=()=>{const t=tasks.find(x=>x.id===selectedId);$("detailDialog").close();openForm(t)};
$("deleteBtn").onclick=()=>{if(!confirm("Delete this maintenance task and its completion history?"))return;tasks=tasks.filter(t=>t.id!==selectedId);save();$("detailDialog").close();render()};
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
$("appVersion").textContent=`Version v${APP_VERSION}`;
render();
