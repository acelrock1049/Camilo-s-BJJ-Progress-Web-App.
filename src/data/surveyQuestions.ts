export type SdColor = 'white' | 'red' | 'blue' | 'orange' | 'green' | 'yellow';

export interface Answer {
  id: string;
  text: string;
  color: SdColor;
}

export interface Question {
  id: string;
  text: string;
  context?: string;
  answers: Answer[];
}

export const surveyQuestions: Question[] = [
  {
    id: "q1",
    text: "What motivates you the most to step on the mats today?",
    context: "Choose the one that resonates most with you right now.",
    answers: [
      { id: "q1_a", text: "Security: I want to know how to defend myself and feel safe.", color: "white" },
      { id: "q1_b", text: "Community: I'm looking for a great group of people and to disconnect from stress.", color: "green" },
      { id: "q1_c", text: "Challenge: I want to test my strength and learn how to win/submit.", color: "red" },
      { id: "q1_d", text: "System: I need discipline and mental order in my life.", color: "blue" },
      { id: "q1_e", text: "Excellence: I want to compete and optimize my performance to the max.", color: "orange" }
    ]
  },
  {
    id: "q2",
    text: "What is your \"Win\" in 3 months?",
    context: "If you achieve THIS in 90 days, you will feel happy with your investment.",
    answers: [
      { id: "q2_a", text: "Survival: Finishing a class without gasping for air or panicking.", color: "white" },
      { id: "q2_b", text: "Escape: Being able to get out of bad positions (e.g., Mount) technically.", color: "blue" },
      { id: "q2_c", text: "Control: Understanding the \"Map\" of Jiu-Jitsu and not feeling lost.", color: "yellow" },
      { id: "q2_d", text: "Submit: Successfully tapping out an opponent of my level.", color: "red" },
      { id: "q2_e", text: "Transform: Seeing visible physical changes (strength/weight).", color: "orange" }
    ]
  },
  {
    id: "q3",
    text: "Relationship with Combat: When you think about 'sparring' (rolling), what do you feel?",
    answers: [
      { id: "q3_a", text: "Panic or a strong fear of getting hurt.", color: "white" },
      { id: "q3_b", text: "Nervousness. I don't want to look foolish in front of others.", color: "red" },
      { id: "q3_c", text: "Curiosity. I want to see if the techniques actually work.", color: "orange" },
      { id: "q3_d", text: "Analytical. I want to identify my mistakes so I can fix them.", color: "yellow" }
    ]
  },
  {
    id: "q4",
    text: "What do you expect from me as your Coach during class?",
    answers: [
      { id: "q4_a", text: "To protect me and ensure no one hurts me.", color: "white" },
      { id: "q4_b", text: "To be friendly, approachable, and create a good vibe.", color: "green" },
      { id: "q4_c", text: "To push me to my limit and be demanding.", color: "red" },
      { id: "q4_d", text: "To give me clear, step-by-step instructions with no ambiguity.", color: "blue" },
      { id: "q4_e", text: "To give me the key concepts and let me experiment/solve problems.", color: "yellow" }
    ]
  },
  {
    id: "q5",
    text: "When learning something difficult and feeling frustrated because nothing goes right at first, but you decide not to give up, what motivates you most to continue?",
    answers: [
      { id: "q5_a", text: "Prove I am strong, not let others surpass me, and earn the respect I deserve.", color: "red" },
      { id: "q5_b", text: "Trust the method, maintain discipline, and know that today's effort brings tomorrow's reward.", color: "blue" },
      { id: "q5_c", text: "Analyze my mistakes to adjust my strategy, become more efficient, and achieve success.", color: "orange" },
      { id: "q5_d", text: "The emotional support of my teammates, mutual growth, and feeling part of a team.", color: "green" },
      { id: "q5_e", text: "Understand how the technique works, learn out of pure curiosity, and improve the process without frustration.", color: "yellow" }
    ]
  },
  {
    id: "q6",
    text: "When you face an extremely stressful day at work (or in life), what's your primary instinct?",
    answers: [
      { id: "q6_a", text: "Get to the end of the day at all costs — pure survival mode.", color: "white" },
      { id: "q6_b", text: "Create order, build lists, and ensure everything is under control.", color: "blue" },
      { id: "q6_c", text: "Figure out how to gain an advantage and compete to win.", color: "orange" },
      { id: "q6_d", text: "Prioritise the harmony of my team or family before my own achievements.", color: "green" },
      { id: "q6_e", text: "See the big picture and flow with the situation, adapting the system.", color: "yellow" }
    ]
  },
  {
    id: "q7",
    text: "What quality do you value most in the people around you?",
    answers: [
      { id: "q7_a", text: "That they provide me with safety and clear role models.", color: "white" },
      { id: "q7_b", text: "Absolute respect for rules and discipline.", color: "blue" },
      { id: "q7_c", text: "Consistent success, ambition, and analytical ability.", color: "orange" },
      { id: "q7_d", text: "Synergy, empathy, and strong interpersonal relationships.", color: "green" },
      { id: "q7_e", text: "Tacit wisdom, discernment, and a long-term intergenerational vision.", color: "yellow" }
    ]
  },
  {
    id: "q8",
    text: "When learning something new, what frustrates you the most?",
    answers: [
      { id: "q8_a", text: "Feeling like my ego is challenged and my instincts aren't sharp enough.", color: "red" },
      { id: "q8_b", text: "When the method isn't clear or the authority isn't firm.", color: "blue" },
      { id: "q8_c", text: "Not seeing immediate results or being unable to measure my progress.", color: "orange" },
      { id: "q8_d", text: "When the environment is selfish and there's no collaborative spirit.", color: "green" },
      { id: "q8_e", text: "Not understanding how my small learning fits into the bigger system.", color: "yellow" }
    ]
  }
];
