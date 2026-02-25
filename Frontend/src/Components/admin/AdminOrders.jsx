import { useState, useEffect } from "react";
import "../../Style/Admin.css";
import axios from "axios";

export default function AdminOrders() {
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getorders');
        setOrdersData(response.data);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/deleteorder/${id}`);
      setOrdersData(ordersData.filter(o => o._id !== id));
    } catch (error) {
      console.error("Error deleting order: ", error);
    }
  }

  return (
    <div className="admin-stack">
      <div className="admin-card admin-card-pad">
        <div className="admin-card-row">
          <div>
            <div className="admin-card-title">Orders</div>
            <div className="admin-muted">Track fulfillment and payment status.</div>
          </div>
          <button className="admin-primary-btn" type="button">
            Manage Orders
          </button>
        </div>

        <div className="admin-table admin-mt">
          <div className="admin-table-head">
            <div>Order</div>
            <div>Date</div>
            <div>Customer</div>
            <div className="justify-end">Actions</div>
            {/* <div className="admin-right">Total</div> */}
          </div>
          {ordersData.length > 0 ? (
            ordersData.map((o, index) => (  // Added index as fallback
              <div key={o._id?.toString() || `order-${index}`} className="admin-table-row">  {/* Unique key with fallback */}
                <div className="admin-mono">#{o._id.slice(0, 7)}</div>
                <div className="admin-mono ">{o.date}</div>
                <div className="admin-strong">{o.FullName}</div>
                <div className="flex gap-2 ">

                  {/* Edit
                <button
                  onClick={() => { setEditItem(p); setShowModal(true); }}
                  title="Edit"
                  style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    border: "1.5px solid #e9d5ff", background: "#faf5ff",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button> */}

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(o._id)}
                    title="Delete"
                    style={{
                      width: "32px", height: "32px", borderRadius: "8px",
                      border: "1.5px solid #ffe4e6", background: "#fff5f7",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>No orders available</div>  // Fallback if not an array or empty
          )}
        </div>
      </div>
    </div>
  );
}