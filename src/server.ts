import * as dotenv from 'dotenv';
import cors from 'cors'
import express from 'express'
import { connectToDatabase } from './database'
import { userRouter } from './user.routes';;

dotenv.config();
const { DB_URI } = process.env

if (!DB_URI) {
    console.log(" NO DB_URI ENVIRONMENT VARIABLE ");
    process.exit(1);
}

connectToDatabase(DB_URI)
    .then(() => {

        const app = express();
        app.use(cors())
        app.use('/user', userRouter)

        app.listen(5400, () => { console.log('Server is hosted on Port 5400') })
    })
    .catch(error => console.error(error))