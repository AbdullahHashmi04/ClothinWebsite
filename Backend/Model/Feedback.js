import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    rating: Number,
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;