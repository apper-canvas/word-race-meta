import puzzleData from '../mockData/puzzles.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PuzzleService {
  constructor() {
    this.puzzles = [...puzzleData];
  }

  async getAll() {
    await delay(200);
    return [...this.puzzles];
  }

  async getById(id) {
    await delay(200);
    const puzzle = this.puzzles.find(p => p.id === id);
    return puzzle ? { ...puzzle } : null;
  }

  async getByNumber(number) {
    await delay(200);
    const puzzle = this.puzzles.find(p => p.number === number);
    return puzzle ? { ...puzzle } : null;
  }

  async create(puzzleData) {
    await delay(300);
    const newPuzzle = {
      id: Date.now().toString(),
      ...puzzleData,
      createdAt: new Date().toISOString()
    };
    this.puzzles.push(newPuzzle);
    return { ...newPuzzle };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.puzzles.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Puzzle not found');
    
    this.puzzles[index] = { ...this.puzzles[index], ...updates };
    return { ...this.puzzles[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.puzzles.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Puzzle not found');
    
    this.puzzles.splice(index, 1);
    return { success: true };
  }

  async shuffleLetters(puzzleId) {
    await delay(200);
    const puzzle = await this.getById(puzzleId);
    if (!puzzle) throw new Error('Puzzle not found');
    
    const shuffled = [...puzzle.letters].sort(() => Math.random() - 0.5);
    return shuffled;
  }
}

export default new PuzzleService();