import joi from 'joi';

async function validateCategory(req, res, next){
    const {name} = req.body;
    const validateSchema = joi.string().required();
    const {error} = validateSchema.validate(name);

    if(error){
        res.status(400).send('Digite uma categoria')
        return
    }
    
    next();
}

export default validateCategory;