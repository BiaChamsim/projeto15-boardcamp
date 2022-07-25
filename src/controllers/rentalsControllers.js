import connection from "../postgres.js";

export async function getRentals(req, res){
    try{
        const {customerId, gameId} = req.query;

        if(customerId){
            const customerFilter = await connection.query(
                `SELECT * FROM customers WHERE id=$1`, [customerId]
            )
            res.status(200).send(customerFilter.rows);
            return
        }

        if(gameId){
            const gameFilter = await connection.query(
                `SELECT * FROM games WHERE id=$1`, [gameId]
            )
            res.status(200).send(gameFilter.rows)
            return
        }


        const rentalsList = await connection.query(`
        SELECT rentals.*, games.id as "gameId", games.name as "gameName", games."categoryId" as "gameCategoryId", customers.name as "customerName", customers.id as "customerId", categories.id as "categoryId", categories.name as "categoryName" FROM rentals
        JOIN games
        ON rentals."gameId" = games.id
        JOIN customers
        ON rentals."customerId" = customers.id
        JOIN categories
        ON games."categoryId" = categories.id
        `)

        res.status(200).send(rentalsList.rows);

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }
}

export async function postRentals(req, res){
    try{
        const {customerId, gameId, daysRented} = req.body;

        const verifyCustomerId = await connection.query(`
            SELECT * FROM customers WHERE id=$1`, [customerId]
        )

        if(verifyCustomerId.rows.length === 0){
            res.status(400).send("Cliente sem registro no sistema")
            return
        }

        const verifyGameId = await connection.query(`
            SELECT * FROM games WHERE id=$1`, [gameId]
        )

        if(verifyGameId.rows.length === 0){
            res.status(400).send("Jogo não registrado")
            return
        }

        const verifyAvailableGame = await connection.query(`
            SELECT "stockTotal" FROM games WHERE id=$1`, [gameId]
        )

        if(verifyAvailableGame.rows[0].stockTotal === 0){
            res.status(400).send("O jogo não está disponível");
            return
        }

        const rentDate = new Date()
        const pricePerDay = await connection.query(`SELECT "pricePerDay" FROM games WHERE id=$1`,[gameId])
        const originalPrice = (pricePerDay.rows[0].pricePerDay)*daysRented;   
        await connection.query(`
            INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") 
            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [customerId, gameId,rentDate, daysRented, null, originalPrice, null]
        )
    
        res.sendStatus(201);

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }
    
}

export async function finishRentals(req, res){
    try{
        const {id} = req.params;

        const verifyRentId = await connection.query(`
            SELECT * FROM rentals WHERE id=$1`, [id]
        )
        if(verifyRentId !== 0){
            res.status(404).send("O aluguel não consta no cadastro")
            return
        }

        const rental = verifyRentId.rows[0];
        if(rental.verifyRentId){
            res.status(400).send("Esse aluguel já foi finalizado")
            return
        }else{
            const delay = new Date().getTime() - new Date(rental.rentDate).getTime();
            const delayDays = (delay / (24 * 3600 * 1000));

            let fee = 0;
            if(delayDays > rental.daysRented){
                const extraDays = delayDays - rental.daysRented;
                fee = extraDays * rental.originalPrice;
                console.log("fee", extraDays);
            }
        }

        await connection.query(`
            UPDATE rentals 
            SET "returnDate" = NOW(), "fee" = $1 
            WHERE id= $2`,
            [fee, id]
        )

        res.sendStatus(200);

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }
    
}

export async function deleteRentals(req, res){
    try{
        const {id} = req.params;
        const verifyId = await connection.query(`
            SELECT * FROM rentals WHERE id=$1`, [id]
        )

        if(verifyId.rows.length===0 || verifyId.rows[0].returnDate !== null){
            res.status(400).send("Esse aluguel não existe ou já foi finalizado")
            return
        }

        await connection.query(`DELETE FROM rentals WHERE id=$1`, [id])
        res.sendStatus(200);

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }
    
}