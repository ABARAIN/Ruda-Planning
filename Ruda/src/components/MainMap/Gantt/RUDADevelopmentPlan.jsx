import React, { useState } from "react";
// Updated CSS styles embedded in component
const styles = `
.ruda-container {
    width: 100%;
    overflow-x: auto;
    font-family: Arial, sans-serif;
    font-size: 12px;
  }
  
  .ruda-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1e3a5f;
    color: white;
    padding: 12px 20px;
    margin-bottom: 0;
  }
  
  .ruda-title {
    font-weight: bold;
    font-size: 20px;
    margin: 0;
  }
  
  .ruda-logo {
    color: #c0c0c0;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .ruda-table {
    border-collapse: collapse;
    width: 100%;
    min-width: 1400px;
  }
  
  .ruda-header {
    background-color: #1e3a5f;
    color: white;
    font-weight: bold;
    font-size: 12px;
    padding: 8px 4px;
    border: 1px solid #2c4a6b;
    text-align: center;
    vertical-align: middle;
  }
  
  .ruda-month-header {
    background-color: #1e3a5f;
    color: white;
    font-size: 9px;
    padding: 4px 1px;
    border: 1px solid #2c4a6b;
    text-align: center;
  }
  
  .ruda-phase-header {
    background-color: #4a4a4a;
    color: white;
    font-weight: bold;
    font-size: 13px;
    padding: 6px 8px;
    border: 1px solid #5a5a5a;
    text-align: left;
  }
  
  .ruda-phase-row {
    cursor: pointer;
  }
  
  .ruda-phase-row:hover {
    background-color: #f0f0f0;
  }
  
  .ruda-package-row {
    cursor: pointer;
    background-color: #f8f9fa;
  }
  
  .ruda-package-row:hover {
    background-color: #e9ecef;
  }
  
  .ruda-subpackage-row {
    cursor: pointer;
    background-color: #fff3cd;
  }
  
  .ruda-subpackage-row:hover {
    background-color: #ffeaa7;
  }
  
  .ruda-activity-row {
    cursor: pointer;
    background-color: #d1ecf1;
  }
  
  .ruda-activity-row:hover {
    background-color: #bee5eb;
  }
  
  .package-cell {
    padding-left: 16px;
    font-weight: bold;
    color: #2c5282;
  }
  
  .subpackage-cell {
    padding-left: 32px;
    font-weight: bold;
    color: #b7791f;
  }
  
  .ruda-subsubpackage-row {
    cursor: pointer;
    background-color: #e1f5fe;
  }
  
  .ruda-subsubpackage-row:hover {
    background-color: #b3e5fc;
  }
  
  .ruda-reach-row {
    cursor: pointer;
    background-color: #f3e5f5;
  }
  
  .ruda-reach-row:hover {
    background-color: #e1bee7;
  }
  
  .ruda-material-row {
    cursor: pointer;
    background-color: #e8f5e8;
  }
  
  .ruda-material-row:hover {
    background-color: #c8e6c9;
  }
  
  .activity-cell {
    padding-left: 48px;
    color: #2c5aa0;
  }
  
  .ruda-subsubpackage-row {
    cursor: pointer;
    background-color: #e1f5fe;
  }
  
  .ruda-subsubpackage-row:hover {
    background-color: #b3e5fc;
  }
  
  .ruda-reach-row {
    cursor: pointer;
    background-color: #f3e5f5;
  }
  
  .ruda-reach-row:hover {
    background-color: #e1bee7;
  }
  
  .ruda-material-row {
    cursor: pointer;
    background-color: #e8f5e8;
  }
  
  .ruda-material-row:hover {
    background-color: #c8e6c9;
  }
  
  .subsubpackage-cell {
    padding-left: 48px;
    font-weight: bold;
    color: #0277bd;
  }
  
  .reach-cell {
    padding-left: 64px;
    font-weight: bold;
    color: #7b1fa2;
  }
  
  .material-cell {
    padding-left: 80px;
    color: #2e7d32;
  }
  
  .ruda-separator-row {
    background-color: #e2e8f0;
  }
  
  .ruda-separator-cell {
    padding: 8px 16px;
    font-weight: bold;
    color: #4a5568;
    border: 1px solid #cbd5e0;
  }
  
  .ruda-cell {
    padding: 4px 8px;
    font-size: 11px;
    border: 1px solid #ddd;
    background-color: white;
    text-align: left;
  }
  
  .ruda-bold {
    font-weight: bold;
  }
  
  .ruda-timeline-cell {
    position: relative;
    height: 20px;
    border: 1px solid #ddd;
    background-color: white;
  }
  
  .ruda-bar {
    position: absolute;
    height: 14px;
    background-color: #4caf50;
    border-radius: 2px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .ruda-total-cell {
    background-color: #1e3a5f;
    color: white;
    font-weight: bold;
    font-size: 13px;
    padding: 8px 6px;
    border: 1px solid #2c4a6b;
    text-align: center;
  }
  
  .ruda-selected-info {
    background-color: #f0f8ff;
    border: 2px solid #4caf50;
    padding: 16px;
    margin: 16px;
    border-radius: 8px;
  }
  
  .ruda-selected-info h3 {
    margin: 0 0 8px 0;
    color: #1e3a5f;
  }
  
  .ruda-selected-info p {
    margin: 0;
    color: #666;
  }
  
  .right {
    text-align: right;
  }
  
  .indent {
    padding-left: 12px;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const RudaTimeline = () => {
  const [expandedPhases, setExpandedPhases] = useState(new Set([0]));
  const [expandedPackages, setExpandedPackages] = useState(new Set());
  const [expandedSubpackages, setExpandedSubpackages] = useState(new Set());
  const [expandedSubsubpackages, setExpandedSubsubpackages] = useState(
    new Set()
  );
  const [expandedReaches, setExpandedReaches] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);

  const data = [
    // Phase 1
    {
      phase: "PHASE 01",
      amount: "155,649",
      items: [
        {
          name: "River Channelization (14.5 Km)",
          amount: "45,420",
          timeline: [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Check Dams (02 Nos)",
          amount: "1,912",
          timeline: [
            0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Road Network (115 Km)",
          amount: "55,513",
          timeline: [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Bridges (02 Nos) & Interchanges (04 Nos)",
          amount: "34,096",
          timeline: [
            0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Trunk Sewer Network (14 Km Both Sides)",
          amount: "9,709",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Power Transmission & Grid Stations (01 No)",
          amount: "9,000",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
      ],
    },

    // Phase 2 - Enhanced with Package structure from PDF
    {
      phase: "PHASE 02",
      amount: "140,531",
      packages: [
        {
          name: "RUDA:Package-2 UP-River Training Works & Barrage Left Embankment (RD 0+000 to RD 10+500)",
          budgetedCost: "1,963,944,060.01",
          earnedValue: "912,053,647.82",
          scheduleComplete: "99.94%",
          performanceComplete: "46.44%",
          timeline: [
            0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
          subpackages: [
            {
              name: "RUDA:Package-2.1 Contract Startup",
              duration: "16",
              budgetedCost: "0.00",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              subsubpackages: [
                {
                  name: "RUDA:Package-2.1.1 General Requirements",
                  duration: "16",
                  budgetedCost: "0.00",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Provision of Performance Security",
                      duration: "3",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Effective access to and possession of site",
                      duration: "4",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Start of Initial Survey",
                      duration: "14",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.1.2 Contract Requirements",
                  duration: "0",
                  budgetedCost: "0.00",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Date of Commencement",
                      duration: "0",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.2 Mobilization",
              duration: "10",
              budgetedCost: "0.00",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              activities: [
                {
                  name: "Establishment of Site boundaries, Compound, Offices, etc",
                  duration: "7",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Mobilization of Contractor's Equipment",
                  duration: "8",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.3 Submission and Approval of Documents",
              duration: "22",
              budgetedCost: "0.00",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              subsubpackages: [
                {
                  name: "RUDA:Package-2.3.1 Design Engineering(Drawings)",
                  duration: "0",
                  budgetedCost: "0.00",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Issuance of Construction Drawings(Cross section) IFC's",
                      duration: "0",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Prepare and submission Shop Drawings",
                      duration: "0",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.3.2 Submission of Method Statement",
                  duration: "7",
                  budgetedCost: "0.00",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Prepare & Submission method statements and approval",
                      duration: "7",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.3.3 HSE Protocols",
                  duration: "15",
                  budgetedCost: "0.00",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Submission of HSE Plans",
                      duration: "5",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Submission of all Possible Critical Activities M/S",
                      duration: "7",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Induction training to upcoming workforce",
                      duration: "8",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.4 Material Procurement",
              duration: "289",
              budgetedCost: "0.00",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              subsubpackages: [
                {
                  name: "RUDA:Package-2.4.1 Material Delivery",
                  duration: "273",
                  budgetedCost: "0.00",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  reaches: [
                    {
                      name: "RUDA:Package-2.4.1.1 Coffer Dam",
                      duration: "16",
                      budgetedCost: "0.00",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(Coarse Filter)",
                          duration: "14",
                          scheduleComplete: "100%",
                          performanceComplete: "50%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "14",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                    {
                      name: "RUDA:Package-2.4.1.2 Reach-1",
                      duration: "132",
                      budgetedCost: "0.00",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(A-4)",
                          duration: "60",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Fine)",
                          duration: "60",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Coarse)",
                          duration: "60",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "73",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                    {
                      name: "RUDA:Package-2.4.1.3 Reach-2",
                      duration: "68",
                      budgetedCost: "0.00",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(A-4)",
                          duration: "35",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Fine)",
                          duration: "15",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Coarse)",
                          duration: "15",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "20",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                    {
                      name: "RUDA:Package-2.4.1.4 Reach-3",
                      duration: "87",
                      budgetedCost: "0.00",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
                        1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(A-4)",
                          duration: "45",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Fine)",
                          duration: "35",
                          scheduleComplete: "100%",
                          performanceComplete: "60.4%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Coarse)",
                          duration: "35",
                          scheduleComplete: "100%",
                          performanceComplete: "60.4%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "30",
                          scheduleComplete: "100%",
                          performanceComplete: "60.4%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                    {
                      name: "RUDA:Package-2.4.1.5 Reach-4",
                      duration: "73",
                      budgetedCost: "0.00",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                        1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(A-4)",
                          duration: "35",
                          scheduleComplete: "100%",
                          performanceComplete: "0%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Fine)",
                          duration: "28",
                          scheduleComplete: "100%",
                          performanceComplete: "0%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Coarse)",
                          duration: "28",
                          scheduleComplete: "100%",
                          performanceComplete: "0%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "24",
                          scheduleComplete: "100%",
                          performanceComplete: "0%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                    {
                      name: "RUDA:Package-2.4.1.6 Reach-5",
                      duration: "60",
                      budgetedCost: "0.00",
                      scheduleComplete: "0%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                      materials: [
                        {
                          name: "Material Delivery(A-4)",
                          duration: "15",
                          scheduleComplete: "100%",
                          performanceComplete: "0%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Fine)",
                          duration: "30",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Coarse)",
                          duration: "30",
                          scheduleComplete: "100%",
                          performanceComplete: "100%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                        {
                          name: "Material Delivery(Stone)",
                          duration: "40",
                          scheduleComplete: "100%",
                          performanceComplete: "60%",
                          timeline: [
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                            1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              activities: [
                {
                  name: "Submit Source of material(Stone)",
                  duration: "0",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Approval of Material Source",
                  duration: "3",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.5 Construction Works",
              duration: "300",
              budgetedCost: "1,963,944,060.01",
              earnedValue: "912,053,647.82",
              scheduleComplete: "99.94%",
              performanceComplete: "46.44%",
              timeline: [
                0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              subsubpackages: [
                {
                  name: "RUDA:Package-2.5.1 Reach-1(0+900 to 3+000)",
                  duration: "145",
                  budgetedCost: "357,952,088.13",
                  earnedValue: "357,952,088.13",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Bill No.1 EarthWork Reach-1(0+900 to 3+000)",
                      duration: "141",
                      budgetedCost: "130,681,828.13",
                      earnedValue: "130,681,828.13",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Bill No.2 StoneWork Reach-1(0+900 to 3+000)",
                      duration: "94",
                      budgetedCost: "227,270,260.00",
                      earnedValue: "227,270,260.00",
                      scheduleComplete: "100%",
                      performanceComplete: "100%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.2 Coffer Dam",
                  duration: "75",
                  budgetedCost: "219,795,585.00",
                  earnedValue: "0.00",
                  scheduleComplete: "99.65%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Cofferdam(EarthWork)",
                      duration: "73",
                      budgetedCost: "64,446,045.00",
                      earnedValue: "64,446,045.00",
                      scheduleComplete: "100%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Cofferdam(StoneWork)",
                      duration: "67",
                      budgetedCost: "155,349,540.00",
                      earnedValue: "154,590,572.31",
                      scheduleComplete: "99.51%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.4 Cut off Channel",
                  duration: "43",
                  budgetedCost: "18,480,000.00",
                  earnedValue: "0.00",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Cut Channel - Earthwork Excavation",
                      duration: "43",
                      budgetedCost: "18,480,000.00",
                      earnedValue: "0.00",
                      scheduleComplete: "100%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.5 Reach-2(3+000 to 5+250)",
                  duration: "87",
                  budgetedCost: "341,929,096.72",
                  earnedValue: "281,114,831.67",
                  scheduleComplete: "100%",
                  performanceComplete: "82.21%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Bill No.1 EarthWork Reach-2(3+000 to 5+250)",
                      duration: "69",
                      budgetedCost: "114,658,836.72",
                      earnedValue: "101,261,444.55",
                      scheduleComplete: "100%",
                      performanceComplete: "88.32%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Bill No.2 StoneWork Reach-2(3+000 to 5+250)",
                      duration: "50",
                      budgetedCost: "227,270,260.00",
                      earnedValue: "179,853,387.12",
                      scheduleComplete: "100%",
                      performanceComplete: "79.14%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.6 Reach-3(5+250 to 7+000)",
                  duration: "89",
                  budgetedCost: "341,929,096.72",
                  earnedValue: "272,986,728.02",
                  scheduleComplete: "100%",
                  performanceComplete: "79.84%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Bill No.1 EarthWork Reach-3(5+250 to 7+000)",
                      duration: "77",
                      budgetedCost: "114,658,836.72",
                      earnedValue: "103,102,355.00",
                      scheduleComplete: "100%",
                      performanceComplete: "89.92%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Bill No.2 StoneWork Reach-3(5+250 to 7+000)",
                      duration: "53",
                      budgetedCost: "227,270,260.00",
                      earnedValue: "169,884,373.02",
                      scheduleComplete: "100%",
                      performanceComplete: "74.75%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
                        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.7 Reach-4(7+000 to 10+500)",
                  duration: "88",
                  budgetedCost: "341,929,096.72",
                  earnedValue: "0.00",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
                    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Bill No.1 EarthWork Reach-4(7+000 to 10+500)",
                      duration: "66",
                      budgetedCost: "114,658,836.72",
                      earnedValue: "0.00",
                      scheduleComplete: "100%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                        1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Bill No.2 StoneWork Reach-4(7+000 to 10+500)",
                      duration: "51",
                      budgetedCost: "227,270,260.00",
                      earnedValue: "0.00",
                      scheduleComplete: "100%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
                {
                  name: "RUDA:Package-2.5.8 Reach-5(0+000 to 0+900)",
                  duration: "73",
                  budgetedCost: "341,929,096.72",
                  earnedValue: "0.00",
                  scheduleComplete: "99.89%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  activities: [
                    {
                      name: "Bill No.1 EarthWork Reach-5(0+000 to 0+900)",
                      duration: "41",
                      budgetedCost: "114,658,836.72",
                      earnedValue: "0.00",
                      scheduleComplete: "100%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                    {
                      name: "Bill No.2 StoneWork Reach-5(0+000 to 0+900)",
                      duration: "61",
                      budgetedCost: "227,270,260.00",
                      earnedValue: "0.00",
                      scheduleComplete: "99.84%",
                      performanceComplete: "0%",
                      timeline: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0,
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.6 Project Finish",
              duration: "0",
              budgetedCost: "0.00",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              activities: [
                {
                  name: "Project End",
                  duration: "0",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
              ],
            },
            {
              name: "RUDA:Package-2.7 Finish Milestone",
              duration: "146",
              budgetedCost: "0.00",
              scheduleComplete: "0%",
              performanceComplete: "0%",
              timeline: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
              activities: [
                {
                  name: "Reach-1(0+900 to 3+000)",
                  duration: "0",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Reach-02(3+000 to 5+250)",
                  duration: "0",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },

                {
                  name: "Cut off Channel",
                  duration: "0",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Reach-3(5+250 to 7+500)",
                  duration: "0",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Reach-5(0+000 to 0+900)",
                  duration: "0",
                  scheduleComplete: "0%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Reach-4(7+500 to 10+500)",
                  duration: "0",
                  scheduleComplete: "100%",
                  performanceComplete: "100%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
                {
                  name: "Coffer Dam",
                  duration: "0",
                  scheduleComplete: "100%",
                  performanceComplete: "0%",
                  timeline: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                },
              ],
            },
          ],
        },
      ],
      // Keep original items for backward compatibility
      items: [
        {
          name: "Preliminary Bunds Ph 02 and Ph 03 (30 km x 2)",
          amount: "10,000",
          timeline: [
            0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "River Channelization (16.5 Km)",
          amount: "53,020",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Check Dams (02 Nos)",
          amount: "1,702",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Road Network (78 Km)",
          amount: "25,495",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Bridges (01 No) & Interchanges (03 Nos)",
          amount: "22,280",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Trunk Sewer Network (15 Km Both Sides)",
          amount: "19,034",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
        {
          name: "Power Transmission & Grid Stations (01 No)",
          amount: "9,000",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          ],
        },
      ],
    },
    // Phase 3
    {
      phase: "PHASE 03",
      amount: "102,995",
      items: [
        {
          name: "River Channelization (15 Km)",
          amount: "43,000",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          ],
        },
        {
          name: "Check Dams (01 No)",
          amount: "851",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          ],
        },
        {
          name: "Road Network (56 Km)",
          amount: "26,550",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          ],
        },
        {
          name: "Bridges (01 No)",
          amount: "8,000",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          ],
        },
        {
          name: "Sewer & Storm Network (15 Km Both Sides)",
          amount: "24,594",
          timeline: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
      ],
    },
  ];

  const months = [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ];

  const togglePhase = (phaseIndex) => {
    const newSet = new Set(expandedPhases);
    newSet.has(phaseIndex) ? newSet.delete(phaseIndex) : newSet.add(phaseIndex);
    setExpandedPhases(newSet);
  };

  const togglePackage = (packageKey) => {
    const newSet = new Set(expandedPackages);
    newSet.has(packageKey) ? newSet.delete(packageKey) : newSet.add(packageKey);
    setExpandedPackages(newSet);
  };

  const toggleSubpackage = (subpackageKey) => {
    const newSet = new Set(expandedSubpackages);
    newSet.has(subpackageKey)
      ? newSet.delete(subpackageKey)
      : newSet.add(subpackageKey);
    setExpandedSubpackages(newSet);
  };

  const toggleSubsubpackage = (subsubpackageKey) => {
    const newSet = new Set(expandedSubsubpackages);
    newSet.has(subsubpackageKey)
      ? newSet.delete(subsubpackageKey)
      : newSet.add(subsubpackageKey);
    setExpandedSubsubpackages(newSet);
  };

  const toggleReach = (reachKey) => {
    const newSet = new Set(expandedReaches);
    newSet.has(reachKey) ? newSet.delete(reachKey) : newSet.add(reachKey);
    setExpandedReaches(newSet);
  };

  const handleItemClick = (item, type = "item") => {
    // Only set timeline for leaf items that have timeline data
    if (item.timeline && Array.isArray(item.timeline)) {
      setSelectedItem(item);
    }
  };

  const renderTimeline = (item) => {
    if (!item.timeline || !Array.isArray(item.timeline)) return null;

    const start = item.timeline.findIndex((v) => v === 1);
    const duration = item.timeline.filter((v) => v === 1).length;

    if (start === -1 || duration === 0) return null;

    return (
      <div
        className="ruda-bar"
        style={{
          left: `${start * 18}px`,
          width: `${duration * 18}px`,
        }}
      />
    );
  };

  const formatAmount = (amount) => {
    if (!amount || amount === "0.00") return "-";
    // Convert to millions if it's a large number
    const num = parseFloat(amount.replace(/,/g, ""));
    if (num > 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    return amount;
  };

  return (
    <div className="ruda-container">
      <div className="ruda-header-container">
        <h1 className="ruda-title">RUDA DEVELOPMENT PLAN - TIMELINE</h1>
        <div className="ruda-logo" onClick={() => (window.location.href = "/")}>
          HOME
        </div>
      </div>

      <div style={{ position: "relative" }}>
        {/* Move vertical lines outside the table */}
        {[263, 514, 763, 1014, 1264].map((left, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 60,
              left: `${195 + left}px`,
              width: "0.08px",
              height: "88%",
              backgroundColor: "#000000",
              zIndex: 10,
            }}
          />
        ))}
        <table className="ruda-table">
          <thead>
            <tr>
              <th
                className="ruda-header"
                style={{ width: "300px" }}
                rowSpan="2"
              >
                PHASES / PACKAGES
              </th>
              <th className="ruda-header" style={{ width: "80px" }} rowSpan="2">
                Amount
                <br />
                (PKR, M)
              </th>
              <th className="ruda-header" style={{ width: "80px" }} rowSpan="2">
                Duration
                <br />
                (Days)
              </th>
              <th className="ruda-header" style={{ width: "70px" }} rowSpan="2">
                Schedule
                <br />%
              </th>
              <th className="ruda-header" style={{ width: "70px" }} rowSpan="2">
                Performance
                <br />%
              </th>
              {[...Array(5)].map((_, i) => (
                <th key={i} className="ruda-header" colSpan="12">
                  FY {25 + i}-{26 + i}
                </th>
              ))}
            </tr>
            <tr>
              {months.map((month, index) => (
                <th key={index} className="ruda-month-header">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((phase, phaseIndex) => (
              <React.Fragment key={phaseIndex}>
                <tr
                  className="ruda-phase-row"
                  onClick={() => togglePhase(phaseIndex)}
                >
                  <td className="ruda-phase-header">
                    {phase.phase} {expandedPhases.has(phaseIndex) ? "▲" : "▼"}
                  </td>
                  <td className="ruda-phase-header right">{phase.amount}</td>
                  <td className="ruda-phase-header right">-</td>
                  <td className="ruda-phase-header right">-</td>
                  <td className="ruda-phase-header right">-</td>
                  <td colSpan={60} className="ruda-phase-header"></td>
                </tr>

                {expandedPhases.has(phaseIndex) && (
                  <>
                    {/* Render packages if they exist (Phase 2 enhanced structure) */}
                    {phase.packages &&
                      phase.packages.map((pkg, pkgIndex) => {
                        const packageKey = `${phaseIndex}-${pkgIndex}`;
                        return (
                          <React.Fragment key={packageKey}>
                            <tr
                              className="ruda-package-row"
                              onClick={() => togglePackage(packageKey)}
                            >
                              <td className="ruda-cell package-cell">
                                📦 {pkg.name}{" "}
                                {expandedPackages.has(packageKey) ? "▲" : "▼"}
                              </td>
                              <td className="ruda-cell ruda-bold right">
                                {formatAmount(pkg.budgetedCost)}
                              </td>
                              <td className="ruda-cell right">-</td>
                              <td className="ruda-cell right">
                                {pkg.scheduleComplete || "-"}
                              </td>
                              <td className="ruda-cell right">
                                {pkg.performanceComplete || "-"}
                              </td>
                              <td colSpan={60} className="ruda-timeline-cell">
                                {renderTimeline(pkg)}
                              </td>
                            </tr>

                            {expandedPackages.has(packageKey) &&
                              pkg.subpackages &&
                              pkg.subpackages.map((subpkg, subIndex) => {
                                const subpackageKey = `${packageKey}-${subIndex}`;
                                return (
                                  <React.Fragment key={subpackageKey}>
                                    <tr
                                      className="ruda-subpackage-row"
                                      onClick={() =>
                                        toggleSubpackage(subpackageKey)
                                      }
                                    >
                                      <td className="ruda-cell subpackage-cell">
                                        📋 {subpkg.name}{" "}
                                        {expandedSubpackages.has(subpackageKey)
                                          ? "▲"
                                          : "▼"}
                                      </td>
                                      <td className="ruda-cell right">
                                        {formatAmount(subpkg.budgetedCost)}
                                      </td>
                                      <td className="ruda-cell right">
                                        {subpkg.duration || "-"}
                                      </td>
                                      <td className="ruda-cell right">
                                        {subpkg.scheduleComplete || "-"}
                                      </td>
                                      <td className="ruda-cell right">
                                        {subpkg.performanceComplete || "-"}
                                      </td>
                                      <td
                                        colSpan={60}
                                        className="ruda-timeline-cell"
                                      >
                                        {renderTimeline(subpkg)}
                                      </td>
                                    </tr>

                                    {/* Render subsubpackages if they exist */}
                                    {expandedSubpackages.has(subpackageKey) &&
                                      subpkg.subsubpackages &&
                                      subpkg.subsubpackages.map(
                                        (subsubpkg, subsubIndex) => {
                                          const subsubpackageKey = `${subpackageKey}-${subsubIndex}`;
                                          return (
                                            <React.Fragment
                                              key={subsubpackageKey}
                                            >
                                              <tr
                                                className="ruda-subsubpackage-row"
                                                onClick={() =>
                                                  toggleSubsubpackage(
                                                    subsubpackageKey
                                                  )
                                                }
                                              >
                                                <td className="ruda-cell subsubpackage-cell">
                                                  🔷 {subsubpkg.name}{" "}
                                                  {expandedSubsubpackages.has(
                                                    subsubpackageKey
                                                  )
                                                    ? "▲"
                                                    : "▼"}
                                                </td>
                                                <td className="ruda-cell right">
                                                  {formatAmount(
                                                    subsubpkg.budgetedCost
                                                  )}
                                                </td>
                                                <td className="ruda-cell right">
                                                  {subsubpkg.duration || "-"}
                                                </td>
                                                <td className="ruda-cell right">
                                                  {subsubpkg.scheduleComplete ||
                                                    "-"}
                                                </td>
                                                <td className="ruda-cell right">
                                                  {subsubpkg.performanceComplete ||
                                                    "-"}
                                                </td>
                                                <td
                                                  colSpan={60}
                                                  className="ruda-timeline-cell"
                                                >
                                                  {renderTimeline(subsubpkg)}
                                                </td>
                                              </tr>

                                              {/* Render reaches if they exist (for Material Delivery) */}
                                              {expandedSubsubpackages.has(
                                                subsubpackageKey
                                              ) &&
                                                subsubpkg.reaches &&
                                                subsubpkg.reaches.map(
                                                  (reach, reachIndex) => {
                                                    const reachKey = `${subsubpackageKey}-${reachIndex}`;
                                                    return (
                                                      <React.Fragment
                                                        key={reachKey}
                                                      >
                                                        <tr
                                                          className="ruda-reach-row"
                                                          onClick={() =>
                                                            toggleReach(
                                                              reachKey
                                                            )
                                                          }
                                                        >
                                                          <td className="ruda-cell reach-cell">
                                                            🎯 {reach.name}{" "}
                                                            {expandedReaches.has(
                                                              reachKey
                                                            )
                                                              ? "▲"
                                                              : "▼"}
                                                          </td>
                                                          <td className="ruda-cell right">
                                                            {formatAmount(
                                                              reach.budgetedCost
                                                            )}
                                                          </td>
                                                          <td className="ruda-cell right">
                                                            {reach.duration ||
                                                              "-"}
                                                          </td>
                                                          <td className="ruda-cell right">
                                                            {reach.scheduleComplete ||
                                                              "-"}
                                                          </td>
                                                          <td className="ruda-cell right">
                                                            {reach.performanceComplete ||
                                                              "-"}
                                                          </td>
                                                          <td
                                                            colSpan={60}
                                                            className="ruda-timeline-cell"
                                                          >
                                                            {renderTimeline(
                                                              reach
                                                            )}
                                                          </td>
                                                        </tr>

                                                        {/* Render materials */}
                                                        {expandedReaches.has(
                                                          reachKey
                                                        ) &&
                                                          reach.materials &&
                                                          reach.materials.map(
                                                            (
                                                              material,
                                                              materialIndex
                                                            ) => (
                                                              <tr
                                                                key={
                                                                  materialIndex
                                                                }
                                                                className="ruda-material-row"
                                                                onClick={() =>
                                                                  handleItemClick(
                                                                    material,
                                                                    "material"
                                                                  )
                                                                }
                                                              >
                                                                <td className="ruda-cell material-cell">
                                                                  🧱{" "}
                                                                  {
                                                                    material.name
                                                                  }
                                                                </td>
                                                                <td className="ruda-cell right">
                                                                  -
                                                                </td>
                                                                <td className="ruda-cell right">
                                                                  {material.duration ||
                                                                    "-"}
                                                                </td>
                                                                <td className="ruda-cell right">
                                                                  {material.scheduleComplete ||
                                                                    "-"}
                                                                </td>
                                                                <td className="ruda-cell right">
                                                                  {material.performanceComplete ||
                                                                    "-"}
                                                                </td>
                                                                <td
                                                                  colSpan={60}
                                                                  className="ruda-timeline-cell"
                                                                >
                                                                  {renderTimeline(
                                                                    material
                                                                  )}
                                                                </td>
                                                              </tr>
                                                            )
                                                          )}
                                                      </React.Fragment>
                                                    );
                                                  }
                                                )}

                                              {/* Render activities for subsubpackages */}
                                              {expandedSubsubpackages.has(
                                                subsubpackageKey
                                              ) &&
                                                subsubpkg.activities &&
                                                subsubpkg.activities.map(
                                                  (activity, actIndex) => (
                                                    <tr
                                                      key={actIndex}
                                                      className="ruda-activity-row"
                                                      onClick={() =>
                                                        handleItemClick(
                                                          activity,
                                                          "activity"
                                                        )
                                                      }
                                                    >
                                                      <td className="ruda-cell activity-cell">
                                                        🔧 {activity.name}
                                                      </td>
                                                      <td className="ruda-cell right">
                                                        {formatAmount(
                                                          activity.budgetedCost
                                                        )}
                                                      </td>
                                                      <td className="ruda-cell right">
                                                        {activity.duration ||
                                                          "-"}
                                                      </td>
                                                      <td className="ruda-cell right">
                                                        {activity.scheduleComplete ||
                                                          "-"}
                                                      </td>
                                                      <td className="ruda-cell right">
                                                        {activity.performanceComplete ||
                                                          "-"}
                                                      </td>
                                                      <td
                                                        colSpan={60}
                                                        className="ruda-timeline-cell"
                                                      >
                                                        {renderTimeline(
                                                          activity
                                                        )}
                                                      </td>
                                                    </tr>
                                                  )
                                                )}
                                            </React.Fragment>
                                          );
                                        }
                                      )}

                                    {/* Render direct activities for subpackages (without subsubpackages) */}
                                    {expandedSubpackages.has(subpackageKey) &&
                                      subpkg.activities &&
                                      !subpkg.subsubpackages &&
                                      subpkg.activities.map(
                                        (activity, actIndex) => (
                                          <tr
                                            key={actIndex}
                                            className="ruda-activity-row"
                                            onClick={() =>
                                              handleItemClick(
                                                activity,
                                                "activity"
                                              )
                                            }
                                          >
                                            <td className="ruda-cell activity-cell">
                                              🔧 {activity.name}
                                            </td>
                                            <td className="ruda-cell right">
                                              {formatAmount(
                                                activity.budgetedCost
                                              )}
                                            </td>
                                            <td className="ruda-cell right">
                                              {activity.duration || "-"}
                                            </td>
                                            <td className="ruda-cell right">
                                              {activity.scheduleComplete || "-"}
                                            </td>
                                            <td className="ruda-cell right">
                                              {activity.performanceComplete ||
                                                "-"}
                                            </td>
                                            <td
                                              colSpan={60}
                                              className="ruda-timeline-cell"
                                            >
                                              {renderTimeline(activity)}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                  </React.Fragment>
                                );
                              })}
                          </React.Fragment>
                        );
                      })}

                    {/* Render original items structure for phases without packages */}
                    {phase.items &&
                      !phase.packages &&
                      phase.items.map((item, itemIndex) => (
                        <tr
                          key={itemIndex}
                          onClick={() => handleItemClick(item)}
                        >
                          <td className="ruda-cell indent">{item.name}</td>
                          <td className="ruda-cell ruda-bold right">
                            {item.amount}
                          </td>
                          <td className="ruda-cell right">-</td>
                          <td className="ruda-cell right">-</td>
                          <td className="ruda-cell right">-</td>
                          <td colSpan={60} className="ruda-timeline-cell">
                            {renderTimeline(item)}
                          </td>
                        </tr>
                      ))}

                    {/* Render original items for phases that have both packages and items (Phase 2) */}
                    {phase.items && phase.packages && (
                      <tr className="ruda-separator-row">
                        <td className="ruda-separator-cell" colSpan={65}>
                          <strong>Original Phase Items</strong>
                        </td>
                      </tr>
                    )}

                    {phase.items &&
                      phase.packages &&
                      phase.items.map((item, itemIndex) => (
                        <tr
                          key={`original-${itemIndex}`}
                          onClick={() => handleItemClick(item)}
                        >
                          <td className="ruda-cell indent">{item.name}</td>
                          <td className="ruda-cell ruda-bold right">
                            {item.amount}
                          </td>
                          <td className="ruda-cell right">-</td>
                          <td className="ruda-cell right">-</td>
                          <td className="ruda-cell right">-</td>
                          <td colSpan={60} className="ruda-timeline-cell">
                            {renderTimeline(item)}
                          </td>
                        </tr>
                      ))}
                  </>
                )}
              </React.Fragment>
            ))}
            <tr>
              <td className="ruda-total-cell">Total</td>
              <td className="ruda-total-cell right">399,175</td>
              <td className="ruda-total-cell right">-</td>
              <td className="ruda-total-cell right">-</td>
              <td className="ruda-total-cell right">-</td>
              <td colSpan={60} className="ruda-total-cell"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <div className="ruda-selected-info">
          <h3>Selected Item: {selectedItem.name}</h3>
          <p>Timeline visualization updated above</p>
        </div>
      )}
    </div>
  );
};

export default RudaTimeline;
