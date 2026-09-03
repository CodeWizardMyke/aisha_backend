const {Employee} = require("../database/models");

const dataScope = async (req, res, next) => {

    try {

        const { employee_id } = req.token_decoded;

        if (!employee_id) {
            return res.status(401).json({
                error: {
                    path: 'authorization',
                    msg: "Autorização recusada."
                }
            });
        }

        const employee = await Employee.findOne({
            where:{
                employee_id:employee_id
            },
            attributes:['role']
        });

        if (!employee) {
            return res.status(401).json({
                error: {
                    path: 'authorization',
                    msg: "Autorização recusada."
                }
            });
        }

        req.dataScope = employee.role === 'admin'
            ? {}
            : { owner_employee_id: employee_id };

        return next();

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: {
                path: 'server',
                msg: 'Erro interno do servidor.'
            }
        });
    }
};

module.exports = dataScope;