import connection from "../postgres.js";

export async function getGames(req, res){
    try{
        const {name} = req.query;

        if(name){
           const gameList = await connection.query(
                `SELECT * FROM games
                WHERE name ILIKE '${name}%'` 
            )

            if(gameList.rows.length !== 0){
                res.status(200).send(gameList.rows)
                return
            }
        }else{            
            const gameList = await connection.query(
                `SELECT games.*, categories.name as categoryName 
                FROM games
                JOIN categories
                ON games."categoryId" = categories.id `
            )

            res.status(200).send(gameList.rows);
        }

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }
}

export async function postGames(req, res){
    try{
        const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

        await connection.query(`
        INSERT INTO games 
        (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES($1, $2, $3, $4, $5);`, [name, image, stockTotal, categoryId, pricePerDay])

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }
}