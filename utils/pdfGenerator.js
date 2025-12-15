/**
 * PDF Generator Utility
 * Generates PDF reports from valuation data
 * 
 * Usage:
 * const pdfPath = await PDFGenerator.generateValuationReport(valuationData, './reports/report.pdf');
 * 
 * @example
 * // Generate a single valuation report
 * const data = {
 *   address: "123 Main St",
 *   pdfDetails: {
 *     fairMarketValue: "1440000",
 *     carpetArea: "1200"
 *   }
 * };
 * await PDFGenerator.generateValuationReport(data, './output/report.pdf');
 */

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export class PDFGenerator {
  /**
   * Create a new PDF document with valuation details
   * 
   * @param {Object} valuationData - Complete valuation data object
   * @param {string} outputPath - File path where PDF will be saved
   * @returns {Promise<string>} Path to generated PDF file
   * 
   * @description
   * This method creates a professional A4 PDF report with:
   * - Header section with report details
   * - Property information
   * - Valuation amounts and details
   * - Rate analysis
   * - Depreciation information
   * - Signature section
   * 
   * The PDF is created in a stream to handle large files efficiently
   */
  static generateValuationReport(valuationData, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // Create PDF document with A4 size and 50px margins
        const doc = new PDFDocument({
          size: "A4",
          margin: 50,
          bufferPages: true
        });

        // Create write stream to file system
        const writeStream = fs.createWriteStream(outputPath);
        doc.pipe(writeStream);

        // Add PDF sections in order
        // These methods format and add content to the document
        PDFGenerator._addHeader(doc, valuationData);          // Report title and date
        PDFGenerator._addPropertyDetails(doc, valuationData); // Owner, address, location
        PDFGenerator._addValuationDetails(doc, valuationData); // Areas, values
        PDFGenerator._addRateAnalysis(doc, valuationData);     // Composite rates, jantri
        PDFGenerator._addDepreciation(doc, valuationData);     // Depreciation details
        PDFGenerator._addFooter(doc, valuationData);          // Signature and date

        // End document generation
        doc.end();

        // Handle successful file writing
        writeStream.on("finish", () => {
          resolve(outputPath);
        });

        // Handle file write errors
        writeStream.on("error", (error) => {
          reject(error);
        });
      } catch (error) {
        // Handle document creation errors
        reject(error);
      }
    });
  }

  /**
   * Add header section to PDF
   * 
   * @description Adds the title and basic report information at the top
   * Includes: Report title, Report number, Valuation date
   */
  static _addHeader(doc, valuationData) {
    const pdfDetails = valuationData.pdfDetails || {};

    // Add report title (16pt, bold, centered)
    doc.fontSize(16).font("Helvetica-Bold").text("VALUATION REPORT", { align: "center" });
    
    // Add report number from pdfDetails
    doc.fontSize(10).text(`Report No: ${pdfDetails.formId || "N/A"}`, { align: "center" });
    
    // Add valuation date formatted as local date string
    doc.fontSize(10).text(
      `Date: ${valuationData.dateTime ? new Date(valuationData.dateTime).toLocaleDateString() : "N/A"}`,
      { align: "center" }
    );
    
    // Add vertical space
    doc.moveDown();
  }

  /**
   * Add property details section to PDF
   * 
   * @description Shows property identification information
   * Includes: Address, Owner, Property Type, Survey Block, Locality, City
   */
  static _addPropertyDetails(doc, valuationData) {
    const pdfDetails = valuationData.pdfDetails || {};

    // Section heading (12pt, bold, underlined)
    doc.fontSize(12).font("Helvetica-Bold").text("Property Details", { underline: true });
    doc.fontSize(10).font("Helvetica");

    // Array of property details to display
    // Each has a label and value extracted from valuationData
    const propertyDetails = [
      { label: "Address", value: valuationData.address || "N/A" },
      { label: "Owner Name", value: pdfDetails.ownerName || "N/A" },
      { label: "Property Type", value: pdfDetails.apartmentNature || "N/A" },
      { label: "Survey Block No", value: pdfDetails.plotSurveyBlockNo || "N/A" },
      { label: "Locality", value: pdfDetails.localityDescription || "N/A" },
      { label: "City", value: valuationData.city || "N/A" }
    ];

    // Render each detail as a single line
    propertyDetails.forEach(({ label, value }) => {
      doc.text(`${label}: ${value}`);
    });

    // Add space before next section
    doc.moveDown();
  }

  /**
   * Add valuation details section to PDF
   * 
   * @description Shows key valuation values and areas
   * Includes: Built up area, Carpet area, FMV, Realizable value, etc.
   */
  static _addValuationDetails(doc, valuationData) {
    const pdfDetails = valuationData.pdfDetails || {};

    // Section heading
    doc.fontSize(12).font("Helvetica-Bold").text("Valuation Details", { underline: true });
    doc.fontSize(10).font("Helvetica");

    // Array of valuation details from pdfDetails object
    // These are the key monetary and area values
    const valuationDetails = [
      { label: "Built Up Area", value: `${pdfDetails.builtUpArea || "N/A"} Sqft` },
      { label: "Carpet Area", value: `${pdfDetails.carpetArea || "N/A"} Sqft` },
      { label: "Fair Market Value", value: pdfDetails.fairMarketValue || "N/A" },        // Primary valuation
      { label: "Realizable Value", value: pdfDetails.realizableValue || "N/A" },        // Quick sale value
      { label: "Distress Value", value: pdfDetails.distressValue || "N/A" },            // Forced sale value
      { label: "Insurable Value", value: pdfDetails.insurableValue || "N/A" }           // Insurance value
    ];

    // Render each valuation detail
    valuationDetails.forEach(({ label, value }) => {
      doc.text(`${label}: ${value}`);
    });

    doc.moveDown();
  }

  /**
   * Add rate analysis section to PDF
   * 
   * @description Shows different rates used in valuation
   * Includes: Composite rate, Jantri rate, Building service rate, etc.
   */
  static _addRateAnalysis(doc, valuationData) {
    const pdfDetails = valuationData.pdfDetails || {};

    // Section heading
    doc.fontSize(12).font("Helvetica-Bold").text("Rate Analysis", { underline: true });
    doc.fontSize(10).font("Helvetica");

    // Array of rate information
    // These are the per-unit rates used to calculate final values
    const rateDetails = [
      { label: "Composite Rate", value: pdfDetails.compositeRate || "N/A" },              // Overall rate per sqft
      { label: "Jantri Rate", value: pdfDetails.jantriRate || "N/A" },                    // Government rate
      { label: "Building Service Rate", value: pdfDetails.buildingServiceRate || "N/A" }, // Building component
      { label: "Land & Other Rate", value: pdfDetails.landOtherRate || "N/A" },           // Land component
      { label: "Final Composite Rate", value: pdfDetails.finalCompositeRate || "N/A" }    // Final calculated rate
    ];

    // Render each rate
    rateDetails.forEach(({ label, value }) => {
      doc.text(`${label}: ${value}`);
    });

    doc.moveDown();
  }

  /**
   * Add depreciation section to PDF
   * 
   * @description Shows depreciation calculation and related values
   * Includes: Building age, life, depreciation %, depreciated rate, etc.
   */
  static _addDepreciation(doc, valuationData) {
    const pdfDetails = valuationData.pdfDetails || {};

    // Section heading
    doc.fontSize(12).font("Helvetica-Bold").text("Depreciation Analysis", { underline: true });
    doc.fontSize(10).font("Helvetica");

    // Array of depreciation information
    // These show how depreciation affects the property value
    const depreciationDetails = [
      { label: "Building Age", value: `${pdfDetails.buildingAge || "N/A"} years` },                    // Current age
      { label: "Building Life", value: `${pdfDetails.buildingLife || "N/A"} years` },                   // Expected life
      { label: "Depreciation %", value: `${pdfDetails.depreciationPercentage || "N/A"}%` },             // Depreciation rate
      { label: "Depreciated Building Rate", value: pdfDetails.depreciatedBuildingRate || "N/A" },      // Rate after depreciation
      { label: "Replacement Cost", value: pdfDetails.replacementCost || "N/A" }                        // Full replacement cost
    ];

    // Render each depreciation detail
    depreciationDetails.forEach(({ label, value }) => {
      doc.text(`${label}: ${value}`);
    });

    doc.moveDown();
  }

  /**
   * Add footer section to PDF
   * 
   * @description Adds signature line and report finalization details
   * Includes: Engineer signature, Location, Date
   */
  static _addFooter(doc, valuationData) {
    const pdfDetails = valuationData.pdfDetails || {};

    // Separator line
    doc.fontSize(10).font("Helvetica").text("---", { align: "center" });
    
    // Valuer/Engineer signature
    doc.fontSize(10).text(`Signed By: ${valuationData.engineerName || "N/A"}`, { align: "center" });
    
    // Place where report was signed
    doc.fontSize(10).text(`Place: ${pdfDetails.place || "N/A"}`, { align: "center" });
    
    // Date of report signature
    doc.fontSize(10).text(`Date: ${pdfDetails.signatureDate || "N/A"}`, { align: "center" });
  }

  /**
   * Generate summary table
   */
  static generateSummaryTable(doc, data) {
    const tableHeaders = ["Field", "Value"];
    const tableRows = Object.entries(data).map(([key, value]) => [
      key.replace(/([A-Z])/g, " $1").trim(),
      String(value)
    ]);

    doc.fontSize(10).text("Summary Table:", { underline: true });

    // Create a simple table
    let y = doc.y;
    const columnWidth = (doc.page.width - 100) / 2;

    tableHeaders.forEach((header, i) => {
      doc.text(header, 50 + i * columnWidth, y, { width: columnWidth });
    });

    doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
    y += 20;

    tableRows.forEach(row => {
      row.forEach((cell, i) => {
        doc.text(String(cell), 50 + i * columnWidth, y, {
          width: columnWidth,
          fontSize: 9
        });
      });
      y += 20;
    });

    doc.moveDown();
  }

  /**
   * Add images to PDF
   */
  static addImagesToReport(doc, imagePaths) {
    return new Promise((resolve, reject) => {
      try {
        imagePaths.forEach((imagePath, index) => {
          if (fs.existsSync(imagePath)) {
            if (index > 0) {
              doc.addPage();
            }
            doc.image(imagePath, 50, 50, { width: 500 });
          }
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate multi-page report
   */
  static async generateComprehensiveReport(valuationData, imagePaths = [], outputPath) {
    try {
      // Generate main report
      await PDFGenerator.generateValuationReport(valuationData, outputPath);

      // Optionally add images
      if (imagePaths && imagePaths.length > 0) {
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(outputPath.replace(".pdf", "_with_images.pdf"));
        doc.pipe(writeStream);

        // Add original content (simplified)
        PDFGenerator._addHeader(doc, valuationData);
        PDFGenerator._addPropertyDetails(doc, valuationData);
        PDFGenerator._addValuationDetails(doc, valuationData);

        // Add images
        await PDFGenerator.addImagesToReport(doc, imagePaths);

        doc.end();

        return new Promise((resolve, reject) => {
          writeStream.on("finish", () => {
            resolve(outputPath.replace(".pdf", "_with_images.pdf"));
          });
          writeStream.on("error", reject);
        });
      }

      return outputPath;
    } catch (error) {
      throw new Error(`Error generating comprehensive report: ${error.message}`);
    }
  }

  /**
   * Generate valuation comparison report
   */
  static generateComparisonReport(valuation1Data, valuation2Data, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const writeStream = fs.createWriteStream(outputPath);
        doc.pipe(writeStream);

        doc.fontSize(16).font("Helvetica-Bold").text("VALUATION COMPARISON REPORT", { align: "center" });
        doc.moveDown();

        // Property 1
        doc.fontSize(12).font("Helvetica-Bold").text("Property 1");
        PDFGenerator._addPropertyDetails(doc, valuation1Data);
        PDFGenerator._addValuationDetails(doc, valuation1Data);

        doc.addPage();

        // Property 2
        doc.fontSize(12).font("Helvetica-Bold").text("Property 2");
        PDFGenerator._addPropertyDetails(doc, valuation2Data);
        PDFGenerator._addValuationDetails(doc, valuation2Data);

        doc.end();

        writeStream.on("finish", () => {
          resolve(outputPath);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default PDFGenerator;
