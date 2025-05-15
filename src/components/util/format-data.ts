export const formatText = (text: string) => {
    const keywords = ['NO', 'MORE', 'THAN', 'TWO', 'WORDS', 'ONE', 'WORD', 'ONLY', 'THREE', 'TRUE', 'FALSE', 'NOT GIVEN','AND/OR','NUMBER'];
    let formattedText = text;
    formattedText = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        return acc.replace(regex, `<span style="font-weight: bold; color: red;">${keyword}</span>`);
    }, formattedText);
    return formattedText.replace(/\b[A-Z](?![A-Z])\b/g, match => `<span style="font-weight: bold; color: red;">${match}</span>`);
};