const express = require('express');
const router = express.Router();

const cart_crud_controller = require('../controllers/cart_crud_controller');
const jsonwebtoken = require('../middlewares/jsonwebtoken');
const cart_create_handdler = require('../middlewares/cart_create_handdler');

router.post('/create', cart_create_handdler, cart_crud_controller.create);
router.get('/read', cart_crud_controller.read);
router.put('/update', cart_crud_controller.update);
router.delete('/destroy', jsonwebtoken, cart_crud_controller.delete);

module.exports = router;
