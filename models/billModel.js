import mongoose from "mongoose";
const billItemSchema = new mongoose.Schema({
  particulars: { type: String, required: true },
  hsn: { type: String, default: "" },
  gstRate: { type: Number, default: 0 },
  amount: { type: Number, required: true },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  itemTotal: { type: Number, required: true }
}, { _id: false });
const bankDetailsSchema = new mongoose.Schema({
  beneficiary: { type: String, default: "" },
  bankName: { type: String, default: "" },
  accountNo: { type: String, default: "" },
  ifscCode: { type: String, default: "" }
}, { _id: false });
const selectedRecordSchema = new mongoose.Schema({
  clnt: { type: String, default: "" },
  addr: { type: String, default: "" },
  mobile: { type: String, default: "" },
  bank: { type: String, default: "" },
  city: { type: String, default: "" },
  fee: { type: String, default: "" },
  leadNumber: { type: String, default: "" },
  _id: { type: String, default: "" }
}, { _id: false });
const billSchema = new mongoose.Schema({
  clientId: { type: String, required: true, index: true },
  billNumber: { type: String, required: true },
  billMonth: { type: String, required: true },
  billDate: { type: String, required: true },
    vendorName: { type: String, required: true },
  vendorAddress: { type: String, required: true },
  vendorPan: { type: String, default: "" },
  vendorGst: { type: String, default: "" },
    billToName: { type: String, required: true },
  billToAddress: { type: String, required: true },
  billToGstin: { type: String, default: "" },
  billToPan: { type: String, default: "" },
    items: [billItemSchema],
     selectedRecords: [selectedRecordSchema],
     totalAmount: { type: Number, default: 0 },
    totalCgst: { type: Number, default: 0 },
    totalSgst: { type: Number, default: 0 },
    totalIgst: { type: Number, default: 0 },
    totalGst: { type: Number, default: 0 },
    totalAmountInWords: { type: String, default: "" },
    grandTotal: { type: Number, default: 0 },
    otherReference: { type: String, default: "" },
  billFinancialYear: { type: String, default: "" },
    bankDetails: bankDetailsSchema,
    declaration: { type: String, default: "" },
    signerName: { type: String, default: "" },
  signatureDate: { type: String, default: "" },
  place: { type: String, default: "" },
    status: {
    type: String,
    enum: ["draft", "approved", "rejected", "archived"],
    default: "draft"
  },
  
  username: { type: String, required: true },
  lastUpdatedBy: { type: String, default: "" },
  lastUpdatedByRole: { type: String, default: "" },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
billSchema.index({ clientId: 1, billNumber: 1 }, { unique: true });
billSchema.index({ billNumber: 1 });
billSchema.index({ username: 1 });
billSchema.index({ createdAt: -1 });

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
