export interface Result {
    check: boolean;
    userAnswer: string;
}

export interface Summary{
    userId: string,
    averageScore: number,
    personalRecommendation: string,
    nextTestId: string,
    testName: string,
    testTopics: string[],
    topics: string[],
    skillLanguageProficiency: SkillLanguageProficiency
}

export interface SkillLanguageProficiency  {
    topic: string,
    tpi: number,
    tci: number,
    averageAccuracy: number,
    averageScore: number,
    averageDifficulty: number
}