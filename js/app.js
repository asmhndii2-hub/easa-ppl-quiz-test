
const App={
subjects:{},
activeKey:"communications",
q:[],
current:0,
exam:null,
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
    }
  };

  this.useSubject("communications");

  Profiles.current()
    ? this.dashboard()
    : this.profileSelect()
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
    <div class="topVersion">v0.9.3</div>
  </div>`
},

status(q){
  return`<span class="status ${q.status||"paper_verified"}">${(q.status||"paper_verified").replaceAll("_"," ")}</span>`
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
    <div class="version">v0.9.3</div>
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
  <section class="card">
    <h2 class="sectionTitle">Subjects</h2>
    ${Object.keys(this.subjects).map(key=>this.subjectCard(key)).join("")}
  </section>`)
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
