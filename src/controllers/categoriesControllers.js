import connection from "../postgres.js";

export async function getCategories(req, res){
    try{
        const listCategories = await connection.query('SELECT * FROM categories;');
        res.send(listCategories.rows);
    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.");
    }
}

export async function postCategories(req,res){
    try{
        const { name } = req.body;
        const { rows: alreadyExists } = await connection.query(
            `SELECT * FROM categories 
            WHERE LOWER(name)=LOWER($1)`,
            [name]
        );
                
        if(alreadyExists.length !== 0){
            res.status(409).send('Essa categoria já existe');
            return
        }
        
        await connection.query('INSERT INTO categories (name) VALUES ($1)',[name]);
        res.sendStatus(200);

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.");
    }
    
}