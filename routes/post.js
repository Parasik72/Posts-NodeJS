const Router = require("express");
const {post: Controller} = require('../controllers');

const router = new Router();

router.get('/', Controller.homePage);
router.get('/add', Controller.creatingPost);
router.get('/:login', Controller.posts);
router.get('/:login/:post', Controller.post);

router.post('/create', Controller.addPost);
router.post('/delete', Controller.deletePost);

module.exports = router;