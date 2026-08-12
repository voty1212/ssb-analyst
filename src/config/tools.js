export const TOOLS = [
  {
    id: 'news',
    path: '/news',
    navLabel: 'News',
    label: 'Daily Newspaper Analysis',
    description: "Upload today's paper and get an SSB-focused breakdown of every major story.",
    badge: 'N',
    storageKey: 'ssb-analyst-news-sessions',
    quickPrompts: {
      'Defence & Security':
        "Give me a deep-dive on the defence and security angles of today's key stories.",
      'Lecturette Topics':
        "Suggest 5 lecturette topics from today's paper with 2-minute outlines.",
      'GD Topics': "List GD topics from today's paper with arguments for and against each.",
      Geopolitics: "Explain the geopolitical significance of today's international news.",
      'India Relations':
        "Summarize today's stories on India's bilateral and multilateral relations.",
      Economy: "Break down today's economic news and its relevance for the SSB interview.",
      'Mock Interview':
        "Run a mock SSB interview round based on today's news, asking me one question at a time.",
    },
  },
  {
    id: 'tat',
    path: '/tat',
    navLabel: 'TAT',
    label: 'TAT Psychological Analysis',
    description:
      'Upload your TAT picture and story to get feedback on the Officer Like Qualities it reveals.',
    badge: 'T',
    storageKey: 'ssb-analyst-tat-sessions',
    quickPrompts: {
      'OLQ Breakdown': 'Break down which Officer Like Qualities this story reflects, with evidence.',
      'Structural Review':
        "Review this story's structure: hero identification, mood, outcome, realism.",
      'Rewrite Suggestions':
        'Suggest specific rewrites to strengthen this story for SSB assessment.',
      'Practice Picture':
        'Give me a fresh TAT-style picture description to practice writing a story for.',
    },
  },
]
