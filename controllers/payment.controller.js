const {
  createCheckoutSession,
  addPaymentRecord,
  getAllMyPayments,
  getAllPayments,
} = require("../services/paymentService");

// create a checkout session
exports.createCheckoutSession = async (req, res) => {
  const { paperId, amount } = req.body;
  return await createCheckoutSession(paperId, amount, res);
};

// add payment record
exports.addPaymentRecord = async (req, res) => {
  try {
    const response = await addPaymentRecord(req.body.paperId, req.user.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const response = await getAllPayments();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all my payments
exports.getAllMyPayments = async (req, res) => {
  try {
    const response = await getAllMyPayments(req.user.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
