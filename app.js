const targets={protein:300,carbs:300,fat:90};
let deferredPrompt=null,setCount=0,timer=null,timeLeft=120;

const workouts={
 am:{title:"AM Core + Movement",challenge:"Build the Athlete. Practice, not punishment.",phases:[
  ["Reset",[["90/90 Breathing","5 x 5 breaths","Ribs down, pelvis neutral."],["Cat-Cow","2 x 10","Move slowly."],["T-Spine Rotation","2 x 10/side","Rotate upper back."]]],
  ["Core Academy",[["Dead Bug","3 x 8/side","Low back down; exhale."],["Bird Dog","3 x 8/side","Hips square."],["Side Plank","3 x 30 sec/side","Straight line."],["Pallof Press","3 x 12/side","Do not rotate."]]],
  ["Movement Academy",[["Deep Squat Hold","3 x 45 sec","Tripod foot."],["Hip CARs","2 x 5/side","Controlled."],["Jump Rope","5 x 60 sec","Quiet feet."]]]
 ]},
 pm:{title:"PM Beast Session",challenge:"Build the Beast without destroying the Athlete.",phases:[
  ["Strength",[["Safety Bar Squat","5 x 5 @ RPE 6-7","Brace first."],["Romanian Deadlift","4 x 8","Hips back, bar close."],["Farmer Carry","5 x 40 yd","Tall spine."]]],
  ["Conditioning",[["Burpee Progression","5 x 5","Strong plank."],["Incline Walk","15 min","Nasal breathing if possible."]]]
 ]}
};

const pullups=[
["Level 0 - Dead Hang","3 x 20-30 sec","Long arms, ribs down."],
["Level 1 - Active Hang","4 x 10 sec","Shoulders down."],
["Level 2 - Scap Pull-up","4 x 8","No elbow bend."],
["Level 3 - Ring/TRX Row","4 x 12","Body straight."],
["Level 4 - Negative Pull-up","5 x 3","5-sec lower."],
["Level 5 - Band Pull-up","4 x 6","Strict form."],
["Level 6 - First Strict Pull-up","1 clean rep","No kick."]
];

const grocery={
 Proteins:["Chicken breast 7 lb","Ground turkey 3 lb","Salmon 2 lb","Lean steak 2 lb","Egg whites 2 cartons","Whole eggs 2 dozen","Whey isolate"],
 Carbs:["Jasmine rice","Sweet potatoes","Oats","Rice cakes","Bananas","Blueberries"],
 Vegetables:["Broccoli","Spinach","Bell peppers","Zucchini","Green beans"],
 Fats:["Avocados","Olive oil","Almonds","Natural peanut butter"]
};

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false;});
installBtn?.addEventListener("click",async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null;installBtn.hidden=true;}});

function showTab(id){document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));document.getElementById(id).classList.add("active");document.querySelectorAll(".tabs button").forEach(b=>b.classList.remove("active"));event.target.classList.add("active");}
function renderWorkout(){const w=workouts[sessionSelect.value];workout.innerHTML=`<h3>${w.title}</h3><p><b>Challenge:</b> ${w.challenge}</p>`+w.phases.map(p=>`<div class="phase"><h3>${p[0]}</h3>${p[1].map(e=>`<div class="exercise"><b>${e[0]}</b><br><span class="tag">${e[1]}</span><p>${e[2]}</p></div>`).join("")}</div>`).join("");}
function startWorkout(){localStorage.setItem("activeWorkoutStarted",new Date().toISOString());alert("Workout started.")}
function completeWorkout(){let n=Number(localStorage.getItem("completedWorkouts")||0)+1;localStorage.setItem("completedWorkouts",n);updateScore();alert("Workout complete.")}
function incSet(){setCount++;setCountEl();}
function decSet(){setCount=Math.max(0,setCount-1);setCountEl();}
function setCountEl(){document.getElementById("setCount").innerText=setCount;}
function saveSet(){const logs=getLogs();logs.push({date:new Date().toLocaleString(),exercise:logExercise.value||"Current workout set",load:"",reps:"",rpe:rpe.value,form:formScore.value,notes:"Set tracker"});localStorage.setItem("logs",JSON.stringify(logs));renderLogs();alert("Set saved.")}
function startRest(){clearInterval(timer);timer=setInterval(()=>{timeLeft--;drawTimer();if(timeLeft<=0){clearInterval(timer);alert("Rest complete.");}},1000);}
function resetRest(){clearInterval(timer);timeLeft=120;drawTimer();}
function drawTimer(){const m=String(Math.floor(timeLeft/60)).padStart(2,"0"),s=String(timeLeft%60).padStart(2,"0");timerDisplay.innerText=`${m}:${s}`;}
function getLogs(){return JSON.parse(localStorage.getItem("logs")||"[]");}
function addLog(){const logs=getLogs();logs.push({date:new Date().toLocaleString(),exercise:logExercise.value,load:logLoad.value,reps:logReps.value,rpe:rpe.value,form:formScore.value,notes:logNotes.value});localStorage.setItem("logs",JSON.stringify(logs));renderLogs();updateScore();}
function renderLogs(){logList.innerHTML=getLogs().slice(-12).reverse().map(l=>`<li>${l.date}: <b>${l.exercise||"Exercise"}</b> ${l.load||"-"} x ${l.reps||"-"} | RPE ${l.rpe||"-"} | Form ${l.form||"-"} ${l.notes? "— "+l.notes:""}</li>`).join("");}
function exportCSV(){const rows=[["date","exercise","load","reps","rpe","form","notes"],...getLogs().map(l=>[l.date,l.exercise,l.load,l.reps,l.rpe,l.form,l.notes])];const csv=rows.map(r=>r.map(x=>`"${String(x||"").replaceAll('"','""')}"`).join(",")).join("\\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="six4beast_logs.csv";a.click();}
function renderPullups(){const current=Number(localStorage.getItem("pullLevel")||0);pullupLevels.innerHTML=pullups.map((p,i)=>`<div class="level ${i<current?"complete":i===current?"active":""}"><h3>${p[0]}</h3><p><b>Standard:</b> ${p[1]}</p><p>${p[2]}</p><button onclick="passPullup(${i})">Pass Level</button></div>`).join("");}
function passPullup(i){localStorage.setItem("pullLevel",Math.max(Number(localStorage.getItem("pullLevel")||0),i+1));renderPullups();updateScore();}
function getMeals(){return JSON.parse(localStorage.getItem("meals")||"[]");}
function addMeal(){const meals=getMeals();meals.push({name:mealName.value||"Meal",p:Number(protein.value)||0,c:Number(carbs.value)||0,f:Number(fat.value)||0});localStorage.setItem("meals",JSON.stringify(meals));renderMeals();}
function renderMeals(){const meals=getMeals();mealList.innerHTML=meals.slice(-10).reverse().map(m=>`<li>${m.name}: ${m.p}P / ${m.c}C / ${m.f}F</li>`).join("");const t=meals.reduce((a,m)=>({p:a.p+m.p,c:a.c+m.c,f:a.f+m.f}),{p:0,c:0,f:0});macroBars.innerHTML=[["Protein",t.p,targets.protein],["Carbs",t.c,targets.carbs],["Fat",t.f,targets.fat]].map(x=>`<p>${x[0]}: ${x[1]} / ${x[2]}g</p><div class="bar"><div style="width:${Math.min(100,x[1]/x[2]*100)}%"></div></div>`).join("");}
function renderGrocery(){grocery.innerHTML=Object.entries(grocery).map(([k,v])=>`<div class="phase"><h3>${k}</h3>${v.map(i=>`<p>□ ${i}</p>`).join("")}</div>`).join("");}
function updateScore(){hybridScore.innerText=Math.min(100,72+Number(localStorage.getItem("completedWorkouts")||0)+Number(localStorage.getItem("pullLevel")||0)*2+Math.floor(getLogs().length/3));}
if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js");}
renderWorkout();renderPullups();renderLogs();renderMeals();renderGrocery();updateScore();drawTimer();
