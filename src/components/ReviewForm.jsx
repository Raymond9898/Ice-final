import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const recognition = useMemo(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return null;
    }
    const instance = new SpeechRecognition();
    instance.lang = 'en-US';
    instance.interimResults = false;
    instance.continuous = false;
    return instance;
  }, []);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event) => {
      const transcript = event.results[0][0].transcript;
      setReviewText(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    const handleError = (event) => {
      console.error('Speech recognition error', event.error);
      setError('Voice input failed. Please try again or type your review.');
      setIsListening(false);
    };

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('end', () => setIsListening(false));

    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('error', handleError);
      recognition.removeEventListener('end', () => setIsListening(false));
      recognition.stop();
    };
  }, [recognition]);

  const handleStartListening = () => {
    if (!recognition) {
      setError('Voice input is not supported in your browser');
      return;
    }
    setIsListening(true);
    try {
      recognition.start();
    } catch (err) {
      console.error('Recognition start error:', err);
      setIsListening(false);
      setError('Could not start voice input. Please refresh and try again.');
    }
  };

  const handleStopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const reviewData = {
      product_id: productId,
      rating,
      review_text: reviewText.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      await axios.post('https://your-backend.com/api/submit_review', reviewData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingHover = (hoverRating) => {
    if (rating === 0) {
      const stars = document.querySelectorAll('.star');
      stars.forEach((_, index) => {
        stars[index].classList.toggle('text-warning-hover', index < hoverRating);
      });
    }
  };

  const handleRatingLeave = () => {
    if (rating === 0) {
      const stars = document.querySelectorAll('.star');
      stars.forEach(star => star.classList.remove('text-warning-hover'));
    }
  };

  return (
    <div className="review-form p-4 rounded shadow-sm">
      <h2 className="mb-4 text-center">Leave a Review</h2>
      <AnimatePresence>
        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error && (
              <motion.div 
                className="alert alert-danger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div className="rating mb-4">
              <label className="form-label mb-2">Rating:</label>
              <div className="stars d-flex justify-content-center" role="radiogroup">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    className={`star btn p-0 mx-1 ${rating >= star ? 'text-warning' : 'text-secondary'}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                    onMouseLeave={handleRatingLeave}
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    aria-checked={rating === star}
                    role="radio"
                    style={{ fontSize: '2rem', background: 'none', border: 'none' }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    &#9733;
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="reviewText" className="form-label mb-2">Review:</label>
              <motion.textarea
                id="reviewText"
                ref={textareaRef}
                className="form-control p-3"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                required
                rows="5"
                whileFocus={{
                  borderColor: '#4ecdc4',
                  boxShadow: '0 0 0 0.2rem rgba(78, 205, 196, 0.25)'
                }}
              />
            </div>

            {recognition && (
              <div className="mb-4 d-flex gap-2">
                <motion.button
                  type="button"
                  onClick={isListening ? handleStopListening : handleStartListening}
                  className={`btn flex-grow-1 ${isListening ? 'btn-danger' : 'btn-success'}`}
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isListening ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Listening...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-mic me-2"></i>
                      Voice Input
                    </>
                  )}
                </motion.button>

                {reviewText && (
                  <motion.button
                    type="button"
                    onClick={() => setReviewText('')}
                    className="btn btn-outline-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Clear review text"
                  >
                    Clear
                  </motion.button>
                )}
              </div>
            )}

            <div className="d-grid">
              <motion.button
                type="submit"
                className="btn btn-primary py-2"
                disabled={isSubmitting || !reviewText.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            className="alert alert-success mt-4 p-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h4 className="mb-3">Thank you for your review!</h4>
            <div className="d-flex justify-content-center mb-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`fs-4 ${i < rating ? 'text-warning' : 'text-secondary'}`}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <p className="lead">{reviewText}</p>
            <motion.button
              onClick={() => setSubmitted(false)}
              className="btn btn-outline-primary mt-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Another Review
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ReviewForm.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ReviewForm;