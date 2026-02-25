// tryonController.js - ES Module Version
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import VirtualTryOn from '../Model/VirtualTryOn.js';
import Product from '../Model/Product.js'; 

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';

export const createTryOn = async (req, res) => {
  try {
    console.log("Accessed")
    const { userId, productId } = req.body;
    
    if (!req.files || !req.files.personImage) {
      return res.status(400).json({ error: 'Person image is required' });
    }
    
    const personImage = req.files.personImage[0];
    const clothImage = req.files.clothImage ? req.files.clothImage[0] : null;
    
    // If cloth image not provided, fetch from product
    let clothImagePath;
    if (!clothImage) {
      // Fetch product cloth image from database
      const product = await Product.findById(productId);
      if (!product || !product.imageUrl) {
        return res.status(400).json({ error: 'Product image not found' });
      }
      
      // For remote URLs, you might need to download the image first
      // Or pass the URL directly if your Python service supports it
      clothImagePath = product.imageUrl;
    } else {
      clothImagePath = clothImage.path;
    }
    
    // Create FormData for Python service
    const formData = new FormData();
    formData.append('person', fs.createReadStream(personImage.path));
    
    // Handle cloth image - if it's a URL, you'll need to download it first
    if (clothImage) {
      formData.append('cloth', fs.createReadStream(clothImagePath));
    } else {
      // Download product image and add to form
      // You may need to implement image download logic here
      formData.append('cloth', fs.createReadStream(clothImagePath));
    }
    
    // Call Python service
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/tryon`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 60000 // 60 seconds timeout
      }
    );
    
    if (response.data.success) {
      // Save to database
      const tryOn = new VirtualTryOn({
        userId,
        productId,
        personImageUrl: personImage.path,
        clothImageUrl: clothImagePath,
        resultImageUrl: `${PYTHON_SERVICE_URL}${response.data.output_url}`,
        requestId: response.data.request_id,
        status: 'completed'
      });
      
      await tryOn.save();
      
      res.json({
        success: true,
        data: {
          tryOnId: tryOn._id,
          resultImageUrl: tryOn.resultImageUrl,
          requestId: tryOn.requestId
        }
      });
    } else {
      throw new Error('Try-on processing failed');
    }
    
  } catch (error) {
    console.error('Try-on error:', error);
    res.status(500).json({ 
      error: 'Virtual try-on failed', 
      message: error.message 
    });
  }
};

export const getTryOnHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const history = await VirtualTryOn.find({ userId })
      .populate('productId', 'name price imageUrl')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTryOnById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tryOn = await VirtualTryOn.findById(id)
      .populate('productId', 'name price imageUrl')
      .populate('userId', 'name email');
    
    if (!tryOn) {
      return res.status(404).json({ error: 'Try-on not found' });
    }
    
    res.json({ success: true, data: tryOn });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTryOn = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tryOn = await VirtualTryOn.findByIdAndDelete(id);
    
    if (!tryOn) {
      return res.status(404).json({ error: 'Try-on not found' });
    }
    
    // Optional: Delete uploaded files
    if (fs.existsSync(tryOn.personImageUrl)) {
      fs.unlinkSync(tryOn.personImageUrl);
    }
    
    res.json({ success: true, message: 'Try-on deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
