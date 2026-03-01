import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    Username: String,
    Email: String,
    Password: String,
    googleId: String,
    picture: String,
    Phone: String,
    Address: String,
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
})


userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.Password);
};

export const Credentials = mongoose.model("Credentials", userSchema)