export type ScoreData = {
    band: number;
    title: string;
    details: string;
    readingRecommendation: string;
};

const scores: ScoreData[] = [
    {
        band: 9,
        title: "Expert user",
        details: "The test taker has fully operational command of the language. Their use of English is appropriate, accurate and fluent, and shows complete understanding.",
        readingRecommendation: "Explore advanced texts like academic research papers, classic literature (e.g., 'Pride and Prejudice' by Jane Austen), or reputable newspapers such as 'The Guardian' or 'The New York Times'."
    },
    {
        band: 8,
        title: "Very good user",
        details: "The test taker has fully operational command of the language with only occasional unsystematic inaccuracies and inappropriate usage. They may misunderstand some things in unfamiliar situations. They handle complex and detailed argumentation well.",
        readingRecommendation: "Read novels with rich language (e.g., '1984' by George Orwell), opinion pieces in high-quality publications, or well-researched non-fiction books like 'Sapiens' by Yuval Noah Harari."
    },
    {
        band: 7,
        title: "Good user",
        details: "The test taker has operational command of the language, though with occasional inaccuracies, inappropriate usage and misunderstandings in some situations. They generally handle complex language well and understand detailed reasoning.",
        readingRecommendation: "Focus on contemporary novels (e.g., 'The Kite Runner' by Khaled Hosseini), detailed magazine articles, or non-fiction texts on topics of personal interest."
    },
    {
        band: 6,
        title: "Competent user",
        details: "The test taker has an effective command of the language despite some inaccuracies, inappropriate usage and misunderstandings. They can use and understand fairly complex language, particularly in familiar situations.",
        readingRecommendation: "Read simplified versions of classics (e.g., 'Animal Farm' by George Orwell), graded readers, or general-interest articles in publications like 'National Geographic'."
    },
    {
        band: 5,
        title: "Modest user",
        details: "The test taker has a partial command of the language and copes with overall meaning in most situations, although they are likely to make many mistakes. They should be able to handle basic communication in their own field.",
        readingRecommendation: "Try beginner-friendly novels (e.g., 'Charlotte's Web' by E.B. White), news articles from sites like 'BBC Learning English', or graded readers for intermediate learners."
    },
    {
        band: 4,
        title: "Limited user",
        details: "The test taker's basic competence is limited to familiar situations. They frequently show problems in understanding and expression. They are not able to use complex language.",
        readingRecommendation: "Focus on short stories for beginners, children’s books (e.g., 'The Cat in the Hat' by Dr. Seuss), or basic English newspapers such as 'The Times in Plain English'."
    },
    {
        band: 3,
        title: "Extremely limited user",
        details: "The test taker conveys and understands only general meaning in very familiar situations. There are frequent breakdowns in communication.",
        readingRecommendation: "Read simple illustrated books, beginner-level graded readers, or practice basic vocabulary with flashcards and picture books."
    },
    {
        band: 2,
        title: "Intermittent user",
        details: "The test taker has great difficulty understanding spoken and written English.",
        readingRecommendation: "Start with picture books or visual aids (e.g., 'Spot the Dog' series), focus on single-word vocabulary books, or practice with language-learning apps like Duolingo."
    },
    {
        band: 1,
        title: "Non-user",
        details: "The test taker has no ability to use the language except a few isolated words.",
        readingRecommendation: "Begin with flashcards for common words and basic phonics books. Practice identifying everyday objects and their English names."
    },
    {
        band: 0,
        title: "Did not attempt the test",
        details: "The test taker did not answer the questions.",
        readingRecommendation: "No reading recommendation since the test was not attempted. Encourage them to start with basic vocabulary and simple English phrases when ready."
    },
];

export function getScoreDescription(score: number): ScoreData | null {
    // Ensure the score is within the allowed range
    if (score < 0 || score > 9 || (score * 10) % 5 !== 0) {
        console.error("Invalid score. Please provide a score between 0 and 9, including increments of 0.5.");
        return null;
    }

    // Find the closest band match
    const exactMatch = scores.find((entry) => entry.band === Math.floor(score));
    if (!exactMatch) {
        console.error("Score data not found.");
        return null;
    }

    return exactMatch;
}

export const getScoreColor = (score: number) => {
    if (score < 4) return "red";
    if (score < 6) return "orange";
    if (score < 7.5) return "cyan";
    return "green";
};
