import { HeaderIntelligenceService } from "../../backend/src/services/header-intelligence/headerIntelligence.service";

function runUnitTests() {
  console.log("====================================================");
  console.log("  Header Intelligence Engine Unit Test Suite        ");
  console.log("====================================================\n");

  const service = new HeaderIntelligenceService();

  const testCases = [
    { input: "Customer Name", expectedField: "name" },
    { input: "Buyer Name", expectedField: "name" },
    { input: "Prospect", expectedField: "name" },
    { input: "Primary Contact", expectedField: "mobile_without_country_code" },
    { input: "Reach Me", expectedField: "mobile_without_country_code" },
    { input: "Observation", expectedField: "crm_note" },
    { input: "Campaign", expectedField: "data_source" },
    { input: "Project", expectedField: "data_source" },
    { input: "Lead Status", expectedField: "crm_status" },
    { input: "Submitted At", expectedField: "created_at" },
    { input: "Possession", expectedField: "possession_time" },
    { input: "Organisation", expectedField: "company" },
    { input: "Organisation Name", expectedField: "company" },
    { input: "Sales status", expectedField: "crm_status" },
    { input: "Email Address", expectedField: "email" },
    { input: "zx", expectedField: "UNKNOWN" },
  ];

  let passed = 0;
  testCases.forEach(({ input, expectedField }) => {
    const mappings = service.analyzeHeaders([input]);
    const mapping = mappings[0];

    if (mapping && mapping.mappedField === expectedField) {
      console.log(`✓ ${input} -> ${expectedField} (Confidence: ${mapping.confidence}, Method: ${mapping.matchingMethod})`);
      passed++;
    } else {
      console.log(`✗ ${input} - Failed. Expected: ${expectedField}, Got: ${mapping?.mappedField || "undefined"}`);
    }
  });

  console.log("\n====================================================");
  console.log(`Passed: ${passed} / ${testCases.length}`);
  console.log("====================================================");

  if (passed === testCases.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runUnitTests();
