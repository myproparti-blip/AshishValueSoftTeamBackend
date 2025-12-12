import mongoose from "mongoose";

// BOF MAHARASHTRA SPECIFIC SCHEMAS

const bofDirectionSchema = new mongoose.Schema({
    north1: { type: String, default: "" },
    east1: { type: String, default: "" },
    south1: { type: String, default: "" },
    west1: { type: String, default: "" },
    north2: { type: String, default: "" },
    east2: { type: String, default: "" },
    south2: { type: String, default: "" },
    west2: { type: String, default: "" }
}, { _id: false });

const bofCoordinateSchema = new mongoose.Schema({
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" }
}, { _id: false });

const bofPhotoSchema = new mongoose.Schema({
    elevationImages: [String],
    siteImages: [String]
}, { _id: false });

const bofPdfDetailsSchema = new mongoose.Schema({
    // DOCUMENT HEADER
    formId: { type: String, default: "" },
    branch: { type: String, default: "" },
    valuationPurpose: { type: String, default: "" },
    inspectionDate: { type: String, default: "" },
    valuationMadeDate: { type: String, default: "" },

    // MORTGAGE & VALUATION HISTORY
    mortgageDeed: { type: String, default: "" },
    mortgageDeedBetween: { type: String, default: "" },
    previousValuationReport: { type: String, default: "" },
    previousValuationInFavorOf: { type: String, default: "" },
    approvedPlanNo: { type: String, default: "" },

    // GENERAL SECTION - DOCUMENTS
    purposeOfValuation: { type: String, default: "" },
    dateOfInspection: { type: String, default: "" },
    dateOfValuationMade: { type: String, default: "" },
    agreementForSale: { type: String, default: "" },
    commencementCertificate: { type: String, default: "" },
    occupancyCertificate: { type: String, default: "" },
    ownerNameAddress: { type: String, default: "" },
    briefDescriptionProperty: { type: String, default: "" },
    listOfDocumentsProduced: { type: String, default: "" },
    ownerName: { type: String, default: "" },

    // PROPERTY DESCRIPTION / LOCATION OF PROPERTY - SECTION 8
    plotSurveyNo: { type: String, default: "" },
    doorNo: { type: String, default: "" },
    tpVillage: { type: String, default: "" },
    wardTaluka: { type: String, default: "" },
    mandalDistrict: { type: String, default: "" },
    layoutPlanIssueDate: { type: String, default: "" },
    approvedMapAuthority: { type: String, default: "" },
    authenticityVerified: { type: String, default: "" },
    valuerCommentOnAuthenticity: { type: String, default: "" },
    otherApprovedPlanDetails: { type: String, default: "" },
    valuesApprovedPlan: { type: String, default: "" },

    // POSTAL ADDRESS & AREA CLASSIFICATION - SECTION 8
    postalAddress: { type: String, default: "" },
    cityTown: { type: String, default: "" },
    residentialArea: { type: Boolean, default: false },
    commercialArea: { type: Boolean, default: false },
    industrialArea: { type: Boolean, default: false },
    locationOfProperty: { type: String, default: "" },

    // INDUSTRIAL AREA DETAILS - SECTION 9
    areaClassification: { type: String, default: "" },
    urbanClassification: { type: String, default: "" },
    governmentType: { type: String, default: "" },
    govtEnactmentsCovered: { type: String, default: "" },

    // BOUNDARIES OF PROPERTY - SECTION 12
    boundariesPlotNorth: { type: String, default: "" },
    boundariesPlotNorthDeed: { type: String, default: "" },
    boundariesPlotNorthActual: { type: String, default: "" },
    boundariesPlotSouth: { type: String, default: "" },
    boundariesPlotSouthDeed: { type: String, default: "" },
    boundariesPlotSouthActual: { type: String, default: "" },
    boundariesPlotEast: { type: String, default: "" },
    boundariesPlotEastDeed: { type: String, default: "" },
    boundariesPlotEastActual: { type: String, default: "" },
    boundariesPlotWest: { type: String, default: "" },
    boundariesPlotWestDeed: { type: String, default: "" },
    boundariesPlotWestActual: { type: String, default: "" },
    boundariesShopNorth: { type: String, default: "" },
    boundariesShopNorthDeed: { type: String, default: "" },
    boundariesShopNorthActual: { type: String, default: "" },
    boundariesShopSouth: { type: String, default: "" },
    boundariesShopSouthDeed: { type: String, default: "" },
    boundariesShopSouthActual: { type: String, default: "" },
    boundariesShopEast: { type: String, default: "" },
    boundariesShopEastDeed: { type: String, default: "" },
    boundariesShopEastActual: { type: String, default: "" },
    boundariesShopWest: { type: String, default: "" },
    boundariesShopWestDeed: { type: String, default: "" },
    boundariesShopWestActual: { type: String, default: "" },

    // DIMENSIONS OF THE UNIT - SECTION 13
    dimensionsDeed: { type: String, default: "" },
    dimensionsActual: { type: String, default: "" },

    // EXTENT OF THE UNIT - SECTION 14
    extentOfUnit: { type: String, default: "" },
    latitudeLongitude: { type: String, default: "" },
    floorSpaceIndex: { type: String, default: "" },

    // EXTENT OF SITE CONSIDERED FOR VALUATION - SECTION 15
    extentOfSiteValuation: { type: String, default: "" },

    // SECTION 16 - OCCUPANCY
    rentReceivedPerMonth: { type: String, default: "" },

    // APARTMENT BUILDING DETAILS - SECTION II
    apartmentNature: { type: String, default: "" },
    apartmentLocation: { type: String, default: "" },
    apartmentCTSNo: { type: String, default: "" },
    apartmentTSNo: { type: String, default: "" },
    apartmentSectorNo: { type: String, default: "" },
    apartmentBlockNo: { type: String, default: "" },
    apartmentWardNo: { type: String, default: "" },
    apartmentVillageMunicipalityCounty: { type: String, default: "" },
    apartmentDoorNoStreetRoad: { type: String, default: "" },
    apartmentPinCode: { type: String, default: "" },

    // APARTMENT BUILDING SUBSECTIONS
    descriptionOfLocalityResidentialCommercialMixed: { type: String, default: "" },
    yearOfConstruction: { type: String, default: "" },
    numberOfFloors: { type: String, default: "" },
    typeOfStructure: { type: String, default: "" },
    numberOfDwellingUnitsInBuilding: { type: String, default: "" },
    qualityOfConstruction: { type: String, default: "" },
    appearanceOfBuilding: { type: String, default: "" },
    maintenanceOfBuilding: { type: String, default: "" },

    // VALUE OF FLAT - SECTION C
    fairMarketValue: { type: String, default: "" },
    realizableValue: { type: String, default: "" },
    distressValue: { type: String, default: "" },
    saleDeedValue: { type: String, default: "" },
    agreementValue: { type: String, default: "" },
    agreementCircleRate: { type: String, default: "" },
    valueCircleRate: { type: String, default: "" },
    insurableValue: { type: String, default: "" },
    totalJantriValue: { type: String, default: "" },

    // FLAT SPECIFICATIONS EXTENDED
    areaUsage: { type: String, default: "" },
    carpetAreaFlat: { type: String, default: "" },

    // MONTHLY RENT
    ownerOccupancyStatus: { type: String, default: "" },
    monthlyRent: { type: String, default: "" },

    // MARKETABILITY SECTION
    marketability: { type: String, default: "" },
    favoringFactors: { type: String, default: "" },
    negativeFactors: { type: String, default: "" },

    // RATE SECTION
    comparableRate: { type: String, default: "" },
    adoptedBasicCompositeRate: { type: String, default: "" },
    buildingServicesRate: { type: String, default: "" },
    landOthersRate: { type: String, default: "" },
    guidelineRate: { type: String, default: "" },

    // COMPOSITE RATE AFTER DEPRECIATION
    depreciatedBuildingRate: { type: String, default: "" },
    replacementCostServices: { type: String, default: "" },
    buildingAge: { type: String, default: "" },
    buildingLife: { type: String, default: "" },
    depreciationPercentage: { type: String, default: "" },
    deprecatedRatio: { type: String, default: "" },

    // MARKET RATE ANALYSIS
    marketabilityDescription: { type: String, default: "" },
    smallFlatDescription: { type: String, default: "" },
    newConstructionArea: { type: String, default: "" },
    rateAdjustments: { type: String, default: "" },

    // BREAK-UP FOR THE ABOVE RATE
    goodwillRate: { type: String, default: "" },

    // COMPOSITE RATE AFTER DEPRECIATION (LEGACY)
    depreciationBuildingDate: { type: String, default: "" },
    depreciationStorage: { type: String, default: "" },

    // TOTAL COMPOSITE RATE
    totalCompositeRate: { type: String, default: "" },
    rateForLandOther: { type: String, default: "" },

    // VALUATION DETAILS - Items (Qty, Rate, Value rows)
    presentValueQty: { type: String, default: "" },
    presentValueRate: { type: String, default: "" },
    presentValue: { type: String, default: "" },
    wardrobesQty: { type: String, default: "" },
    wardrobesRate: { type: String, default: "" },
    wardrobes: { type: String, default: "" },
    showcasesQty: { type: String, default: "" },
    showcasesRate: { type: String, default: "" },
    showcases: { type: String, default: "" },
    kitchenArrangementsQty: { type: String, default: "" },
    kitchenArrangementsRate: { type: String, default: "" },
    kitchenArrangements: { type: String, default: "" },
    superfineFinishQty: { type: String, default: "" },
    superfineFinishRate: { type: String, default: "" },
    superfineFinish: { type: String, default: "" },
    interiorDecorationsQty: { type: String, default: "" },
    interiorDecorationsRate: { type: String, default: "" },
    interiorDecorations: { type: String, default: "" },
    electricityDepositsQty: { type: String, default: "" },
    electricityDepositsRate: { type: String, default: "" },
    electricityDeposits: { type: String, default: "" },
    collapsibleGatesQty: { type: String, default: "" },
    collapsibleGatesRate: { type: String, default: "" },
    collapsibleGates: { type: String, default: "" },
    potentialValueQty: { type: String, default: "" },
    potentialValueRate: { type: String, default: "" },
    potentialValue: { type: String, default: "" },
    otherItemsQty: { type: String, default: "" },
    otherItemsRate: { type: String, default: "" },
    otherItems: { type: String, default: "" },
    totalValuationItems: { type: String, default: "" },

    // SECTION 3: FLAT/UNIT SPECIFICATIONS
    unitFloor: { type: String, default: "" },
    unitDoorNo: { type: String, default: "" },
    unitRoof: { type: String, default: "" },
    unitFlooring: { type: String, default: "" },
    unitDoors: { type: String, default: "" },
    unitBathAndWC: { type: String, default: "" },
    unitElectricalWiring: { type: String, default: "" },
    unitSpecification: { type: String, default: "" },
    unitWindows: { type: String, default: "" },
    unitFittings: { type: String, default: "" },
    unitFinishing: { type: String, default: "" },

    // SECTION 4: UNIT TAX/ASSESSMENT
    assessmentNo: { type: String, default: "" },
    taxPaidName: { type: String, default: "" },
    taxAmount: { type: String, default: "" },

    // SECTION 5: ELECTRICITY SERVICE
    electricityServiceNo: { type: String, default: "" },
    meterCardName: { type: String, default: "" },

    // SECTION 6: UNIT MAINTENANCE
    unitMaintenance: { type: String, default: "" },

    // SECTION 7: AGREEMENT FOR SALE
    agreementSaleExecutedName: { type: String, default: "" },

    // SECTION 8 & 9: UNIT AREA DETAILS
    undividedAreaLand: { type: String, default: "" },
    plinthArea: { type: String, default: "" },
    carpetArea: { type: String, default: "" },

    // SECTION 10-14: UNIT CLASSIFICATION
    classificationPosh: { type: String, default: "" },
    classificationUsage: { type: String, default: "" },
    classificationOwnership: { type: String, default: "" },

    // SIGNATURE & REPORT DETAILS
    place: { type: String, default: "" },
    signatureDate: { type: String, default: "" },
    signerName: { type: String, default: "" },
    reportDate: { type: String, default: "" },
    fairMarketValueWords: { type: String, default: "" },

    // FACILITIES AVAILABLE
    liftAvailable: { type: String, default: "" },
    protectedWaterSupply: { type: String, default: "" },
    undergroundSewerage: { type: String, default: "" },
    carParkingOpenCovered: { type: String, default: "" },
    isCompoundWallExisting: { type: String, default: "" },
    isPavementLaidAroundBuilding: { type: String, default: "" },
    othersFacility: { type: String, default: "" },
    facilityOthers: { type: String, default: "" },

    // DECLARATIONS
    declarationB: { type: String, default: "" },
    declarationD: { type: String, default: "" },
    declarationE: { type: String, default: "" },
    declarationI: { type: String, default: "" },
    declarationJ: { type: String, default: "" },

    // VALUATION INFORMATION DETAILS
    assetBackgroundInfo: { type: String, default: "" },
    valuationPurposeAuthority: { type: String, default: "" },
    valuersIdentity: { type: String, default: "" },
    valuersConflictDisclosure: { type: String, default: "" },
    dateOfAppointment: { type: String, default: "" },
    inspectionsUndertaken: { type: String, default: "" },
    informationSources: { type: String, default: "" },
    valuationProcedures: { type: String, default: "" },
    reportRestrictions: { type: String, default: "" },
    majorFactors: { type: String, default: "" },
    additionalFactors: { type: String, default: "" },
    caveatsLimitations: { type: String, default: "" }
}, { _id: false });

const bofCustomFieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true }
}, { _id: false });

const bofMaharastraSchema = new mongoose.Schema({
    // BASIC INFO
    clientId: { type: String, required: true, index: true },
    uniqueId: { type: String, required: true, sparse: true },
    username: { type: String, required: true },
    dateTime: { type: String, required: true },
    day: { type: String, required: true },

    // BANK & CITY
    bankName: { type: String, required: true },
    city: { type: String, required: true },
    customBankName: { type: String, default: "" },
    customCity: { type: String, default: "" },

    // CLIENT DETAILS
    clientName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },

    // PAYMENT
    payment: { type: String, required: true },
    collectedBy: { type: String, default: "" },

    // DSA & ENGINEER
    dsa: { type: String, required: true },
    customDsa: { type: String, default: "" },
    engineerName: { type: String, required: true, default: "" },
    customEngineerName: { type: String, default: "" },

    // NOTES
    notes: { type: String, default: "" },
    selectedForm: { type: String, default: null },

    // PROPERTY BASIC DETAILS
    elevation: { type: String, default: "" },

    // DIRECTIONS
    directions: { type: bofDirectionSchema, default: () => ({}) },

    // COORDINATES
    coordinates: { type: bofCoordinateSchema, default: () => ({}) },

    // IMAGES
    propertyImages: [mongoose.Schema.Types.Mixed],
    locationImages: [mongoose.Schema.Types.Mixed],
    photos: { type: bofPhotoSchema, default: () => ({}) },

    // STATUS TRACKING
    status: {
        type: String,
        enum: ["pending", "on-progress", "approved", "rejected", "rework"],
        default: "pending"
    },
    managerFeedback: { type: String, default: "" },
    submittedByManager: { type: Boolean, default: false },
    lastUpdatedBy: { type: String, default: "" },
    lastUpdatedByRole: { type: String, default: "" },
    reworkComments: { type: String, default: "" },
    reworkRequestedBy: { type: String, default: "" },
    reworkRequestedAt: { type: Date, default: null },
    reworkRequestedByRole: { type: String, default: "" },

    // PDF DETAILS (BOF-SPECIFIC FIELDS)
    pdfDetails: { type: bofPdfDetailsSchema, default: () => ({}) },

    // CUSTOM FIELDS
    customFields: [{ type: bofCustomFieldSchema, default: () => ({}) }],

    // TIMESTAMPS
    lastUpdatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create unique compound index for clientId and uniqueId
bofMaharastraSchema.index({ clientId: 1, uniqueId: 1 }, { unique: true, sparse: true });

// Pre-save middleware to update timestamps
bofMaharastraSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const BofMaharastraModel = mongoose.model("BofMaharashtra", bofMaharastraSchema, "bof_maharastras");
export default BofMaharastraModel;