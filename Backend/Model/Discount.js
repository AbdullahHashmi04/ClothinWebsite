import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    code: String,
    value: Number,
    status: String,
    expiry: Date,
    type: String,
    minOrder: Number,
    usageLimit: Number,
})

const Discount = mongoose.model("Discount", discountSchema)
export default Discount