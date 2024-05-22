import express from 'express'
import { Response, Request } from 'express'
import { User } from '../core/models/interface'
import jwt from 'jsonwebtoken';
import db from '../db/db.json';

const router = express.Router()

router.post('/', (req: Request, res: Response) => {

    const { username, password } = req.body

    if(!username || !password) {
        return res.status(400).json({
            message: "The Username and Password are required!"
        })
    }

    const users : User[] =  db.users

    const user = users.find(user => user.username === username && user.password === password)
    if(!user) {
        return res.status(401).json({
            message: "This User is Unauthorized"
        })
    }

    const accessToken = jwt.sign({ "username": username, "role":  user.role }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "1h" })
    res.json({
        token: accessToken
    })
})

module.exports = router