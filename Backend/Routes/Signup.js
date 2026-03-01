import express from 'express'
import { Credentials } from '../Model/Credentials.js';
const router = express.Router()


router.post('/', async (req, res) => {
    try {
        console.log("Signup request received: ", req.body);
        const { Username, Email, Password } = req.body;
        const existing = await Credentials.findOne({ Username });
        if (existing) {
            console.log("Signup failed: Username already exists");
            return res.status(400).json({ message: "Username already exists" });
        }
        const user = new Credentials({ Username, Email, Password });
        console.log("New user signup: ", user);
        await user.save();
        res.status(201).json({ message: "Signup Successful" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
})

export default router;