/**
 * Type definitions for the speaking exam feature
 */

export interface SpeakingQuestion {
  number: number;
  topic:string;
  question:string;
}

export interface SpeakingExam {
  id: string;
  testName: string;
  type: number;
  partOne: SpeakingQuestion[];
  partTwo: SpeakingQuestion;
  partThree: SpeakingQuestion[];
}

export interface SpeakingExamSubmission {
  id: string;
  testName: string;
  answersOne: SpeakingAnswer[];
  answersTwo: SpeakingAnswer;
  answersThree: SpeakingAnswer[];
}

export interface SpeakingAnswer {
  number: number,
  topic: string,
  question: string,
  url: string
}

export interface  SpeakingAudioFileResponse {
  questionId: number;
  blobName: string;
  duration: number;
}

export interface SpeakingDetailResult{
  id: string,
  testName: string,
  score: string,
  partOne: SpeakingAnswer[],
  partTwo: SpeakingAnswer,
  partThree: SpeakingAnswer[],
}