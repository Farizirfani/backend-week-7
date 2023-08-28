import gameController from '../../controllers/gameController.js';
import Game from '../../models/gameModel.js';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv();

// Mock the response object
const res = {
  status: jest.fn(() => res),
  json: jest.fn((data) => data),
};

// Mock the Game model
jest.mock('../../models/gameModel.js');

describe('gameController', () => {
  beforeAll(() => {
    const mongoUri = process.env.MONGO_URI;
    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  }, 10000);

  describe('getAllGames', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should fetch all games successfully', async () => {
      const req = {};

      const games = [
        {
          _id: 'gameId1',
          title: 'Game 1',
          // Other properties here
        },
        {
          _id: 'gameId2',
          title: 'Game 2',
          // Other properties here
        },
        // Add more games as needed
      ];

      Game.find.mockResolvedValue(games);

      await gameController.getAllGames(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Games fetched successfully',
        status: 200,
        data: games,
      });
    });

    it('should handle "Games not found" scenario', async () => {
      const req = {};

      // Mock the `find` function to return an empty array
      Game.find.mockResolvedValue([]);

      await gameController.getAllGames(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Games not found' });
    });

    it('should handle errors', async () => {
      const req = {};

      const errorMessage = 'An error occurred';

      // Mock the `find` function to throw an error
      Game.find.mockRejectedValue(new Error(errorMessage));

      await gameController.getAllGames(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getgameByTitle', () => {
    it('should fetch a game by title successfully', async () => {
      const req = {
        body: {
          title: 'GTA 1',
        },
      };

      const game = {
        _id: 'gameId',
        title: 'Example Game Title',
        // Other properties here
      };

      Game.findOne.mockResolvedValue(game);

      await gameController.getgameByTitle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Game fetched successfully',
        status: 200,
        data: game,
      });
    });

    it('should handle "Game not found" scenario', async () => {
      const gameTitle = 'Nonexistent Game';

      // Mocking Game.findOne to return null (game not found)
      Game.findOne = jest.fn().mockResolvedValue(null);

      const req = { body: { title: gameTitle } };

      await gameController.getgameByTitle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Game not found' });
    });

    it('should handle errors with status 500', async () => {
      const gameTitle = 'Sample Game';

      // Mocking Game.findOne to throw an error
      Game.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = { body: { title: gameTitle } };

      await gameController.getgameByTitle(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database error',
      });
    });
  });
});

describe('updateGame', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the game successfully', async () => {
    const req = {
      body: {
        id_game: 'gameId',
        // Other request properties here
      },
    };

    const updatedGame = {
      _id: 'gameId',
      title: 'Updated Game Title',
      // Other properties here
    };

    // Mock the `findOneAndUpdate` function to return the updated game
    Game.findOneAndUpdate.mockResolvedValue(updatedGame);

    await gameController.updateGame(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Game updated successfully',
      status: 200,
      data: updatedGame,
    });
  });

  it('should return 404 if the game is not found', async () => {
    const req = {
      body: {
        id_game: 'nonExistentGameId',
        // Other request properties here
      },
    };

    // Mock the `findOneAndUpdate` function to return null (game not found)
    Game.findOneAndUpdate.mockResolvedValue(null);

    await gameController.updateGame(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Game not found' });
  });

  it('should handle errors', async () => {
    const req = {
      body: {
        id_game: 'gameId',
        // Other request properties here
      },
    };

    const errorMessage = 'An error occurred';

    // Mock the `findOneAndUpdate` function to throw an error
    Game.findOneAndUpdate.mockRejectedValue(new Error(errorMessage));

    await gameController.updateGame(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  describe('addGame', () => {
    it('should add a game successfully', async () => {
      const mockGame = {
        _id: '123456',
        title: 'Sample Game',
        genre: 'Sample Genre',
        platform: 'Sample Platform',
        releaseDate: new Date(),
        developer: 'Sample Developer',
        rating: 5,
      };

      // Mocking Game.create to return the mockGame
      Game.create = jest.fn().mockResolvedValue(mockGame);

      const req = { body: mockGame };

      await gameController.addGame(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Game added successfully',
        status: 201,
        data: mockGame,
      });
    });

    it('should handle "cannot add game" scenario', async () => {
      // Mocking Game.create to return null (game creation failed)
      Game.create = jest.fn().mockResolvedValue(null);

      const req = { body: {} };

      await gameController.addGame(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'cannot add game' });
    });

    it('should handle errors with status 500', async () => {
      // Mocking Game.create to throw an error
      Game.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = { body: {} };

      await gameController.addGame(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database error',
      });
    });
  });

  describe('deleteGame', () => {
    it('should delete a game successfully', async () => {
      const mockGame = {
        _id: '123456',
        title: 'Sample Game',
        // ... other properties
      };

      // Mocking Game.findByIdAndDelete to return the mockGame
      Game.findByIdAndDelete = jest.fn().mockResolvedValue(mockGame);

      const req = { body: { id_game: '123456' } };

      await gameController.deleteGame(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Game deleted successfully',
        status: 200,
        data: mockGame,
      });
    });

    it('should handle "cannot delete game" scenario', async () => {
      // Mocking Game.findByIdAndDelete to return null (game deletion failed)
      Game.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const req = { body: { id_game: '123456' } };

      await gameController.deleteGame(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'cannot delete game' });
    });

    it('should handle errors with status 500', async () => {
      // Mocking Game.findByIdAndDelete to throw an error
      Game.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = { body: { id_game: '123456' } };

      await gameController.deleteGame(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database error',
      });
    });
  });
});
