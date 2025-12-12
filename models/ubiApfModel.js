import mongoose from "mongoose";


const ubiApfDirectionSchema = new mongoose.Schema({
    north1: { type: String, default: "" },
    east1: { type: String, default: "" },
    south1: { type: String, default: "" },
    west1: { type: String, default: "" },
    north2: { type: String, default: "" },
    east2: { type: String, default: "" },
    south2: { type: String, default: "" },
    west2: { type: String, default: "" }
}, { _id: false });

const ubiApfCoordinateSchema = new mongoose.Schema({
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" }
}, { _id: false });

const ubiApfPhotoSchema = new mongoose.Schema({
    elevationImages: [String],
    siteImages: [String]
}, { _id: false });

const ubiApfPdfDetailsSchema = new mongoose.Schema({
    
    // PAGE 1 - COST OF CONSTRUCTION AS PER ACTUAL MEASUREMENT
    subArea: { type: String, default: "" },
    basementFloor: { type: String, default: "" },
    groundArea: { type: String, default: "" },
    socketFloor: { type: String, default: "" },
    terraceArea: { type: String, default: "" },
    firstFloorConstruction: { type: String, default: "" },
    secondFloorConstruction: { type: String, default: "" },
    thirdFloorConstruction: { type: String, default: "" },
    fourthFloorConstruction: { type: String, default: "" },
    fifthFloorConstruction: { type: String, default: "" },
    sixthFloorConstruction: { type: String, default: "" },
    glassHouseFloor: { type: String, default: "" },
    totalAreaAmount: { type: String, default: "" },
    valueCostAmount: { type: String, default: "" },
    ratePerSqftAmount: { type: String, default: "" },
    
    // PAGE 2 - TOTAL ABSTRACT OF THE ENTIRE PROPERTY (OWNED)
    partA: { type: String, default: "" },
    partB: { type: String, default: "" },
    partC: { type: String, default: "" },
    partD: { type: String, default: "" },
    partE: { type: String, default: "" },
    partF: { type: String, default: "" },
    
    // PAGE 3 - GENERAL INFORMATION
    theMarketValueOfAbovePropertyIs: { type: String, default: "" },
    theRealisableValueOfAbovePropertyIs: { type: String, default: "" },
    theInsurableValueOfAbovePropertyIs: { type: String, default: "" },
    place: { type: String, default: "" },
    date: { type: String, default: "" },
    signatureOfBranchManagerWithOfficeSeal: { type: String, default: "" },
    shashilantRDhumalSignatureOfApprover: { type: String, default: "" },
    theUndersignedHasInspectedThePropertyDetailedInTheValuationReportCrossVerifyTheFollowingDetailsAndFoundToBeAccurate: { type: String, default: "" },
    thePropertyIsReasonablyMarketValueOn: { type: String, default: "" },
    theUndersignedHasInspectedAndSatisfiedThatTheFairAndReasonableMarketValueOn: { type: String, default: "" },
    
    // PAGE 4 - TOTAL ABSTRACT OF ENTIRE PROPERTY
    abstractLand: { type: String, default: "" },
    abstractBuilding: { type: String, default: "" },
    abstractExtraItems: { type: String, default: "" },
    abstractAmenities: { type: String, default: "" },
    abstractMiscellaneous: { type: String, default: "" },
    abstractServices: { type: String, default: "" },
    abstractTotalValue: { type: String, default: "" },
    
    asAResultOfMyAppraisalAndAnalysisItIsMyConsideredOpinionThatThePresentFairMarketValue: { type: String, default: "" },
    valueOfTheAbovePropertyAsOnTheValuationDateIs: { type: String, default: "" },
    preValuationRatePercentageWithDeductionWithRespectToTheAgreementValuePropertyDeed: { type: String, default: "" },
    
    // PAGE 5 - PART A - SERVICES
    srNo: { type: String, default: "" },
    description1: { type: String, default: "" },
    amountInRupees1: { type: String, default: "" },
    
    // PAGE 5 - PART A - CONTINUED (12 rows with Sr. No., Description, Amount in Rupees)
    part1SrNo1: { type: String, default: "" },
    part1Description1: { type: String, default: "" },
    part1Amount1: { type: String, default: "" },
    part1SrNo2: { type: String, default: "" },
    part1Description2: { type: String, default: "" },
    part1Amount2: { type: String, default: "" },
    part1SrNo3: { type: String, default: "" },
    part1Description3: { type: String, default: "" },
    part1Amount3: { type: String, default: "" },
    part1SrNo4: { type: String, default: "" },
    part1Description4: { type: String, default: "" },
    part1Amount4: { type: String, default: "" },
    part1SrNo5: { type: String, default: "" },
    part1Description5: { type: String, default: "" },
    part1Amount5: { type: String, default: "" },
    
    // PAGE 6 - PART A - AMENITIES (with Description and Amount in Rupees for 9 items)
    part2SrNo: { type: String, default: "" },
    part2Description: { type: String, default: "" },
    part2Workbeds: { type: String, default: "" },
    part2Item1Description: { type: String, default: "" },
    part2Item1Amount: { type: String, default: "" },
    part2Item2Description: { type: String, default: "" },
    part2Item2Amount: { type: String, default: "" },
    part2Item3Description: { type: String, default: "" },
    part2Item3Amount: { type: String, default: "" },
    part2Item4Description: { type: String, default: "" },
    part2Item4Amount: { type: String, default: "" },
    part2Item5Description: { type: String, default: "" },
    part2Item5Amount: { type: String, default: "" },
    part2Item6Description: { type: String, default: "" },
    part2Item6Amount: { type: String, default: "" },
    part2Item7Description: { type: String, default: "" },
    part2Item7Amount: { type: String, default: "" },
    part2Item8Description: { type: String, default: "" },
    part2Item8Amount: { type: String, default: "" },
    part2Item9Description: { type: String, default: "" },
    part2Item9Amount: { type: String, default: "" },
    part2Total: { type: String, default: "" },
    
    // PAGE 7 - PART C - MISCELLANEOUS
    part3SrNo: { type: String, default: "" },
    part3Description: { type: String, default: "" },
    part3Item1Description: { type: String, default: "" },
    part3Item1Amount: { type: String, default: "" },
    part3Item2Description: { type: String, default: "" },
    part3Item2Amount: { type: String, default: "" },
    part3Item3Description: { type: String, default: "" },
    part3Item3Amount: { type: String, default: "" },
    part3Item4Description: { type: String, default: "" },
    part3Item4Amount: { type: String, default: "" },
    part3Item5Description: { type: String, default: "" },
    part3Item5Amount: { type: String, default: "" },
    part3Total: { type: String, default: "" },
    
    // PAGE 8 - DETAILS OF VALUATION OF BUILDING - COMPOUND WALL & FIXTURES
    compoundWall: { type: String, default: "" },
    height: { type: String, default: "" },
    length: { type: String, default: "" },
    typeOfConstruction: { type: String, default: "" },
    electricalInstallation: { type: String, default: "" },
    typeOfWiring: { type: String, default: "" },
    classOfFittings: { type: String, default: "" },
    numberOfLightPoints: { type: String, default: "" },
    farPlugs: { type: String, default: "" },
    sparePlug: { type: String, default: "" },
    anyOtherElectricalItem: { type: String, default: "" },
    plumbingInstallation: { type: String, default: "" },
    numberOfWaterClassAndTaps: { type: String, default: "" },
    noWashBasins: { type: String, default: "" },
    noUrinals: { type: String, default: "" },
    noOfBathtubs: { type: String, default: "" },
    waterMeterTapsEtc: { type: String, default: "" },
    anyOtherPlumbingFixture: { type: String, default: "" },
    
    // PAGE 9 - DETAILS OF VALUATION OF BUILDING
    ornamentalFloor: { type: String, default: "" },
    ornamentalFloorAmount: { type: String, default: "" },
    stuccoVeranda: { type: String, default: "" },
    stuccoVerandaAmount: { type: String, default: "" },
    sheetGrills: { type: String, default: "" },
    sheetGrillsAmount: { type: String, default: "" },
    overheadWaterTank: { type: String, default: "" },
    overheadWaterTankAmount: { type: String, default: "" },
    extraShedPossibleGates: { type: String, default: "" },
    extraShedPossibleGatesAmount: { type: String, default: "" },
    
    // PAGE 10 - PART F - SERVICES
    partFSrNo: { type: String, default: "" },
    partFDescription: { type: String, default: "" },
    partFPortico: { type: String, default: "" },
    partFItem1Description: { type: String, default: "" },
    partFItem1Amount: { type: String, default: "" },
    partFItem2Description: { type: String, default: "" },
    partFItem2Amount: { type: String, default: "" },
    partFItem3Description: { type: String, default: "" },
    partFItem3Amount: { type: String, default: "" },
    partFItem4Description: { type: String, default: "" },
    partFItem4Amount: { type: String, default: "" },
    partFItem5Description: { type: String, default: "" },
    partFItem5Amount: { type: String, default: "" },
    partFTotal: { type: String, default: "" },
    
    // PAGE 11 - PART C EXTRA ITEMS
    partCExtraSrNo: { type: String, default: "" },
    partCExtraDescription: { type: String, default: "" },
    partCExtraWorksItems: { type: String, default: "" },
    partCExtraItem1Description: { type: String, default: "" },
    partCExtraItem1Amount: { type: String, default: "" },
    partCExtraItem2Description: { type: String, default: "" },
    partCExtraItem2Amount: { type: String, default: "" },
    partCExtraItem3Description: { type: String, default: "" },
    partCExtraItem3Amount: { type: String, default: "" },
    partCExtraItem4Description: { type: String, default: "" },
    partCExtraItem4Amount: { type: String, default: "" },
    partCExtraItem5Description: { type: String, default: "" },
    partCExtraItem5Amount: { type: String, default: "" },
    partCExtraTotal: { type: String, default: "" },
    
    // PAGE 12 - PART E - MISCELLANEOUS (Revised)
    partESrNo: { type: String, default: "" },
    partEDescription: { type: String, default: "" },
    partEItem1Description: { type: String, default: "" },
    partEItem1Amount: { type: String, default: "" },
    partEItem2Description: { type: String, default: "" },
    partEItem2Amount: { type: String, default: "" },
    partEItem3Description: { type: String, default: "" },
    partEItem3Amount: { type: String, default: "" },
    partEItem4Description: { type: String, default: "" },
    partEItem4Amount: { type: String, default: "" },
    partETotal: { type: String, default: "" },
    
    // PAGE 13 - BUILDING CONSTRUCTION - FLOOR WISE DETAILS
    buildingConstructionSrNo: { type: String, default: "" },
    buildingConstructionDescription: { type: String, default: "" },
    builtUpArea: { type: String, default: "" },
    groundFloor: { type: String, default: "" },
    groundFloorRate: { type: String, default: "" },
    groundFloorValue: { type: String, default: "" },
    firstFloor: { type: String, default: "" },
    firstFloorRate: { type: String, default: "" },
    firstFloorValue: { type: String, default: "" },
    secondFloor: { type: String, default: "" },
    secondFloorRate: { type: String, default: "" },
    secondFloorValue: { type: String, default: "" },
    thirdFloor: { type: String, default: "" },
    thirdFloorRate: { type: String, default: "" },
    thirdFloorValue: { type: String, default: "" },
    fourthFloor: { type: String, default: "" },
    fourthFloorRate: { type: String, default: "" },
    fourthFloorValue: { type: String, default: "" },
    fifthFloor: { type: String, default: "" },
    fifthFloorRate: { type: String, default: "" },
    fifthFloorValue: { type: String, default: "" },
    sixthFloor: { type: String, default: "" },
    sixthFloorRate: { type: String, default: "" },
    sixthFloorValue: { type: String, default: "" },
    basementFloor: { type: String, default: "" },
    basementFloorRate: { type: String, default: "" },
    basementFloorValue: { type: String, default: "" },
    glassHouse: { type: String, default: "" },
    glassHouseRate: { type: String, default: "" },
    totalAreaBuilding: { type: String, default: "" },
    
    // PAGE 13 - MEASUREMENT CARPET AREA
    carpetAreaSqft: { type: String, default: "" },
    basementFloorSqft: { type: String, default: "" },
    groundFloorSqftMeasure: { type: String, default: "" },
    groundFloorAmountInRupees: { type: String, default: "" },
    serviceFloorCarpetArea: { type: String, default: "" },
    traceAreaCarpetArea: { type: String, default: "" },
    firstFloorCarpetArea: { type: String, default: "" },
    serviceFloor: { type: String, default: "" },
    serviceFloorRate: { type: String, default: "" },
    serviceFloorValue: { type: String, default: "" },
    
    // PAGE 14 - PLOT AREA & BUILT UP AREA
    west: { type: String, default: "" },
    extentAreaAndBuildUpArea: { type: String, default: "" },
    plotAreaAsPerSketchedPlan: { type: String, default: "" },
    plotAreaInBuildUpAreaInSqft: { type: String, default: "" },
    plotAreaInSqft: { type: String, default: "" },
    buildUpAreaAsPerSketchedPlan: { type: String, default: "" },
    buildingSpecificationsPlotLayout: { type: String, default: "" },
    floorAreaSqft: { type: String, default: "" },
    rateOfConstructionPerSqft: { type: String, default: "" },
    valueOfConstruction: { type: String, default: "" },
    rateOfConstructionValues: { type: String, default: "" },
    buildingSpecificationsPlotLayoutSqfRateValue: { type: String, default: "" },
    deedBuiltUpAreaSqft: { type: String, default: "" },
    estimatedRepairCostOfConstruction: { type: String, default: "" },
    floorAreaSqftLand: { type: String, default: "" },
    ratePerSqftLand: { type: String, default: "" },
    interior0PercentLand: { type: String, default: "" },
    entranceCanopyArea: { type: String, default: "" },
    
    // PAGE 15 - PROPERTY DETAILS SECTION
    locationOfProperty: { type: String, default: "" },
    plotNo: { type: String, default: "" },
    surveyNo: { type: String, default: "" },
    doorNo: { type: String, default: "" },
    taluka: { type: String, default: "" },
    mandal: { type: String, default: "" },
    district: { type: String, default: "" },
    briefDescriptionOfProperty: { type: String, default: "" },
    cityTown: { type: String, default: "" },
    residentialArea: { type: String, default: "" },
    commercialArea: { type: String, default: "" },
    industrialArea: { type: String, default: "" },
    classificationOfArea: { type: String, default: "" },
    urbanRural: { type: String, default: "" },
    mileSemUrban: { type: String, default: "" },
    municipalCorporationAsPer: { type: String, default: "" },
    
    // BOUNDARIES OF PROPERTY
    boundariesOfTheProperty: { type: String, default: "" },
    northBoundary: { type: String, default: "" },
    southBoundary: { type: String, default: "" },
    eastBoundary: { type: String, default: "" },
    westBoundary: { type: String, default: "" },
    
    // PAGE 16 - APARTMENT BUILDING & NATURE
    classificationOfLocality: { type: String, default: "" },
    developmentOfSurroundingAreas: { type: String, default: "" },
    possibilityOfFutureHousingMixing: { type: String, default: "" },
    feasibilityOf1To2Kms: { type: String, default: "" },
    typeOfStructureMaterial: { type: String, default: "" },
    shareOfLand: { type: String, default: "" },
    typeOfUseToWhichItCanBePut: { type: String, default: "" },
    anyUsageRestriction: { type: String, default: "" },
    isPlotInTownPlanning: { type: String, default: "" },
    cornerPlotOrInteriorFacilities: { type: String, default: "" },
    yearOfRoadAvailability: { type: String, default: "" },
    waterRoadAvailableBelowOrAbove: { type: String, default: "" },
    isALandArea: { type: String, default: "" },
    waterSewerageSystem: { type: String, default: "" },
    apartmentNature: { type: String, default: "" },
    apartmentLocation: { type: String, default: "" },
    apartmentCTSNo: { type: String, default: "" },
    apartmentSectorNo: { type: String, default: "" },
    apartmentBlockNo: { type: String, default: "" },
    apartmentWardNo: { type: String, default: "" },
    apartmentVillageMunicipalityCounty: { type: String, default: "" },
    apartmentDoorNoStreetRoad: { type: String, default: "" },
    apartmentPinCode: { type: String, default: "" },
    descriptionOfLocalityResidentialCommercialMixed: { type: String, default: "" },
    numberOfDwellingUnitsInBuilding: { type: String, default: "" },
    
    // PAGE 17 - APPROVAL & AUTHORIZATION
    constructionAsPer: { type: String, default: "" },
    panchayatMunicipalitySearchReport: { type: String, default: "" },
    watercoveredUnderSaleDeeds: { type: String, default: "" },
    governmentEnctmentsOrUtilitiesScheduledArea: { type: String, default: "" },
    dateIssueAndValidityOfApprovedPlan: { type: String, default: "" },
    whetherGenerousOnAuthority: { type: String, default: "" },
    anyOtherCommentsOrAuthorityApprovedPlan: { type: String, default: "" },
    purposeForValuation: { type: String, default: "" },
    dateOfInspection: { type: String, default: "" },
    dateOnWhichValuationIsMade: { type: String, default: "" },
    listOfDocumentsProducedForPerusal: { type: String, default: "" },
    protocolDocuments: { type: String, default: "" },
    sanctionedPlanStatus: { type: String, default: "" },
    certificateNumber: { type: String, default: "" },
    buildingCompletionCertificate: { type: String, default: "" },
    completionCertificateNo: { type: String, default: "" },
    ownerAddressJointOwners: { type: String, default: "" },
    jointOwnersDeDetailsOfJointOwnership: { type: String, default: "" }
    }, { _id: false });

const ubiApfSchema = new mongoose.Schema({
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

    directions: { type: ubiApfDirectionSchema, default: () => ({}) },
    coordinates: { type: ubiApfCoordinateSchema, default: () => ({}) },

    propertyImages: [mongoose.Schema.Types.Mixed],
    locationImages: [mongoose.Schema.Types.Mixed],
    photos: { type: ubiApfPhotoSchema, default: () => ({}) },
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
    pdfDetails: { type: ubiApfPdfDetailsSchema, default: () => ({}) },
    lastUpdatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
ubiApfSchema.index({ clientId: 1, uniqueId: 1 }, { unique: true, sparse: true });

ubiApfSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const ubiApfModel = mongoose.model("ubiApf", ubiApfSchema, "ubi_Apf");
export default ubiApfModel;
