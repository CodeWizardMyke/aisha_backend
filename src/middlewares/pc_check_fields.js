const {validationResult} = require('express-validator');

const prod_price_convert = require('../functions/prod_price_convert');
const remove_image = require('../functions/remove_image');

const pc_check_fields = ( req, res, next ) => {
    if(!req.file){
        return res.status(400).json({errors: [{path:'thumbnails',msg:'Nenuhma imagem selecionada!'}] } );
    }

    const checkResult = validationResult(req);
    if (!checkResult.isEmpty()) {
        remove_image(req.body.thumbnails);
        console.log(checkResult);
        return res.status(400).json(checkResult);
    }

    const err = prod_price_convert(req,res);

    //if(err) return res.status(400).json(err);
    
    return next();
};

module.exports = pc_check_fields;
