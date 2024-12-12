const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/payment.controller");
const { isAuth, isAdmin, isStudent } = require("../../auth-middleware/check");

// create checkout session
router.post(
  "/create-checkout-session",
  isAuth,
  isStudent,
  paymentController.createCheckoutSession
);

// create payment record
router.post("/", isAuth, isStudent, paymentController.addPaymentRecord);

// get all my payment record
router.get("/my", isAuth, isStudent, paymentController.getAllMyPayments);

// get all payment records for admin
router.get("/", isAuth, isAdmin, paymentController.getAllPayments);

module.exports = router;
