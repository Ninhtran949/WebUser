const validateCartInput = (req, res, next) => {
  const { userClient, idProduct, numberProduct } = req.body;
  
  if (!userClient || !idProduct || !numberProduct) {
    return res.status(400).json({ 
      message: 'userClient, idProduct and numberProduct are required' 
    });
  }

  if (numberProduct < 1) {
    return res.status(400).json({ 
      message: 'numberProduct must be greater than 0' 
    });
  }

  next();
};

module.exports = validateCartInput;