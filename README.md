# DebriefRoom v1.0.0 — All Subjects Integration

This patch integrates all nine EASA PPL subjects into the current DebriefRoom application.

## Subjects and question counts

- Communications: 81
- Air Law: 174
- Human Performance: 85
- Operational Procedures: 78
- Principles of Flight: 91
- Aircraft General Knowledge: 122
- Meteorology: 124
- Flight Performance & Planning: 106
- Navigation: 103

**Total: 964 questions**

## Installation

Copy the contents of this ZIP into the root of the current DebriefRoom repository and allow matching files to be replaced.

Replace:

- `index.html`
- `js/app.js`
- files inside `data/`

Add or merge:

- folders inside `assets/`
- `reference/navigation_practical_routes.pdf`

Do not delete the existing `css/`, `manifest.json`, `service-worker.js`, or `js/store.js` files.

## Included behavior

- Opens directly on the Subjects page; the profile/sign-in page remains removed.
- Existing Communications and Air Law IDs are preserved, so saved progress remains compatible.
- Study mode shows the correct answer immediately.
- Quiz and Exam use 20 random questions and delay feedback until the Debrief Summary.
- Answer text is shuffled while visible labels remain A–D.
- Internal verification statuses are not shown to students.
- Question diagrams and charts are included in `assets/`.
- The 44-page Navigation practical-route section is preserved as a reference PDF and is not exposed as a multiple-choice quiz.

## Validation completed

- JavaScript syntax checks
- Question schema and answer-key checks
- Global question-ID uniqueness
- Image-reference validation
- Nine-subject dashboard smoke test
- Study and Quiz flow smoke test for every subject

Commit:

`DebriefRoom v1.0.0 integrate all EASA PPL subjects`
