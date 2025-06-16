import gameData from '../mockData/games.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GameService {
  constructor() {
    this.games = [...gameData];
  }

  async getAll() {
    await delay(200);
    return [...this.games];
  }

  async getById(id) {
    await delay(200);
    const game = this.games.find(g => g.id === id);
    return game ? { ...game } : null;
  }

  async create(gameData) {
    await delay(300);
    const newGame = {
      id: Date.now().toString(),
      ...gameData,
      status: 'waiting',
      usedNumbers: [],
      currentPlayerIndex: 0,
      createdAt: new Date().toISOString()
    };
    this.games.push(newGame);
    return { ...newGame };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.games.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Game not found');
    
    this.games[index] = { ...this.games[index], ...updates };
    return { ...this.games[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.games.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Game not found');
    
    this.games.splice(index, 1);
    return { success: true };
  }

  async startGame(id) {
    await delay(200);
    return this.update(id, { status: 'playing' });
  }

  async endGame(id, finalScore) {
    await delay(200);
    return this.update(id, { 
      status: 'finished',
      finalScore,
      endedAt: new Date().toISOString()
    });
  }

  async nextTurn(id) {
    await delay(200);
    const game = await this.getById(id);
    if (!game) throw new Error('Game not found');
    
    const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
    return this.update(id, { currentPlayerIndex: nextPlayerIndex });
  }
}

export default new GameService();