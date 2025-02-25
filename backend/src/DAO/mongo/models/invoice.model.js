import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
});

export default mongoose.model('invoices', invoiceSchema);
