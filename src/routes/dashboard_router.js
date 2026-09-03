const express =  require('express');
const router = express.Router();

const jsonwebtoken = require('../middlewares/jsonwebtoken');
const dataScope = require('../middlewares/dataScope');

const dashboard_controller = require('../controllers/dashboard_controller');

router.get("/", jsonwebtoken, dataScope, dashboard_controller.read );


module.exports = router;
