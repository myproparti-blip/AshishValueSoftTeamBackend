import BofMaharastraModel from "../models/bomFlatModel.js";

export const createBofMaharashtra = async (req, res) => {
    try {
        const { clientId, uniqueId, username, userRole, bankName } = req.body;

        console.log("[createBofMaharashtra] Request received:", {
            uniqueId,
            username,
            bankName,
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });
        
        console.log("[createBofMaharashtra] Full request body keys:", Object.keys(req.body));

        // Validate required fields
        if (!clientId) {
            console.error("[createBofMaharashtra] Missing clientId");
            return res.status(400).json({
                success: false,
                message: "Missing clientId - Client identification required"
            });
        }

        if (!clientId || !uniqueId || !username) {
            console.error("[createBofMaharashtra] Missing required fields");
            return res.status(400).json({
                success: false,
                message: "Missing required fields: clientId, uniqueId, username"
            });
        }

        // Check for duplicate
        const existingForm = await BofMaharastraModel.findOne({
            clientId,
            uniqueId
        });

        if (existingForm) {
            console.log("[createBofMaharashtra] Duplicate submission prevented");
            return res.status(200).json({
                success: true,
                message: "BOF Maharashtra form already exists (duplicate submission prevented)",
                data: existingForm,
                isDuplicate: true
            });
        }

        // Create new BOF Maharashtra form
        const newForm = new BofMaharastraModel({
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

        const savedForm = await newForm.save();

        console.log("[createBofMaharashtra] Success - Form saved to database:", {
            uniqueId,
            status: savedForm.status,
            _id: savedForm._id,
            collectionName: "bof_maharastras"
        });

        res.status(201).json({
            success: true,
            message: "BOF Maharashtra form created successfully",
            data: savedForm
        });
    } catch (error) {
        console.error("[createBofMaharashtra] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create BOF Maharashtra form",
            error: error.message
        });
    }
};

// GET BOF MAHARASHTRA FORM BY ID
export const getBofMaharastraById = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, userRole, clientId } = req.query;

        console.log("[getBofMaharastraById] Request received:", {
            id,
            username,
            userRole,
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Validate ID format
        if (!id || typeof id !== 'string') {
            console.error("[getBofMaharastraById] Invalid ID format:", id);
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Fetch form from BOM Flat collection by _id first, then by uniqueId
         let form;
         try {
             // Try direct _id lookup first
             try {
                 form = await BofMaharastraModel.findById(id).lean();
                 if (form) {
                     console.log("[getBofMaharastraById] Found by _id");
                 }
             } catch (idError) {
                 console.log("[getBofMaharastraById] Not a valid ObjectId, trying uniqueId");
             }

             // Fallback: try by uniqueId
             if (!form) {
                 form = await BofMaharastraModel.findOne({ uniqueId: String(id) }).lean();
                 if (form) {
                     console.log("[getBofMaharastraById] Found by uniqueId");
                 }
             }
         } catch (dbError) {
             console.error("[getBofMaharastraById] Database query error:", dbError.message);
             return res.status(400).json({
                 success: false,
                 message: "Invalid request parameters"
             });
         }

         if (!form) {
             console.error("[getBofMaharastraById] Form not found:", id);
             return res.status(404).json({
                 success: false,
                 message: "BOF Maharashtra form not found"
             });
         }

        // CLIENT ISOLATION - CRITICAL
        if (form.clientId !== clientId) {
            console.error("[getBofMaharastraById] Client isolation violation:", {
                recordClient: form.clientId,
                requestClient: clientId
            });
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        // Permission check
        if (userRole !== "manager" && userRole !== "admin" && form.username !== username) {
            console.error("[getBofMaharastraById] Unauthorized access attempt");
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this form"
            });
        }

        console.log("[getBofMaharastraById] Success");

        res.status(200).json({
            success: true,
            data: form
        });
    } catch (error) {
        console.error("[getBofMaharastraById] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch BOF Maharashtra form",
            error: error.message
        });
    }
};

// GET ALL BOF MAHARASHTRA FORMS
export const getAllBofMaharashtra = async (req, res) => {
    try {
        const { username, userRole, clientId, status, city, bankName, page = 1, limit = 10 } = req.query;

        console.log("[getAllBofMaharashtra] Request received:", {
            userRole,
            status,
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Validate clientId
        if (!clientId) {
            console.error("[getAllBofMaharashtra] Missing clientId");
            return res.status(400).json({
                success: false,
                message: "Missing clientId - Client identification required"
            });
        }

        // Build filter
        const filter = { clientId };

        // Users only see their own forms
        if (userRole !== "manager" && userRole !== "admin") {
            filter.username = username;
        }

        // Apply optional filters
        if (status) filter.status = status;
        if (city) filter.city = city;
        if (bankName) filter.bankName = bankName;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const forms = await BofMaharastraModel.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .lean();

        const total = await BofMaharastraModel.countDocuments(filter);

        console.log("[getAllBofMaharashtra] Success:", {
            total,
            returned: forms.length,
            page
        });

        res.status(200).json({
            success: true,
            data: forms,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error("[getAllBofMaharashtra] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch BOF Maharashtra forms",
            error: error.message
        });
    }
};

// UPDATE BOF MAHARASHTRA FORM
export const updateBofMaharashtra = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, userRole, clientId } = req.query;

        console.log("[updateBofMaharashtra] Request received:", {
            id,
            username,
            userRole,
            action: "save changes",
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Validate ID format
        if (!id || typeof id !== 'string') {
            console.error("[updateBofMaharashtra] Invalid ID format:", id);
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Validate required query parameters
        if (!username || !userRole || !clientId) {
            console.error("[updateBofMaharashtra] Missing required parameters");
            return res.status(400).json({
                success: false,
                message: "Missing required user information"
            });
        }

        // Fetch existing form by _id first, then by uniqueId
        let form;
        try {
            // Try direct _id lookup first
            try {
                form = await BofMaharastraModel.findById(id).lean();
                if (form) {
                    console.log("[updateBofMaharashtra] Found by _id");
                }
            } catch (idError) {
                console.log("[updateBofMaharashtra] Not a valid ObjectId, trying uniqueId");
            }

            // Fallback: try by uniqueId
            if (!form) {
                form = await BofMaharastraModel.findOne({ uniqueId: String(id) }).lean();
                if (form) {
                    console.log("[updateBofMaharashtra] Found by uniqueId");
                }
            }
        } catch (dbError) {
            console.error("[updateBofMaharashtra] Database query error:", dbError.message);
            return res.status(400).json({
                success: false,
                message: "Invalid request parameters"
            });
        }

        if (!form) {
            console.error("[updateBofMaharashtra] Form not found:", id);
            return res.status(404).json({
                success: false,
                message: "BOF Maharashtra form not found"
            });
        }

        // CLIENT ISOLATION - CRITICAL
        if (form.clientId !== clientId) {
            console.error("[updateBofMaharashtra] Client isolation violation:", {
                recordClient: form.clientId,
                requestClient: clientId
            });
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        // Permission check
        if (userRole !== "manager" && userRole !== "admin" && form.username !== username) {
            console.error("[updateBofMaharashtra] Unauthorized update attempt");
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this form"
            });
        }

        // Status validation: Regular users cannot edit certain statuses
        if (userRole !== "manager" && userRole !== "admin") {
            if (!["pending", "rejected", "rework"].includes(form.status)) {
                console.error("[updateBofMaharashtra] User cannot edit status:", form.status);
                return res.status(400).json({
                    success: false,
                    message: `Cannot edit form with status: ${form.status}`
                });
            }
        }

        console.log("[updateBofMaharashtra] Permission check passed. Previous status:", form.status);

        // Prepare update data
        const updateData = {
            ...req.body,
            status: "on-progress",
            lastUpdatedBy: username,
            lastUpdatedByRole: userRole,
            lastUpdatedAt: new Date(),
            updatedAt: new Date()
        };

        // Remove sensitive fields if user is not admin
        if (userRole !== "admin") {
            delete updateData.managerFeedback;
            delete updateData.submittedByManager;
        }

        const updatedForm = await BofMaharastraModel.findByIdAndUpdate(
            form._id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedForm) {
            console.error("[updateBofMaharashtra] Failed to update form:", id);
            return res.status(500).json({
                success: false,
                message: "Failed to update BOF Maharashtra form"
            });
        }

        console.log("[updateBofMaharashtra] Success:", {
            formId: id,
            newStatus: updatedForm.status,
            updatedAt: updatedForm.lastUpdatedAt
        });

        res.status(200).json({
            success: true,
            message: "BOF Maharashtra form updated successfully",
            data: updatedForm
        });
    } catch (error) {
        console.error("[updateBofMaharashtra] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update BOF Maharashtra form",
            error: error.message
        });
    }
};

// MANAGER SUBMIT (APPROVE/REJECT)
export const managerSubmitBofMaharashtra = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || typeof id !== 'string') {
            console.error("[managerSubmitBofMaharashtra] Invalid ID format:", id);
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        const action = req.body.action || req.body.status;
        const feedback = req.body.feedback || req.body.managerFeedback || "";
        const username = req.body.username || req.user.username;
        const userRole = req.body.userRole || req.user.role;
        const clientId = req.body.clientId || req.user.clientId;

        console.log("[managerSubmitBofMaharashtra] Request received:", {
            id,
            action,
            username,
            userRole,
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Verify manager/admin role
        if (req.user.role !== "manager" && req.user.role !== "admin") {
            console.error("[managerSubmitBofMaharashtra] Unauthorized role:", req.user.role);
            return res.status(403).json({
                success: false,
                message: "Only managers and admins can perform this action"
            });
        }

        // Validate action
        if (!["approved", "rejected"].includes(action)) {
            console.error("[managerSubmitBofMaharashtra] Invalid action:", action);
            return res.status(400).json({
                success: false,
                message: "Invalid action. Must be 'approved' or 'rejected'"
            });
        }

        // Find form by _id first, then by uniqueId
        let form;
        try {
            // Try direct _id lookup first
            try {
                form = await BofMaharastraModel.findById(id).lean();
                if (form) {
                    console.log("[managerSubmitBofMaharashtra] Found by _id");
                }
            } catch (idError) {
                console.log("[managerSubmitBofMaharashtra] Not a valid ObjectId, trying uniqueId");
            }

            // Fallback: try by uniqueId
            if (!form) {
                form = await BofMaharastraModel.findOne({ uniqueId: String(id) }).lean();
                if (form) {
                    console.log("[managerSubmitBofMaharashtra] Found by uniqueId");
                }
            }
        } catch (dbError) {
            console.error("[managerSubmitBofMaharashtra] Database query error:", dbError.message);
            return res.status(400).json({
                success: false,
                message: "Invalid request parameters"
            });
        }

        if (!form) {
            console.error("[managerSubmitBofMaharashtra] Form not found:", id);
            return res.status(404).json({
                success: false,
                message: "BOF Maharashtra form not found"
            });
        }

        // CLIENT ISOLATION - CRITICAL
        if (form.clientId !== clientId) {
            console.error("[managerSubmitBofMaharashtra] Client isolation violation:", {
                recordClient: form.clientId,
                requestClient: clientId
            });
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        console.log("[managerSubmitBofMaharashtra] Performing action:", {
            action,
            formId: id,
            previousStatus: form.status,
            hashedFeedback: feedback ? feedback.substring(0, 20) + "..." : "(empty)"
        });

        // Update form
        const updatedForm = await BofMaharastraModel.findByIdAndUpdate(
            form._id,
            {
                status: action,
                managerFeedback: feedback ? feedback.trim() : "",
                submittedByManager: true,
                lastUpdatedBy: username,
                lastUpdatedByRole: userRole,
                lastUpdatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedForm) {
            console.error("[managerSubmitBofMaharashtra] Failed to update form:", id);
            return res.status(500).json({
                success: false,
                message: "Failed to update BOF Maharashtra form"
            });
        }

        console.log("[managerSubmitBofMaharashtra] Success:", {
            action,
            newStatus: updatedForm.status,
            updatedAt: updatedForm.lastUpdatedAt
        });

        res.status(200).json({
            success: true,
            message: `BOF Maharashtra form ${action} successfully`,
            data: updatedForm
        });
    } catch (error) {
        console.error("[managerSubmitBofMaharashtra] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit BOF Maharashtra form",
            error: error.message
        });
    }
};

// REQUEST REWORK
export const requestReworkBofMaharashtra = async (req, res) => {
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

        console.log("[requestReworkBofMaharashtra] Request:", { id, username, userRole, clientId: clientId?.substring(0, 8) });

        // Verify manager/admin role (check from middleware-provided user data)
        if (req.user.role !== "manager" && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only managers and admins can request rework"
            });
        }

        // Find BOF Maharashtra form by _id (direct lookup first) or uniqueId (fallback)
        let form;
        // Try direct _id lookup first (regardless of format)
        try {
            form = await BofMaharastraModel.findById(id).lean();
            if (form) {
                console.log("[requestReworkBofMaharashtra] Found by _id");
            }
        } catch (idError) {
            console.log("[requestReworkBofMaharashtra] Not a valid ObjectId, trying uniqueId");
        }

        // Fallback: try by uniqueId
        if (!form) {
            form = await BofMaharastraModel.findOne({ uniqueId: String(id) }).lean();
            if (form) {
                console.log("[requestReworkBofMaharashtra] Found by uniqueId");
            }
        }

        console.log("[requestReworkBofMaharashtra] Found form:", form ? form._id : "not found");

        if (!form) {
            return res.status(404).json({
                success: false,
                message: "BOF Maharashtra form not found"
            });
        }

        // CLIENT ISOLATION - CRITICAL: Verify record belongs to requesting client
        if (form.clientId !== clientId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        // Update BOF Maharashtra form for rework - try _id first, then uniqueId
        let updatedForm;
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
            updatedForm = await BofMaharastraModel.findByIdAndUpdate(id, updateData, { new: true });
        } catch (idError) {
            console.log("[requestReworkBofMaharashtra] Not a valid ObjectId, trying uniqueId for update");
            // Fallback: try by uniqueId
            updatedForm = await BofMaharastraModel.findOneAndUpdate(
                { uniqueId: String(id) },
                updateData,
                { new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: "Rework requested successfully",
            data: updatedForm
        });
    } catch (error) {
        console.error("[requestReworkBofMaharashtra] Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to request rework",
            error: error.message
        });
    }
};
