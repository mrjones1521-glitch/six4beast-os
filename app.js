const targets={protein:300,carbs:300,fat:90};
const workouts={
 am:{title:"AM Core + Movement",challenge:"Build the Athlete. Practice, not punishment.",exercises:[
  {name:"90/90 Breathing",sets:5,reps:"5 breaths",tempo:"5-sec inhale / 5-sec exhale",rest:30,purpose:"Reset rib and pelvis position.",cues:["Ribs down","Pelvis neutral","Long exhale","Feel abs turn on"],mistakes:["Rib flare","Low-back arch","Rushing breath"]},
  {name:"Dead Bug",sets:3,reps:"8/side",tempo:"3-1-3",rest:45,purpose:"Build anterior core control.",cues:["Low back down","Exhale as limb extends","Move slowly"],mistakes:["Arching back","Moving too fast","Losing rib position"]},
  {name:"Bird Dog",sets:3,reps:"8/side",tempo:"3-sec hold",rest:45,purpose:"Build spinal stability and cross-body control.",cues:["Hips square","Reach long","No shrugging"],mistakes:["Rotating hips","Overarching","Rushing"]},
  {name:"Jump Rope",sets:5,reps:"60 sec",tempo:"Smooth",rest:30,purpose:"Build rhythm, foot stiffness, and fighter conditioning.",cues:["Quiet feet","Relax shoulders","Soft landings"],mistakes:["Jumping too high","Stiff knees","Turning with shoulders"]}
 ]},
 pm:{title:"PM Beast Session",challenge:"Build the Beast without destroying the Athlete.",exercises:[
  {name:"Safety Bar Squat",sets:5,reps:"5",tempo:"3-1-X-1",rest:150,purpose:"Long-femur friendly squat strength.",cues:["Brace first","Midfoot pressure","Knees forward/out","Torso strong"],mistakes:["Folding over","Heels lifting","Good-morning reps"]},
  {name:"Romanian Deadlift",sets:4,reps:"8",tempo:"3-1-2",rest:90,purpose:"Posterior chain strength for jumping, sprinting, and pulling.",cues:["Hips back","Bar close","Lats tight","Feel hamstrings"],mistakes:["Squatting the hinge","Rounding back","Bar drifting"]},
  {name:"Farmer Carry",sets:5,reps:"40 yd",tempo:"Controlled",rest:90,purpose:"Grip, trunk stiffness, posture, and real strength.",cues:["Tall spine","Crush handles","Quiet steps"],mistakes:["Leaning back","Shrugging","Rushing"]},
  {name:"Burpee Progression",sets:5,reps:"5",tempo:"Clean reps",rest:60,purpose:"Conditioning without sloppy movement.",cues:["Strong plank","Feet under hips","Land softly"],mistakes:["Belly flop","Sagging hips","Hard landing"]}
 ]}
};

const pullupLevels=[
 ["Dead Hang","3 x 20–30 sec","Long arms, ribs down, quiet legs."],
 ["Active Hang","4 x 10 sec","Move from shoulder blades, not elbows."],
 ["Scap Pull-up","4 x 8","Shoulders down away from ears."],
 ["Ring/TRX Row","4 x 12","Body straight, chest to handles."],
 ["Negative Pull-up","5 x 3","5-sec lower, own the descent."],
 ["Band Pull-up","4 x 6","Only enough assistance to stay strict."],
 ["First Strict Pull-up","1 clean rep","No kick, no neck reach."]
];

const grocery={
 Proteins:["Chicken breast 7 lb","Lean ground turkey 3 lb","Salmon 2 lb","Lean steak 2 lb","Egg whites 2 cartons","Whole eggs 2 dozen","Whey isolate"],
 Carbs:["Jasmine rice","Sweet potatoes","Oats","Rice cakes","Bananas","Blueberries","Apples"],
 Vegetables:["Broccoli","Spinach","Bell peppers","Zucchini","Green beans","Asparagus"],
 Fats:["Avocados","Olive oil","Almonds","Natural peanut butter"]
};

let currentSession="am", exerciseIndex=0, setsDoneCount=0, timeLeft=120, timerInt=null;

document.querySelectorAll(".nav").forEach(btn=>{
 btn.addEventListener("click",()=>{
  document.querySelectorAll(".nav").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.getElementById(btn.dataset.tab).classList.add("active");
  renderCharts();
 });
});

function getLogs(){return JSON.parse(localStorage.getItem("s4b_logs_v2")||"[]")}
function setLogs(v){localStorage.setItem("s4b_logs_v2",JSON.stringify(v))}
function getMeals(){return JSON.parse(localStorage.getItem("s4b_meals_v2")||"[]")}
function setMeals(v){localStorage.setItem("s4b_meals_v2",JSON.stringify(v))}
function getWeights(){return JSON.parse(localStorage.getItem("s4b_weights_v2")||"[363.2,361.8,360.5]")}
function setWeights(v){localStorage.setItem("s4b_weights_v2",JSON.stringify(v))}
function pullLevel(){return Number(localStorage.getItem("s4b_pull_v2")||0)}

function loadSession(){currentSession=sessionSelect.value;exerciseIndex=0;setsDoneCount=0;renderExercise();}
function currentExercise(){return workouts[currentSession].exercises[exerciseIndex]}
function renderExercise(){
 const w=workouts[currentSession], e=currentExercise();
 workoutTitle.innerHTML=`<h3>${w.title}</h3><p><b>Challenge:</b> ${w.challenge}</p>`;
 exercisePanel.innerHTML=`<div class="exercise-card"><h2>${e.name}</h2>
 <span class="tag">${e.sets} sets</span><span class="tag">${e.reps}</span><span class="tag">${e.tempo}</span><span class="tag">${e.rest}s rest</span>
 <p><b>Purpose:</b> ${e.purpose}</p>
 <h3>Coaching Cues</h3><ul>${e.cues.map(x=>`<li>${x}</li>`).join("")}</ul>
 <h3>Common Mistakes</h3><ul>${e.mistakes.map(x=>`<li>${x}</li>`).join("")}</ul></div>`;
 exerciseIndexEl();
 timeLeft=e.rest||120; drawTimer();
}
function exerciseIndexEl(){document.getElementById("exerciseIndex").innerText=`${exerciseIndex+1}/${workouts[currentSession].exercises.length}`;document.getElementById("setsDone").innerText=setsDoneCount}
function prevExercise(){exerciseIndex=Math.max(0,exerciseIndex-1);setsDoneCount=0;renderExercise()}
function nextExercise(){exerciseIndex=Math.min(workouts[currentSession].exercises.length-1,exerciseIndex+1);setsDoneCount=0;renderExercise()}
function completeSet(){setsDoneCount++;exerciseIndexEl();startRest();updateDashboard()}
function startRest(){clearInterval(timerInt);timerInt=setInterval(()=>{timeLeft--;drawTimer();if(timeLeft<=0){clearInterval(timerInt)}},1000)}
function resetRest(){clearInterval(timerInt);timeLeft=currentExercise().rest||120;drawTimer()}
function drawTimer(){timer.innerText=`${String(Math.floor(timeLeft/60)).padStart(2,"0")}:${String(timeLeft%60).padStart(2,"0")}`}

function saveWorkoutLog(){
 const e=currentExercise(), logs=getLogs();
 logs.push({date:new Date().toLocaleString(),session:workouts[currentSession].title,exercise:e.name,load:loadInput.value,reps:repsInput.value||e.reps,rpe:rpeInput.value,form:formInput.value,notes:notesInput.value});
 setLogs(logs); renderHistory(); renderCharts(); updateDashboard(); alert("Workout log saved.");
}
function renderHistory(){
 historyList.innerHTML=getLogs().slice(-25).reverse().map(l=>`<li>${l.date}: <b>${l.exercise}</b> ${l.load||"-"} x ${l.reps||"-"} | RPE ${l.rpe||"-"} | Form ${l.form||"-"} ${l.notes?"— "+l.notes:""}</li>`).join("");
}
function renderPullups(){
 const level=pullLevel();
 pullLevelDash.innerText=level;
 pullupCards.innerHTML=pullupLevels.map((p,i)=>`<div class="level-card ${i<level?"complete":i===level?"active":""}">
 <h3>Level ${i}: ${p[0]}</h3><p><b>Standard:</b> ${p[1]}</p><p>${p[2]}</p></div>`).join("");
}
function advancePullup(){localStorage.setItem("s4b_pull_v2",Math.min(6,pullLevel()+1));renderPullups();updateDashboard()}

function addMeal(){
 const meals=getMeals();
 meals.push({name:mealName.value||"Meal",p:Number(proteinInput.value)||0,c:Number(carbInput.value)||0,f:Number(fatInput.value)||0});
 setMeals(meals); renderMeals(); updateDashboard();
}
function clearMeals(){setMeals([]);renderMeals();updateDashboard()}
function renderMeals(){
 const meals=getMeals();
 mealList.innerHTML=meals.slice(-10).reverse().map(m=>`<li>${m.name}: ${m.p}P / ${m.c}C / ${m.f}F</li>`).join("");
 const total=meals.reduce((a,m)=>({p:a.p+m.p,c:a.c+m.c,f:a.f+m.f}),{p:0,c:0,f:0});
 macroBars.innerHTML=[["Protein",total.p,targets.protein],["Carbs",total.c,targets.carbs],["Fat",total.f,targets.fat]].map(x=>`
 <div class="bar-label"><span>${x[0]}</span><span>${x[1]} / ${x[2]}g</span></div><div class="bar"><div style="width:${Math.min(100,(x[1]/x[2])*100)}%"></div></div>`).join("");
}
function renderGrocery(){
 groceryList.innerHTML=Object.entries(grocery).map(([k,v])=>`<div class="exercise-card"><h3>${k}</h3>${v.map(i=>`<p>□ ${i}</p>`).join("")}</div>`).join("");
}
function addWeight(){let w=getWeights();w.push(Number(weightInput.value));setWeights(w);currentWeight.innerText=w[w.length-1];renderCharts()}
function drawLine(canvas,data,title){
 const ctx=canvas.getContext("2d");ctx.clearRect(0,0,560,280);
 const max=Math.max(...data)+10,min=Math.min(...data)-10;
 ctx.strokeStyle="#333";ctx.lineWidth=1;
 for(let i=0;i<5;i++){let y=40+i*48;ctx.beginPath();ctx.moveTo(40,y);ctx.lineTo(530,y);ctx.stroke()}
 ctx.strokeStyle="#d4af37";ctx.lineWidth=4;ctx.beginPath();
 data.forEach((v,i)=>{let x=50+i*(460/Math.max(1,data.length-1));let y=240-((v-min)/(max-min))*190;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
 ctx.stroke();ctx.fillStyle="#fff";ctx.font="14px Arial";ctx.fillText(title,40,24);
}
function renderCharts(){
 drawLine(weightChart,getWeights(),"Weight Trend");
 const strength=getLogs().filter(l=>Number(l.load)).slice(-10).map(l=>Number(l.load));
 drawLine(strengthChart,strength.length?strength:[135,185,225,275],"Logged Load Trend");
}
function updateCoachAI(){
 const logs=getLogs(), meals=getMeals(), level=pullLevel();
 let notes=[];
 if(level===0) notes.push("Pull-up focus: accumulate dead-hang time before chasing reps.");
 if(logs.length<3) notes.push("Log at least 3 workouts this week to unlock better progression guidance.");
 if(meals.length<3) notes.push("Nutrition focus: log all 5 meals today to protect lean mass.");
 notes.push("AM rule: core and movement should leave you better, not exhausted.");
 coachAI.innerHTML=notes.map(n=>`<p>• ${n}</p>`).join("");
}
function updateDashboard(){
 const logs=getLogs(), meals=getMeals(), weights=getWeights();
 const score=Math.min(100,74+pullLevel()*2+Math.floor(logs.length/4)+Math.floor(meals.length/10));
 hybridScore.innerText=score;
 currentWeight.innerText=weights[weights.length-1];
 workoutCount.innerText=new Set(logs.map(l=>l.date.split(",")[0])).size;
 setTotal.innerText=setsDoneCount;
 mealCount.innerText=meals.length;
 logCount.innerText=logs.length;
 updateCoachAI();
 renderPullups();
}
function startMission(){document.querySelector('[data-tab="training"]').click()}
function exportAllData(){
 const data={logs:getLogs(),meals:getMeals(),weights:getWeights(),pullLevel:pullLevel()};
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="six4beast_os_2_data.json";a.click();
}
if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js")}
loadSession();renderHistory();renderMeals();renderGrocery();renderCharts();updateDashboard();
