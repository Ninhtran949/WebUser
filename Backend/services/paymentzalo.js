// paymentzalo.js
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const express = require('express');
const router = express.Router();

// ZaloPay configuration
const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
  // Update these URLs to match your environment
  callback_url: process.env.ZALOPAY_CALLBACK_URL || 'https://your-backend-url.com/zalopay/callback',
  redirect_url: process.env.ZALOPAY_REDIRECT_URL || 'https://your-frontend-url.com/payment-result',
};

// Create payment endpoint
router.post('/payment', async (req, res) => {
    const { app_user, amount, description } = req.body;
    
    // Validate required fields
    if (!amount || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const embed_data = {
        redirecturl: config.redirect_url,
    };
  
    const items = [];
    const transID = Math.floor(Math.random() * 1000000);
  
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: app_user || 'guest',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      callback_url: config.callback_url,
      description,
      bank_code: '',
      return_url: config.redirect_url,
    };
  
    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
    try {
      const result = await axios.post(config.endpoint, null, { params: order });
      console.log("Order created:", {
        app_trans_id: order.app_trans_id,
        amount: order.amount,
        description: order.description,
        order_url: result.data.order_url
      });
      
      return res.status(200).json({
        ...result.data,
        app_trans_id: order.app_trans_id
      });
    } catch (error) {
      console.error("Payment creation error:", error.response ? error.response.data : error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Return endpoint for ZaloPay to call when payment is completed
router.get('/return', (req, res) => {
  const { status, apptransid } = req.query;
  console.log('Received return request:', req.query);

  // Build URL to redirect to the frontend with necessary parameters
  const redirectUrl = `yourapp://paymentresult?status=${status}&apptransid=${apptransid}`;

  // For web applications, you might want to redirect to a specific page instead
  // const webRedirectUrl = `${config.redirect_url}?status=${status}&apptransid=${apptransid}`;
  
  // Redirect to the app or web page
  res.redirect(redirectUrl);
});

// Callback endpoint for ZaloPay to call when payment is successful
router.post('/callback', (req, res) => {
  let result = {};
  console.log('Received callback data:', req.body);
  
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log('Client MAC:', reqMac);
    console.log('Server MAC:', mac);

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = 'mac not equal';
    } else {
      let dataJson = JSON.parse(dataStr);
      console.log("Payment successful for app_trans_id:", dataJson['app_trans_id']);

      // Here you would update the order status in your database
      // For example: updateOrderStatus(dataJson['app_trans_id'], 'success');

      result.return_code = 1;
      result.return_message = 'success';
    }
  } catch (ex) {
    console.error('Callback error:', ex.message);
    result.return_code = 0;
    result.return_message = ex.message;
  }

  // Return response to ZaloPay
  res.json(result);
});

// Check payment status endpoint
router.post('/check-status-order', async (req, res) => {
  const { app_trans_id } = req.body;

  if (!app_trans_id) {
    return res.status(400).json({ error: 'Missing app_trans_id' });
  }

  let postData = {
    app_id: config.app_id,
    app_trans_id,
  };

  let data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: 'post',
    url: 'https://sb-openapi.zalopay.vn/v2/query',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    console.log('Payment status check result:', result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Payment status check error:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
