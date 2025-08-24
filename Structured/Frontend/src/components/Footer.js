import React from 'react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="back-to-top" onClick={scrollToTop}>
        Back to top
      </div>
      
      <div className="footer-content">
        <div className="footer-section">
          <h4>Get to Know Us</h4>
          <ul>
            <li><a href="#about">About MemuStore</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press Releases</a></li>
            <li><a href="#science">MemuStore Science</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect with Us</h4>
          <ul>
            <li><a href="#facebook">Facebook</a></li>
            <li><a href="#twitter">Twitter</a></li>
            <li><a href="#instagram">Instagram</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Make Money with Us</h4>
          <ul>
            <li><a href="#sell">Sell on MemuStore</a></li>
            <li><a href="#accelerator">Sell under MemuStore Accelerator</a></li>
            <li><a href="#brand">Protect and Build Your Brand</a></li>
            <li><a href="#global">MemuStore Global Selling</a></li>
            <li><a href="#supply">Supply to MemuStore</a></li>
            <li><a href="#affiliate">Become an Affiliate</a></li>
            <li><a href="#fulfillment">Fulfilment by MemuStore</a></li>
            <li><a href="#advertise">Advertise Your Products</a></li>
            <li><a href="#pay">MemuStore Pay on Merchants</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Let Us Help You</h4>
          <ul>
            <li><a href="#account">Your Account</a></li>
            <li><a href="#returns">Returns Centre</a></li>
            <li><a href="#recalls">Recalls and Product Safety Alerts</a></li>
            <li><a href="#protection">100% Purchase Protection</a></li>
            <li><a href="#app">MemuStore App Download</a></li>
            <li><a href="#help">Help</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-services">
        <div className="service-item">
          <h5>MeBooks</h5>
          <p>Books, art & collectibles</p>
        </div>
        <div className="service-item">
          <h5>MemuStore Web Services</h5>
          <p>Scalable Cloud Computing Services</p>
        </div>
        <div className="service-item">
          <h5>Audible</h5>
          <p>Download Audio Books</p>
        </div>
        <div className="service-item">
          <h5>Shopbop</h5>
          <p>Designer Fashion Brands</p>
        </div>
        <div className="service-item">
          <h5>MemuStore Business</h5>
          <p>Everything For Your Business</p>
        </div>
        <div className="service-item">
          <h5>Prime Now</h5>
          <p>2-Hour Delivery on Everyday Items</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-links">
          <a href="#conditions">Conditions of Use & Sale</a>
          <a href="#privacy">Privacy Notice</a>
          <a href="#ads">Interest-Based Ads</a>
        </div>
        <div className="footer-copyright">
          © 1996-2025, MemuStore.com, Inc. or its affiliates
        </div>
      </div>
    </footer>
  );
};

export default Footer;