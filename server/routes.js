const express = require('express');
const { register, login } = require('./controllers/user');
const authenticate = require('./middleware/authMiddleware');
const { createOrder, getOrder } = require('./controllers/orders');
const router = express.Router();

router.route('/auth/register').post(register)
router.route('/auth/login').post(login)

router.post('/order', authenticate, createOrder);
router.get('/order', authenticate, getOrder);

module.exports = router;

