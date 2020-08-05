const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const PaymentController = require('../controllers/payment.controller');
router.get('/user', UserController.getUserById);
router.post('/user/new-order', UserController.newOrder);
router.get('/user/paid', UserController.paid);
module.exports = router;

router.get("/user/payment/health", PaymentController.health);
router.all("/user/handleShopperRedirect", PaymentController.handleShopperRedirect);
router.get("/user/config", PaymentController.config);
router.post("/user/getPaymentMethods", PaymentController.getPaymentMethods);
router.post("/user/initiatePayment", PaymentController.initiatePayment);
router.post("/user/submitAdditionalDetails", PaymentController.submitAdditionalDetails);

