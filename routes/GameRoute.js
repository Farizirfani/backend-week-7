import express from 'express';
import gameController from '../controllers/gameController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const gameRoute = express.Router();

gameRoute.get('/game', authMiddleware, gameController.getAllGames);
gameRoute.get('/gameByTitle', authMiddleware, gameController.getgameByTitle);
gameRoute.post('/game/:id', adminMiddleware, gameController.addGame);
// gameRoute.put('/game/:id', adminMiddleware, gameController.updateGame);
gameRoute.put('/game/:id', adminMiddleware, gameController.updateGame);
gameRoute.delete('/game/:id', adminMiddleware, gameController.deleteGame);

export default gameRoute;
