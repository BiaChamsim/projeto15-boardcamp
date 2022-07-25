import connection from "../postgres.js";

export async function getCustomers(req, res){
    try{
        const {cpf} = req.query;
        
        if(cpf){
            const customersCPF = await connection.query(`
                SELECT * FROM customers 
                WHERE cpf LIKE '$1%'`, [cpf]
            )

            res.send(customersCPF.rows);

        }else{
            const customersList = await connection.query(`
                SELECT * FROM customers`
            )

            if(customersList.rows.length === 0){
                res.send("Não há nenhum cliente com este CPF cadastrado")
                return
            }

            res.send(customersList.rows)
        }

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }

}

export async function getOneCustomer(req, res){
    try{
        const {id} = req.params;
        const customerId = await connection.query(`
            SELECT * FROM customers WHERE id=$1`, [id]
        )

        if(customerId.rows.length === 0){
            res.status(404).send("Esse cliente não consta no banco de dados");
            return
        }

        res.send(customerId.rows[0]).status(200);

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }
}

export async function postCustomers(req, res){
    try{
        const {name, phone, cpf, birthday} = req.body;

        const checkCPF = await connection.query(`
            SELECT FROM CUSTOMERS
            WHERE cpf=$1`, [cpf]
        )

        if(checkCPF.rows.length !== 0){
            res.status(409).send("Este CPF já está cadastrado");
            return
        }

        const insertCustomer = await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]
        )

        res.status(201).send(insertCustomer.rows);        

    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }
    
}

export async function putCustomers(req, res){
    try{
        const {name, phone, cpf, birthday} = req.body;
        const {id} = req.params;

        const checkCPF = await connection.query(`
            SELECT FROM CUSTOMERS
            WHERE cpf=$1 AND id<>$2`, [cpf, id]
        )

        if(checkCPF.rows.length !== 0){
            res.status(409).send("Este CPF já está cadastrado");
            return
        }

        const updateCustomer = await connection.query(`
            UPDATE customers 
            SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`, 
            [name, phone, cpf, birthday, id]
        )

        res.status(200).send(updateCustomer.rows);


    }catch(e){
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter a informação.")
    }
    
}