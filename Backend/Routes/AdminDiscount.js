import Discount from '../Model/Discount.js'
import express from 'express'
const router = express.Router()


router.post('/createDiscount', (req, res) => {
    const discount = new Discount(req.body);
    discount.save();
    res.status(200)
    res.send("Successful")
})

router.get('/getDiscount', async (req, res) => {
    const discounts = await Discount.find({})
    res.send(discounts)
})

router.delete('/deleteDiscount/:id', async (req, res) => {

    const { id } = req.params;
    const discount = await Discount.findByIdAndDelete(id);
    res.json(discount)

})


router.put('/updateDiscount/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const discount = await Discount.findByIdAndUpdate(id, req.body, { new: true });
        res.json(discount)
    } catch (err) {
        res.status(500).send(err.message);
    }
})
export default router