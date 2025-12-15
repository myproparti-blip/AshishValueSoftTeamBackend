import UbiShopModel from "../models/ubiShopModel.js";

export const createUbiShop = async (req, res) => {
    try {
        const { clientId, uniqueId, username, userRole } = req.body;
        const authenticatedUser = req.user?.username;
        const authenticatedRole = req.user?.role;
        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: "Missing clientId - Client identification required"
            });
        }
        if (!clientId || !uniqueId || !username) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: clientId, uniqueId, username"
            });
        }
        const existingUbiShop = await UbiShopModel.findOne({
            clientId,
            uniqueId
        });
        if (existingUbiShop) {
            return res.status(200).json({
                success: true,
                message: "UbiShop already exists (duplicate submission prevented)",
                data: existingUbiShop,
                isDuplicate: true
            });
        }

        // Data validation skipped

        const newUbiShop = new UbiShopModel({
            clientId,
            uniqueId,
            username,
            lastUpdatedBy: username,
            lastUpdatedByRole: userRole || "user",
            status: "pending",
            dateTime: new Date().toLocaleString(),
            day: new Date().toLocaleDateString("en-US", { weekday: "long" }),
            ...req.body
        });

        const savedUbiShop = await newUbiShop.save();

        res.status(201).json({
            success: true,
            message: "UbiShop created successfully",
            data: savedUbiShop
        });
    } catch (error) {
        console.error("Create UbiShop Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create UbiShop",
            error: error.message
        });
    }
};


export const getUbiShopById = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, userRole, clientId } = req.query;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }
        let ubiShop;
        try {
            ubiShop = await UbiShopModel.findOne({ uniqueId: String(id) }).lean();
        } catch (dbError) {
            return res.status(400).json({
                success: false,
                message: "Invalid request parameters"
            });
        }

        if (!ubiShop) {
            return res.status(404).json({
                success: false,
                message: "UbiShop not found"
            });
        }
        if (ubiShop.clientId !== clientId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }
        if (userRole !== "manager" && userRole !== "admin" && ubiShop.username !== username) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this UbiShop"
            });
        }

        res.status(200).json({
            success: true,
            data: ubiShop
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch UbiShop",
            error: error.message
        });
    }
};


export const getAllUbiShops = async (req, res) => {
    try {
        const { username, userRole, clientId, status, city, bankName, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: "Missing clientId - Client identification required"
            });
        }
        filter.clientId = clientId;
        if (userRole !== "manager" && userRole !== "admin") {
            filter.username = username;
        } if (status) filter.status = status;
        if (city) filter.city = city;
        if (bankName) filter.bankName = bankName;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const ubiShops = await UbiShopModel.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .lean();
        const total = await UbiShopModel.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: ubiShops,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch UbiShops",
            error: error.message
        });
    }
};

export const updateUbiShop = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, userRole, clientId } = req.query;

        // Validate ID format
        if (!id || typeof id !== 'string') {
            console.error("[updateUbiShop] Invalid ID format:", id);
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Validate required query parameters
        if (!username || !userRole || !clientId) {
            console.error("[updateUbiShop] Missing required parameters:", {
                hasUsername: !!username,
                hasUserRole: !!userRole,
                hasClientId: !!clientId
            });
            return res.status(400).json({
                success: false,
                message: "Missing required user information"
            });
        }

        console.log("[updateUbiShop] Request received:", {
            id,
            username,
            userRole,
            action: "save changes",
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Fetch existing UbiShop
        let ubiShop;
        try {
            ubiShop = await UbiShopModel.findOne({ uniqueId: String(id) }).lean();
        } catch (dbError) {
            console.error("[updateUbiShop] Database query error:", dbError.message);
            return res.status(400).json({
                success: false,
                message: "Invalid request parameters"
            });
        }

        if (!ubiShop) {
            console.error("[updateUbiShop] UbiShop not found:", id);
            return res.status(404).json({
                success: false,
                message: "UbiShop not found"
            });
        }

        // CLIENT ISOLATION - CRITICAL: Verify record belongs to requesting client
        if (ubiShop.clientId !== clientId) {
            console.error("[updateUbiShop] Client isolation violation:", {
                recordClient: ubiShop.clientId,
                requestClient: clientId
            });
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        // Permission check: User can only update their own pending/rejected/rework forms
        if (userRole !== "manager" && userRole !== "admin" && ubiShop.username !== username) {
            console.error("[updateUbiShop] User trying to update someone else's form:", {
                owner: ubiShop.username,
                requester: username
            });
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this UbiShop"
            });
        }

        // Status validation: Regular users cannot edit certain statuses
        if (userRole !== "manager" && userRole !== "admin") {
            if (!["pending", "rejected", "rework"].includes(ubiShop.status)) {
                console.error("[updateUbiShop] User cannot edit status:", ubiShop.status);
                return res.status(400).json({
                    success: false,
                    message: `Cannot edit UbiShop with status: ${ubiShop.status}`
                });
            }
        }

        console.log("[updateUbiShop] Permission check passed. Previous status:", ubiShop.status);

        // Prepare update data with proper field handling
        // IMPORTANT: Server always sets status to "on-progress" on save
        const updateData = {
            ...req.body,
            status: "on-progress",
            lastUpdatedBy: username,
            lastUpdatedByRole: userRole,
            lastUpdatedAt: new Date(),
            updatedAt: new Date()
        };

        // Remove sensitive fields if user is trying to set them directly
        if (userRole !== "admin") {
            delete updateData.managerFeedback;
            delete updateData.submittedByManager;
        }

        const updatedUbiShop = await UbiShopModel.findOneAndUpdate(
            { uniqueId: String(id) },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUbiShop) {
            console.error("[updateUbiShop] Failed to update UbiShop:", id);
            return res.status(500).json({
                success: false,
                message: "Failed to update UbiShop"
            });
        }

        console.log("[updateUbiShop] Success:", {
            ubiShopId: id,
            newStatus: updatedUbiShop.status,
            updatedAt: updatedUbiShop.lastUpdatedAt
        });

        res.status(200).json({
            success: true,
            message: "UbiShop updated successfully",
            data: updatedUbiShop
        });
    } catch (error) {
        console.error("[updateUbiShop] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update UbiShop",
            error: error.message
        });
    }
};



export const managerSubmitUbiShop = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID is not empty
        if (!id || typeof id !== 'string') {
            console.error("[managerSubmitUbiShop] Invalid ID format:", id);
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Use req.user from middleware (already authenticated), fall back to body if provided
        let action = req.body.action || req.body.status;
        const feedback = req.body.feedback || req.body.managerFeedback || "";
        const username = req.body.username || req.user.username;
        const userRole = req.body.userRole || req.user.role;
        const clientId = req.body.clientId || req.user.clientId;

        console.log("[managerSubmitUbiShop] Request received:", {
            id,
            action,
            username,
            userRole,
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Verify manager/admin role (check from middleware-provided user data)
        if (req.user.role !== "manager" && req.user.role !== "admin") {
            console.error("[managerSubmitUbiShop] Unauthorized role:", req.user.role);
            return res.status(403).json({
                success: false,
                message: "Only managers and admins can perform this action"
            });
        }

        // Validate action
        if (!["approved", "rejected"].includes(action)) {
            console.error("[managerSubmitUbiShop] Invalid action:", action);
            return res.status(400).json({
                success: false,
                message: "Invalid action. Must be 'approved' or 'rejected'"
            });
        }

        // Find UbiShop by uniqueId (explicitly as string, not ObjectId)
        let ubiShop;
        try {
            ubiShop = await UbiShopModel.findOne({ uniqueId: String(id) }).lean();
        } catch (dbError) {
            console.error("[managerSubmitUbiShop] Database query error:", dbError.message);
            return res.status(400).json({
                success: false,
                message: "Invalid request parameters",
                error: "Failed to query UbiShop"
            });
        }

        if (!ubiShop) {
            console.error("[managerSubmitUbiShop] UbiShop not found:", id);
            return res.status(404).json({
                success: false,
                message: "UbiShop not found"
            });
        }

        // CLIENT ISOLATION - CRITICAL: Verify record belongs to requesting client
        if (ubiShop.clientId !== clientId) {
            console.error("[managerSubmitUbiShop] Client isolation violation:", {
                recordClient: ubiShop.clientId,
                requestClient: clientId
            });
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        // Log the action being performed
        console.log("[managerSubmitUbiShop] Performing action:", {
            action,
            ubiShopId: id,
            previousStatus: ubiShop.status,
            hashedFeedback: feedback ? feedback.substring(0, 20) + "..." : "(empty)"
        });

        // Update UbiShop status by uniqueId (explicitly use String ID)
        const updatedUbiShop = await UbiShopModel.findOneAndUpdate(
            { uniqueId: String(id) },
            {
                status: action,
                managerFeedback: feedback.trim() || "",
                submittedByManager: true,
                lastUpdatedBy: username,
                lastUpdatedByRole: userRole,
                lastUpdatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedUbiShop) {
            console.error("[managerSubmitUbiShop] Failed to update UbiShop:", id);
            return res.status(500).json({
                success: false,
                message: "Failed to update UbiShop"
            });
        }

        console.log("[managerSubmitUbiShop] Success:", {
            action,
            newStatus: updatedUbiShop.status,
            updatedAt: updatedUbiShop.lastUpdatedAt
        });

        res.status(200).json({
            success: true,
            message: `UbiShop ${action} successfully`,
            data: updatedUbiShop
        });
    } catch (error) {
        // Handle Mongoose validation/casting errors more gracefully
        console.error("[managerSubmitUbiShop] Unexpected error:", error);
        let errorMessage = "Failed to submit UbiShop";
        if (error.name === 'MongooseError' || error.message.includes('Cast to')) {
            errorMessage = "Invalid UbiShop format or ID";
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.name === 'CastError' ? "Invalid data format" : error.message
        });
    }
};


export const requestUbiShopRework = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Use req.user from middleware (already authenticated), fall back to body if provided
        const comments = req.body.comments || "";
        const username = req.body.username || req.user.username;
        const userRole = req.body.userRole || req.user.role;
        const clientId = req.body.clientId || req.user.clientId;

        console.log("[requestUbiShopRework] Request:", { id, username, userRole, clientId: clientId?.substring(0, 8) });

        // Verify manager/admin role (check from middleware-provided user data)
        if (req.user.role !== "manager" && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only managers and admins can request rework"
            });
        }

        // Find UbiShop by _id (direct lookup first) or uniqueId (fallback)
        let ubiShop;
        // Try direct _id lookup first (regardless of format)
        try {
            ubiShop = await UbiShopModel.findById(id).lean();
            if (ubiShop) {
                console.log("[requestUbiShopRework] Found by _id");
            }
        } catch (idError) {
            console.log("[requestUbiShopRework] Not a valid ObjectId, trying uniqueId");
        }

        // Fallback: try by uniqueId
        if (!ubiShop) {
            ubiShop = await UbiShopModel.findOne({ uniqueId: String(id) }).lean();
            if (ubiShop) {
                console.log("[requestUbiShopRework] Found by uniqueId");
            }
        }

        console.log("[requestUbiShopRework] Found UbiShop:", ubiShop ? ubiShop._id : "not found");

        if (!ubiShop) {
            return res.status(404).json({
                success: false,
                message: "UbiShop not found"
            });
        }

        // CLIENT ISOLATION - CRITICAL: Verify record belongs to requesting client
        if (ubiShop.clientId !== clientId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        // Update UbiShop for rework - try _id first, then uniqueId
        let updatedUbiShop;
        const updateData = {
            status: "rework",
            reworkComments: comments || "",
            reworkRequestedBy: username,
            reworkRequestedAt: new Date(),
            reworkRequestedByRole: userRole,
            lastUpdatedBy: username,
            lastUpdatedByRole: userRole,
            lastUpdatedAt: new Date()
        };

        try {
            updatedUbiShop = await UbiShopModel.findByIdAndUpdate(id, updateData, { new: true });
        } catch (idError) {
            console.log("[requestUbiShopRework] Not a valid ObjectId, trying uniqueId for update");
            // Fallback: try by uniqueId
            updatedUbiShop = await UbiShopModel.findOneAndUpdate(
                { uniqueId: String(id) },
                updateData,
                { new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: "Rework requested successfully",
            data: updatedUbiShop
        });
    } catch (error) {
        console.error("[requestUbiShopRework] Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to request rework",
            error: error.message
        });
    }
};

