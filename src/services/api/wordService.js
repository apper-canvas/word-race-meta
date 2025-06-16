import wordData from '../mockData/words.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WordService {
  constructor() {
    this.words = [...wordData];
  }

  async getAll() {
    await delay(200);
    return [...this.words];
  }

  async validateWord(word, availableLetters) {
    await delay(200);
    
    // Check if word exists in dictionary
    const isValidWord = this.words.some(w => w.word.toLowerCase() === word.toLowerCase());
    if (!isValidWord) {
      return { 
        valid: false, 
        reason: 'Word not found in dictionary',
        points: 0
      };
    }

    // Check if word can be formed from available letters
    const wordLetters = word.toLowerCase().split('');
    const letterCounts = {};
    
    // Count available letters
    availableLetters.forEach(letter => {
      const lowerLetter = letter.toLowerCase();
      letterCounts[lowerLetter] = (letterCounts[lowerLetter] || 0) + 1;
    });

    // Check if word can be formed
    const usedLetters = {};
    for (const letter of wordLetters) {
      usedLetters[letter] = (usedLetters[letter] || 0) + 1;
      if (usedLetters[letter] > (letterCounts[letter] || 0)) {
        return {
          valid: false,
          reason: 'Word cannot be formed from available letters',
          points: 0
        };
      }
    }

    // Calculate points (1 point per letter, bonus for longer words)
    let points = word.length;
    if (word.length >= 6) points += 2;
    if (word.length >= 8) points += 3;

    return {
      valid: true,
      reason: 'Valid word!',
      points
    };
  }

  async getWordsByLength(minLength = 3) {
    await delay(200);
    return this.words.filter(w => w.word.length >= minLength);
  }

  async searchWords(query) {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return this.words.filter(w => 
      w.word.toLowerCase().includes(lowerQuery)
    );
  }
}

export default new WordService();