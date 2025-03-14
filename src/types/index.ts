export interface Question {
  id: string;
  Skill: string;
  Tags: string[];
  Question: string;
  "IMG URL": string;
  Difficulty: 'Easy' | 'Medium' | 'Hard';
  A: string;
  B: string;
  C: string;
  D: string;
  "Correct Answer": string;
  "Formal Answer Explanation": string;
}

export interface Explanation {
  "Question ID": string;
  "Step 1 Name"?: string;
  "Step 1 Description"?: string;
  "Step 2 Name"?: string;
  "Step 2 Description"?: string;
  "Step 3 Name"?: string;
  "Step 3 Description"?: string;
  "Step 4 Name"?: string;
  "Step 4 Description"?: string;
  "Pro Tip": string;
}

export interface PlayerAnswer {
  playerId: number;
  answer: string | null;
  isCorrect: boolean;
  timeTaken: number;
}

export interface RoundResult {
  roundNumber: number;
  questionId: string;
  player1Answer: PlayerAnswer;
  player2Answer: PlayerAnswer;
  winnerId: number | null; // null means tie
}

export interface GameState {
  currentRound: number;
  currentPlayer: number;
  player1Score: number;
  player2Score: number;
  rounds: RoundResult[];
  currentQuestion: Question | null;
  gameOver: boolean;
  winner: number | null;
}