import mongoose from "mongoose";
import { ensureCompleteValuation } from "../utils/valuationDefaults.js";

const directionSchema = new mongoose.Schema({
    north1: { type: String, default: "" },
    east1: { type: String, default: "" },
    south1: { type: String, default: "" },
    west1: { type: String, default: "" },
    north2: { type: String, default: "" },
    east2: { type: String, default: "" },
    south2: { type: String, default: "" },
    west2: { type: String, default: "" }
}, { _id: false });

const coordinateSchema = new mongoose.Schema({
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" }
}, { _id: false });

const photoSchema = new mongoose.Schema({
    elevationImages: [String],
    siteImages: [String]
}, { _id: false });

const pdfDetailsSchema = new mongoose.Schema({
    formId: { type: String, default: "" },
    branch: { type: String, default: "" },
    valuationPurpose: { type: String, default: "" },
    inspectionDate: { type: String, default: "" },
    valuationMadeDate: { type: String, default: "" },
    mortgageDeed: { type: String, default: "" },
    mortgageDeedBetween: { type: String, default: "" },
    previousValuationReport: { type: String, default: "" },
    previousValuationInFavorOf: { type: String, default: "" },
    approvedPlanNo: { type: String, default: "" },
    purposeOfValuation: { type: String, default: "" },
    dateOfInspection: { type: String, default: "" },
    dateOfValuationMade: { type: String, default: "" },
    agreementForSale: { type: String, default: "" },
    commencementCertificate: { type: String, default: "" },
    occupancyCertificate: { type: String, default: "" },
    ownerNameAddress: { type: String, default: "" },
    briefDescriptionProperty: { type: String, default: "" },
    ownerName: { type: String, default: "" },
    plotSurveyNo: { type: String, default: "" },
    doorNo: { type: String, default: "" },
    tpVillage: { type: String, default: "" },
    wardTaluka: { type: String, default: "" },
    mandalDistrict: { type: String, default: "" },
    layoutPlanIssueDate: { type: String, default: "" },
    approvedMapAuthority: { type: String, default: "" },
    authenticityVerified: { type: String, default: "" },
    valuerCommentOnAuthenticity: { type: String, default: "" },
    postalAddress: { type: String, default: "" },
    cityTown: { type: String, default: "" },
    residentialArea: { type: Boolean, default: false },
    commercialArea: { type: Boolean, default: false },
    industrialArea: { type: Boolean, default: false },
    locationOfProperty: { type: String, default: "" },
    areaClassification: { type: String, default: "" },
    urbanClassification: { type: String, default: "" },
    governmentType: { type: String, default: "" },
    govtEnactmentsCovered: { type: String, default: "" },
    // BOUNDARIES OF PROPERTY - PLOT (Section 12a)
    boundariesPlotNorthDeed: { type: String, default: "" },
    boundariesPlotNorthActual: { type: String, default: "" },
    boundariesPlotSouthDeed: { type: String, default: "" },
    boundariesPlotSouthActual: { type: String, default: "" },
    boundariesPlotEastDeed: { type: String, default: "" },
    boundariesPlotEastActual: { type: String, default: "" },
    boundariesPlotWestDeed: { type: String, default: "" },
    boundariesPlotWestActual: { type: String, default: "" },
    // BOUNDARIES OF PROPERTY - SHOP (Section 12b)
    boundariesShopNorthDeed: { type: String, default: "" }, 
    boundariesShopNorthActual: { type: String, default: "" },
    boundariesShopSouthDeed: { type: String, default: "" },
    boundariesShopSouthActual: { type: String, default: "" },
    boundariesShopEastDeed: { type: String, default: "" },
    boundariesShopEastActual: { type: String, default: "" },
    boundariesShopWestDeed: { type: String, default: "" },
    boundariesShopWestActual: { type: String, default: "" },
    // Legacy fields (for backward compatibility)
    boundariesPlotNorth: { type: String, default: "" }, 
    boundariesPlotSouth: { type: String, default: "" },
    boundariesPlotEast: { type: String, default: "" },
    boundariesPlotWest: { type: String, default: "" },
    boundariesShopNorth: { type: String, default: "" },
    boundariesShopSouth: { type: String, default: "" },
    boundariesShopEast: { type: String, default: "" },
    boundariesShopWest: { type: String, default: "" },
    dimensionsDeed: { type: String, default: "" },
    dimensionsActual: { type: String, default: "" },
    extentOfUnit: { type: String, default: "" },
    latitudeLongitude: { type: String, default: "" },
    extentOfSiteValuation: { type: String, default: "" },
    rentReceivedPerMonth: { type: String, default: "" },
    apartmentNature: { type: String, default: "" },
    apartmentLocation: { type: String, default: "" },
    apartmentTSNo: { type: String, default: "" },
    apartmentBlockNo: { type: String, default: "" },
    apartmentWardNo: { type: String, default: "" },
    apartmentVillageMunicipalityCounty: { type: String, default: "" },
    apartmentDoorNoStreetRoadPinCode: { type: String, default: "" },
    descriptionOfLocalityResidentialCommercialMixed: { type: String, default: "" },
    yearOfConstruction: { type: String, default: "" },
    numberOfFloors: { type: String, default: "" },
    typeOfStructure: { type: String, default: "" },
    numberOfDwellingUnitsInBuilding: { type: String, default: "" },
    qualityOfConstruction: { type: String, default: "" },
    appearanceOfBuilding: { type: String, default: "" },
    maintenanceOfBuilding: { type: String, default: "" },
    fairMarketValue: { type: String, default: "" },
    realizableValue: { type: String, default: "" },
    distressValue: { type: String, default: "" },
    saleDeedValue: { type: String, default: "" },
    insurableValue: { type: String, default: "" },
    totalJantriValue: { type: String, default: "" },
    areaUsage: { type: String, default: "" },
    carpetAreaFlat: { type: String, default: "" },
    monthlyRent: { type: String, default: "" },
    marketability: { type: String, default: "" },
    favoringFactors: { type: String, default: "" },
    negativeFactors: { type: String, default: "" },
    comparableRate: { type: String, default: "" },
    adoptedBasicCompositeRate: { type: String, default: "" },
    buildingServicesRate: { type: String, default: "" },
    landOthersRate: { type: String, default: "" },
    guidelineRate: { type: String, default: "" },
    depreciatedBuildingRate: { type: String, default: "" },
    replacementCostServices: { type: String, default: "" },
    buildingAge: { type: String, default: "" },
    buildingLife: { type: String, default: "" },
    depreciationPercentage: { type: String, default: "" },
    deprecatedRatio: { type: String, default: "" },
    totalCompositeRate: { type: String, default: "" },
    rateForLandOther: { type: String, default: "" },
    presentValue: { type: String, default: "" },
    wardrobes: { type: String, default: "" },
    showcases: { type: String, default: "" },
    kitchenArrangements: { type: String, default: "" },
    superfineFinish: { type: String, default: "" },
    interiorDecorations: { type: String, default: "" },
    electricityDeposits: { type: String, default: "" },
    collapsibleGates: { type: String, default: "" },
    potentialValue: { type: String, default: "" },
    otherItems: { type: String, default: "" },
    totalValuationItems: { type: String, default: "" },
    place: { type: String, default: "" },
    signatureDate: { type: String, default: "" },
    signerName: { type: String, default: "" },
    reportDate: { type: String, default: "" },
    fairMarketValueWords: { type: String, default: "" }
}, { _id: false });

const buildingConstructionSchema = new mongoose.Schema({
    localityDescription: { type: String, default: "" },
    yearOfConstruction: { type: String, default: "" },
    numberOfFloors: { type: String, default: "" },
    typeOfStructure: { type: String, default: "" },
    numberOfDwellingUnits: { type: String, default: "" },
    qualityOfConstruction: { type: String, default: "" },
    appearanceOfBuilding: { type: String, default: "" },
    maintenanceOfBuilding: { type: String, default: "" }
}, { _id: false });

const facilitiesSchema = new mongoose.Schema({
    liftAvailable: { type: String, default: "" },
    protectedWaterSupply: { type: String, default: "" },
    undergroundSewerage: { type: String, default: "" },
    carParkingType: { type: String, default: "" },
    compoundWallExisting: { type: String, default: "" },
    pavementAroundBuilding: { type: String, default: "" }
}, { _id: false });

const unitSpecificationsSchema = new mongoose.Schema({
    floorLocation: { type: String, default: "" },
    doorNoUnit: { type: String, default: "" },
    roof: { type: String, default: "" },
    flooring: { type: String, default: "" },
    doors: { type: String, default: "" },
    windows: { type: String, default: "" },
    fittings: { type: String, default: "" },
    finishing: { type: String, default: "" }
}, { _id: false });

const unitTaxSchema = new mongoose.Schema({
    assessmentNo: { type: String, default: "" },
    taxPaidName: { type: String, default: "" },
    taxAmount: { type: String, default: "" }
}, { _id: false });

const electricityServiceSchema = new mongoose.Schema({
    electricityServiceConnectionNo: { type: String, default: "" },
    meterCardName: { type: String, default: "" }
}, { _id: false });

const unitMaintenanceSchema = new mongoose.Schema({
    unitMaintenanceStatus: { type: String, default: "" }
}, { _id: false });

const agreementForSaleSchema = new mongoose.Schema({
    agreementForSaleExecutedName: { type: String, default: "" }
}, { _id: false });

const unitAreaDetailsSchema = new mongoose.Schema({
    undividedLandAreaSaleDeed: { type: String, default: "" },
    plinthAreaUnit: { type: String, default: "" },
    carpetAreaUnit: { type: String, default: "" }
}, { _id: false });

const unitClassificationSchema = new mongoose.Schema({
     floorSpaceIndex: { type: String, default: "" },
     unitClassification: { type: String, default: "" },
     residentialOrCommercial: { type: String, default: "" },
     ownerOccupiedOrLetOut: { type: String, default: "" }
 }, { _id: false });

 const plotBoundariesSchema = new mongoose.Schema({
     north: { type: String, default: "" },
     south: { type: String, default: "" },
     east: { type: String, default: "" },
     west: { type: String, default: "" }
 }, { _id: false });

 const shopBoundariesSchema = new mongoose.Schema({
     north: { type: String, default: "" },
     south: { type: String, default: "" },
     east: { type: String, default: "" },
     west: { type: String, default: "" }
 }, { _id: false });

 const propertyBoundariesSchema = new mongoose.Schema({
     plotBoundaries: { type: plotBoundariesSchema, default: () => ({}) },
     shopBoundaries: { type: shopBoundariesSchema, default: () => ({}) }
 }, { _id: false });

 const propertyDimensionsSchema = new mongoose.Schema({
     dimensionsAsPerDeed: { type: String, default: "" },
     actualDimensions: { type: String, default: "" },
     extent: { type: String, default: "" },
     latitudeLongitudeCoordinates: { type: String, default: "" },
     extentSiteConsideredValuation: { type: String, default: "" }
 }, { _id: false });

 const rateValuationSchema = new mongoose.Schema({
     comparableRateSimilarUnitPerSqft: { type: Number, default: 0 },
     adoptedBasicCompositeRatePerSqft: { type: Number, default: 0 },
     buildingServicesRatePerSqft: { type: Number, default: 0 },
     landOthersRatePerSqft: { type: Number, default: 0 }
 }, { _id: false });

 const compositeRateDepreciationSchema = new mongoose.Schema({
     guidelineRatePerSqm: { type: Number, default: 0 },
     depreciatedBuildingRatePerSqft: { type: Number, default: 0 },
     replacementCostUnitServicesPerSqft: { type: Number, default: 0 },
     ageOfBuildingYears: { type: Number, default: 0 },
     lifeOfBuildingEstimatedYears: { type: Number, default: 0 },
     depreciationPercentageSalvage: { type: Number, default: 0 },
     depreciatedRatioBuilding: { type: Number, default: 0 },
     rateLandOtherV3IIPerSqft: { type: Number, default: 0 },
     totalCompositeRatePerSqft: { type: Number, default: 0 }
 }, { _id: false });

 const valuationResultsSchema = new mongoose.Schema({
     fairMarketValue: { type: Number, default: 0 },
     realizableValue: { type: Number, default: 0 },
     distressValue: { type: Number, default: 0 },
     saleDeedValue: { type: Number, default: 0 },
     insurableValue: { type: Number, default: 0 },
     totalJantriValue: { type: Number, default: 0 },
     fairMarketValueInWords: { type: String, default: "" }
 }, { _id: false });

 const additionalFlatDetailsSchema = new mongoose.Schema({
     areaUsage: { type: String, default: "" },
     carpetAreaFlat: { type: String, default: "" }
 }, { _id: false });

 const signatureReportSchema = new mongoose.Schema({
     place: { type: String, default: "" },
     signatureDate: { type: String, default: "" },
     signerName: { type: String, default: "" },
     reportDate: { type: String, default: "" }
 }, { _id: false });

 const apartmentLocationSchema = new mongoose.Schema({
     apartmentNature: { type: String, default: "" },
     apartmentLocation: { type: String, default: "" },
     tsNo: { type: String, default: "" },
     blockNo: { type: String, default: "" },
     wardNo: { type: String, default: "" },
     villageOrMunicipality: { type: String, default: "" },
     doorNoStreetRoadPinCode: { type: String, default: "" }
 }, { _id: false });

 const monthlyRentSchema = new mongoose.Schema({
     ifRentedMonthlyRent: { type: String, default: "" }
 }, { _id: false });

 const marketabilitySchema = new mongoose.Schema({
     howIsMarketability: { type: String, default: "" },
     factorsFavouringExtraPotential: { type: String, default: "" },
     negativeFactorsAffectingValue: { type: String, default: "" }
 }, { _id: false });

 const valuationDetailsTableSchema = new mongoose.Schema({
     details: [{
         srNo: { type: Number, default: 0 },
         description: { type: String, default: "" },
         qty: { type: String, default: "" },
         ratePerUnit: { type: String, default: "" },
         estimatedValue: { type: Number, default: 0 }
     }],
     valuationTotal: { type: Number, default: 0 }
 }, { _id: false });

 const guidelineRateSchema = new mongoose.Schema({
     guidelineRatePerSqm: { type: Number, default: 0 }
 }, { _id: false });

 const documentsProducedSchema = new mongoose.Schema({
      photocopyCopyAgreement: { type: String, default: "" },
      commencementCertificate: { type: String, default: "" },
      occupancyCertificate: { type: String, default: "" }
  }, { _id: false });

  const customFieldSchema = new mongoose.Schema({
      name: { type: String, required: true },
      value: { type: String, required: true }
  }, { _id: false });

 const locationOfPropertySchema = new mongoose.Schema({
     plotSurveyNo: { type: String, default: "" },
     doorNo: { type: String, default: "" },
     tsVillage: { type: String, default: "" },
     wardTaluka: { type: String, default: "" },
     mandalDistrict: { type: String, default: "" },
     dateLayoutIssueValidity: { type: String, default: "" },
     approvedMapIssuingAuthority: { type: String, default: "" },
     authenticityVerified: { type: String, default: "" },
     valuationCommentsAuthenticity: { type: String, default: "" }
 }, { _id: false });

 const ownerDetailsSchema = new mongoose.Schema({
     ownerNameAddress: { type: String, default: "" },
     propertyDescription: { type: String, default: "" }
 }, { _id: false });

 const postalAddressSchema = new mongoose.Schema({
     fullAddress: { type: String, default: "" }
 }, { _id: false });

 const cityAreaTypeSchema = new mongoose.Schema({
     cityTown: { type: String, default: "" },
     isResidentialArea: { type: Boolean, default: false },
     isCommercialArea: { type: Boolean, default: false },
     isIndustrialArea: { type: Boolean, default: false }
 }, { _id: false });

 const areaClassificationSchema = new mongoose.Schema({
     areaClassification: { type: String, default: "" },
     areaType: { type: String, default: "" },
     govGovernance: { type: String, default: "" },
     stateGovernmentEnactments: { type: String, default: "" }
 }, { _id: false });

 const documentInformationSchema = new mongoose.Schema({
     branch: { type: String, default: "" },
     dateOfInspection: { type: String, default: "" },
     dateOfValuation: { type: String, default: "" }
 }, { _id: false });

const ubiShopSchema = new mongoose.Schema({
    clientId: { type: String, required: true, index: true },
    uniqueId: { type: String, required: true, sparse: true },
    username: { type: String, required: true },
    dateTime: { type: String, required: true },
    day: { type: String, required: true },
    bankName: { type: String, required: true },
    city: { type: String, required: true },
    clientName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    payment: { type: String, required: true },
    collectedBy: { type: String, default: "" },
    dsa: { type: String, required: true },
    customDsa: { type: String, default: "" },
    engineerName: { type: String, required: true, default: "" },
    customEngineerName: { type: String, default: "" },
    notes: { type: String, default: "" },
    selectedForm: { type: String, default: null },
    elevation: { type: String, default: "" },
    directions: { type: directionSchema, default: () => ({}) },
    coordinates: { type: coordinateSchema, default: () => ({}) },
    propertyImages: [mongoose.Schema.Types.Mixed],
    locationImages: [mongoose.Schema.Types.Mixed],
    documentPreviews: [mongoose.Schema.Types.Mixed],
    photos: { type: photoSchema, default: () => ({}) },
    status: {
        type: String,
        enum: ["pending", "on-progress", "approved", "rejected", "rework"],
        default: "pending"
    },
    managerFeedback: { type: String, default: "" },
    submittedByManager: { type: Boolean, default: false },
    lastUpdatedBy: { type: String, default: "" },
    lastUpdatedByRole: { type: String, default: "" },
    pdfDetails: { type: pdfDetailsSchema, default: () => ({}) },
    buildingConstruction: { type: buildingConstructionSchema, default: () => ({}) },
    facilities: { type: facilitiesSchema, default: () => ({}) },
    unitSpecifications: { type: unitSpecificationsSchema, default: () => ({}) },
    unitTax: { type: unitTaxSchema, default: () => ({}) },
    electricityService: { type: electricityServiceSchema, default: () => ({}) },
    unitMaintenance: { type: unitMaintenanceSchema, default: () => ({}) },
    agreementForSale: { type: agreementForSaleSchema, default: () => ({}) },
    unitAreaDetails: { type: unitAreaDetailsSchema, default: () => ({}) },
    unitClassification: { type: unitClassificationSchema, default: () => ({}) },
    customBankName: { type: String, default: "" },
    customCity: { type: String, default: "" },
    reworkComments: { type: String, default: "" },
    reworkRequestedBy: { type: String, default: "" },
    reworkRequestedAt: { type: Date, default: null },
    reworkRequestedByRole: { type: String, default: "" },
    lastUpdatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // New nested objects for expanded valuation data
    documentInformation: { type: documentInformationSchema, default: () => ({}) },
    ownerDetails: { type: ownerDetailsSchema, default: () => ({}) },
    locationOfProperty: { type: locationOfPropertySchema, default: () => ({}) },
    postalAddress: { type: postalAddressSchema, default: () => ({}) },
    cityAreaType: { type: cityAreaTypeSchema, default: () => ({}) },
    areaClassification: { type: areaClassificationSchema, default: () => ({}) },
    propertyBoundaries: { type: propertyBoundariesSchema, default: () => ({}) },
    propertyDimensions: { type: propertyDimensionsSchema, default: () => ({}) },
    rateValuation: { type: rateValuationSchema, default: () => ({}) },
    compositeRateDepreciation: { type: compositeRateDepreciationSchema, default: () => ({}) },
    valuationResults: { type: valuationResultsSchema, default: () => ({}) },
    additionalFlatDetails: { type: additionalFlatDetailsSchema, default: () => ({}) },
    signatureReport: { type: signatureReportSchema, default: () => ({}) },
    apartmentLocation: { type: apartmentLocationSchema, default: () => ({}) },
    monthlyRent: { type: monthlyRentSchema, default: () => ({}) },
    marketability: { type: marketabilitySchema, default: () => ({}) },
    valuationDetailsTable: { type: valuationDetailsTableSchema, default: () => ({}) },
    guidelineRate: { type: guidelineRateSchema, default: () => ({}) },
    documentsProduced: { type: documentsProducedSchema, default: () => ({}) },
    customFields: [{ type: customFieldSchema, default: () => ({}) }]
});

ubiShopSchema.index({ clientId: 1, uniqueId: 1 }, { unique: true, sparse: true });

ubiShopSchema.post(['find', 'findOne', 'findOneAndUpdate'], function(docs) {
    if (!docs) return docs;
    
    if (Array.isArray(docs)) {
        return docs.map(doc => ensureCompleteValuation(doc));
    } else {
        return ensureCompleteValuation(docs);
    }
});

const UbiShopModel = mongoose.model("UbiShop", ubiShopSchema);
export default UbiShopModel;