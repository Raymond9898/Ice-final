import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const MpesaPayment = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const product = state?.product || {}; // Retrieve the passed product details

  const submit = async (e) => {
    e.preventDefault();
    setLoading("Please wait...");

    try {
      const data = new FormData();
      data.append("phone", phone);
      data.append("amount", product.product_cost);

      // Ensure you replace with the correct API endpoint
      const response = await axios.post("https://raymondotieno.pythonanywhere.com/api/mpesa_payment", data);

      setLoading(""); // Clear loading state
      setMessage(response.data.message); // Display success message
    } catch (error) {
      setLoading(""); // Clear loading state
      setError("Something went wrong. Please try again."); // Display error message
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <h2 className="mt-4 row justify-content-center mt-3">Mpesa Payment - Lipa na Mpesa</h2>
      <div className="col-md-6 card shadow p-4">
        <p className="text-info">Product Name: {product.product_name}</p>
        <p className="text-warning">Product Cost: KES {product.product_cost?.toLocaleString()}</p>

        <form onSubmit={submit}>
          <p className="text-warning">{loading}</p>
          <p className="text-danger">{error}</p>
          <p className="text-success">{message}</p>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone Number (e.g. 254xxxxxxxxx)</label>
            <input
              type="tel"
              id="phone"
              placeholder="254xxxxxxxxx"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-success" type="submit">
            Make Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default MpesaPayment;
