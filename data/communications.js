window.DEBRIEFROOM_COMMUNICATIONS = [
  {
    "id": "COM-001",
    "topic": "Phraseology",
    "difficulty": "Core",
    "status": "paper_verified",
    "question": "The correct pronunciation for transmitting an altitude of 2500 is:",
    "options": {
      "A": "Two fife zero zero",
      "B": "Two fife hundred",
      "C": "Too tousand fife hundred",
      "D": "Too fife zero zero"
    },
    "correct": "C",
    "explanation": "2500 is transmitted as thousands plus hundreds: too tousand fife hundred.",
    "examTip": "Altitude pronunciation tests standard aviation wording.",
    "image": null
  },
  {
    "id": "COM-002",
    "topic": "Frequencies",
    "difficulty": "Core",
    "status": "paper_verified",
    "question": "The correct RTF phraseology for frequency 121.275 MHz is:",
    "options": {
      "A": "One two one decimal two seven",
      "B": "One two one two seven five",
      "C": "One two one two seven",
      "D": "One two one decimal two seven five"
    },
    "correct": "D",
    "explanation": "Frequencies are transmitted digit by digit, using decimal.",
    "examTip": "Use decimal, not point.",
    "image": null
  },
  {
    "id": "COM-003",
    "topic": "Phraseology",
    "difficulty": "Core",
    "status": "paper_verified",
    "question": "The word Roger has the meaning:",
    "options": {
      "A": "I understand your last transmission",
      "B": "Received and understood",
      "C": "I will comply with your message",
      "D": "I have received all of your last transmission"
    },
    "correct": "D",
    "explanation": "Roger means the last transmission has been received. It does not mean you will comply.",
    "examTip": "Roger = received. Wilco = received and will comply.",
    "image": null
  },
  {
    "id": "COM-004",
    "topic": "Transponder",
    "difficulty": "Core",
    "status": "verified",
    "question": "The transponder should be set to which code in the event of an emergency?",
    "options": {
      "A": "7000",
      "B": "7500",
      "C": "7600",
      "D": "7700"
    },
    "correct": "D",
    "explanation": "Squawk 7700 is the general emergency code.",
    "examTip": "7700 emergency, 7600 radio failure, 7500 unlawful interference.",
    "image": null
  },
  {
    "id": "COM-005",
    "topic": "Transponder",
    "difficulty": "Important",
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
    "image": "assets/transponder_7000_on.svg"
  },
  {
    "id": "COM-006",
    "topic": "Transponder",
    "difficulty": "Important",
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
    "image": "assets/transponder_7000_alt.svg"
  },
  {
    "id": "COM-007",
    "topic": "Readability",
    "difficulty": "Core",
    "status": "verified",
    "question": "Readability 3 means:",
    "options": {
      "A": "Perfectly readable",
      "B": "Unreadable",
      "C": "Readable but with difficulty",
      "D": "Readable now and then"
    },
    "correct": "C",
    "explanation": "Readability 3 means readable but with difficulty.",
    "examTip": "Readability scale: 1 unreadable, 5 perfectly readable.",
    "image": null
  },
  {
    "id": "COM-008",
    "topic": "ATIS",
    "difficulty": "Core",
    "status": "paper_verified",
    "question": "A service providing automated airfield and meteorological information for arriving and departing traffic is:",
    "options": {
      "A": "AFIS",
      "B": "ATIS",
      "C": "FIS",
      "D": "APIS"
    },
    "correct": "B",
    "explanation": "ATIS provides automatic terminal information.",
    "examTip": "ATIS = Automatic Terminal Information Service.",
    "image": null
  },
  {
    "id": "COM-009",
    "topic": "Distress Calls",
    "difficulty": "Core",
    "status": "verified",
    "question": "Distress is defined as a condition:",
    "options": {
      "A": "Where the pilot considers the aircraft has an emergency",
      "B": "Concerning the safety of an aircraft or other vehicle",
      "C": "Of grave and/or imminent danger and of requiring immediate assistance",
      "D": "Concerning the safety of an aircraft and not requiring immediate assistance"
    },
    "correct": "C",
    "explanation": "Distress means grave and imminent danger requiring immediate assistance.",
    "examTip": "Distress = MAYDAY. Urgency = PAN PAN.",
    "image": null
  },
  {
    "id": "COM-010",
    "topic": "Phraseology",
    "difficulty": "Core",
    "status": "verified",
    "question": "STANDBY means:",
    "options": {
      "A": "The same as pass your message",
      "B": "Wait and I will call you",
      "C": "Repeat your last transmission",
      "D": "Wait and transmit again"
    },
    "correct": "B",
    "explanation": "Standby means wait; the other station will call you back when ready.",
    "examTip": "Standby is not permission to continue your message.",
    "image": null
  }
];
