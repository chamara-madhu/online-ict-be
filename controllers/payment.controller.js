const {
  createCheckoutSession,
  addPaymentRecord,
} = require("../services/paymentService");

// create a checkout session
exports.createCheckoutSession = async (req, res) => {
  const { paperId, amount } = req.body;
  return await createCheckoutSession(paperId, amount, res);
};

// add successful payment record
exports.addPaymentRecord = async (req, res) => {
  try {
    const response = await addPaymentRecord(req.body.paperId, req.user.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
