import React, { useContext, useState } from "react";
import CartContext from "./Context/CartContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, scale } from "framer-motion";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Plus,
  Minus,
} from "lucide-react";

function Cart() {
  const { handleSubmit } = useForm();

  const { cart, removeFromCart, loginStatus } = useContext(CartContext);
  const [quantities, setQuantities] = useState({});

  const totalPrice = cart.reduce((sum, item) => {
    const qty = quantities[item.id] || 1;
    return sum + item.price * qty;
  }, 0);

  const updateQuantity = (id, change) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const newQty = Math.max(1, current + change);
      return { ...prev, [id]: newQty };
    });
  };

  const onSubmit = async (data) => {
    console.log("Form Data is ", data);
    let r = await axios.post("http://localhost:3000/order", {
      item: data,
    });
    console.log("Order Response is ", r);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-12">
        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2 }}
            className="mx-10"
          >
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight 
            bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 
            bg-clip-text text-transparent"
            >
              Your Shopping Cart
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-500">
              Review your selected items before checkout ·{" "}
              <span className="font-semibold text-gray-700">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </span>
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-2xl shadow-lg"
            >
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl mb-6">Your cart is empty.</p>
              <Link to="/catalog">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg">
                  Start Shopping
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 ">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {cart.map((item, index) => {
                    const qty = quantities[item.id] || 1;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all"
                      >
                        <div className="flex flex-col md:flex-row gap-6  p-6">
                          <div className="w-full md:w-28 h-44 md:h-28 rounded-xl overflow-hidden bg-gray-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 capitalize mb-3">
                              {item.category}
                            </p>

                            <div className="flex items-center gap-4">
                              <span className="text-xl font-bold text-gray-900">
                                ${(item.price * qty).toFixed(2)}
                              </span>

                              {qty > 1 && (
                                <span className="text-sm text-gray-400">
                                  ${item.price} × {qty}
                                </span>
                              )}
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                              <span className="text-sm text-gray-600">
                                Quantity
                              </span>

                              <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="px-3 py-1 hover:bg-gray-100"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>

                                <span className="px-4 font-semibold">
                                  {qty}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="px-3 py-1 hover:bg-gray-100"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="self-start md:self-center 
        p-3 rounded-xl bg-red-50 text-red-600 
        hover:bg-red-100 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </form>
              </div>

              <div className="md:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-6 sticky top-24"
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link to="/catalog">
                      <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold">
                        <ArrowLeft className="w-5 h-5" />
                        Continue Shopping
                      </button>
                    </Link>

                    {/* {loginStatus ? ( */}
                    <Link to="/orderform">
                      <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700
                         hover:to-white transition-all transform hover:scale-105 shadow-lg font-semibold">
                        <CreditCard className="w-5 h-5" />
                        Proceed to Checkout.
                      </button>
                    </Link>
                    {/* ) : (
                      <Link to="/login">
                        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg font-semibold">
                          Login to Get 10% discount.
                        </button>
                      </Link> )} */}

                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
