const Order = require('../models/Order')

const createOrder=async (req, res) => {
    const { orderDetails } = req.body;
    const newOrder = new Order({
      customerId:req.user.userId,
      orderDetails,
      status: 'Pending',  // Initial status
      createdAt: new Date(),
    });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', newOrder });
  };

const getOrder = async(req, res)=>{
  
  let orders;
    
    if (req.user.role === 'staff') {
      orders = await Order.find({});
    } else if (req.user.role === 'customer') {
      orders = await Order.find({ customerId: req.user.userId });
    } else {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json(orders);

}
module.exports = {createOrder,getOrder};
  