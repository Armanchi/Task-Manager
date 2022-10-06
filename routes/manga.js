const express = require('express');
const router = express.Router();

const {
    addManga,
    createManga,
    deleteManga,
    getManga,
    updateManga,
    editManga
} = require('../controllers/manga');


router.route('/').post(createManga).get(getManga);
router.route('/delete/:id').get(deleteManga);
router.route('/update/:id').post(updateManga);
router.route('/edit/:id').get(editManga);
router.route('/add').get(addManga);

module.exports = router;