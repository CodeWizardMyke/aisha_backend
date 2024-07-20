const express = require('express');
const router = express.Router();

const cart_crud_controller = require('../controllers/cart_crud_controller');

const cc_swreep_fields = require('../functions/cc_swreep_fields');

const cc_check_fields = require('../middlewares/cc_check_fields');
const update_check_fields = require('../middlewares/update_check_fields');
const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.post('/create', cc_swreep_fields, cc_check_fields, cart_crud_controller.createCart);
router.get('/read', cart_crud_controller.readCart);
router.put('/update',  update_check_fields, cart_crud_controller.updateCart);
router.delete('/destroy', jsonwebtoken, cart_crud_controller.deleteCart);

module.exports = router;