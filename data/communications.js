window.DEBRIEFROOM_COMMUNICATIONS = [
  {
    "id": "COM-001",
    "subject": "Communications",
    "topic": "Phraseology",
    "difficulty": "Core",
    "source": "Seed",
    "status": "paper_verified",
    "question": "The correct pronunciation for transmitting an altitude of 2500 is:",
    "options": {
      "A": "Two fife zero zero",
      "B": "Two fife hundred",
      "C": "Too tousand fife hundred",
      "D": "Too fife zero zero"
    },
    "correct": "C",
    "explanation": "In radiotelephony, 2500 is transmitted as thousands plus hundreds: “too tousand fife hundred.”",
    "examTip": "Altitude pronunciation questions test standard aviation pronunciation.",
    "image": null,
    "tags": [
      "numbers",
      "altitude"
    ]
  },
  {
    "id": "COM-002",
    "subject": "Communications",
    "topic": "Frequencies",
    "difficulty": "Core",
    "source": "Seed",
    "status": "paper_verified",
    "question": "The correct RTF phraseology for frequency 121.275 MHz is:",
    "options": {
      "A": "One two one decimal two seven",
      "B": "One two one two seven five",
      "C": "One two one two seven",
      "D": "One two one decimal two seven five"
    },
    "correct": "D",
    "explanation": "Frequencies are transmitted digit by digit, using “decimal” for the decimal point.",
    "examTip": "Use “decimal”, not “point”, in aviation RTF.",
    "image": null,
    "tags": [
      "frequency"
    ]
  },
  {
    "id": "COM-003",
    "subject": "Communications",
    "topic": "Phraseology",
    "difficulty": "Core",
    "source": "Seed",
    "status": "paper_verified",
    "question": "The word “Roger” has the meaning:",
    "options": {
      "A": "I understand your last transmission",
      "B": "Received and understood",
      "C": "I will comply with your message",
      "D": "I have received all of your last transmission"
    },
    "correct": "D",
    "explanation": "Roger means the last transmission has been received. It does not mean you will comply.",
    "examTip": "Roger = received. Wilco = received and will comply.",
    "image": null,
    "tags": [
      "roger",
      "wilco"
    ]
  },
  {
    "id": "COM-004",
    "subject": "Communications",
    "topic": "Transponder",
    "difficulty": "Core",
    "source": "Seed",
    "status": "verified",
    "question": "The transponder should be set to which code in the event of an emergency?",
    "options": {
      "A": "7000",
      "B": "7500",
      "C": "7600",
      "D": "7700"
    },
    "correct": "D",
    "explanation": "Squawk 7700 is the general emergency transponder code.",
    "examTip": "7700 emergency, 7600 radio failure, 7500 unlawful interference.",
    "image": null,
    "tags": [
      "transponder"
    ]
  },
  {
    "id": "COM-005",
    "subject": "Communications",
    "topic": "Transponder",
    "difficulty": "Important",
    "source": "Paper 9 Q9 corrected",
    "status": "needs_review",
    "question": "The transponder display shows code 7000 and the selector is in ON mode. What will be displayed on a controller’s radar?",
    "options": {
      "A": "The aircraft's pressure altitude only",
      "B": "The code that you have set on the transponder",
      "C": "The code that you have set on the transponder and the aircraft’s pressure altitude",
      "D": "The code and altitude using the regional pressure setting"
    },
    "correct": "B",
    "explanation": "In ON mode, the transponder replies with the selected code only. ALT mode is required for code plus pressure altitude.",
    "examTip": "ON = code only. ALT = code + pressure altitude.",
    "image": "assets/transponder_7000_on.svg",
    "tags": [
      "transponder",
      "on",
      "alt"
    ]
  },
  {
    "id": "COM-006",
    "subject": "Communications",
    "topic": "Transponder",
    "difficulty": "Important",
    "source": "DebriefRoom training variant",
    "status": "verified",
    "question": "The transponder display shows code 7000 and the selector is in ALT mode. What will be displayed on a controller’s radar?",
    "options": {
      "A": "The aircraft's pressure altitude only",
      "B": "The code that you have set on the transponder",
      "C": "The code that you have set on the transponder and the aircraft’s pressure altitude",
      "D": "The aircraft callsign only"
    },
    "correct": "C",
    "explanation": "In ALT mode, the transponder transmits the selected squawk code and pressure altitude.",
    "examTip": "ON sends code only; ALT sends code + pressure altitude.",
    "image": "assets/transponder_7000_alt.svg",
    "tags": [
      "transponder",
      "alt"
    ]
  }
];
