
const App={
subjects:{},
activeKey:"communications",
q:[],
current:0,
exam:null,
mock:null,
mockSelected:null,
displayLetters:["A","B","C","D"],

init(){
  this.subjects={
    communications:{
      key:"communications",
      name:"Communications",
      icon:"📡",
      color:"#2563eb",
      questions:window.DEBRIEFROOM_COMMUNICATIONS||[]
    },
    airlaw:{
      key:"airlaw",
      name:"Air Law",
      icon:"⚖️",
      color:"#7c3aed",
      questions:window.DEBRIEFROOM_AIRLAW||[]
    },
    humanperformance:{
      key:"humanperformance",
      name:"Human Performance",
      icon:"🧠",
      color:"#db2777",
      questions:window.DEBRIEFROOM_HUMANPERFORMANCE||[]
    },
    operationalprocedures:{
      key:"operationalprocedures",
      name:"Operational Procedures",
      icon:"🛟",
      color:"#ea580c",
      questions:window.DEBRIEFROOM_OPERATIONALPROCEDURES||[]
    },
    principlesofflight:{
      key:"principlesofflight",
      name:"Principles of Flight",
      icon:"🪽",
      color:"#0891b2",
      questions:window.DEBRIEFROOM_PRINCIPLESOFFLIGHT||[]
    },
    aircraftgeneralknowledge:{
      key:"aircraftgeneralknowledge",
      name:"Aircraft General Knowledge",
      icon:"⚙️",
      color:"#475569",
      questions:window.DEBRIEFROOM_AIRCRAFTGENERALKNOWLEDGE||[]
    },
    meteorology:{
      key:"meteorology",
      name:"Meteorology",
      icon:"🌦️",
      color:"#0284c7",
      questions:window.DEBRIEFROOM_METEOROLOGY||[]
    },
    flightperformance:{
      key:"flightperformance",
      name:"Flight Performance & Planning",
      icon:"📊",
      color:"#16a34a",
      questions:window.DEBRIEFROOM_FLIGHTPERFORMANCE||[]
    },
    navigation:{
      key:"navigation",
      name:"Navigation",
      icon:"🧭",
      color:"#ca8a04",
      questions:window.DEBRIEFROOM_NAVIGATION||[]
    }
  };

  this.useSubject("communications");

  // Skip the profile-selection/sign-in page.
  // Preserve an existing profile; otherwise use the main Abdulla profile.
  const savedProfile=Profiles.current();
  const validProfile=Profiles.list.some(profile=>profile.id===savedProfile);

  if(!validProfile){
    Profiles.set("p1");
  }

  this.dashboard()
},

useSubject(key){
  if(!this.subjects[key])key="communications";
  this.activeKey=key;
  this.q=this.subjects[key].questions||[]
},

activeSubject(){
  return this.subjects[this.activeKey]
},

mount(h){
  document.getElementById("app").innerHTML=`<main class="app">${h}</main>`
},

shuffle(a){
  return a.map(v=>[Math.random(),v])
    .sort((x,y)=>x[0]-y[0])
    .map(x=>x[1])
},

quizSet(set=null){
  const pool=set||this.q;
  return this.shuffle([...pool])
    .slice(0,Math.min(20,pool.length))
    .map(q=>({
      ...q,
      optionOrder:this.shuffle(["A","B","C","D"])
    }))
},

displayLabelFor(originalKey,order){
  const idx=(order||["A","B","C","D"]).indexOf(originalKey);
  return this.displayLetters[idx]||originalKey
},

subjectProgress(key=this.activeKey){
  const subject=this.subjects[key];
  const questions=subject?.questions||[];
  const s=Store.get();
  const total=questions.length;

  const answered=Object.keys(s.answered||{})
    .filter(id=>questions.some(q=>q.id===id))
    .length;

  const wrong=Object.keys(s.wrong||{})
    .filter(id=>questions.some(q=>q.id===id))
    .length;

  const bookmarks=Object.keys(s.bookmarks||{})
    .filter(id=>questions.some(q=>q.id===id))
    .length;

  return{
    total,
    answered,
    wrong,
    bookmarks,
    pct:total?Math.round(answered/total*100):0
  }
},

getLastStudy(key=this.activeKey){
  const s=Store.get();

  if(s.lastStudyBySubject && Number.isInteger(s.lastStudyBySubject[key])){
    return s.lastStudyBySubject[key]
  }

  if(key==="communications" && Number.isInteger(s.lastStudy)){
    return s.lastStudy
  }

  return 0
},

setLastStudy(index){
  const s=Store.get();
  s.lastStudyBySubject=s.lastStudyBySubject||{};
  s.lastStudyBySubject[this.activeKey]=index;

  if(this.activeKey==="communications"){
    s.lastStudy=index
  }

  Store.set(s)
},

top(label,action="App.subject()"){
  return`<div class="topbar">
    <button class="back" onclick="${action}">← ${label}</button>
    <div class="topVersion">v1.0.2</div>
  </div>`
},


header(sub){
  return`<header class="hero">
    <div class="brand">
      <div class="logo">✈️</div>
      <div>
        <h1>DebriefRoom</h1>
        <p>${sub}</p>
      </div>
    </div>
    <div class="version">v1.0.2</div>
  </header>`
},

profileSelect(){
  this.mount(`${this.header("Train. Debrief. Master.")}
  <section class="card">
    <h2 class="sectionTitle">Who is studying?</h2>
    <div class="profileGrid">
      ${Profiles.list.map(p=>`
        <button class="profileBtn" onclick="App.setProfile('${p.id}')">
          <div class="profileAvatar">${p.icon}</div>
          ${p.name}
          <small style="display:block;color:#64748b;margin-top:4px">Separate progress</small>
        </button>`).join("")}
    </div>
  </section>`)
},

setProfile(id){
  Profiles.set(id);
  this.dashboard()
},

subjectCard(key){
  const subject=this.subjects[key];
  const p=this.subjectProgress(key);

  return`
  <button class="subjectCard" onclick="App.openSubject('${key}')" style="margin-bottom:12px">
    <div class="icon" style="background:${subject.color}14">${subject.icon}</div>
    <div style="flex:1">
      ${subject.name}
      <small>${p.total} questions • ${p.pct}% complete</small>
      <div class="progressLine" style="margin:10px 0 0">
        <div class="progressFill" style="width:${p.pct}%;background:${subject.color}"></div>
      </div>
    </div>
  </button>`
},

dashboard(){
  this.mount(`${this.header(`${Profiles.name()} • Select your subject`)}
  <nav class="card" style="display:flex;gap:10px;padding:12px" aria-label="Main tabs">
    <button class="primary" style="flex:1;margin:0" aria-current="page">Subjects</button>
    <button class="secondary" style="flex:1;margin:0" onclick="App.mockSetup()">✈️ MockPrep</button>
  </nav>
  <section class="card">
    <h2 class="sectionTitle">✈️ MockPrep</h2>
    <p class="subtle">Choose from five subjects, generate 100 proportionally weighted questions, then tap to reveal each answer.</p>
    <button class="primary" onclick="App.mockSetup()">Open MockPrep</button>
  </section>
  <section class="card">
    <h2 class="sectionTitle">Subjects</h2>
    ${Object.keys(this.subjects).map(key=>this.subjectCard(key)).join("")}
  </section>`)
},

// MockPrep is deliberately a reveal-based revision session, not a scored exam.
// The five subject weights are the agreed 20:28:7:20:25 allocation.
mockWeights(){
  return [
    ["communications",20],
    ["airlaw",28],
    ["operationalprocedures",7],
    ["aircraftgeneralknowledge",20],
    ["principlesofflight",25]
  ]
},

mockSetup(message=""){
  if(!this.mockSelected)this.mockSelected=this.mockWeights().map(([key])=>key);
  this.mount(`${this.top("Subjects","App.dashboard()")}
  <section class="card">
    <h2 class="sectionTitle">✈️ MockPrep · Click to Reveal</h2>
    <p class="subtle">Select one or more subjects. Their original exam weights are redistributed to exactly 100 questions.</p>
    ${this.mockWeights().map(([key,weight])=>{
      const subject=this.subjects[key];
      return `<label style="display:flex;align-items:center;gap:12px;padding:14px 8px;border-bottom:1px solid #e2e8f0;cursor:pointer">
        <input type="checkbox" data-mock-subject="${key}" ${this.mockSelected.includes(key)?"checked":""} onchange="App.setMockSubject('${key}',this.checked)" style="width:20px;height:20px;flex-shrink:0;accent-color:#1d4ed8">
        <span style="font-weight:700">${subject.icon} ${subject.name}</span><span style="margin-left:auto;color:#64748b">${weight}%</span>
      </label>`;
    }).join("")}
    ${message?`<p style="color:#b91c1c;font-weight:700">${message}</p>`:""}
    <button class="primary" style="margin-top:20px" onclick="App.startMockReveal()">Generate 100 Questions</button>
  </section>`)
},

setMockSubject(key,checked){
  const selected=new Set(this.mockSelected||[]);
  if(checked)selected.add(key);else selected.delete(key);
  this.mockSelected=this.mockWeights().map(([k])=>k).filter(k=>selected.has(k));
},

// Largest-remainder allocation with capacity caps, yielding exactly 100.
mockAllocate(selected){
  const entries=this.mockWeights().filter(([k])=>selected.includes(k));
  if(!entries.length)throw Error("Select at least one subject.");
  const totalWeight=entries.reduce((sum,[,w])=>sum+w,0);
  const available=entries.map(([k,w])=>({key:k,weight:w,capacity:this.subjects[k].questions.length,ideal:100*w/totalWeight,count:0}));
  if(available.reduce((sum,x)=>sum+x.capacity,0)<100){
    throw Error("The selected subjects have fewer than 100 questions in total. Select more subjects.");
  }
  available.forEach(x=>x.count=Math.min(x.capacity,Math.floor(x.ideal)));
  let missing=100-available.reduce((sum,x)=>sum+x.count,0);
  while(missing>0){
    const candidates=available.filter(x=>x.count<x.capacity);
    if(!candidates.length)throw Error("Not enough questions to generate the session.");
    candidates.sort((a,b)=>(b.ideal-b.count)-(a.ideal-a.count) || b.weight-a.weight);
    candidates[0].count++;
    missing--;
  }
  return available;
},

mockHistory(){
  try{return JSON.parse(localStorage.getItem("debriefroom_mock_reveal_history")||"{}")||{}}
  catch(e){return {}}
},

makeMockRevealQuestions(alloc){
  const history=this.mockHistory();
  const current={...history};
  const combined=[];
  alloc.forEach(({key,count})=>{
    // Shuffle ties; prioritize questions not recently used.
    const ranked=this.shuffle([...this.subjects[key].questions]).sort((a,b)=>(history[a.id]||0)-(history[b.id]||0));
    const picked=ranked.slice(0,count);
    picked.forEach(q=>{current[q.id]=(history[q.id]||0)+1;combined.push({subjectKey:key,question:q})});
  });
  try{localStorage.setItem("debriefroom_mock_reveal_history",JSON.stringify(current))}catch(e){}
  return this.shuffle(combined);
},

startMockReveal(){
  try{
    const allocation=this.mockAllocate(this.mockSelected||[]);
    const questions=this.makeMockRevealQuestions(allocation);
    if(questions.length!==100 || new Set(questions.map(x=>x.question.id)).size!==100){
      throw Error("Question selection failed uniqueness check.");
    }
    this.mock={allocation,questions,index:0,revealed:{}};
    this.renderMockReveal();
  }catch(e){this.mockSetup(e.message)}
},

renderMockReveal(){
  if(!this.mock)return this.mockSetup();
  const {allocation,questions,index,revealed}=this.mock;
  const item=questions[index];
  const q=item.question;
  const subject=this.subjects[item.subjectKey];
  const isRevealed=!!revealed[q.id];
  const choices=["A","B","C","D"].map(letter=>`
    <div class="option ${isRevealed && letter===q.correct?"correct":""}" style="cursor:default">
      <div class="letter">${letter}</div><div class="optionText">${q.options[letter]}</div>
    </div>`).join("");
  this.mount(`${this.top("MockPrep","App.mockSetup()")}
  <section class="card">
    <div class="questionIndex">Question ${index+1} of ${questions.length}</div>
    <div class="topic">${subject.icon} ${subject.name} · ${q.id}</div>
    <div class="question">${q.question}</div>
    ${this.img(q)}
    ${choices}
    ${isRevealed?`
      <div class="feedback" style="margin-top:16px"><b>✅ Answer: ${q.correct}</b><br>${q.options[q.correct]}
        ${q.explanation?`<br><br><b>Why</b><br>${q.explanation}`:""}
        ${q.examTip?`<br><br><b>Exam Trap</b><br>${q.examTip}`:""}
      </div>`:
      `<button class="primary" style="margin-top:16px" onclick="App.revealMockAnswer()">👁 Reveal Answer</button>`}
    <div style="display:flex;gap:10px;margin-top:18px">
      <button class="secondary" style="flex:1" onclick="App.moveMock(-1)" ${index===0?"disabled":""}>← Previous</button>
      <button class="primary" style="flex:1" onclick="App.moveMock(1)" ${index===questions.length-1?"disabled":""}>Next →</button>
    </div>
    <div class="footerNote">${allocation.map(x=>`${this.subjects[x.key].name}: ${x.count}`).join(" · ")}</div>
    ${index===questions.length-1?`<button class="secondary" onclick="App.mockFinish()">Finish Session</button>`:""}
  </section>`)
},

revealMockAnswer(){
  if(!this.mock)return;
  const q=this.mock.questions[this.mock.index].question;
  this.mock.revealed[q.id]=true;
  this.renderMockReveal();
},

moveMock(delta){
  if(!this.mock)return;
  this.mock.index=Math.max(0,Math.min(this.mock.questions.length-1,this.mock.index+delta));
  this.renderMockReveal();
},

mockFinish(){
  if(!this.mock)return;
  const shown=Object.keys(this.mock.revealed).length;
  this.mount(`${this.top("MockPrep","App.dashboard()")}
  <section class="card">
    <h2 class="sectionTitle">MockPrep Complete</h2>
    <p class="subtle">You revealed ${shown} of 100 answers. This revision session is not scored.</p>
    <button class="primary" onclick="App.mockSetup()">New MockPrep</button>
    <button class="secondary" onclick="App.dashboard()">Subjects</button>
  </section>`);
},

openSubject(key){
  this.useSubject(key);
  this.subject()
},

subject(){
  const subject=this.activeSubject();
  const p=this.subjectProgress();
  const last=this.getLastStudy();

  this.mount(`${this.top("Subjects","App.dashboard()")}
  <section class="card glass">
    <h2 class="sectionTitle">${subject.icon} ${subject.name}</h2>
    <p style="color:#dbeafe;margin:0">${p.pct}% complete • ${p.total} questions</p>
    <div class="progressLine">
      <div class="progressFill" style="width:${p.pct}%;background:${subject.color}"></div>
    </div>
  </section>

  ${p.total && last>0 ? `
  <section class="card">
    <h2 class="sectionTitle">Continue Learning</h2>
    <p class="subtle">Question ${Math.min(last+1,p.total)} of ${p.total}</p>
    <button class="primary" onclick="App.study(App.getLastStudy())">Continue</button>
  </section>` : ""}

  <section class="card">
    <h2 class="sectionTitle">Choose Session</h2>
    <div class="menu">
      <button class="menuBtn" onclick="App.study(0)">
        <div class="icon">📚</div>
        <div>Study<small>Question and correct answer.</small></div>
      </button>

      <button class="menuBtn" onclick="App.startPractice()">
        <div class="icon">⚡</div>
        <div>Practice<small>Choose an answer and get instant feedback.</small></div>
      </button>

      <button class="menuBtn" onclick="App.startExam()">
        <div class="icon">📝</div>
        <div>Quiz<small>20 random questions.</small></div>
      </button>

      <button class="menuBtn" onclick="App.startExam()">
        <div class="icon">🎯</div>
        <div>Exam<small>Open always.</small></div>
      </button>

      <button class="menuBtn" onclick="App.bookmarks()">
        <div class="icon">⭐</div>
        <div>Bookmarks<small>${p.bookmarks} saved questions.</small></div>
      </button>

      <button class="menuBtn" onclick="App.reviewSavedWrong()">
        <div class="icon">📚</div>
        <div>Mistakes<small>${p.wrong} questions need focus.</small></div>
      </button>
    </div>
  </section>`)
},

img(q){
  return q.image
    ? `<div class="visual"><img src="${q.image}" alt="Question illustration"></div>`
    : ""
},

options(q,mode="plain",order=null){
  const optionOrder=order||q.optionOrder||["A","B","C","D"];

  return optionOrder.map((originalKey,index)=>{
    const visibleLetter=this.displayLetters[index];
    let cls="option";

    if(mode==="answer" && originalKey===q.correct){
      cls+=" correct"
    }

    return`<div class="${cls}"
      data-key="${originalKey}"
      data-label="${visibleLetter}"
      ${mode==="exam"?`onclick="App.answerExam('${originalKey}')"`:""}>
      <div class="letter">${visibleLetter}</div>
      <div class="optionText">${q.options[originalKey]}</div>
    </div>`
  }).join("")
},

study(i=0){
  if(!this.q.length){
    this.subject();
    return
  }

  this.current=Math.max(0,Math.min(i,this.q.length-1));
  const q=this.q[this.current];
  const subject=this.activeSubject();

  this.setLastStudy(this.current);

  const bm=Store.get().bookmarks?.[q.id]?"⭐":"☆";
  const correctText=q.options[q.correct];

  const explanation=q.explanation
    ? `<div class="feedback"><b>Explanation</b><br>${q.explanation}</div>`
    : "";

  const examTip=q.examTip
    ? `<div class="feedback"><b>Exam Tip</b><br>${q.examTip}</div>`
    : "";

  this.mount(`${this.top(subject.name)}
  <section class="card">
    <div class="questionIndex">Question ${this.current+1} of ${this.q.length}</div>

    <span class="badge">${q.id}</span>
    ${q.badge?`<span style="margin-left:8px">${q.badge}</span>`:""}

    <button class="secondary"
      style="float:right;width:auto;margin:0;padding:9px 12px"
      onclick="App.toggleBookmark('${q.id}')">${bm}</button>

    <div class="topic">${q.topic} • ${q.difficulty}</div>
    <div class="question">${q.question}</div>

    ${this.img(q)}

    <div style="
      margin:18px 0 8px;
      padding:18px;
      border-radius:18px;
      background:#eff6ff;
      border:1px solid #bfdbfe;
      color:#0f172a;
      font-size:24px;
      line-height:1.35;
      font-weight:900">
      ${correctText}
    </div>

    ${explanation}
    ${examTip}

    <button class="primary" onclick="App.study(App.current+1)">Next</button>
    <button class="secondary" onclick="App.study(App.current-1)">Previous</button>
  </section>`)
},

startPractice(startIndex=0){
  if(!this.q.length){
    this.subject();
    return
  }

  this.practice={
    subjectKey:this.activeKey,
    questions:this.q.map(q=>({
      ...q,
      optionOrder:this.shuffle(["A","B","C","D"])
    })),
    index:Math.max(0,Math.min(startIndex,this.q.length-1)),
    answers:{}
  };

  this.renderPractice()
},

renderPractice(){
  if(!this.practice || !this.practice.questions.length){
    this.subject();
    return
  }

  const q=this.practice.questions[this.practice.index];
  const subject=this.activeSubject();
  const saved=this.practice.answers[q.id]||null;
  const bm=Store.get().bookmarks?.[q.id]?"⭐":"☆";

  const optionOrder=q.optionOrder||["A","B","C","D"];
  const optionHtml=optionOrder.map((originalKey,index)=>{
    const visibleLetter=this.displayLetters[index];
    let cls="option";

    if(saved){
      if(originalKey===q.correct)cls+=" correct";
      if(originalKey===saved.selected && originalKey!==q.correct)cls+=" wrong";
      if(originalKey===saved.selected)cls+=" selected";
    }

    const click=saved?"":`onclick="App.answerPractice('${originalKey}')"`;

    return`<div class="${cls}" data-key="${originalKey}" data-label="${visibleLetter}" ${click}>
      <div class="letter">${visibleLetter}</div>
      <div class="optionText">${q.options[originalKey]}</div>
    </div>`
  }).join("");

  let feedback="";
  if(saved){
    const correctLabel=this.displayLabelFor(q.correct,q.optionOrder);
    const resultTitle=saved.isCorrect?"✅ Correct":"❌ Not quite";
    const resultText=saved.isCorrect
      ? `You selected the correct answer.`
      : `Correct answer: ${correctLabel}. ${q.options[q.correct]}`;

    const explanation=q.explanation
      ? `<br><br><b>Why</b><br>${q.explanation}`
      : "";
    const examTip=q.examTip
      ? `<br><br><b>Exam Trap</b><br>${q.examTip}`
      : "";

    feedback=`<div class="feedback"><b>${resultTitle}</b><br>${resultText}${explanation}${examTip}</div>`;
  }

  this.mount(`${this.top(subject.name)}
  <section class="card">
    <div class="questionIndex">Question ${this.practice.index+1} of ${this.practice.questions.length}</div>

    <span class="badge">${q.id}</span>
    ${q.badge?`<span style="margin-left:8px">${q.badge}</span>`:""}

    <button class="secondary"
      style="float:right;width:auto;margin:0;padding:9px 12px"
      onclick="App.togglePracticeBookmark('${q.id}')">${bm}</button>

    <div class="topic">${q.topic} • ${q.difficulty}</div>
    <div class="question">${q.question}</div>

    ${this.img(q)}
    ${optionHtml}
    ${feedback}

    <button class="primary" onclick="App.practiceMove(1)" ${this.practice.index>=this.practice.questions.length-1?'disabled':''}>Next</button>
    <button class="secondary" onclick="App.practiceMove(-1)" ${this.practice.index<=0?'disabled':''}>Previous</button>
  </section>`)
},

answerPractice(originalKey){
  if(!this.practice)return;

  const q=this.practice.questions[this.practice.index];
  if(this.practice.answers[q.id])return;

  const isCorrect=originalKey===q.correct;
  this.practice.answers[q.id]={
    selected:originalKey,
    correct:q.correct,
    isCorrect
  };

  Store.mark(q.id,isCorrect);
  this.renderPractice()
},

practiceMove(delta){
  if(!this.practice)return;
  const next=Math.max(0,Math.min(
    this.practice.index+delta,
    this.practice.questions.length-1
  ));
  this.practice.index=next;
  this.renderPractice()
},

togglePracticeBookmark(id){
  Store.bookmark(id);
  this.renderPractice()
},

toggleBookmark(id){
  Store.bookmark(id);
  this.study(this.current)
},

startExam(set=null){
  if(!this.q.length){
    this.subject();
    return
  }

  this.exam={
    subjectKey:this.activeKey,
    questions:this.quizSet(set),
    index:0,
    answers:[],
    score:0
  };

  this.renderExam()
},

renderExam(){
  const q=this.exam.questions[this.exam.index];
  const subject=this.activeSubject();

  this.mount(`${this.top(subject.name)}
  <section class="card">
    <div class="questionIndex">Question ${this.exam.index+1} of ${this.exam.questions.length}</div>

    <span class="badge">${q.id}</span>
    ${q.badge?`<span style="margin-left:8px">${q.badge}</span>`:""}

    <div class="topic">${q.topic} • ${q.difficulty}</div>
    <div class="question">${q.question}</div>

    ${this.img(q)}
    ${this.options(q,"exam")}

    <div class="footerNote">No feedback until Debrief.</div>
  </section>`)
},

answerExam(originalKey){
  const q=this.exam.questions[this.exam.index];
  const ok=originalKey===q.correct;

  const selectedEl=document.querySelector(`.option[data-key="${originalKey}"]`);
  const selectedLabel=selectedEl?selectedEl.dataset.label:originalKey;
  const correctLabel=this.displayLabelFor(q.correct,q.optionOrder);

  this.exam.answers.push({
    id:q.id,
    selected:originalKey,
    selectedLabel,
    correct:q.correct,
    correctLabel,
    isCorrect:ok,
    topic:q.topic
  });

  if(ok)this.exam.score++;
  Store.mark(q.id,ok);

  document.querySelectorAll(".option").forEach(el=>{
    el.style.pointerEvents="none";
    if(el.dataset.key===originalKey){
      el.classList.add("selected")
    }
  });

  setTimeout(()=>{
    if(this.exam.index<this.exam.questions.length-1){
      this.exam.index++;
      this.renderExam()
    }else{
      this.examResult()
    }
  },140)
},

topicSummary(){
  const stats={};

  this.exam.answers.forEach(a=>{
    stats[a.topic]=stats[a.topic]||{ok:0,total:0};
    stats[a.topic].total++;
    if(a.isCorrect)stats[a.topic].ok++
  });

  const arr=Object.entries(stats).map(([topic,v])=>({
    topic,
    score:v.ok/v.total
  }));

  return{
    strengths:arr
      .filter(x=>x.score>=.8)
      .map(x=>x.topic)
      .slice(0,3),

    weak:arr
      .filter(x=>x.score<.8)
      .sort((a,b)=>a.score-b.score)
      .map(x=>x.topic)
      .slice(0,3)
  }
},

examResult(){
  const total=this.exam.questions.length;
  const pct=Math.round(this.exam.score/total*100);
  const wrong=this.exam.answers.filter(a=>!a.isCorrect);
  const sum=this.topicSummary();
  const subject=this.activeSubject();

  Store.lastQuiz({
    subject:this.activeKey,
    score:this.exam.score,
    total,
    pct
  });

  this.mount(`${this.top(subject.name)}
  <section class="card">
    <h2 class="sectionTitle">Debrief Summary</h2>

    <div class="score">${this.exam.score} / ${total}</div>
    <div class="metricLabel">Accuracy</div>
    <p class="subtle">${pct}%</p>

    <div class="progressLine">
      <div class="progressFill" style="width:${pct}%;background:${subject.color}"></div>
    </div>

    <div class="summaryGrid">
      <div class="summaryBox">
        <b>💪 Strengths</b>
        ${sum.strengths.length
          ? sum.strengths.map(t=>`<div>✅ ${t}</div>`).join("")
          : "<div>Keep training to build strengths.</div>"}
      </div>

      <div class="summaryBox">
        <b>📚 Needs Focus</b>
        ${sum.weak.length
          ? sum.weak.map(t=>`<div>⚠️ ${t}</div>`).join("")
          : "<div>No weak topics in this quiz.</div>"}
      </div>
    </div>

    ${wrong.length?`
      <button class="primary" onclick="App.reviewExamMistakes()">Review Mistakes</button>
      <button class="secondary" onclick="App.retryMistakes()">Retry Mistakes</button>
    `:""}

    <button class="secondary" onclick="App.startExam()">Start New Quiz</button>
    <button class="secondary" onclick="App.subject()">Return to ${subject.name}</button>
  </section>`)
},

retryMistakes(){
  const ids=this.exam.answers
    .filter(a=>!a.isCorrect)
    .map(a=>a.id);

  this.startExam(
    this.exam.questions.filter(q=>ids.includes(q.id))
  )
},

reviewExamMistakes(){
  const wrong=this.exam.answers.filter(a=>!a.isCorrect);

  this.mount(`${this.top("Debrief","App.examResult()")}
  <section class="card">
    <h2 class="sectionTitle">Mistake Review</h2>

    ${wrong.map(a=>{
      const q=this.exam.questions.find(x=>x.id===a.id);

      const tip=q.examTip
        ? `<br><br><b>Exam Tip</b><br>${q.examTip}`
        : "";

      return`
      <div>
        <span class="badge">${q.id}</span>
        ${q.badge?`<span style="margin-left:8px">${q.badge}</span>`:""}

        <div class="topic">${q.topic}</div>
        <div class="question" style="font-size:21px">${q.question}</div>

        ${this.img(q)}

        <div class="option wrong">
          <div class="letter">${a.selectedLabel||a.selected}</div>
          <div class="optionText">Your answer: ${q.options[a.selected]}</div>
        </div>

        <div class="option correct">
          <div class="letter">${a.correctLabel||q.correct}</div>
          <div class="optionText">Correct: ${q.options[q.correct]}</div>
        </div>

        <div class="feedback">
          <b>Explanation</b><br>
          ${q.explanation||"Explanation will be added after verification."}
          ${tip}
        </div>
      </div>`
    }).join("")}

    <button class="primary" onclick="App.examResult()">Back to Debrief</button>
  </section>`)
},

reviewSavedWrong(){
  const ids=Object.keys(Store.get().wrong||{});
  const set=this.q.filter(q=>ids.includes(q.id));

  if(!set.length){
    this.mount(`${this.top(this.activeSubject().name)}
    <section class="card">
      <h2 class="sectionTitle">🎉 No mistakes yet</h2>
      <p class="subtle">Complete a quiz first. Missed questions will appear here.</p>
      <button class="primary" onclick="App.startExam()">Start Quiz</button>
    </section>`);
    return
  }

  this.startExam(set)
},

bookmarks(){
  const ids=Object.keys(Store.get().bookmarks||{});
  const set=this.q.filter(q=>ids.includes(q.id));

  if(!set.length){
    this.mount(`${this.top(this.activeSubject().name)}
    <section class="card">
      <h2 class="sectionTitle">⭐ No bookmarks yet</h2>
      <p class="subtle">Save important questions while studying.</p>
      <button class="primary" onclick="App.study(0)">Start Studying</button>
    </section>`);
    return
  }

  this.study(
    this.q.findIndex(q=>q.id===set[0].id)
  )
}
};

window.addEventListener("load",()=>App.init());
