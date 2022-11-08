import * as express from 'express'
import * as mongodb from 'mongodb'
import * as bcrypt from 'bcrypt'
import { collections } from './database';

export const userRouter = express.Router();
userRouter.use(express.json())

userRouter.post('/', async (req, res) => {
    try {
        const user = req.body;
        const saltRounds = 10;
        const myPlaintextPassword = user.pwd;
        bcrypt.genSalt(saltRounds, (err: any, salt: any) => {
            bcrypt.hash(myPlaintextPassword, salt, async (err: any, hash: any) => {
                user.pwd = hash;
                const result = await collections.users.insertOne(user)
                if (result.acknowledged) {
                    res.status(201).send(`Created a new User: ID ${result.insertedId}`)
                } else {
                    res.status(500).send('Failed to create a new User')
                }
            });
        });

    } catch (error) {
        console.error(error);
        res.status(400).send(`Failed to create the User ID: Reason: ${error.message} `)
    }
})