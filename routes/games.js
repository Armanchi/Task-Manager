const express = require('express');
const router = express.Router();

const {
    addGame,
    createGame,
    deleteGame,
    getGames,
    updateGame,
    editGame
} = require('../controllers/games');
//queries page
router.route('/').post(createGame).get(getGames);
router.route('/delete/:id').get(deleteGame);
router.route('/update/:id').post(updateGame);
router.route('/edit/:id').get(editGame);
router.route('/add').get(addGame);

module.exports = router;