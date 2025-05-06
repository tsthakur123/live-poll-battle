export type PollOption = 'optionA' | 'optionB';

export interface Room {
  question: string;
  votes: { optionA: number; optionB: number };
  usersVoted: Set<string>;
  timer?: NodeJS.Timeout;
  active: boolean;
}
