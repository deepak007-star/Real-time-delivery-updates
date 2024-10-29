const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    orderDetails:Array,
    status:{
        type:String,
        default:'pending',
    },
    updatedAt: Date
})
const Order = mongoose.model('Order',orderSchema);
module.exports = Order;