import joi from 'joi';
import connection from '../postgres.js';

export default async function validateGames(req, res, next){
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;
    const validateSchema = joi.object({
        name: joi.string().required(),
        image: joi.string().uri().required(),
        stockTotal: joi.number().min(1).required(),
        categoryId: joi.number().required(),
        pricePerDay: joi.number().min(1).required(),
    }) 

    const {error} = validateSchema.validate({name, image, stockTotal, categoryId, pricePerDay})
    if(error){
        res.status(400).send("Dados incorretos")
        return
    }

    const validateCategoryId = await connection.query(`
        SELECT FROM categories 
        WHERE id=$1`, [categoryId]
    )
    if(validateCategoryId.rows.length === 0){
        res.status(400).send('Essa categoria não existe')
    } 

    const validateGameName = await connection.query(`
        SELECT FROM games
        WHERE name ILIKE '${name}%'`
    )

    if(validateGameName.rows.length !== 0){
        res.status(409).send('Esse nome de jogo já existe')
    }

    next();
}