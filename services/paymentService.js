const { PRICE_PER_PAPER, PROMOTION_RATE } = require("../config/constant");
const { pay } = require("../config/stripe");
const stripe = require("stripe")(pay.STRIPE_SECRET_KEY);
const Payment = require("../models/payment.model");

class paymentService {
  async createCheckoutSession(paperId, amount, res) {
    stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "LKR",
              product_data: {
                name: "Paper Fee",
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1, // Set the quantity of this item
          },
        ],
        mode: "payment",
        success_url: `http://localhost:5173/payment/success/${paperId}`,
        cancel_url: `http://localhost:5173/mcq/buy/paper/${paperId}`,
      },
      (err, session) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to create checkout session" });
        } else {
          res.status(200).json({ sessionId: session.id });
        }
      }
    );
  }

  async addPaymentRecord(paperId, userId) {
    const payment = new Payment({
      paper: paperId,
      user: userId,
      amount: PRICE_PER_PAPER * (1 - PROMOTION_RATE),
    });
    return await payment.save();
  }

  async getAllMyPayments(userId) {
    return await Payment.find({
      user: userId,
    }).populate("paper", "longName");
  }

  async getAllPayments() {
    return await Payment.find()
      .populate("paper", "longName")
      .populate("user", "name email");
  }
}

module.exports = new paymentService();
