import Game from '../models/gameModel.js';

const gameController = {
  getAllGames: async (req, res) => {
    try {
      const games = await Game.find();
      if (games.length > 0) {
        res.status(200).json({
          message: 'Games fetched successfully',
          status: 200,
          data: games,
        });
      } else {
        res.status(400).json({ message: 'Games not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getgameByTitle: async (req, res) => {
    try {
      const game = await Game.findOne({ title: req.body.title });
      if (game) {
        res.status(200).json({
          message: 'Game fetched successfully',
          status: 200,
          data: game,
        });
      } else {
        res.status(400).json({ message: 'Game not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addGame: async (req, res) => {
    try {
      const game = await Game.create(req.body);
      if (game) {
        res.status(201).json({
          message: 'Game added successfully',
          status: 201,
          data: game,
        });
      } else {
        res.status(400).json({ message: 'cannot add game' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateGame: async (req, res) => {
    const { id_ } = req.body.id_game;

    try {
      const updatedGame = await Game.findOneAndUpdate({ id_ }, { $set: req.body }, { new: true });

      if (updatedGame) {
        res.status(200).json({
          message: 'Game updated successfully',
          status: 200,
          data: updatedGame,
        });
      } else {
        res.status(404).json({ message: 'Game not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteGame: async (req, res) => {
    try {
      const game = await Game.findByIdAndDelete(req.body.id_game);
      if (game) {
        res.status(200).json({
          message: 'Game deleted successfully',
          status: 200,
          data: game,
        });
      } else {
        res.status(400).json({ message: 'cannot delete game' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default gameController;
