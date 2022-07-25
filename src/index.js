import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import categories from './routes/categories.js';
import games from './routes/games.js';
import customers from './routes/customers.js';
import rentals from './routes/rentals.js';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use(categories);
app.use(games);
app.use(customers);
app.use(rentals);


const PORT = process.env.PORT || 4000

app.listen(PORT, () => (
    console.log('servidor funfando')
))
