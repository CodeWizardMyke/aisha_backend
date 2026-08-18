const { validationResult } = require('express-validator');
const removeFiles = require('../functions/removeUploadedFiles');

const pc_check_fields = async (req, res, next) => {

    const checkResult = validationResult(req);

    if (!checkResult.isEmpty()) {
        removeFiles(req.files);

        return res.status(400).json(checkResult);
    }

    function normalizePricing(value) {

        if (value === undefined || value === null || value === '') {
            return 0;
        }

        const number = Number(value);

        return Number.isFinite(number) ? number : 0;
    }

    req.body.product_state = 'Enable';

    req.body.discounts = normalizePricing(req.body.discounts);
    req.body.profit_margin = normalizePricing(req.body.profit_margin);
    req.body.fees_and_taxes = normalizePricing(req.body.fees_and_taxes);

    return next();
};

module.exports = pc_check_fields;