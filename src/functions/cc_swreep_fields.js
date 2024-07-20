const {check} = require('express-validator');

const cc_swreep_fields = [
  check('user_name').notEmpty().withMessage('Nome do cliente não informado').trim(),
  check('cpf').notEmpty().withMessage('È necessário um cpf para cadastrar um carrinho').trim(),
  check('product_id').notEmpty().withMessage('Neenhum produto foi informado').trim(),
  check('qtd_product').notEmpty().withMessage('Insira uma quantidade válida').trim(),
  check('state').notEmpty().withMessage('Deve ser informado o estado padrão do carrinho').trim(),
]

module.exports = cc_swreep_fields;
