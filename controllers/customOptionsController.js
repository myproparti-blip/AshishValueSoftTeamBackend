import CustomOption from "../models/customOptionsModel.js";

// Delete a custom option (only for the logged-in user who created it)

// Get all custom options for a type (filtered by current user)
export const getCustomOptions = async (req, res) => {
  try {
    const { type } = req.params;
    const requestUser = req.user;

    // Validate type
    const validTypes = ["banks", "cities", "dsas", "engineers"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid type. Must be banks, cities, dsas, or engineers",
        });
    }

    // Filter by current client and user
    const query = { 
      clientId: requestUser.clientId,
      type,
      createdBy: requestUser?.username || null
    };

    const options = await CustomOption.find(query)
      .sort({ createdAt: -1 })
      .select("value")
      .lean();

    res.status(200).json({
      success: true,
      data: options.map((opt) => opt.value),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching custom options",
      error: err.message,
    });
  }
};

// Add a custom option
export const addCustomOption = async (req, res) => {
  try {
    const { type } = req.params;
    const { value } = req.body;
    const requestUser = req.user;

    // Validate type
    const validTypes = ["banks", "cities", "dsas", "engineers"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid type. Must be banks, cities, dsas, or engineers",
        });
    }

    // Validate value
    if (!value || typeof value !== "string" || !value.trim()) {
      return res.status(400).json({
        success: false,
        message: "Value is required and must be a non-empty string",
      });
    }

    // Check if option already exists
    const existing = await CustomOption.findOne({
      clientId: requestUser.clientId,
      type,
      value: value.trim(),
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Option already exists",
        data: existing,
      });
    }

    // Create new option
    const newOption = await CustomOption.create({
      clientId: requestUser.clientId,
      type,
      value: value.trim(),
      createdBy: requestUser.username,
    });

    res.status(201).json({
      success: true,
      message: "Custom option added successfully",
      data: newOption,
    });
  } catch (err) {
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Option already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error adding custom option",
      error: err.message,
    });
  }
};

// Delete a custom option
export const deleteCustomOption = async (req, res) => {
  try {
    const { type, value } = req.params;
    const requestUser = req.user;

    // Validate type
    const validTypes = ["banks", "cities", "dsas", "engineers"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Must be banks, cities, dsas, or engineers",
      });
    }

    // Validate value
    if (!value) {
      return res.status(400).json({
        success: false,
        message: "Value is required",
      });
    }

    // Delete only if created by the current user in the current client
    const result = await CustomOption.deleteOne({
     clientId: requestUser.clientId,
     type,
     value: decodeURIComponent(value),
     createdBy: requestUser?.username,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Option not found or you don't have permission to delete it",
      });
    }

    // Clear cache after deletion
    res.status(200).json({
      success: true,
      message: "Custom option deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting custom option",
      error: err.message,
    });
  }
};
