DebriefRoom v1.0.2 — MockPrep (100-question Click-to-Reveal)

TARGET: Original DebriefRoom project only. Do NOT install into Debrief50.

Installation:
  Replace js/app.js in the original DebriefRoom repository with the supplied file.
  Commit to your original DebriefRoom repository and allow hosting to redeploy.
  Assumes the original nine subject scripts are already loaded by index.html.

Feature:
  - Dashboard: MockPrep tab/button.
  - Five selectable subjects (Communications 20, Air Law 28,
    Operational Procedures 7, Aircraft General Knowledge 20,
    Principles of Flight 25).
  - Exact 100-question proportional redistribution for any selection with
    enough available questions; largest remainder allocation with capacity caps.
  - Fully randomized question order; A/B/C/D options remain in source order.
  - Click Reveal Answer to highlight the correct option and show the answer.
  - Original explanation/Exam Trap shown when available.
  - Previous/Next, reveals retained during the current session.
  - Session is not graded. Repeated questions are minimized on the same browser.
  - Does not modify subject Study, Practice, Quiz or Exam data/logic.

Important pool limit:
  In the bundled original v1.0 question bank, Communications has 81 questions,
  Operational Procedures 78 and Principles of Flight 91.
  Selecting only one of those subjects cannot generate 100 UNIQUE questions.
  The app asks you to select additional subjects rather than invent/repeat questions.

Verified with source data from the original DebriefRoom v1.0 archive and
v1.0.1 Practice app.js: five subjects all selected -> 20/28/7/20/25;
Air Law + Ops -> 80/20; Air Law only -> 100;
three selected Comms/Air Law/AGK -> 30/41/29. 100 unique IDs checked.
Node JavaScript syntax check passed. Live deployment not tested.
