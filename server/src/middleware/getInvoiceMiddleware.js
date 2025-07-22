const Invoice = require("../models/Invoice");

const getInvoice = async (req, res, next) => {
  let invoice;
  try {
    invoice = await Invoice.findById(req.params.id)
      .populate('patientId', 'name phone')
      .populate('treatment');
    if (invoice == null) {
      return res.status(404).json({ message: 'Cannot find invoice' });
    }
  } catch (err) {
    // Handle invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Invoice ID format' });
    }
    return res.status(500).json({ message: err.message });
  }
  res.invoice = invoice;
  next();
}

module.exports = getInvoice;