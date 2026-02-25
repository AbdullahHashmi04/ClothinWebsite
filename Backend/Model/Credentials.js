import mongoose from "mongoose"

const SignupSchema = new mongoose.Schema({
    Username: String,
    Email: String,
    Password: String,
    googleId: String,
    picture: String,
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
})

export const Credentials = mongoose.model("Credentials", SignupSchema)