/**
 * Valuation Validator
 * Validates valuation data and PDF details
 */

export class ValuationValidator {
  /**
   * Validate basic valuation information
   */
  static validateBasicInfo(data) {
    const errors = [];

    if (!data.clientId) errors.push("Client ID is required");
    if (!data.bankName) errors.push("Bank name is required");
    if (!data.city) errors.push("City is required");
    if (!data.clientName) errors.push("Client name is required");
    if (!data.mobileNumber) {
      errors.push("Mobile number is required");
    } else if (!ValuationValidator._isValidPhoneNumber(data.mobileNumber)) {
      errors.push("Invalid mobile number format");
    }
    if (!data.address) errors.push("Address is required");
    if (!data.dsa) errors.push("DSA is required");

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate property details
   */
  static validatePropertyDetails(pdfDetails) {
    const errors = [];

    if (!pdfDetails.ownerName) errors.push("Owner name is required");
    if (!pdfDetails.plotSurveyBlockNo) errors.push("Plot survey block no is required");
    if (!pdfDetails.cityTown) errors.push("City/Town is required");
    if (!pdfDetails.builtUpArea) {
      errors.push("Built up area is required");
    } else if (isNaN(parseFloat(pdfDetails.builtUpArea))) {
      errors.push("Built up area must be a number");
    }
    if (!pdfDetails.carpetArea) {
      errors.push("Carpet area is required");
    } else if (isNaN(parseFloat(pdfDetails.carpetArea))) {
      errors.push("Carpet area must be a number");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate valuation amounts
   */
  static validateValuationAmounts(pdfDetails) {
    const errors = [];

    if (!pdfDetails.fairMarketValue) {
      errors.push("Fair market value is required");
    } else if (isNaN(parseFloat(pdfDetails.fairMarketValue))) {
      errors.push("Fair market value must be a number");
    } else if (parseFloat(pdfDetails.fairMarketValue) <= 0) {
      errors.push("Fair market value must be greater than 0");
    }

    if (pdfDetails.realizableValue && isNaN(parseFloat(pdfDetails.realizableValue))) {
      errors.push("Realizable value must be a number");
    }

    if (pdfDetails.distressValue && isNaN(parseFloat(pdfDetails.distressValue))) {
      errors.push("Distress value must be a number");
    }

    if (pdfDetails.insurableValue && isNaN(parseFloat(pdfDetails.insurableValue))) {
      errors.push("Insurable value must be a number");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate rate information
   */
  static validateRates(pdfDetails) {
    const errors = [];

    if (!pdfDetails.compositeRate) {
      errors.push("Composite rate is required");
    } else if (isNaN(parseFloat(pdfDetails.compositeRate))) {
      errors.push("Composite rate must be a number");
    }

    if (pdfDetails.jantriRate && isNaN(parseFloat(pdfDetails.jantriRate))) {
      errors.push("Jantri rate must be a number");
    }

    if (pdfDetails.buildingServiceRate && isNaN(parseFloat(pdfDetails.buildingServiceRate))) {
      errors.push("Building service rate must be a number");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate depreciation details
   */
  static validateDepreciation(pdfDetails) {
    const errors = [];

    if (!pdfDetails.buildingAge) {
      errors.push("Building age is required");
    } else if (isNaN(parseInt(pdfDetails.buildingAge))) {
      errors.push("Building age must be a number");
    }

    if (!pdfDetails.buildingLife) {
      errors.push("Building life is required");
    } else if (isNaN(parseInt(pdfDetails.buildingLife))) {
      errors.push("Building life must be a number");
    } else if (parseInt(pdfDetails.buildingAge) > parseInt(pdfDetails.buildingLife)) {
      errors.push("Building age cannot be greater than building life");
    }

    if (pdfDetails.depreciationPercentage && isNaN(parseFloat(pdfDetails.depreciationPercentage))) {
      errors.push("Depreciation percentage must be a number");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate complete valuation data
   */
  static validateCompleteValuation(valuationData) {
    const results = {
      basicInfo: ValuationValidator.validateBasicInfo(valuationData),
      propertyDetails: ValuationValidator.validatePropertyDetails(valuationData.pdfDetails || {}),
      valuationAmounts: ValuationValidator.validateValuationAmounts(valuationData.pdfDetails || {}),
      rates: ValuationValidator.validateRates(valuationData.pdfDetails || {}),
      depreciation: ValuationValidator.validateDepreciation(valuationData.pdfDetails || {})
    };

    const allErrors = [
      ...results.basicInfo.errors,
      ...results.propertyDetails.errors,
      ...results.valuationAmounts.errors,
      ...results.rates.errors,
      ...results.depreciation.errors
    ];

    return {
      isValid: allErrors.length === 0,
      totalErrors: allErrors.length,
      errors: allErrors,
      details: results
    };
  }

  /**
   * Validate phone number format
   */
  static _isValidPhoneNumber(phoneNumber) {
    // Basic validation for Indian phone numbers
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber.replace(/[^\d]/g, ""));
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate dates
   */
  static isValidDate(dateString) {
    try {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date);
    } catch {
      return false;
    }
  }

  /**
   * Validate monetary amount
   */
  static isValidAmount(amount) {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
  }

  /**
   * Check for data consistency
   */
  static checkDataConsistency(valuationData) {
    const issues = [];
    const pdfDetails = valuationData.pdfDetails || {};

    // Check if carpet area is less than or equal to built up area
    if (pdfDetails.carpetArea && pdfDetails.builtUpArea) {
      const carpetArea = parseFloat(pdfDetails.carpetArea);
      const builtUpArea = parseFloat(pdfDetails.builtUpArea);
      if (carpetArea > builtUpArea) {
        issues.push("Carpet area cannot be greater than built up area");
      }
    }

    // Check if fair market value is reasonable
    if (pdfDetails.fairMarketValue && pdfDetails.compositeRate && pdfDetails.carpetArea) {
      const expectedValue = parseFloat(pdfDetails.compositeRate) * parseFloat(pdfDetails.carpetArea);
      const actualValue = parseFloat(pdfDetails.fairMarketValue);
      const variance = Math.abs((actualValue - expectedValue) / expectedValue);
      if (variance > 0.2) {
        issues.push(
          `Fair market value variance is ${(variance * 100).toFixed(2)}% from expected value`
        );
      }
    }

    // Check depreciation percentage
    if (pdfDetails.buildingAge && pdfDetails.buildingLife) {
      const age = parseInt(pdfDetails.buildingAge);
      const life = parseInt(pdfDetails.buildingLife);
      const expectedDepreciation = (age / life) * 100;
      if (pdfDetails.depreciationPercentage) {
        const actualDepreciation = parseFloat(pdfDetails.depreciationPercentage);
        if (Math.abs(actualDepreciation - expectedDepreciation) > 5) {
          issues.push(
            `Depreciation percentage seems inconsistent with building age and life`
          );
        }
      }
    }

    return {
      hasIssues: issues.length > 0,
      issues
    };
  }

  /**
   * Generate validation report
   */
  static generateValidationReport(valuationData) {
    const validation = ValuationValidator.validateCompleteValuation(valuationData);
    const consistency = ValuationValidator.checkDataConsistency(valuationData);

    return {
      timestamp: new Date().toISOString(),
      overallStatus: validation.isValid && !consistency.hasIssues ? "PASS" : "FAIL",
      validation: {
        totalErrors: validation.totalErrors,
        errors: validation.errors,
        sections: validation.details
      },
      consistency: {
        hasIssues: consistency.hasIssues,
        issues: consistency.issues
      },
      summary: {
        totalIssues: validation.totalErrors + consistency.issues.length,
        criticalIssues: validation.totalErrors,
        warnings: consistency.issues.length
      }
    };
  }
}

export default ValuationValidator;
