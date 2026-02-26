import express from 'express'
import { Credentials } from '../Model/Credentials.js';
const router = express.Router()


router.post('/', (req, res) => {
    const product = new Credentials(req.body)
    product.save()
    res.send("Signup Successful")
})

export default router;