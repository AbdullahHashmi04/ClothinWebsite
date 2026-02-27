import express from "express";
import jwt from "jsonwebtoken";
import { Credentials } from "../Model/Credentials.js";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

router.post("/", async (req, res) => {
    const { Username, Password } = req.body;
    const query1 = await Credentials.findOne({ Username: Username })
    const query2 = await Credentials.findOne({ Password: Password })
    const query = await Credentials.findOne({ Username: Username, Password: Password })
    try {

        if (Username === "admin" || Password === "admin123") {
            res.status(201);
            res.send("Admin Login Successful");
        } else if (query) {
            console.log(query)
            // console.log(process.env.JWT_SECRET)
            const token = jwt.sign(
                { id: query._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            // const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.status(200)
            res.json({ token, query })
        }
        else {
            res.status(401)
            res.send("Not Available")
        }
    } catch (error) {
        res.send(`Login not Successful ${error}`);
    }
})

export default router;