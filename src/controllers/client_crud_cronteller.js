const {Client} = require('../database/models');

const client_crud = {
    create: async (req, res ) => {
        try {
            await Client.create(req.body);
            return res.status(201).json('criado com sucesso!')

        } catch (error) {
            console.log(error);
            return res.json(error)
        }
    },
    read: async (req, res ) => {
        try {
            const {clientInstagram} = req.body;

            const data = await Client.findOne({where:{clientInstagram:clientInstagram}});
            return res.status(200).json(data);

        } catch (error) {
            console.log(error);
            return res.json(error)
        }
    },
    update: async (req, res ) => {
        try {
            const {client_id}  = req.body;

            const data = await Client.findOne({where:{client_id:client_id}});
            delete req.body.client_id;

            await data.update(req.body);
            return res.send('Atualizado!')

        } catch (error) {
            console.log(error);
            return res.json(error)
        }
    },
    delete: async (req, res ) => {
        try {
            const {client_id} = req.body;

            const data = await Client.findOne({where:{client_id:client_id}});
            await data.destroy() ;

            return res.status(201).json('Removido com sucesso!')
            
        } catch (error) {
            console.log(error);
            return res.json(error)
        }
    },
};

module.exports = client_crud;