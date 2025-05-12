import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row g-4">
          {/* About Section */}
          <div className="col-lg-6 col-md-6">
            <h5 className="text-uppercase mb-4" style={{ color: '#0dcaf0' }}>❄️ Ice Jewelz</h5>
            <p>
              Crafting exquisite ice-inspired jewelry that captures the ephemeral beauty of frozen elegance. 
              Each piece is a unique work of art, blending craftsmanship with contemporary design.
            </p>
            <div className="social-icons mt-4">
              <a href="https://facebook.com" className="text-white me-3" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-white me-3" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-white me-3" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="https://pinterest.com" className="text-white me-3" aria-label="Pinterest">
                <FaPinterest size={20} />
              </a>
              <a href="https://youtube.com" className="text-white" aria-label="YouTube">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-lg-6 col-md-6">
            <h5 className="text-uppercase mb-4" style={{ color: '#0dcaf0' }}>Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <FaMapMarkerAlt className="mt-1 me-3" />
                <span>123 Ice Avenue, Nairobi CBD, Kenya</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="me-3" />
                <span>+254 700 123 456</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="me-3" />
                <span>info@icejewelz.com</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaClock className="me-3" />
                <span>Mon-Fri: 9AM - 6PM | Sat: 10AM - 4PM</span>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div className="mt-4">
              <h6 className="text-uppercase mb-3">Stay Updated</h6>
              <form className="d-flex">
                <input
                  type="email"
                  className="form-control rounded-0"
                  placeholder="Your email"
                  aria-label="Email"
                />
                <button
                  type="submit"
                  className="btn btn-primary rounded-0"
                  style={{ backgroundColor: '#0dcaf0', borderColor: '#0dcaf0' }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Copyright Section */}
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Ice Jewelz. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0">
              Crafted with ❤️ by <a href="#" className="text-white">Raymond</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;