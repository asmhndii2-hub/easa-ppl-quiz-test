let current = 0;
let score = 0;
let answered = false;
let missed = [];

function $(id){ return document.getElementById(id); }

function startQuiz(){
  current = 0; score = 0; missed = [];
  $("startScreen").classList.add("hidden");
  $("resultScreen").classList.add("hidden");
  $("quizScreen").classList.remove("hidden");
  renderQuestion();
}

function renderQuestion(){
  answered = false;
  const q = QUESTIONS[current];
  $("progressPill").textContent = (current + 1) + " / " + QUESTIONS.length;
  $("cardId").textContent = q.id;
  $("subject").textContent = q.subject;
  $("questionText").textContent = q.question;
  $("feedback").className = "feedback hidden";
  $("feedback").innerHTML = "";
  $("nextBtn").disabled = true;
  $("nextBtn").textContent = current === QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question";

  $("options").innerHTML = ["A","B","C","D"].map(letter => `
    <div class="option" data-letter="${letter}" onclick="chooseAnswer('${letter}')">
      <div class="letter">${letter}</div>
      <div class="optionText">${q.options[letter]}</div>
    </div>
  `).join("");
}

function chooseAnswer(letter){
  if(answered) return;
  answered = true;
  const q = QUESTIONS[current];

  document.querySelectorAll(".option").forEach(el => {
    const l = el.getAttribute("data-letter");
    if(l === q.answer) el.classList.add("correct");
    if(l === letter && l !== q.answer) el.classList.add("wrong");
  });

  const correct = letter === q.answer;
  if(correct) score++;
  else missed.push(q.id);

  $("feedback").className = "feedback " + (correct ? "good" : "bad");
  $("feedback").innerHTML =
    `<b>${correct ? "✅ Correct" : "❌ Incorrect"}</b><br><br>` +
    `<b>Correct Answer: ${q.answer} — ${q.options[q.answer]}</b><br><br>` +
    `${q.explanation}`;

  $("nextBtn").disabled = false;
}

function nextQuestion(){
  if(current < QUESTIONS.length - 1){
    current++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz(){
  $("quizScreen").classList.add("hidden");
  $("resultScreen").classList.remove("hidden");
  $("progressPill").textContent = "Done";
  const pct = Math.round(score / QUESTIONS.length * 100);
  $("scoreText").textContent = `${score}/${QUESTIONS.length} (${pct}%)`;
  $("resultText").textContent = pct >= 80 ? "Good result. Keep reviewing weak cards." : "Review the missed cards and try again.";
  $("missedList").innerHTML = missed.length ? `<b>Missed:</b> ${missed.join(", ")}` : "<b>Perfect score.</b>";
}

function restartQuiz(){
  startQuiz();
}
