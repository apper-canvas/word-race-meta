import playerData from '../mockData/players.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PlayerService {
  constructor() {
    this.players = [...playerData];
  }

  async getAll() {
    await delay(200);
    return [...this.players];
  }

  async getById(id) {
    await delay(200);
    const player = this.players.find(p => p.id === id);
    return player ? { ...player } : null;
  }

  async create(playerData) {
    await delay(300);
    const newPlayer = {
      id: Date.now().toString(),
      ...playerData,
      score: 0,
      gamesPlayed: 0,
      wordsFormed: 0,
      createdAt: new Date().toISOString()
    };
    this.players.push(newPlayer);
    return { ...newPlayer };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.players.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Player not found');
    
    this.players[index] = { ...this.players[index], ...updates };
    return { ...this.players[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.players.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Player not found');
    
    this.players.splice(index, 1);
    return { success: true };
  }

  async updateScore(id, points) {
    await delay(200);
    const player = await this.getById(id);
    if (!player) throw new Error('Player not found');
    
    return this.update(id, { 
      score: player.score + points,
      wordsFormed: player.wordsFormed + 1
    });
  }

  async resetScore(id) {
    await delay(200);
    return this.update(id, { score: 0 });
  }
}

export default new PlayerService();