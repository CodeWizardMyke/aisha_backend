const {check} = require('express-validator');

const pc_sweep_fields = [
  check('title').notEmpty().withMessage('Título está vazio').trim(),
  check('official_store_name').notEmpty().withMessage('Título oficial do produto está vazio').trim(),
  check('category').notEmpty().withMessage('Campo de categoria está vazio').trim(),
  check('discribe').notEmpty().withMessage('Campo de descriçao está vazio').trim(),
  check('currency_id').notEmpty().withMessage('Campo tipo de moeda está vazio').trim(),
  check('price').notEmpty().withMessage('Campo de preço está vazio').trim(),
  check('stock').notEmpty().withMessage('Quantidade em estoque está vazio').trim(),
  check('brand').notEmpty().withMessage('Campo da marca está vazio').trim(),
  check('line').notEmpty().withMessage('Campo da linha do produto está vazio').trim(),
]

module.exports = pc_sweep_fields;
