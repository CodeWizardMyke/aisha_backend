const express = require('express');
const router = express.Router();

const product_crud_controller = require('../controllers/product_crud_controller');

const upload_image = require('../middlewares/upload_image');
const pc_sweep_fields = require('../functions/pc_sweep_fields');
const pc_check_fields = require('../middlewares/pc_check_fields');
const pu_check_on_off = require('../middlewares/pu_check_on_off');
const update_check_fields = require('../middlewares/update_check_fields');
const jsonwebtoken = require('../middlewares/jsonwebtoken');

router.post('/create', upload_image.any('thumbnails'), pc_sweep_fields, pc_check_fields, jsonwebtoken, pu_check_on_off, product_crud_controller.create);
router.get('/read', jsonwebtoken, product_crud_controller.read);
router.put('/update', upload_image.any('thumbnails'),  jsonwebtoken, pu_check_on_off, update_check_fields ,product_crud_controller.update);
router.delete('/destroy', jsonwebtoken, product_crud_controller.destroy);

module.exports = router;