import express from 'express';
import dotenv from 'dotenv';
import rootRouter from "./routes/index.js";

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/", rootRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
    console.log(`server listening at localhost:${process.env.PORT}`);
});