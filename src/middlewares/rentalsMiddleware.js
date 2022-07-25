import joi from 'joi';

export default async function validateRentals(req, res, next){
    const {customerId, gameId, daysRented} = req.body
    const validateSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().min(1).required()
    })

    const {error} = validateSchema.validate({customerId, gameId, daysRented})
    if(error){
        res.status(403).send("Insira os dados corretamente")
        return
    }

    next()
    
}