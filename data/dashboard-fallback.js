// Auto-generated from data/dashboard.json and data/jack-feed.json
window.SPARK_INTERN_DATA = {
  "lastUpdated": "2026-10-13",
  "feedConfig": {
    "status": "Ready for Friday (Project #1)",
    "localFeedPath": "./data/jack-feed.json",
    "remoteFeedUrl": "",
    "llmModel": "deepseek-chat",
    "inputMode": "Mobile & Studio Voice → DeepSeek API"
  },
  "intern": {
    "name": "Jack",
    "role": "AI & Studio Operations Intern",
    "hostOrganization": "Spark AI",
    "primaryLocation": "Studio 1385",
    "supervisor": "Mike Miller",
    "partnerOrganization": "Momentum Work Inc.",
    "startDate": "2026-10-16",
    "scheduleNote": "Flexible Schedule (~3–5 hrs/week • Studio 1385, On-Site Client Visits & Remote/Home)",
    "status": "Active — Starts Fri, Oct 16, 2026"
  },
  "projects": [
    {
      "id": "voice-deepseek-time-logger",
      "badge": "INTERNAL PROJECT • PERSONAL LOGGER DASHBOARD BUILD",
      "title": "Personal Time-Logger Dashboard (Functional Build → Voice Input → DeepSeek API)",
      "status": "Starts Oct 16",
      "description": "Jack first builds his own functional dashboard to log his hours (Studio 1385 vs. Remote / Home) and wire it into this Master Portal, then upgrades it with voice capture and DeepSeek API structured JSON parsing so he can speak his updates instead of typing.",
      "milestones": [
        {
          "id": "p1-m1",
          "title": "1. Build Functional Time-Logging Dashboard & Wire to Master Portal",
          "detail": "Create Jack's personal dashboard UI, make time & location logging (Studio 1385 vs. Remote / Home) fully functional, and connect its feed (data/jack-feed.json) into this Master Dashboard",
          "status": "Upcoming",
          "sampleStatus": "Completed",
          "completed": false,
          "sampleCompleted": true
        },
        {
          "id": "p1-m2",
          "title": "2. Add Mobile & Studio Voice Capture (\"Speak, Don't Type\")",
          "detail": "Add microphone speech capture on Jack's dashboard so he can dictate session updates from his phone or Studio 1385 workstation",
          "status": "Upcoming",
          "sampleStatus": "In Progress",
          "completed": false,
          "sampleCompleted": true
        },
        {
          "id": "p1-m3",
          "title": "3. Wire DeepSeek API Voice-to-JSON Parser",
          "detail": "Connect deepseek-chat (JSON mode) to parse Jack's spoken updates into structured date, location, hours, project, and summary records automatically",
          "status": "Upcoming",
          "sampleStatus": "Upcoming",
          "completed": false,
          "sampleCompleted": false
        }
      ]
    },
    {
      "id": "yce-inc-mac-mini-llm",
      "badge": "CLIENT PROJECT #1 • YCE INC.",
      "title": "YCE Inc. — On-Premise LLM Mac Mini Deployment & Training",
      "status": "Pending Coordination",
      "description": "Deploying a local Large Language Model Mac Mini appliance at YCE Inc.'s offices and conducting hands-on staff training. Coordinating schedule so Jack can attend on-site, see how the deployment is executed, and assist with training.",
      "milestones": [
        {
          "id": "yce-m1",
          "title": "1. On-Site LLM Mac Mini Deployment at YCE Offices",
          "detail": "Shadow and assist Mike with delivering and deploying the local LLM Mac Mini setup at YCE Inc. (targeting Friday or upcoming window)",
          "status": "Pending Schedule",
          "sampleStatus": "Completed",
          "completed": false,
          "sampleCompleted": true
        },
        {
          "id": "yce-m2",
          "title": "2. Hands-On Client Training & Workflow Walkthrough",
          "detail": "Assist with training YCE Inc. on using their private local LLM system in day-to-day operations",
          "status": "Upcoming",
          "sampleStatus": "In Progress",
          "completed": false,
          "sampleCompleted": false
        }
      ]
    },
    {
      "id": "right-at-home-phase-2",
      "badge": "CLIENT PROJECT #2 • RIGHT AT HOME HEALTHCARE",
      "title": "Right at Home Healthcare — Phase 2 Admin AI & Marketing Enablement",
      "status": "Upcoming • Phase 2",
      "description": "Implementing Phase 2 for Right at Home Healthcare owner Phil — rolling out administrative AI workflows, training Phil on administrative tools, and assisting with AI-powered marketing initiatives.",
      "milestones": [
        {
          "id": "rah-m1",
          "title": "1. Phase 2 Administrative AI Implementation & Owner Training",
          "detail": "Assist with setting up administrative AI workflows and training owner Phil on daily usage",
          "status": "Upcoming",
          "sampleStatus": "Completed",
          "completed": false,
          "sampleCompleted": true
        },
        {
          "id": "rah-m2",
          "title": "2. AI-Assisted Marketing Workflows",
          "detail": "Support marketing content and automation tasks powered by AI for Right at Home Healthcare",
          "status": "Upcoming",
          "sampleStatus": "Upcoming",
          "completed": false,
          "sampleCompleted": false
        }
      ]
    },
    {
      "id": "precision-automotive-ai-website",
      "badge": "CLIENT PROJECT #3 • PRECISION AUTOMOTIVE",
      "title": "Precision Automotive — AI-Powered Website Build",
      "status": "Upcoming",
      "description": "Designing and building an AI-powered website for Precision Automotive.",
      "milestones": [
        {
          "id": "pa-m1",
          "title": "1. AI-Powered Website Design, Build & QA",
          "detail": "Assist Mike with building, testing, and refining the Precision Automotive website and AI features",
          "status": "Upcoming",
          "sampleStatus": "Upcoming",
          "completed": false,
          "sampleCompleted": false
        }
      ]
    }
  ],
  "timeLogs": [],
  "sampleTimeLogs": [
    {
      "id": "sample-2026-10-19",
      "date": "2026-10-19",
      "displayDate": "Mon, Oct 19, 2026",
      "sessionLabel": "Via Jack's Voice Logger",
      "location": "Remote / Home",
      "hours": 1.5,
      "project": "Voice-First Time Logger (Speech → DeepSeek API → Master Portal)",
      "summary": "Wired DeepSeek API JSON parser into personal voice logger and tested mobile voice-to-JSON extraction from home.",
      "rawTranscript": "Worked from home on my phone for an hour and a half wiring the DeepSeek API parser into my logger...",
      "inputMethod": "Voice → DeepSeek API",
      "verificationStatus": "logged_by_jack",
      "verifiedBy": "Logged by Jack"
    },
    {
      "id": "sample-2026-10-16",
      "date": "2026-10-16",
      "displayDate": "Fri, Oct 16, 2026",
      "sessionLabel": "Session #1",
      "location": "Studio 1385",
      "hours": 4,
      "project": "YCE Inc. & Studio Onboarding Kickoff",
      "summary": "In-person onboarding at Studio 1385: reviewed YCE Inc. Mac Mini LLM deployment plan, Right at Home Phase 2, Precision Automotive website scope, and started Voice+DeepSeek Logger.",
      "rawTranscript": "In Studio 1385 today for four hours with Mike reviewing the YCE Mac Mini deployment and starting my voice logger dashboard.",
      "inputMethod": "Voice → DeepSeek API",
      "verificationStatus": "verified",
      "verifiedBy": "Mike Miller"
    }
  ],
  "skills": [
    {
      "name": "Voice-First LLM Interaction (\"Speak, Don't Type\")",
      "category": "AI Workflow",
      "status": "Introduced",
      "sampleStatus": "Practicing"
    },
    {
      "name": "DeepSeek API & Structured JSON Parsing",
      "category": "AI Engineering",
      "status": "Introduced",
      "sampleStatus": "Practicing"
    },
    {
      "name": "On-Premise LLM Hardware Deployment (Mac Mini)",
      "category": "Client Operations",
      "status": "Introduced",
      "sampleStatus": "Practicing"
    },
    {
      "name": "Client AI Training & AI Web Development",
      "category": "Client Delivery",
      "status": "Introduced",
      "sampleStatus": "Introduced"
    }
  ],
  "supervisorNotes": [
    {
      "id": "note-sample-2026-10-16",
      "date": "2026-10-16",
      "displayDate": "Friday, Oct 16, 2026",
      "context": "Studio 1385 Session (Sample Preview)",
      "author": "Mike Miller",
      "sampleOnly": true,
      "text": "Great first day at Studio 1385. Walked through our active client slate (YCE Inc. Mac Mini deployment, Right at Home Phase 2 with Phil, and Precision Automotive AI website) and started wiring DeepSeek API to parse Jack's spoken time logs."
    },
    {
      "id": "note-2026-10-13",
      "date": "2026-10-13",
      "displayDate": "Tuesday, Oct 13, 2026",
      "context": "Onboarding & Client Project Lineup",
      "author": "Mike Miller",
      "sampleOnly": false,
      "text": "Welcome aboard! Jack starts Friday, Oct 16, 2026. Initial client project lineup: (1) YCE Inc. on-site LLM Mac Mini deployment & training, (2) Right at Home Healthcare Phase 2 admin AI & marketing training with Phil, and (3) Precision Automotive AI-powered website build—plus building his own Voice → DeepSeek time logger."
    }
  ]
};
window.SPARK_JACK_FEED = {
  "feedName": "Jack's Voice → DeepSeek Logger Feed",
  "lastSynced": "2026-10-13",
  "entries": []
};
