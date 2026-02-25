import { useState, useEffect } from "react";
import "../../Style/Admin.css";
import axios from "axios";

function Modal({ onClose, editData }) {
  const [form, setForm] = useState(editData || {
    code: "", type: "Percentage", value: "", minOrder: "", usageLimit: "", expiry: "", status: "Active"
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(26,10,46,0.35)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "480px",
        padding: "32px", boxShadow: "0 24px 60px rgba(147,51,234,0.18)",
        animation: "fadeUp 0.3s ease",
        fontFamily: "'DM Sans',sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1a0a2e" }}>
              {editData ? "Edit Discount" : "Create New Discount"}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#9ca3af" }}>
              {editData ? "Update promo code details" : "Add a new promo code for your store"}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: "34px", height: "34px", borderRadius: "50%",
            border: "1.5px solid #e9d5ff", background: "#faf5ff",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", color: "#9333ea",
          }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { label: "Name", key: "code", placeholder: "e.g. SUMMER25", type: "text" },
            { label: "Email", key: "value", placeholder: "e.g. 25", type: "number" },
            { label: "Minimum Order (Rs)", key: "minOrder", placeholder: "e.g. 500", type: "number" },
            { label: "Usage Limit", key: "usageLimit", placeholder: "e.g. 100", type: "number" },
            { label: "Expiry Date", key: "expiry", placeholder: "", type: "date" },
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px", letterSpacing: "0.04em" }}>
                {field.label.toUpperCase()}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                style={{
                  width: "100%", padding: "10px 14px",
                  border: "1.5px solid #e9d5ff", borderRadius: "10px",
                  fontSize: "13.5px", color: "#1a0a2e",
                  outline: "none", fontFamily: "'DM Sans',sans-serif",
                  background: "#fefcff", boxSizing: "border-box",
                }}
              />
            </div>
          ))}

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px", letterSpacing: "0.04em" }}>
              TYPE
            </label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              style={{
                width: "100%", padding: "10px 14px",
                border: "1.5px solid #e9d5ff", borderRadius: "10px",
                fontSize: "13.5px", color: "#1a0a2e",
                outline: "none", fontFamily: "'DM Sans',sans-serif",
                background: "#fefcff", boxSizing: "border-box",
              }}
            >
              <option>Percentage</option>
              <option>Fixed Amount</option>
              <option>Free Shipping</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", borderRadius: "10px",
            border: "1.5px solid #e9d5ff", background: "#fff",
            fontSize: "13.5px", fontWeight: 600, color: "#6b7280",
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
          }}>Cancel</button>
          {editData ? <button onClick={onClose} style={{
            flex: 2, padding: "11px", borderRadius: "10px",
            border: "none", background: "linear-gradient(135deg,#9333ea,#c084fc)",
            fontSize: "13.5px", fontWeight: 700, color: "#fff",
            cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
            boxShadow: "0 4px 14px rgba(147,51,234,0.3)",
          }}>
            Save Changes
          </button>
            : <button onClick={onClose} style={{
              flex: 2, padding: "11px", borderRadius: "10px",
              border: "none", background: "linear-gradient(135deg,#9333ea,#c084fc)",
              fontSize: "13.5px", fontWeight: 700, color: "#fff",
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              boxShadow: "0 4px 14px rgba(147,51,234,0.3)",
            }}>
              Create Customer
            </button>}
        </div>
      </div>
    </div>
  );
}



export default function AdminCustomers() {

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);


  useEffect(() => {
    const fetchCustomers = async () => {
      let response = await axios("http://localhost:3000/getcustomers");
      setData(response.data);
    }
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/deletecustomer/${id}`);
    setData(data.filter(d => d._id !== id));
  }
  return (
    <div className="admin-stack">
      {showModal && <Modal onClose={() => { setShowModal(false); setEditItem(null); }} editData={editItem} />}
      <div className="admin-card admin-card-pad">
        <div className="admin-card-row">
          <div>
            <div className="admin-card-title">Customers</div>
            <div className="admin-muted">Customer list and basic insights.</div>
          </div>
          <div>
            <button onClick={() => setShowModal(true)} className="admin-primary-btn">
              + Create Customer
            </button>
          </div>
        </div>

        <div className="admin-table admin-mt">
          <div className="admin-table-head">
            <div>ID</div>
            <div>Name</div>
            <div>Email</div>
            <div>Action</div>
            {/* <div>Orders</div> */}
          </div>
          {data.map((c) => (
            <div key={c._id} className="admin-table-row">
              <div className="admin-mono">#{c._id.slice(0, 7)}</div>
              <div className="admin-strong">{c.Username}</div>
              <div className="admin-muted">{c.Email}</div>
              {/* Actions */}
              <div style={{ display: "flex", gap: "10px" }}>

                {/* Edit */}
                <button
                  onClick={() => { setEditItem(c); setShowModal(true); }}
                  title="Edit"
                  style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    border: "1.5px solid #e9d5ff", background: "#faf5ff",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(c._id)}
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
              {/* <div className="admin-muted">{c.Orders.length}</div> */}
              {/* <div className="admin-right">{c.orders}</div> */}
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}
