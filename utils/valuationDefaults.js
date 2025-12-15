/**
 * Default structure for all valuation nested schemas
 * Ensures consistent data structure across API responses
 */
export const VALUATION_DEFAULTS = {
    directions: {
        north1: "", east1: "", south1: "", west1: "",
        north2: "", east2: "", south2: "", west2: ""
    },
    coordinates: { latitude: "", longitude: "" },
    photos: { elevationImages: [], siteImages: [] },
    unitClassification: {
        floorSpaceIndex: "", unitClassification: "", 
        residentialOrCommercial: "", ownerOccupiedOrLetOut: ""
    },
    valuationResults: {
        fairMarketValue: 0, realizableValue: 0, distressValue: 0,
        saleDeedValue: 0, insurableValue: 0, totalJantriValue: 0,
        fairMarketValueInWords: ""
    },
    additionalFlatDetails: { areaUsage: "", carpetAreaFlat: "" },
    signatureReport: {
        place: "", signatureDate: "", signerName: "", reportDate: ""
    },
    monthlyRent: { monthlyRent: "" },
    marketability: {
        marketability: "", factorsFavouringExtraPotential: "",
        negativeFactorsAffectingValue: ""
    },
    rateInfo: {
        comparableRateSimilarUnit: 0, adoptedBasicCompositeRate: 0,
        buildingServicesRate: 0, landOthersRate: 0
    },
    valuationDetailsTable: { details: [], valuationTotal: 0 },
    electricityService: {
        electricityServiceConnectionNo: "", meterCardName: ""
    },
    unitMaintenance: { unitMaintenanceStatus: "" },
    agreementForSale: { agreementForSaleExecutedName: "" },
    unitAreaDetails: {
        undividedLandAreaSaleDeed: "", plinthAreaUnit: "",
        carpetAreaUnit: ""
    },
    compositeRate: {
        guidelineRateRegistrar: 0, depreciatedBuildingRate: 0,
        replacementCostUnitServices: 0, ageOfBuilding: 0,
        lifeOfBuildingEstimated: 0, depreciationPercentageSalvage: 0,
        depreciatedRatioBuilding: 0, depreciatedBuildingRateVIA: 0,
        rateLandOtherV3II: 0, totalCompositeRate: 0
    },
    unitSpecifications: {
        floorLocation: "", doorNoUnit: "", roof: "", flooring: "",
        doors: "", windows: "", fittings: "", finishing: ""
    },
    unitTax: {
        assessmentNo: "", taxPaidName: "", taxAmount: 0
    },
    buildingConstruction: {
        localityDescription: "", yearOfConstruction: "",
        numberOfFloors: "", typeOfStructure: "",
        numberOfDwellingUnits: "", qualityOfConstruction: "",
        appearanceOfBuilding: "", maintenanceOfBuilding: ""
    },
    facilities: {
        liftAvailable: "", protectedWaterSupply: "",
        undergroundSewerage: "", carParkingType: "",
        compoundWallExisting: "", pavementAroundBuilding: ""
    },
    propertyBoundaries: {
        plotBoundaries: {
            north: "", south: "", east: "", west: ""
        },
        shopBoundaries: { north: "", south: "" }
    },
    propertyDimensions: {
        dimensionsAsPerDeed: "", actualDimensions: "", extent: "",
        latitudeLongitudeCoordinates: "", extentSiteConsideredValuation: ""
    },
    buildingOccupancy: { occupancyDetails: "" },
    apartmentLocation: {
        apartmentNature: "", apartmentLocation: "", tsNo: "",
        blockNo: "", wardNo: "", villageOrMunicipality: "",
        doorNoStreetRoadPinCode: ""
    },
    documentInformation: {
        branch: "", dateOfInspection: "", dateOfValuation: ""
    },
    documentsProduced: {
        photocopyCopyAgreement: "", commencementCertificate: "",
        occupancyCertificate: ""
    },
    ownerDetails: {
        ownerNameAddress: "", propertyDescription: ""
    },
    locationOfProperty: {
        plotSurveyNo: "", doorNo: "", tsVillage: "",
        wardTaluka: "", mandalDistrict: "",
        dateLayoutIssueValidity: "", approvedMapIssuingAuthority: "",
        authenticityVerified: "", valuationCommentsAuthenticity: ""
    },
    postalAddress: { fullAddress: "" },
    cityAreaType: {
        cityTown: "", isResidentialArea: false,
        isCommercialArea: false, isIndustrialArea: false
    },
    areaClassification: {
        areaClassification: "", areaType: "", govGovernance: "",
        stateGovernmentEnactments: ""
    }
};

/**
 * Ensures all nested fields are populated with their default values
 * Merges defaults with actual data, preferring actual data
 * @param {Object} doc - The document to process
 * @returns {Object} - Document with all nested fields populated
 */
export const ensureCompleteValuation = (doc) => {
    if (!doc) return doc;
    
    const plainDoc = doc.toObject?.() || doc;
    
    // Merge defaults with actual data
    Object.keys(VALUATION_DEFAULTS).forEach(key => {
        plainDoc[key] = {
            ...VALUATION_DEFAULTS[key],
            ...(plainDoc[key] || {})
        };
    });
    
    return plainDoc;
};
