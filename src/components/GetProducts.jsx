import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSpinner, FaExclamationTriangle, FaShoppingCart } from 'react-icons/fa';
import Carousel from './Carousel';
import Footer from './Footer';

const Getproducts = () => {
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [discountCode, setDiscountCode] = useState('');
  const [validDiscount, setValidDiscount] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountMessage, setDiscountMessage] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const navigate = useNavigate();
  const img_url = "https://raymondotieno.pythonanywhere.com/static/images/";

  // Fetch products
  const get_products = async () => {
    setLoading('Loading products...');
    try {
      const response = await axios.get('https://raymondotieno.pythonanywhere.com/api/get_products_details');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading('');
    } catch (error) {
      setError(error.message);
      setLoading('');
    }
  };

  // Format price with currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  // Apply discount code
  const applyDiscount = () => {
    // Simulating discount check (replace with actual API call or logic)
    const result = { 
      valid: discountCode === 'DISCOUNT10', 
      discountPercent: 10,
      message: ""
    };

    if (result.valid) {
      setValidDiscount(true);
      setDiscountPercent(result.discountPercent);
      setDiscountApplied(true);
      setDiscountMessage(result.message);

      // Store in localStorage to maintain during session
      localStorage.setItem('currentDiscount', JSON.stringify({
        code: discountCode,
        percent: result.discountPercent,
        validUntil: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours from now
      }));
    } else {
      setValidDiscount(false);
      setDiscountApplied(false);
      setDiscountMessage(result.message || "");
    }
  };

  // Calculate discounted price
  const getDiscountedPrice = (price) => {
    if (!validDiscount) return price;
    return price - (price * discountPercent) / 100;
  };

  // Load any existing discount on component mount
  useEffect(() => {
    const storedDiscount = localStorage.getItem('currentDiscount');
    if (storedDiscount) {
      const discount = JSON.parse(storedDiscount);
      if (new Date().getTime() < discount.validUntil) {
        setDiscountCode(discount.code);
        setValidDiscount(true);
        setDiscountApplied(true);
        setDiscountPercent(discount.percent);
      } else {
        localStorage.removeItem('currentDiscount');
      }
    }
    get_products();
  }, []);

  // Filter and sort products
  useEffect(() => {
    if (!products.length) return;

    let result = [...products];

    if (searchQuery) {
      result = result.filter(product =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.product_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.product_cost - b.product_cost);
        break;
      case 'price-high':
        result.sort((a, b) => b.product_cost - a.product_cost);
        break;
      case 'name-asc':
        result.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, sortOption, products]);

  return (
    <div className="container-fluid p-0">
      <Carousel />

      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-md-8 mb-3 mb-md-0">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select 
              className="form-select shadow-sm"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-center">
          <input
            type="text"
            placeholder="Enter discount code"
            className="form-control w-50 d-inline-block me-2"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button className="btn btn-success" onClick={applyDiscount}>
            Apply
          </button>
          {discountMessage && <div className="mt-2 text-center">{discountMessage}</div>}
        </div>

        {loading && (
          <div className="text-center py-5">
            <FaSpinner className="fa-spin me-2" />
            {loading}
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">
            <FaExclamationTriangle className="me-2" />
            Error loading products: {error}
          </div>
        )}

        <h2 className="mb-4 text-center">Available Products</h2>

        {!loading && !error && filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4>No products found</h4>
            <p>Try adjusting your search</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((product, index) => (
              <div className="col-md-6 col-lg-4 col-xl-3" key={index}>
                <div className="card h-100 shadow-sm border-0 overflow-hidden">
                  <div className="product-image-container">
                    <img 
                      src={img_url + product.product_photo} 
                      alt={product.product_name}
                      className="card-img-top product-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.product_name}</h5>
                    <p className="card-text text-muted flex-grow-1">
                      {product.product_description.substring(0, 100)}...
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        {validDiscount && (
                          <span className="text-muted text-decoration-line-through me-2">
                            {formatPrice(product.product_cost)}
                          </span>
                        )}
                        <span className={validDiscount ? "text-danger fw-bold" : "text-warning fw-bold"}>
                          {formatPrice(getDiscountedPrice(product.product_cost))}
                        </span>
                      </div>
                    </div>
                    <div className="d-grid gap-2 mt-3">
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/mpesapayment', { 
                          state: { 
                            product, 
                            discount: getDiscountedPrice(product.product_cost),
                            discountCode: validDiscount ? discountCode : null
                          } 
                        })}
                      >
                        <FaShoppingCart className="me-2" />
                        Buy Now
                      </button>
                      <button 
                        className="btn btn-outline-success"
                        onClick={() => navigate(`/review/${product.id}`)}
                      >
                        ✍️ Leave a Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Getproducts;
