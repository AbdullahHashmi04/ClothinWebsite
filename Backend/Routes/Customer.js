import express from 'express'
const router = express.Router()
import { Credentials } from '../Model/Credentials.js'

router.get('/getcustomers', async (req, res) => {
    const customers = await Credentials.find({})
    res.send(customers)
})
router.delete('/deletecustomer/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Credentials.findByIdAndDelete(id);
        res.json(customer)
    } catch (err) {
        res.status(500).send(err.message);
    }
})


export default router