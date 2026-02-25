import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import CartContext from './Context/CartContext';
import { motion, removeItem } from 'framer-motion';
import { CreditCard, MapPin, User, Phone, Mail, CheckCircle } from 'lucide-react';
import axios from 'axios';

const OrderForm = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Data is coming again", data)
      const res = await axios.post("http://localhost:3000/orders", { data });
      if (res.status === 200) {
        console.log("Response successful", res)
        // clearCart();
        // navigate("/");
      }
    } catch (error) {
      console.error("Order submission error:", error);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Checkout
            </h1>
            <p className="text-gray-600">Complete your order</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} action="" className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-600" />
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      {...register("FullName", { required: "Full name is required" })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("Email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register("Phone", { required: "Phone number is required" })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </label>
                    <textarea
                      {...register("Address", { required: "Address is required" })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                      rows="3"
                      placeholder="123 Main St, City, State, ZIP"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      {...register("CardNumber", { required: "Card number is required" })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        {...register("expiry", { required: "Expiry date is required" })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="MM/YY"
                      />
                      {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        {...register("cvv", { required: "CVV is required" })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="123"
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 sticky top-24"
              >
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <input className="font-semibold text-sm"  {...register(`cart.${index}.name`)} value={item.name} />
                        <input className="text-gray-500 text-xs"  {...register(`cart.${index}.name`)} value={item.price} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-3 border-t">
                    <span>Total</span>
                    <input type='text'
                      {...register("Total")}
                      value={totalPrice}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl 
                font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 
                shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">

                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Place Order
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
