async function validateDemoLimit({
    model,
    employee_id,
    limit = 10
}) {

    const total = await model.count({
        where:{
            owner_employee_id: employee_id
        }
    });

    return total >= limit;
}

module.exports = {
    validateDemoLimit
};