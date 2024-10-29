const express = require('express')
const app = express();
const https = require('https')
const mongoose = require('mongoose')
const fs = require('fs')
const socketIo = require('socket.io')
const connectDb= require('./config/connect');
const router = require('./routes');
const authenticate = require('./middleware/authMiddleware');
const Order = require('./models/Order')
const cors = require('cors')
require('dotenv').config()

app.use(express.json())

app.use(cors())
app.use('/user',router)
app.get('/',(req, res)=>{
    console.log("hello express")
})
const sslOptions = {
    key:fs.readFileSync('key.pem'),
    cert:fs.readFileSync('cert.pem')
}
const server = https.createServer(sslOptions, app);
const io = socketIo(server,{
  cors:{
    origin:"https://localhost:5173",
    methods:["GET","POST"]
  }
});

// route for posting update-order
app.post('/update-order', authenticate, async (req, res) => {
    const { orderId, status } = req.body;
    const { role } = req.user;
  
    if (role !== 'staff') {
      return res.status(403).json({ message: 'Permission denied' });
    }
    console.log(orderId)

    const updatedOrder = await Order.findOneAndUpdate({ _id:orderId }, { status, updatedAt: new Date() }, { new: true });
    console.log(updatedOrder);
    
    if (updatedOrder) {
      io.emit('orderUpdate', updatedOrder); // Emit real-time updates
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  });

io.on('connection', (socket)=>{
    console.log("new user connected")
    socket.on('authenticate', (token) => {
        try {
          const user = jwt.verify(token, process.env.JWT); 
          socket.user = user; 
        } catch (err) {
          console.log('Authentication failed', err);
          socket.emit('error', 'Authentication failed');
          socket.disconnect();
        }
      });
    
      // Only allow staff to update order status
      socket.on('updateOrder', (data) => {
        if (socket.user && socket.user.role === 'staff') {
          io.emit('orderUpdate', data); 
        } else {
          socket.emit('error', 'Permission denied');
        }
      });
    socket.on('dissconnect',()=>{
        console.log("user disconnected")
    })
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, async()=>{
    try {
        await connectDb();
        console.log("server running");
    } catch (error) {
        console.log(`failed to load server error:${error.message}`);
    }
})