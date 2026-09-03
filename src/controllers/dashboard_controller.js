const { Op } = require('sequelize');

const {
    Product,
    Category,
    Brand,
    sequelize
} = require('../database/models');


const dashboard_controller = {

    read: async (req, res) => {
        const {employee_id} = req.token_decoded;

        try {

            const where = {
                 [Op.or]:[
                    {
                        owner_employee_id:null
                    },
                    {
                        owner_employee_id:employee_id
                    }
                ]
            };

            const [
                // Produtos
                totalProducts,
                totalStock,
                outOfStock,
                lowStock,
                disabledProducts,

                // Catálogo
                totalBrands,
                totalCategories,
                usedBrands,
                usedCategories,

                // Listas
                lowStockProducts,
                recentProducts,

                // Gráfico
                distribution,

                // Financeiro
                financialSummary

            ] = await Promise.all([


                // =========================================
                // PRODUTOS
                // =========================================

                Product.count({
                    where
                }),


                Product.sum('stock', {
                    where
                }),


                Product.count({
                    where: {
                        ...where,
                        stock: 0
                    }
                }),


                Product.count({
                    where: {
                        ...where,

                        stock: {
                            [Op.between]: [1, 10]
                        }
                    }
                }),


                Product.count({
                    where: {
                        ...where,
                        product_state: 'Disable'
                    }
                }),


                // =========================================
                // MARCAS / CATEGORIAS
                // =========================================

                Brand.count({
                    where
                }),


                Category.count({
                    where
                }),


                // Quantidade de marcas utilizadas
                Product.count({
                    where: {
                        ...where,

                        fk_brand_id: {
                            [Op.ne]: null
                        }
                    },

                    distinct: true,
                    col: 'fk_brand_id'
                }),


                // Quantidade de categorias utilizadas
                Product.count({
                    where: {
                        ...where,

                        fk_category_id: {
                            [Op.ne]: null
                        }
                    },

                    distinct: true,
                    col: 'fk_category_id'
                }),


                // =========================================
                // PRODUTOS COM ESTOQUE BAIXO
                // =========================================

                Product.findAll({

                    where: {
                        ...where,

                        stock: {
                            [Op.between]: [0, 10]
                        }
                    },

                    attributes: [
                        'product_id',
                        'title',
                        'stock'
                    ],

                    order: [
                        ['stock', 'ASC']
                    ],

                    limit: 5,

                    raw: true

                }),


                // =========================================
                // PRODUTOS RECENTES
                // =========================================

                Product.findAll({

                    where,

                    attributes: [
                        'product_id',
                        'title',
                        'stock',
                        'createdAt',
                        'updatedAt'
                    ],

                    order: [
                        ['updatedAt', 'DESC']
                    ],

                    limit: 5,

                    raw: true

                }),


                // =========================================
                // DISTRIBUIÇÃO POR CATEGORIA
                // =========================================

                Product.findAll({

                    where,

                    attributes: [

                        'fk_category_id',

                        [
                            sequelize.fn(
                                'COUNT',
                                sequelize.col('Product.product_id')
                            ),
                            'value'
                        ]

                    ],

                    include: [

                        {
                            model: Category,
                            as: 'categoryProduct',

                            attributes: [
                                'category_name'
                            ]
                        }

                    ],

                    group: [
                        'fk_category_id',
                        'categoryProduct.category_id'
                    ]

                }),


                // =========================================
                // RESUMO FINANCEIRO
                // =========================================

                Product.findOne({

                    where,

                    attributes: [

                        // Quanto você gastou no estoque
                        [
                            sequelize.fn(
                                'SUM',
                                sequelize.literal(
                                    'product_cost * stock'
                                )
                            ),
                            'inventoryCost'
                        ],

                        // Quanto o estoque vale pelo preço de venda
                        [
                            sequelize.fn(
                                'SUM',
                                sequelize.literal(
                                    'selling_price * stock'
                                )
                            ),
                            'potentialValue'
                        ],

                        // Margem média dos produtos
                        [
                            sequelize.fn(
                                'AVG',
                                sequelize.col('profit_margin')
                            ),
                            'averageMargin'
                        ],

                        // Preço médio
                        [
                            sequelize.fn(
                                'AVG',
                                sequelize.col('selling_price')
                            ),
                            'averagePrice'
                        ]

                    ],

                    raw: true

                })

            ]);


            // =============================================
            // DISTRIBUIÇÃO
            // =============================================

            const distributed = distribution.map(item => ({

                label:
                    item.categoryProduct?.category_name
                    ?? 'Sem categoria',

                value:
                    Number(item.get('value')) || 0

            }));


            // =============================================
            // STATUS
            // =============================================

            // Se você só possui Enable e Disable
            const enabledProducts =
                totalProducts - disabledProducts;

            const activePercentage =
                totalProducts > 0
                    ? Number(
                        (
                            enabledProducts /
                            totalProducts *
                            100
                        ).toFixed(1)
                    )
                    : 0;


            // =============================================
            // ATIVIDADES RECENTES
            // =============================================

            const activities = recentProducts.map(product => {

                const createdAt =
                    new Date(product.createdAt);

                const updatedAt =
                    new Date(product.updatedAt);

                const isCreated =
                    createdAt.getTime() ===
                    updatedAt.getTime();

                return {

                    product_id:
                        product.product_id,

                    title:
                        product.title,

                    action:
                        isCreated
                            ? 'created'
                            : 'updated',

                    date:
                        product.updatedAt

                };

            });


            // =============================================
            // RESPOSTA
            // =============================================

            const data = {

                products: {

                    total:
                        totalProducts,

                    enabled:
                        enabledProducts,

                    disabled:
                        disabledProducts,

                    activePercentage

                },


                stock: {

                    total:
                        totalStock ?? 0,

                    outOfStock,

                    lowStock,

                    products:
                        lowStockProducts

                },


                catalog: {

                    categories: {

                        total:
                            totalCategories,

                        used:
                            usedCategories,

                        unused:
                            Math.max(
                                totalCategories -
                                usedCategories,
                                0
                            )

                    },

                    brands: {

                        total:
                            totalBrands,

                        used:
                            usedBrands,

                        unused:
                            Math.max(
                                totalBrands -
                                usedBrands,
                                0
                            )

                    }

                },


                financial: {

                    inventoryCost:
                        Number(
                            financialSummary?.inventoryCost
                        ) || 0,

                    potentialValue:
                        Number(
                            financialSummary?.potentialValue
                        ) || 0,

                    averageMargin:
                        Number(
                            financialSummary?.averageMargin
                        ) || 0,

                    averagePrice:
                        Number(
                            financialSummary?.averagePrice
                        ) || 0

                },


                distribution:
                    distributed,


                activities

            };


            return res
                .status(200)
                .json(data);


        } catch (error) {

            console.error(
                'Dashboard controller:',
                error
            );

            return res
                .status(500)
                .json({
                    error: {
                        path: 'dashboard',
                        msg: 'Erro ao carregar dashboard.'
                    }
                });

        }

    }

};


module.exports = dashboard_controller;