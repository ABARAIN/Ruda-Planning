const axios = require('axios');

// Test data with JSON fields
const testData = {
  name: "Test Project",
  layer: "Test Layer", 
  map_name: "Test Map",
  category: "Test Category",
  ruda_phase: "Ruda Phase 1",
  description: "Test description",
  firms: [
    { img: "/test.jpg", name: "Test Company", title: "Contractor" }
  ],
  scope_of_work: [
    { name: "Earth Work", value: 100 },
    { name: "Concrete Work", value: 200 }
  ],
  physical_chart: [
    { month: "Jan-24", actual: 10, planned: 15 }
  ],
  financial_chart: [
    { name: "Contract Amount", value: 1000000 }
  ],
  kpi_chart: [
    { name: "Progress", value: 75 }
  ],
  curve_chart: [
    { name: "S-Curve", value: 50 }
  ]
};

async function testBackend() {
  try {
    console.log("🧪 Testing JSON fields backend integration...\n");
    
    // Test 1: Create a new record
    console.log("1️⃣ Creating new record with JSON fields...");
    const createResponse = await axios.post('https://ruda-planning.onrender.com/api/manage/all', testData);
    console.log("✅ Create successful!");
    console.log("Created record ID:", createResponse.data.row.gid);
    console.log("Firms field:", createResponse.data.row.firms);
    console.log("Scope of work field:", createResponse.data.row.scope_of_work);
    
    const recordId = createResponse.data.row.gid;
    
    // Test 2: Fetch all records to verify JSON parsing
    console.log("\n2️⃣ Fetching all records to verify JSON parsing...");
    const fetchResponse = await axios.get('https://ruda-planning.onrender.com/api/manage/all');
    const createdRecord = fetchResponse.data.find(record => record.gid === recordId);
    
    if (createdRecord) {
      console.log("✅ Record found in fetch!");
      console.log("Firms field type:", typeof createdRecord.firms, createdRecord.firms);
      console.log("Scope of work field type:", typeof createdRecord.scope_of_work, createdRecord.scope_of_work);
    } else {
      console.log("❌ Record not found in fetch");
    }
    
    // Test 3: Update the record
    console.log("\n3️⃣ Updating record with modified JSON fields...");
    const updatedData = {
      ...testData,
      name: "Updated Test Project",
      firms: [
        { img: "/updated.jpg", name: "Updated Company", title: "Main Contractor" },
        { img: "/partner.jpg", name: "Partner Company", title: "Sub Contractor" }
      ]
    };
    
    const updateResponse = await axios.put(`https://ruda-planning.onrender.com/api/manage/all/${recordId}`, updatedData);
    console.log("✅ Update successful!");
    console.log("Updated firms field:", updateResponse.data.row.firms);
    
    // Test 4: Fetch GeoJSON to verify JSON parsing in GeoJSON response
    console.log("\n4️⃣ Fetching GeoJSON to verify JSON parsing...");
    const geojsonResponse = await axios.get('https://ruda-planning.onrender.com/api/all');
    const geojsonRecord = geojsonResponse.data.features?.find(
      feature => feature.properties.gid === recordId
    );
    
    if (geojsonRecord) {
      console.log("✅ Record found in GeoJSON!");
      console.log("GeoJSON firms field:", geojsonRecord.properties.firms);
    } else {
      console.log("⚠️ Record not found in GeoJSON (might not have geometry)");
    }
    
    // Test 5: Clean up - delete the test record
    console.log("\n5️⃣ Cleaning up - deleting test record...");
    await axios.delete(`https://ruda-planning.onrender.com/api/manage/all/${recordId}`);
    console.log("✅ Test record deleted!");
    
    console.log("\n🎉 All tests completed successfully!");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
  }
}

// Run the test
testBackend();
