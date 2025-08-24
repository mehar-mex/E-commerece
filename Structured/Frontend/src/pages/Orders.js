import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cancelOrder } from '../store/ordersSlice';

const Orders = () => {
  const { orders } = useSelector(state => state.orders);
  const dispatch = useDispatch();
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  const [expandedOrder, setExpandedOrder] = React.useState(null);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [orderToCancel, setOrderToCancel] = React.useState(null);

  // Auto-refresh every 10 seconds to update tracking status
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCancelOrder = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    dispatch(cancelOrder(orderToCancel));
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const getShipmentSteps = (status) => {
    const steps = ['Processing', 'Shipped', 'In Transit', 'Delivered'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const generateShipmentStatus = (orderDate) => {
    const now = new Date();
    const orderTime = new Date(orderDate);
    const timeDiff = now - orderTime; // milliseconds
    
    const thirtySeconds = 30 * 1000;
    const oneHour = 60 * 60 * 1000;
    const sixtyHours = 60 * 60 * 60 * 1000;
    
    if (timeDiff >= sixtyHours) {
      return 'Delivered';
    } else if (timeDiff >= oneHour) {
      return 'In Transit';
    } else if (timeDiff >= thirtySeconds) {
      return 'Shipped';
    } else {
      return 'Processing';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="container">
        <h2>Your Orders</h2>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No orders found. Start shopping to see your orders here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Your Orders</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <div className="order-info">
                <span className="order-date">
                  {new Date(order.date).toLocaleDateString()}
                </span>
                <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                {order.status === 'Completed' && (
                  <button 
                    onClick={() => handleCancelOrder(order.id)}
                    className="btn btn-cancel"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
            <div className="order-items">
              {order.items.map(item => (
                <div key={item._id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total: ${order.total}</strong>
            </div>
            <div className="product-details-section">
              <button 
                className="details-toggle"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <span>Product Details</span>
                <span className={`arrow ${expandedOrder === order.id ? 'expanded' : ''}`}>▼</span>
              </button>
              {expandedOrder === order.id && (
                <div className="order-details-expanded">
                  <div className="order-summary">
                    <h4>Order Summary</h4>
                    <p><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Order ID:</strong> #{order.id}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                  </div>
                  {order.shippingAddress && (
                    <div className="shipping-info">
                      <h4>Shipping Address</h4>
                      <p><strong>Address:</strong> {order.shippingAddress.address}</p>
                      <p><strong>City:</strong> {order.shippingAddress.city}</p>
                      <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
                      <p><strong>Country:</strong> {order.shippingAddress.country}</p>
                      <p><strong>Mobile Number:</strong> {order.shippingAddress.mobile}</p>
                    </div>
                  )}
                  <div className="products-list">
                    <h4>Products Ordered</h4>
                    {order.items.map(item => (
                      <div key={item._id} className="order-product-item">
                        <img src={item.image} alt={item.name} className="product-thumb" />
                        <div className="product-info">
                          <h5>{item.name}</h5>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: ${item.price}</p>
                          <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="tracking-section">
              <div className="tracking-header">
                <h4>Shipment Tracking</h4>
                <span className="tracking-id">ID: {order.trackingId || `TRK${order.id.toString().slice(-8)}`}</span>
              </div>
              {order.status === 'Cancelled' ? (
                <div className="cancelled-message">
                  <div className="cancelled-icon">❌</div>
                  <span className="cancelled-text">Order is Cancelled</span>
                </div>
              ) : (
                <div className="tracking-progress">
                  {getShipmentSteps(generateShipmentStatus(order.date)).map((step, index) => (
                    <div key={index} className={`tracking-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                      <div className="step-icon">
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <span className="step-name">{step.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="cancel-modal">
            <h3>Cancel Order</h3>
            <p>Are you sure you want to cancel this order?</p>
            <div className="modal-buttons">
              <button 
                onClick={closeCancelModal}
                className="btn btn-secondary"
              >
                No, Keep Order
              </button>
              <button 
                onClick={confirmCancelOrder}
                className="btn btn-danger"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;