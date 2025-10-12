export interface Answer {
  text: string
  score: number
}

export interface Question {
  id: number
  question: string
  answers: Answer[]
}

export const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What's your main reason for creating content?",
    answers: [
      { text: "To get likes, clicks, and followers", score: 1 },
      { text: "To grow quickly, even if it means using trends", score: 2 },
      { text: "To share lessons from my experiences", score: 3 },
      { text: "To help my former self and give value freely", score: 4 },
    ],
  },
  {
    id: 2,
    question: "How do you balance volume and quality?",
    answers: [
      { text: "I post as much as possible, daily if needed", score: 1 },
      { text: "I follow algorithms and trending formats", score: 2 },
      { text: "I prefer fewer posts but with deeper insights", score: 3 },
      { text: "I aim for timeless content that compounds over time", score: 4 },
    ],
  },
  {
    id: 3,
    question: "When writing, what do you optimise for?",
    answers: [
      { text: "Engagement (likes, shares, virality)", score: 1 },
      { text: "Emotional hooks to get attention", score: 2 },
      { text: "Resonance with a specific group of people", score: 3 },
      { text: "Long-term trust and credibility", score: 4 },
    ],
  },
  {
    id: 4,
    question: "How do you view algorithms?",
    answers: [
      { text: "They control everything, I must please them", score: 1 },
      { text: 'I chase hacks to "beat" the algo', score: 2 },
      { text: "I respect them, but I don't obsess", score: 3 },
      { text: "I build an algo-resistant body of work", score: 4 },
    ],
  },
  {
    id: 5,
    question: "Who do you speak to in your content?",
    answers: [
      { text: "Everyone who might listen", score: 1 },
      { text: "My current peers or trending audience", score: 2 },
      { text: "My community and niche", score: 3 },
      { text: "My former self (someone walking the path I did)", score: 4 },
    ],
  },
  {
    id: 6,
    question: "How do you feel about AI-generated content?",
    answers: [
      { text: "It's perfect, I use it to churn as much as possible", score: 1 },
      { text: "Great for quick filler content", score: 2 },
      { text: "Helpful tool, but I add my voice and context", score: 3 },
      { text: "AI can't replace unique lived experience and insights", score: 4 },
    ],
  },
  {
    id: 7,
    question: "What's your view on monetizing content?",
    answers: [
      { text: "Grab short-term cash grabs, whatever works now", score: 1 },
      { text: "Monetise fast before attention fades", score: 2 },
      { text: "Build products/services around trust", score: 3 },
      { text: "Focus on long-term wealth through reputation", score: 4 },
    ],
  },
  {
    id: 8,
    question: "How do you deal with burnout?",
    answers: [
      { text: "I burn out often chasing trends", score: 1 },
      { text: "I push through even if I don't enjoy it", score: 2 },
      { text: "I rest and recalibrate", score: 3 },
      { text: "I avoid burnout by creating what resonates with me", score: 4 },
    ],
  },
  {
    id: 9,
    question: "How do you decide what's worth your time?",
    answers: [
      { text: "Whatever looks like the fastest win", score: 1 },
      { text: "Whatever gets attention right now", score: 2 },
      { text: "I curate based on ROI and past lessons", score: 3 },
      { text: "I filter noise to find long-term signal", score: 4 },
    ],
  },
  {
    id: 10,
    question: "How do you measure success?",
    answers: [
      { text: "Virality and follower counts", score: 1 },
      { text: "Growth rate week by week", score: 2 },
      { text: "Trust and relationships built", score: 3 },
      { text: "Proof of work, reputation, and wealth compounding", score: 4 },
    ],
  },
]

export interface ResultCategory {
  title: string
  description: string
  emoji: string
  shareImageUrl: string
}

export function getResultCategory(score: number): ResultCategory {
  if (score >= 10 && score <= 17) {
    return {
      title: "Heavy Noise Creator",
      description: "You're chasing dopamine, but risk burnout.",
      emoji: "📢",
      shareImageUrl: "https://signal-creator-quiz-v1-pdml.vercel.app/share-heavy-noise.png",
    }
  } else if (score >= 18 && score <= 25) {
    return {
      title: "Leaning Noise Creator",
      description: "You mix some value, but still fall for algo traps.",
      emoji: "⚠️",
      shareImageUrl: "https://signal-creator-quiz-v1-pdml.vercel.app/share-leaning-noise.png",
    }
  } else if (score >= 26 && score <= 33) {
    return {
      title: "Leaning Signal Creator",
      description: "You're on the path to reputation and algo-resistance.",
      emoji: "✨",
      shareImageUrl: "https://signal-creator-quiz-v1-pdml.vercel.app/share-leaning-signal.png",
    }
  } else {
    return {
      title: "Strong Signal Creator",
      description: "You give value freely, build trust, and play the long game.",
      emoji: "🎯",
      shareImageUrl: "https://signal-creator-quiz-v1-pdml.vercel.app/share-strong-signal.png",
    }
  }
}
