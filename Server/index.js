const express = require('express');
const app = express();
require('dotenv').config();


const db = require("./db");
db.connect();

const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

const workoutRouter = require('./workout/workoutRouter');
app.use('/workout', workoutRouter);

const userRouter = require('./User/user.router')
app.use("/user", userRouter)


const PORT = process.env.PORT || 2500;
app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}!`));