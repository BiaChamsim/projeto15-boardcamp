import joi from 'joi';

export default async function validateCustomer(req, res, next){
    
    const {name, phone, cpf, birthday} = req.body;
    const validateSchema = joi.object({
        name: joi.string().required(),
        phone: joi.string().min(10).max(11).required(),
        cpf: joi.string().min(11).max(11).required(),
        birthday: joi.string().isoDate().required()
    });

    const {error} = validateSchema.validate({name, phone, cpf, birthday})
    if(error){
        res.status(400).send("Dados incorretos")
        return
    }

    next()

}