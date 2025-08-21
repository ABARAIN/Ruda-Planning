// scripts/populateGanttData.js
require("dotenv").config();
const pool = require("../config/database");
const GanttCrudModel = require("../models/GanttCrudModel");

// Hardcoded data from RUDADevelopmentPlan.jsx
const ganttData = [
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
        duration: "-",
        plannedValue: "1,962,814,361.55",
        earnedValue: "912,053,647.82",
        actualStart: "22-Jul-24",
        actualFinish: "22-Jul-25",
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
            plannedValue: "0.00",
            earnedValue: "0.00",
            actualStart: "22-Jul-24",
            actualFinish: "08-Aug-24",
            scheduleComplete: "0%",
            performanceComplete: "0%",
            timeline: [
              0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ],
            subsubpackages: [
              {
                name: "RUDA:Package-2.1.1 General Requirements",
                duration: "16",
                budgetedCost: "0.00",
                plannedValue: "0.00",
                earnedValue: "0.00",
                actualStart: "22-Jul-24",
                actualFinish: "08-Aug-24",
                scheduleComplete: "0%",
                performanceComplete: "0%",
                timeline: [
                  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ],
                activities: [
                  {
                    name: "Provision of Performance Security",
                    duration: "3",
                    plannedValue: "-",
                    earnedValue: "-",
                    actualStart: "22-Jul-24",
                    actualFinish: "24-Jul-24",
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
                    plannedValue: "-",
                    earnedValue: "-",
                    actualStart: "23-Jul-24",
                    actualFinish: "26-Jul-24",
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
                    plannedValue: "-",
                    earnedValue: "-",
                    actualStart: "24-Jul-24",
                    actualFinish: "08-Aug-24",
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
            ],
          },
        ],
      },
    ],
  },
];

async function populateGanttData() {
  try {
    console.log("🚀 Starting Gantt data population...");

    // Create tables first
    await GanttCrudModel.createTables();
    console.log("✅ Tables created successfully");

    // Clear existing data
    await pool.query("DELETE FROM public.gantt_activities");
    await pool.query("DELETE FROM public.gantt_subsubpackages");
    await pool.query("DELETE FROM public.gantt_subpackages");
    await pool.query("DELETE FROM public.gantt_packages");
    await pool.query("DELETE FROM public.gantt_items");
    await pool.query("DELETE FROM public.gantt_phases");
    console.log("✅ Existing data cleared");

    // Insert data
    for (const phaseData of ganttData) {
      // Insert phase
      const phaseResult = await pool.query(
        `
        INSERT INTO public.gantt_phases (phase, amount)
        VALUES ($1, $2)
        RETURNING id
      `,
        [phaseData.phase, phaseData.amount]
      );

      const phaseId = phaseResult.rows[0].id;
      console.log(`✅ Inserted phase: ${phaseData.phase}`);

      // Insert simple items (Phase 1 style)
      if (phaseData.items) {
        for (const item of phaseData.items) {
          await pool.query(
            `
            INSERT INTO public.gantt_items (phase_id, name, amount, timeline)
            VALUES ($1, $2, $3, $4)
          `,
            [phaseId, item.name, item.amount, JSON.stringify(item.timeline)]
          );
          console.log(`  ✅ Inserted item: ${item.name}`);
        }
      }

      // Insert packages (Phase 2+ style)
      if (phaseData.packages) {
        for (const pkg of phaseData.packages) {
          const packageResult = await pool.query(
            `
            INSERT INTO public.gantt_packages (
              phase_id, name, budgeted_cost, duration, planned_value, earned_value,
              actual_start, actual_finish, schedule_complete, performance_complete, timeline
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id
          `,
            [
              phaseId,
              pkg.name,
              pkg.budgetedCost,
              pkg.duration,
              pkg.duration,
              pkg.plannedValue,
              pkg.earnedValue,
              pkg.actualStart,
              pkg.actualFinish,
              pkg.scheduleComplete,
              pkg.performanceComplete,
              JSON.stringify(pkg.timeline),
            ]
          );

          const packageId = packageResult.rows[0].id;
          console.log(`  ✅ Inserted package: ${pkg.name}`);

          // Insert subpackages
          if (pkg.subpackages) {
            for (const subpkg of pkg.subpackages) {
              const subpackageResult = await pool.query(
                `
                INSERT INTO public.gantt_subpackages (
                  package_id, name, duration, budgeted_cost, planned_value, earned_value,
                  actual_start, actual_finish, schedule_complete, performance_complete, timeline
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING id
              `,
                [
                  packageId,
                  subpkg.name,
                  subpkg.duration,
                  subpkg.budgetedCost,
                  subpkg.plannedValue,
                  subpkg.earnedValue,
                  subpkg.actualStart,
                  subpkg.actualFinish,
                  subpkg.scheduleComplete,
                  subpkg.performanceComplete,
                  JSON.stringify(subpkg.timeline),
                ]
              );

              const subpackageId = subpackageResult.rows[0].id;
              console.log(`    ✅ Inserted subpackage: ${subpkg.name}`);

              // Insert subsubpackages
              if (subpkg.subsubpackages) {
                for (const subsubpkg of subpkg.subsubpackages) {
                  const subsubpackageResult = await pool.query(
                    `
                    INSERT INTO public.gantt_subsubpackages (
                      subpackage_id, name, duration, budgeted_cost, planned_value, earned_value,
                      actual_start, actual_finish, schedule_complete, performance_complete, timeline
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                    RETURNING id
                  `,
                    [
                      subpackageId,
                      subsubpkg.name,
                      subsubpkg.duration,
                      subsubpkg.budgetedCost,
                      subsubpkg.plannedValue,
                      subsubpkg.earnedValue,
                      subsubpkg.actualStart,
                      subsubpkg.actualFinish,
                      subsubpkg.scheduleComplete,
                      subsubpkg.performanceComplete,
                      JSON.stringify(subsubpkg.timeline),
                    ]
                  );

                  const subsubpackageId = subsubpackageResult.rows[0].id;
                  console.log(
                    `      ✅ Inserted subsubpackage: ${subsubpkg.name}`
                  );

                  // Insert activities for subsubpackage
                  if (subsubpkg.activities) {
                    for (const activity of subsubpkg.activities) {
                      await pool.query(
                        `
                        INSERT INTO public.gantt_activities (
                          parent_id, parent_type, name, duration, planned_value, earned_value,
                          actual_start, actual_finish, schedule_complete, performance_complete, timeline
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                      `,
                        [
                          subsubpackageId,
                          "subsubpackage",
                          activity.name,
                          activity.duration,
                          activity.plannedValue,
                          activity.earnedValue,
                          activity.actualStart,
                          activity.actualFinish,
                          activity.scheduleComplete,
                          activity.performanceComplete,
                          JSON.stringify(activity.timeline),
                        ]
                      );
                      console.log(
                        `        ✅ Inserted activity: ${activity.name}`
                      );
                    }
                  }
                }
              }

              // Insert activities for subpackage (direct activities)
              if (subpkg.activities) {
                for (const activity of subpkg.activities) {
                  await pool.query(
                    `
                    INSERT INTO public.gantt_activities (
                      parent_id, parent_type, name, duration, planned_value, earned_value,
                      actual_start, actual_finish, schedule_complete, performance_complete, timeline
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                  `,
                    [
                      subpackageId,
                      "subpackage",
                      activity.name,
                      activity.duration,
                      activity.plannedValue,
                      activity.earnedValue,
                      activity.actualStart,
                      activity.actualFinish,
                      activity.scheduleComplete,
                      activity.performanceComplete,
                      JSON.stringify(activity.timeline),
                    ]
                  );
                  console.log(`      ✅ Inserted activity: ${activity.name}`);
                }
              }
            }
          }
        }
      }
    }

    console.log("🎉 Gantt data population completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to populate Gantt data:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  populateGanttData();
}

module.exports = { populateGanttData };
