import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Components/AuthProvider';
import moment from 'moment';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import LoadingGif from "../Components/LoadingGif";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserNavigation from '../Components/UserNavigation';
import { FaFileInvoice } from "react-icons/fa";

function OrderHistory() {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const handleViewInvoice = async (razorpay_order_id) => {
    try {
      const response = await fetch(`${apiUrl}/getorderdetails/${razorpay_order_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoice details');
      }
      const data = await response.json();
      console.log('Invoice data:', data); // Log the data to check if it's correct
      setSelectedOrderDetails(data[0]);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      toast.error('Failed to fetch invoice details');
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrderHistory(user.email);
    }
  }, [user]);

  const fetchOrderHistory = async (email) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/orders/${email}`);
      const data = await response.json();
      console.log("Fetched orders:", data); // Log the orders to confirm the order
      setOrders(data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  const handleBuyAgain = async (product) => {
    const { _id, Name, Price, Image_URL, Product_id, quantity } = product;
    const cartItem = {
      _id,
      Name,
      Price,
      Image_URL,
      quantity,
      Product_id,
      email: user.email
    };

    try {
      await axios.post(`${apiUrl}/addtocart`, cartItem);
      toast.success('Item Added To Cart', { autoClose: 2000 });
      navigate('/cart');
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
      toast.error('Failed to add item to cart');
    }
  };
  const downloadPDF = () => {
    if (selectedOrderDetails) {
      const pdf = new jsPDF();
      pdf.text(JSON.stringify(selectedOrderDetails), 10, 10); // Example: Add invoice data to PDF
      pdf.save('invoice.pdf');
    } else {
      toast.error('Invoice data not available');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:w-3/4 lg:w-[80%]">
      <UserNavigation />
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Purchase History</h2>
      {isLoading ? (
        <LoadingGif />
      ) : (
        <>
          {orders.length === 0 ? (
            <div className="text-center mb-4">
              <p className="text-lg text-gray-800">No orders ordered yet.</p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-[#125872] text-white hover:bg-[#0d4255] text-sm px-4 py-2 rounded-md mt-4"
              >
                Shop Products
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-md overflow-hidden border border-gray-200">
                  <div
                    className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    <div className='flex'>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order._id.slice(0, 12)}...
                      </h3>
                      <div className="text-base md:text-md md:pl-[18rem] font-semibold text-gray-800">Order Date: {order.orderDate}</div>
                      <div className="text-base md:text-md md:pl-[24rem] font-semibold text-gray-800">Total: ₹{order.amount}</div>
                    </div>
                    <div className="text-lg">
                      {expandedOrderId === order._id ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    </div>
                  </div>
                  {expandedOrderId === order._id && (
                    <div className="p-4 md:p-6">
                      {order.cartItems.map((item) => (
                        <div key={item._id} className="flex items-center mb-4">
                          {item.Image_URL && (
                            <img
                              src={item.Image_URL}
                              alt={item.Name}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover mr-4 md:mr-6 rounded-md"
                            />
                          )}
                          <div className='flex justify-between items-center w-full'>
                            <div>
                              <h4 className="text-base md:text-lg font-semibold text-gray-800">{item.Name}</h4>
                              <p className="text-xs md:text-sm text-gray-600">
                                Quantity :  {item.quantity} {item.Size}
                              </p>
                              <p className="text-base md:text-lg font-semibold text-gray-800">₹{item.Price}</p>
                            </div>
                            <button
                              onClick={() => handleBuyAgain(item)}
                              className="bg-[#125872] text-white hover:bg-[#0d4255] text-xs md:text-sm px-2 py-2 rounded-md"
                            >
                              Buy Again
                            </button>

                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-xs md:text-sm text-gray-700">Payment Status: {order.paymentStatus}</div>
                        <div className="text-xs md:text-sm text-gray-700">Payment ID: {order.razorpay_order_id}</div>
                        <div className="text-base md:text-lg font-semibold text-gray-800">Total: ₹{order.amount}</div>
                      </div>
                      
                      <button onClick={() => handleViewInvoice(order.razorpay_order_id)}>
                        <FaFileInvoice />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OrderHistory;

