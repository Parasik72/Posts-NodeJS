const Router = require("express");
const {comment: Controller} = require('../controllers');

const router = new Router();

router.post('/add', Controller.add);
router.post('/delete', Controller.delete);

module.exports = router;