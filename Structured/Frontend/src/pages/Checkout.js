import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addOrder } from '../store/ordersSlice';
import { clearCart } from '../store/cartSlice';

const Checkout = () => {
  const { items } = useSelector(state => state.cart);
  const { products } = useSelector(state => state.products);
  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getSaleProducts = () => {
    return products.slice(0, 6).map(p => p._id);
  };

  const getItemPrice = (item) => {
    const saleProductIds = getSaleProducts();
    const isOnSale = saleProductIds.includes(item.productId);
    return isOnSale ? item.price * 0.5 : item.price;
  };
  
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    mobile: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const deliveryCharge = 45;
  const subtotal = items.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  const total = subtotal + deliveryCharge;

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'Net Banking') {
      setShowPaymentOptions(true);
    } else {
      setShowPaymentOptions(false);
      handleOrderSubmit(method);
    }
  };

  const handlePaymentOptionSelect = (option) => {
    if (option === 'GPay') {
      // Try Razorpay link first, fallback to UPI
      const amount = Math.round(total);
      
      // Option 1: Direct UPI payment (if you have UPI ID)
      const upiId = 'officialmehar601-1@okicici'; // Your actual UPI ID
      const upiUrl = `upi://pay?pa=${upiId}&pn=MemuStore&am=${amount}&cu=INR&tn=Order%20Payment%20MemuStore`;
      
      // Check if mobile device for UPI
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Try UPI direct payment on mobile
        window.location.href = upiUrl;
      } else {
        // For desktop, show payment instructions
        alert(`Please pay Rs.${amount} to UPI ID: ${upiId}\n\nOr scan QR code on your mobile device.`);
      }
      
      // Show confirmation dialog after payment
      setTimeout(() => {
        const paymentConfirmed = window.confirm('Have you completed the payment? Click OK if payment is successful.');
        if (paymentConfirmed) {
          handleOrderSubmit('GPay Payment via Razorpay');
        }
      }, 5000);
    } else {
      // Other payment methods
      const paymentUrl = `upi://pay?pa=merchant@${option.toLowerCase()}&pn=MemuStore&am=${total}&cu=INR&tn=Order%20Payment`;
      window.open(paymentUrl, '_blank');
      
      setTimeout(() => {
        handleOrderSubmit(`${option} Payment`);
      }, 3000);
    }
  };

  const handleOrderSubmit = async (selectedPaymentMethod) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const orderData = {
        orderItems: items.map(item => ({
          product: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: shippingData,
        paymentMethod: selectedPaymentMethod,
        totalPrice: total
      };

      await axios.post('/api/orders', orderData, config);
      
      // Add order to local orders state
      dispatch(addOrder({
        items: items,
        total: total.toFixed(2),
        shippingAddress: shippingData
      }));
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/orders');
      }, 2000);
    } catch (error) {
      alert('Error placing order');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
  };

  if (!user) {
    return <div className="container">Please login to checkout</div>;
  }

  return (
    <div className="container">
      <h1>Checkout</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h3>Order Summary</h3>
          {items.map(item => {
            const itemPrice = getItemPrice(item);
            const isOnSale = getSaleProducts().includes(item.productId);
            return (
              <div key={item.productId} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                {item.name} x {item.quantity} = 
                {isOnSale ? (
                  <span>
                    <span style={{textDecoration: 'line-through', color: '#999', marginLeft: '0.5rem'}}>
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span style={{color: '#ff4757', fontWeight: 'bold', marginLeft: '0.5rem'}}>
                      Rs.{(itemPrice * item.quantity).toFixed(2)}
                    </span>
                  </span>
                ) : (
                  <span style={{marginLeft: '0.5rem'}}>Rs.{(itemPrice * item.quantity).toFixed(2)}</span>
                )}
              </div>
            );
          })}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Delivery Charge:</span>
              <span>Rs.{deliveryCharge.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
              <span>Total:</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <h3>Shipping Address</h3>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              value={shippingData.address}
              onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              value={shippingData.city}
              onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Postal Code:</label>
            <input
              type="text"
              value={shippingData.postalCode}
              onChange={(e) => setShippingData({...shippingData, postalCode: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              value={shippingData.country}
              onChange={(e) => setShippingData({...shippingData, country: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Mobile Number:</label>
            <input
              type="tel"
              value={shippingData.mobile}
              onChange={(e) => setShippingData({...shippingData, mobile: e.target.value})}
              placeholder="+1 234 567 8900"
              required
            />
          </div>
          
          <h3>Payment Method</h3>
          <div className="payment-methods">
            <div 
              className={`payment-option ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('Cash on Delivery')}
            >
              <i className="fa-solid fa-money-bill"></i>
              <span>Cash on Delivery</span>
            </div>
            <div 
              className={`payment-option ${paymentMethod === 'Net Banking' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodSelect('Net Banking')}
            >
              <i className="fa-solid fa-credit-card"></i>
              <span>Net Banking</span>
            </div>
          </div>
          
          {showPaymentOptions && (
            <div className="payment-options">
              <h4>Select Payment App</h4>
              <div className="payment-apps">
                <div className="payment-app" onClick={() => handlePaymentOptionSelect('GPay')}>
                  <span>GPay</span>
                  <span>Rs.{total.toFixed(2)}</span>
                </div>
                <div className="payment-app" onClick={() => handlePaymentOptionSelect('Paytm')}>
                  <span>Paytm</span>
                  <span>Rs.{total.toFixed(2)}</span>
                </div>
                <div className="payment-app" onClick={() => handlePaymentOptionSelect('PhonePe')}>
                  <span>PhonePe</span>
                  <span>Rs.{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">✓</div>
            <h3>Order Placed Successfully!</h3>
            <p>Thank you for your order. You will be redirected to your orders page.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;