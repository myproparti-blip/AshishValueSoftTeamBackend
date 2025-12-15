import Bill from "../models/billModel.js";

// CREATE BILL
export const createBill = async (req, res) => {
  try {
    const requestUser = req.user;

    // Authorization: Only managers and admin can create bills
    if (requestUser.role !== "manager" && requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Only managers and admin can create bills",
      });
    }

    console.log("[billController] Creating bill with request data:", {
      hasSelectedRecords: !!req.body.selectedRecords,
      selectedRecordsCount: req.body.selectedRecords?.length || 0,
      selectedRecords: req.body.selectedRecords
    });

    // Generate bill number if not provided
    let billNumber = req.body.billNumber;
    if (!billNumber) {
      const count = await Bill.countDocuments({ clientId: requestUser.clientId });
      billNumber = `BILL-${Date.now()}-${count + 1}`;
    }

    const billData = {
      ...req.body,
      billNumber,
      clientId: requestUser.clientId,
      username: requestUser.username,
      status: "draft",
      lastUpdatedBy: requestUser.username,
      lastUpdatedByRole: requestUser.role,
    };

    // Calculate totals
    if (billData.items && Array.isArray(billData.items)) {
      let totalAmount = 0;
      let totalCgst = 0;
      let totalSgst = 0;
      let totalIgst = 0;

      billData.items.forEach((item) => {
        totalAmount += item.amount || 0;
        totalCgst += item.cgst || 0;
        totalSgst += item.sgst || 0;
        totalIgst += item.igst || 0;
      });

      billData.totalAmount = totalAmount;
      billData.totalCgst = totalCgst;
      billData.totalSgst = totalSgst;
      billData.totalIgst = totalIgst;
      billData.totalGst = totalCgst + totalSgst + totalIgst;
      billData.grandTotal = totalAmount + billData.totalGst;
    }

    const newBill = await Bill.create(billData);

    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: newBill,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating bill",
      error: err.message,
    });
  }
};

// GET BILL BY ID
export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    // Use req.user from middleware (already authenticated)
    const requestUser = req.user || {
      username: req.query.username,
      role: req.query.userRole,
      clientId: req.query.clientId
    };

    const bill = await Bill.findOne({ 
      billNumber: id,
      clientId: requestUser.clientId 
    });

    if (!bill) {
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });
    }

    // Authorization: Users can only see their own bills
    if (requestUser.role === "user" && bill.username !== requestUser.username) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You can only view your own bills",
      });
    }

    // Managers can view user bills and their own
    if (requestUser.role === "manager") {
      const isUserBill = bill.username.toLowerCase().startsWith("user");
      const isOwnBill = bill.username === requestUser.username;

      if (!isUserBill && !isOwnBill) {
        return res.status(403).json({
          success: false,
          message: "Forbidden - You can only view user or your own bills",
        });
      }
    }

    res.status(200).json({ success: true, data: bill });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching bill",
      error: err.message,
    });
  }
};

// UPDATE BILL
export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    // Use req.user from middleware (already authenticated)
    const requestUser = req.user || {
      username: req.query.username,
      role: req.query.userRole,
      clientId: req.query.clientId
    };

    const existingBill = await Bill.findOne({ 
      billNumber: id,
      clientId: requestUser.clientId 
    });

    if (!existingBill) {
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });
    }

    // Authorization: Only managers and admin can update bills
    if (
      requestUser.role !== "manager" &&
      requestUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Only managers and admin can update bills",
      });
    }

    console.log("[billController] Updating bill with request data:", {
      hasSelectedRecords: !!req.body.selectedRecords,
      selectedRecordsCount: req.body.selectedRecords?.length || 0,
      selectedRecords: req.body.selectedRecords
    });

    let updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.billNumber; // Don't allow changing bill number

    // Recalculate totals
    if (updateData.items && Array.isArray(updateData.items)) {
      let totalAmount = 0;
      let totalCgst = 0;
      let totalSgst = 0;
      let totalIgst = 0;

      updateData.items.forEach((item) => {
        totalAmount += item.amount || 0;
        totalCgst += item.cgst || 0;
        totalSgst += item.sgst || 0;
        totalIgst += item.igst || 0;
      });

      updateData.totalAmount = totalAmount;
      updateData.totalCgst = totalCgst;
      updateData.totalSgst = totalSgst;
      updateData.totalIgst = totalIgst;
      updateData.totalGst = totalCgst + totalSgst + totalIgst;
      updateData.grandTotal = totalAmount + updateData.totalGst;
    }

    updateData.lastUpdatedBy = requestUser.username;
    updateData.lastUpdatedByRole = requestUser.role;
    updateData.updatedAt = new Date();

    const updatedBill = await Bill.findOneAndUpdate(
      { 
        billNumber: id,
        clientId: requestUser.clientId 
      },
      updateData,
      { new: true, runValidators: true }
    ).maxTimeMS(30000);

    res.status(200).json({
      success: true,
      message: "Bill updated successfully",
      data: updatedBill,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating bill",
      error: err.message,
    });
  }
};
export const getAllBills = async (req, res) => {
  try {
    const requestUser = req.user || {
      username: req.query.username,
      role: req.query.userRole,
      clientId: req.query.clientId
    };
    let query = { clientId: requestUser.clientId }; // Filter by client

    // USERS: Can only see their own bills
    if (requestUser.role === "user") {
      query.username = requestUser.username;
    }
    else if (requestUser.role === "manager" || requestUser.role === "admin") {
      if (requestUser.role === "manager") {
        query.$or = [
          { username: { $regex: "^user", $options: "i" } },
          { username: requestUser.username },
        ];
      }
      // Admin can see all bills for the client - no additional filter needed
    }

    const bills = await Bill.find(query)
      .sort({ createdAt: -1 })
      .maxTimeMS(30000)
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    const requestUser = req.user || {
      username: req.query.username,
      role: req.query.userRole,
      clientId: req.query.clientId
    };

    const existingBill = await Bill.findOne({ 
      billNumber: id,
      clientId: requestUser.clientId 
    });

    if (!existingBill) {
      return res
        .status(404)
        .json({ success: false, message: "Bill not found" });
    }

    if (requestUser.role !== "manager" && requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Only managers and admin can delete bills",
      });
    }

    await Bill.findOneAndDelete({ 
      billNumber: id,
      clientId: requestUser.clientId 
    });

    res.status(200).json({
      success: true,
      message: "Bill deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting bill",
      error: err.message,
    });
  }
};
