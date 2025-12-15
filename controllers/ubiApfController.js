import UbiApfModel from "../models/ubiApfModel.js";

export const createUbiApfForm = async (req, res) => {
    try {
        const { clientId, uniqueId, username, userRole, bankName } = req.body;

        console.log("[createUbiApf] Request received:", {
            uniqueId,
            username,
            bankName,
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });
        
        console.log("[createUbiApf] Full request body keys:", Object.keys(req.body));

        // Validate required fields
        if (!clientId) {
            console.error("[createUbiApf] Missing clientId");
            return res.status(400).json({
                success: false,
                message: "Missing clientId - Client identification required"
            });
        }

        if (!clientId || !uniqueId || !username) {
            console.error("[createUbiApf] Missing required fields");
            return res.status(400).json({
                success: false,
                message: "Missing required fields: clientId, uniqueId, username"
            });
        }

        // Check for duplicate
        const existingForm = await UbiApfModel.findOne({
            clientId,
            uniqueId
        });

        if (existingForm) {
            console.log("[createUbiApf] Duplicate submission prevented");
            return res.status(200).json({
                success: true,
                message: "UBI APF form already exists (duplicate submission prevented)",
                data: existingForm,
                isDuplicate: true
            });
        }

        // Create new UBI APF form
        const newForm = new UbiApfModel({
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

        console.log("[createUbiApf] Success - Form saved to database:", {
            uniqueId,
            status: savedForm.status,
            _id: savedForm._id,
            collectionName: "ubi_apf"
        });

        res.status(201).json({
            success: true,
            message: "UBI APF form created successfully",
            data: savedForm
        });
    } catch (error) {
        console.error("[createUbiApf] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create UBI APF form",
            error: error.message
        });
    }
};

// GET UBI APF FORM BY ID
export const getUbiApfFormById = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, userRole, clientId } = req.query;

        console.log("[getUbiApfById] Request received:", {
            id,
            username,
            userRole,
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Validate ID format
        if (!id || typeof id !== 'string') {
            console.error("[getUbiApfById] Invalid ID format:", id);
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Fetch form from UBI APF collection by _id first, then by uniqueId
         let form;
         try {
             // Try direct _id lookup first
             try {
                 form = await UbiApfModel.findById(id).lean();
                 if (form) {
                     console.log("[getUbiApfById] Found by _id");
                 }
             } catch (idError) {
                 console.log("[getUbiApfById] Not a valid ObjectId, trying uniqueId");
             }

             // Fallback: try by uniqueId
             if (!form) {
                 form = await UbiApfModel.findOne({ uniqueId: String(id) }).lean();
                 if (form) {
                     console.log("[getUbiApfById] Found by uniqueId");
                 }
             }
         } catch (dbError) {
             console.error("[getUbiApfById] Database query error:", dbError.message);
             return res.status(400).json({
                 success: false,
                 message: "Invalid request parameters"
             });
         }

         if (!form) {
             console.error("[getUbiApfById] Form not found:", id);
             return res.status(404).json({
                 success: false,
                 message: "UBI APF form not found"
             });
         }

        // CLIENT ISOLATION - CRITICAL
        if (form.clientId !== clientId) {
            console.error("[getUbiApfById] Client isolation violation:", {
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
            console.error("[getUbiApfById] Unauthorized access attempt");
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this form"
            });
        }

        console.log("[getUbiApfById] Success");

        res.status(200).json({
            success: true,
            data: form
        });
    } catch (error) {
        console.error("[getUbiApfById] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch UBI APF form",
            error: error.message
        });
    }
};

// GET ALL UBI APF FORMS
export const getAllUbiApfForms = async (req, res) => {
    try {
        const { username, userRole, clientId, status, city, bankName, page = 1, limit = 10 } = req.query;

        console.log("[getAllUbiApf] Request received:", {
            userRole,
            status,
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Validate clientId
        if (!clientId) {
            console.error("[getAllUbiApf] Missing clientId");
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

        const forms = await UbiApfModel.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .lean();

        const total = await UbiApfModel.countDocuments(filter);

        console.log("[getAllUbiApf] Success:", {
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
        console.error("[getAllUbiApf] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch UBI APF forms",
            error: error.message
        });
    }
};

// UPDATE UBI APF FORM
export const updateUbiApfForm = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, userRole, clientId } = req.query;

        console.log("[updateUbiApf] Request received:", {
            id,
            username,
            userRole,
            action: "save changes",
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Validate ID format
        if (!id || typeof id !== 'string') {
            console.error("[updateUbiApf] Invalid ID format:", id);
            return res.status(400).json({
                success: false,
                message: "Invalid ID format"
            });
        }

        // Validate required query parameters
        if (!username || !userRole || !clientId) {
            console.error("[updateUbiApf] Missing required parameters");
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
                 form = await UbiApfModel.findById(id).lean();
                 if (form) {
                     console.log("[updateUbiApf] Found by _id");
                 }
             } catch (idError) {
                 console.log("[updateUbiApf] Not a valid ObjectId, trying uniqueId");
             }

             // Fallback: try by uniqueId
             if (!form) {
                 form = await UbiApfModel.findOne({ uniqueId: String(id) }).lean();
                 if (form) {
                     console.log("[updateUbiApf] Found by uniqueId");
                 }
             }
         } catch (dbError) {
             console.error("[updateUbiApf] Database query error:", dbError.message);
             return res.status(400).json({
                 success: false,
                 message: "Invalid request parameters"
             });
         }

         if (!form) {
             console.error("[updateUbiApf] Form not found:", id);
             return res.status(404).json({
                 success: false,
                 message: "UBI APF form not found"
             });
         }

        // CLIENT ISOLATION - CRITICAL
        if (form.clientId !== clientId) {
            console.error("[updateUbiApf] Client isolation violation:", {
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
            console.error("[updateUbiApf] Unauthorized update attempt");
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this form"
            });
        }

        // Status validation: Regular users cannot edit certain statuses
        if (userRole !== "manager" && userRole !== "admin") {
            if (!["pending", "rejected", "rework"].includes(form.status)) {
                console.error("[updateUbiApf] User cannot edit status:", form.status);
                return res.status(400).json({
                    success: false,
                    message: `Cannot edit form with status: ${form.status}`
                });
            }
        }

        console.log("[updateUbiApf] Permission check passed. Previous status:", form.status);

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

        const updatedForm = await UbiApfModel.findByIdAndUpdate(
            form._id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedForm) {
            console.error("[updateUbiApf] Failed to update form:", id);
            return res.status(500).json({
                success: false,
                message: "Failed to update UBI APF form"
            });
        }

        console.log("[updateUbiApf] Success:", {
            formId: id,
            newStatus: updatedForm.status,
            updatedAt: updatedForm.lastUpdatedAt
        });

        res.status(200).json({
            success: true,
            message: "UBI APF form updated successfully",
            data: updatedForm
        });
    } catch (error) {
        console.error("[updateUbiApf] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update UBI APF form",
            error: error.message
        });
    }
};

// MANAGER SUBMIT (APPROVE/REJECT)
export const managerSubmitUbiApfForm = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || typeof id !== 'string') {
            console.error("[managerSubmitUbiApf] Invalid ID format:", id);
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

        console.log("[managerSubmitUbiApf] Request received:", {
            id,
            action,
            username,
            userRole,
            clientId: clientId ? clientId.substring(0, 8) + "..." : "missing"
        });

        // Verify manager/admin role
        if (req.user.role !== "manager" && req.user.role !== "admin") {
            console.error("[managerSubmitUbiApf] Unauthorized role:", req.user.role);
            return res.status(403).json({
                success: false,
                message: "Only managers and admins can perform this action"
            });
        }

        // Validate action
        if (!["approved", "rejected"].includes(action)) {
            console.error("[managerSubmitUbiApf] Invalid action:", action);
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
                 form = await UbiApfModel.findById(id).lean();
                 if (form) {
                     console.log("[managerSubmitUbiApf] Found by _id");
                 }
             } catch (idError) {
                 console.log("[managerSubmitUbiApf] Not a valid ObjectId, trying uniqueId");
             }

             // Fallback: try by uniqueId
             if (!form) {
                 form = await UbiApfModel.findOne({ uniqueId: String(id) }).lean();
                 if (form) {
                     console.log("[managerSubmitUbiApf] Found by uniqueId");
                 }
             }
         } catch (dbError) {
             console.error("[managerSubmitUbiApf] Database query error:", dbError.message);
             return res.status(400).json({
                 success: false,
                 message: "Invalid request parameters"
             });
         }

         if (!form) {
             console.error("[managerSubmitUbiApf] Form not found:", id);
             return res.status(404).json({
                 success: false,
                 message: "UBI APF form not found"
             });
         }

        // CLIENT ISOLATION - CRITICAL
        if (form.clientId !== clientId) {
            console.error("[managerSubmitUbiApf] Client isolation violation:", {
                recordClient: form.clientId,
                requestClient: clientId
            });
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Record belongs to different client"
            });
        }

        console.log("[managerSubmitUbiApf] Performing action:", {
            action,
            formId: id,
            previousStatus: form.status,
            hashedFeedback: feedback ? feedback.substring(0, 20) + "..." : "(empty)"
        });

        // Update form
        const updatedForm = await UbiApfModel.findByIdAndUpdate(
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
            console.error("[managerSubmitUbiApf] Failed to update form:", id);
            return res.status(500).json({
                success: false,
                message: "Failed to update UBI APF form"
            });
        }

        console.log("[managerSubmitUbiApf] Success:", {
            action,
            newStatus: updatedForm.status,
            updatedAt: updatedForm.lastUpdatedAt
        });

        res.status(200).json({
            success: true,
            message: `UBI APF form ${action} successfully`,
            data: updatedForm
        });
    } catch (error) {
        console.error("[managerSubmitUbiApf] Unexpected error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit UBI APF form",
            error: error.message
        });
    }
};  

// REQUEST REWORK
export const requestReworkUbiApfForm = async (req, res) => {
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

        console.log("[requestReworkUbiApf] Request:", { id, username, userRole, clientId: clientId?.substring(0, 8) });

        // Verify manager/admin role (check from middleware-provided user data)
        if (req.user.role !== "manager" && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only managers and admins can request rework"
            });
        }

        // Find UBI APF form by _id (direct lookup first) or uniqueId (fallback)
         let form;
         // Try direct _id lookup first (regardless of format)
         try {
             form = await UbiApfModel.findById(id).lean();
             if (form) {
                 console.log("[requestReworkUbiApf] Found by _id");
             }
         } catch (idError) {
             console.log("[requestReworkUbiApf] Not a valid ObjectId, trying uniqueId");
         }

         // Fallback: try by uniqueId
         if (!form) {
             form = await UbiApfModel.findOne({ uniqueId: String(id) }).lean();
             if (form) {
                 console.log("[requestReworkUbiApf] Found by uniqueId");
             }
         }

         console.log("[requestReworkUbiApf] Found form:", form ? form._id : "not found");

         if (!form) {
             return res.status(404).json({
                 success: false,
                 message: "UBI APF form not found"
             });
         }

        // CLIENT ISOLATION - CRITICAL: Verify record belongs to requesting client
        if (form.clientId !== clientId) {
             return res.status(403).json({
                 success: false,
                 message: "Unauthorized - Record belongs to different client"
             });
        }

        // Update UBI APF form for rework - try _id first, then uniqueId
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
             updatedForm = await UbiApfModel.findByIdAndUpdate(id, updateData, { new: true });
         } catch (idError) {
             console.log("[requestReworkUbiApf] Not a valid ObjectId, trying uniqueId for update");
             // Fallback: try by uniqueId
             updatedForm = await UbiApfModel.findOneAndUpdate(
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
         console.error("[requestReworkUbiApf] Error:", error);
         res.status(500).json({
             success: false,
             message: "Failed to request rework",
             error: error.message
         });
     }
 };
