import mongoose from "mongoose"

const virtualTryOnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  personImageUrl: {
    type: String,
    required: true
  },
  clothImageUrl: {
    type: String,
    required: true
  },
  resultImageUrl: {
    type: String,
    required: true
  },
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const VirtualTryOn = mongoose.model('VirtualTryOn', virtualTryOnSchema);

export default VirtualTryOn;