const Router = require("express");
const {auth: Controller} = require('../controllers');
const {registration, login} = require('../middleware/auth.js')

const router = new Router();

router.get('/logout', Controller.logout);

router.post('/registration', registration, Controller.registration);
router.post('/login', login, Controller.login);

module.exports = router;