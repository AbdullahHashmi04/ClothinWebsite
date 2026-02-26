import express from "express";
import Feedback from "../Model/Feedback.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, message } = req.body;
    const feedback = new Feedback({ name, email, message })
    await feedback.save()
    res.status(200)
    res.send("Successful")
});

router.get("/", async (req, res) => {
    const feedback = await Feedback.find({})
    res.status(200).json(feedback)
})

export default router;
