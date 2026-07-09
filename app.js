const workouts={
 am:{title:"AM Core + Movement",challenge:"Practice, not punishment.",exercises:[
  {name:"90/90 Breathing",sets:5,reps:"5 breaths",tempo:"5-sec inhale/exhale",rest:30,purpose:"Reset rib and pelvis position.",cues:["Ribs down","Pelvis neutral","Long exhale"],mistakes:["Rib flare","Rushing breath"]},
  {name:"Dead Bug",sets:3,reps:"8/side",tempo:"3-1-3",rest:45,purpose:"Build anterior core control.",cues:["Low back down","Exhale on extension","Move slow"],mistakes:["Arching","Moving too fast"]},
  {name:"Bird Dog",sets:3,reps:"8/side",tempo:"3-sec hold",rest:45,purpose:"Spinal stability and cross-body control.",cues:["Hips square","Reach long"],mistakes:["Rotating hips","Shrugging"]},
  {name:"Jump Rope",sets:5,reps:"60 sec",tempo:"Smooth",rest:30,purpose:"Foot rhythm and fighter conditioning.",cues:["Quiet feet","Relax shoulders"],mistakes:["Jumping too high","Stiff knees"]}
 ]},
 pm:{title:"PM Lower Beast Session",challenge:"Brace first. No grinders.",exercises:[
  {name:"Safety Bar Squat",sets:5,reps:"5",tempo:"3-1-X-1",rest:150,purpose:"Long-femur friendly squat strength.",cues:["Brace first","Midfoot pressure","Knees forward/out"],mistakes:["Folding over","Heels lifting"]},
  {name:"Romanian Deadlift",sets:4,reps:"8",tempo:"3-1-2",rest:90,purpose:"Posterior chain strength.",cues:["Hips back","Bar close","Lats tight"],mistakes:["Squatting it","Bar drifting"]},
  {name:"Farmer Carry",sets:5,reps:"40 yd",tempo:"Controlled",rest:90,purpose:"Grip, trunk stiffness, posture.",cues:["Tall spine","Crush handles","Quiet steps"],mistakes:["Leaning back","Shrugging"]},
  {name:"Burpee Progression",sets:5,reps:"5",tempo:"Clean reps",rest:60,purpose:"Conditioning without sloppy movement.",cues:["Strong plank","Feet under hips"],mistakes:["Belly flop","Hard landing"]}
 ]}
};
let session="am", idx=0, sets=0, timerInt=null, timeLeft=120;

function showTab(id){document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".tabs button").forEach(b=>b.classList.remove("active"));event.target.classList.add("active");renderCharts();}
function loadWorkout(){session=sessionSelect.value;idx=0;sets=0;renderWorkout();}
function current(){return workouts[session].exercises[idx]}
function renderWorkout(){
 const w=workouts[session], e=current();
 workoutHeader.innerHTML=`<h3>${w.title}</h3><p><b>Challenge:</b> ${w.challenge}</p>`;
 exerciseBox.innerHTML=`<div class="exercise-card"><h2>${e.name}</h2><span class="tag">${e.sets} sets</span><span class="tag">${e.reps}</span><span class="tag">${e.tempo}</span><p><b>Purpose:</b> ${e.purpose}</p><h3>Cues</h3><ul>${e.cues.map(c=>`<li>${c}</li>`).join("")}</ul><h3>Common Mistakes</h3><ul>${e.mistakes.map(m=>`<li>${m}</li>`).join("")}</ul></div>`;
 exerciseProgress.innerText=`${idx+1}/${w.exercises.length}`;setsDone.innerText=sets;
 timeLeft=e.rest || 120; drawTimer();
}
function prevExercise(){idx=Math.max(0,idx-1);sets=0;renderWorkout()}
function nextExercise(){idx=Math.min(workouts[session].exercises.length-1,idx+1);sets=0;renderWorkout()}
function completeSet(){sets++;setsDone.innerText=sets;startRest()}
function startRest(){clearInterval(timerInt);timerInt=setInterval(()=>{timeLeft--;drawTimer();if(timeLeft<=0){clearInterval(timerInt);}},1000)}
function resetRest(){clearInterval(timerInt);timeLeft=current().rest||120;drawTimer()}
function drawTimer(){timer.innerText=`${String(Math.floor(timeLeft/60)).padStart(2,"0")}:${String(timeLeft%60).padStart(2,"0")}`}
function logs(){return JSON.parse(localStorage.getItem("s4b_logs")||"[]")}
function saveExerciseLog(){const e=current();let l=logs();l.push({date:new Date().toLocaleString(),session:workouts[session].title,exercise:e.name,load:load.value,reps:reps.value||e.reps,rpe:rpe.value,form:formScore.value,notes:notes.value});localStorage.setItem("s4b_logs",JSON.stringify(l));renderHistory();renderCharts();alert("Saved.")}
function renderHistory(){historyList.innerHTML=logs().slice(-20).reverse().map(l=>`<li>${l.date}: <b>${l.exercise}</b> ${l.load||"-"} x ${l.reps||"-"} | RPE ${l.rpe||"-"} | Form ${l.form||"-"} ${l.notes? "— "+l.notes:""}</li>`).join("")}
function weights(){return JSON.parse(localStorage.getItem("s4b_weights")||"[363.2,361.8,360.5]")}
function addWeight(){let w=weights();w.push(Number(weightInput.value));localStorage.setItem("s4b_weights",JSON.stringify(w));renderCharts()}
function pullLevel(){return Number(localStorage.getItem("s4b_pull")||0)}
function renderPull(){const names=["Dead Hang","Active Hang","Scap Pull-up","Ring/TRX Row","Negative Pull-up","Band Pull-up","First Strict Pull-up"];pullupProgress.innerHTML=names.map((n,i)=>`<div class="level ${i<pullLevel()?'complete':i===pullLevel()?'active':''}"><b>Level ${i}: ${n}</b></div>`).join("")}
function advancePullup(){localStorage.setItem("s4b_pull",Math.min(6,pullLevel()+1));renderPull();updateScore()}
function calcReadiness(){let s=(Number(sleep.value)+Number(energy.value)+(6-Number(soreness.value))+(6-Number(stress.value)))/20*100;readinessScore.innerText=Math.round(s)+"%";coachRecommendation.innerText=s>=80?"Green light — train as planned.":s>=60?"Yellow light — quality work, avoid grinders.":"Red light — reduce intensity."}
function drawLine(canvas,data,title){let ctx=canvas.getContext("2d");ctx.clearRect(0,0,520,260);let max=Math.max(...data)+10,min=Math.min(...data)-10;ctx.strokeStyle="#333";for(let i=0;i<5;i++){let y=35+i*45;ctx.beginPath();ctx.moveTo(35,y);ctx.lineTo(500,y);ctx.stroke()}ctx.strokeStyle="#d4af37";ctx.lineWidth=4;ctx.beginPath();data.forEach((v,i)=>{let x=45+i*(430/Math.max(1,data.length-1));let y=225-((v-min)/(max-min))*180;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.stroke();ctx.fillStyle="#fff";ctx.font="14px Arial";ctx.fillText(title,35,20)}
function renderCharts(){drawLine(weightChart,weights(),"Weight");let strength=logs().filter(l=>Number(l.load)).slice(-8).map(l=>Number(l.load));drawLine(strengthChart,strength.length?strength:[135,185,225,275],"Logged Loads");}
function updateScore(){hybridScore.innerText=Math.min(100,74+pullLevel()*2+Math.floor(logs().length/4))}
function exportData(){const data={logs:logs(),weights:weights(),pullLevel:pullLevel()};const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="six4beast_data.json";a.click()}
loadWorkout();renderHistory();renderPull();calcReadiness();renderCharts();updateScore();
