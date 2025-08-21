// models/GanttCrudModel.js
const pool = require("../config/database");

class GanttCrudModel {
  static async createTables() {
    const sql = `
      -- Create phases table
      CREATE TABLE IF NOT EXISTS public.gantt_phases (
        id SERIAL PRIMARY KEY,
        phase VARCHAR(255) NOT NULL,
        amount VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create packages table
      CREATE TABLE IF NOT EXISTS public.gantt_packages (
        id SERIAL PRIMARY KEY,
        phase_id INTEGER REFERENCES public.gantt_phases(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        budgeted_cost VARCHAR(255),
        duration VARCHAR(255),
        planned_value VARCHAR(255),
        earned_value VARCHAR(255),
        actual_start VARCHAR(255),
        actual_finish VARCHAR(255),
        schedule_complete VARCHAR(255),
        performance_complete VARCHAR(255),
        timeline TEXT, -- JSON array as text
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create subpackages table
      CREATE TABLE IF NOT EXISTS public.gantt_subpackages (
        id SERIAL PRIMARY KEY,
        package_id INTEGER REFERENCES public.gantt_packages(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        duration VARCHAR(255),
        budgeted_cost VARCHAR(255),
        planned_value VARCHAR(255),
        earned_value VARCHAR(255),
        actual_start VARCHAR(255),
        actual_finish VARCHAR(255),
        schedule_complete VARCHAR(255),
        performance_complete VARCHAR(255),
        timeline TEXT, -- JSON array as text
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create subsubpackages table
      CREATE TABLE IF NOT EXISTS public.gantt_subsubpackages (
        id SERIAL PRIMARY KEY,
        subpackage_id INTEGER REFERENCES public.gantt_subpackages(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        duration VARCHAR(255),
        budgeted_cost VARCHAR(255),
        planned_value VARCHAR(255),
        earned_value VARCHAR(255),
        actual_start VARCHAR(255),
        actual_finish VARCHAR(255),
        schedule_complete VARCHAR(255),
        performance_complete VARCHAR(255),
        timeline TEXT, -- JSON array as text
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create activities table
      CREATE TABLE IF NOT EXISTS public.gantt_activities (
        id SERIAL PRIMARY KEY,
        parent_id INTEGER NOT NULL,
        parent_type VARCHAR(50) NOT NULL, -- 'subpackage' or 'subsubpackage'
        name TEXT NOT NULL,
        duration VARCHAR(255),
        planned_value VARCHAR(255),
        earned_value VARCHAR(255),
        actual_start VARCHAR(255),
        actual_finish VARCHAR(255),
        schedule_complete VARCHAR(255),
        performance_complete VARCHAR(255),
        timeline TEXT, -- JSON array as text
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create items table (for Phase 1 simple items)
      CREATE TABLE IF NOT EXISTS public.gantt_items (
        id SERIAL PRIMARY KEY,
        phase_id INTEGER REFERENCES public.gantt_phases(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        amount VARCHAR(255),
        timeline TEXT, -- JSON array as text
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_gantt_packages_phase_id ON public.gantt_packages(phase_id);
      CREATE INDEX IF NOT EXISTS idx_gantt_subpackages_package_id ON public.gantt_subpackages(package_id);
      CREATE INDEX IF NOT EXISTS idx_gantt_subsubpackages_subpackage_id ON public.gantt_subsubpackages(subpackage_id);
      CREATE INDEX IF NOT EXISTS idx_gantt_activities_parent ON public.gantt_activities(parent_id, parent_type);
      CREATE INDEX IF NOT EXISTS idx_gantt_items_phase_id ON public.gantt_items(phase_id);
    `;

    await pool.query(sql);
  }

  static async getAllData() {
    try {
      // Get all phases
      const phasesResult = await pool.query(`
        SELECT * FROM public.gantt_phases ORDER BY id
      `);

      const phases = [];

      for (const phase of phasesResult.rows) {
        const phaseData = {
          phase: phase.phase,
          amount: phase.amount,
        };

        // Get simple items for this phase (Phase 1 style)
        const itemsResult = await pool.query(
          `
          SELECT * FROM public.gantt_items WHERE phase_id = $1 ORDER BY id
        `,
          [phase.id]
        );

        if (itemsResult.rows.length > 0) {
          phaseData.items = itemsResult.rows.map((item) => ({
            name: item.name,
            amount: item.amount,
            timeline: JSON.parse(item.timeline || "[]"),
          }));
        }

        // Get packages for this phase (Phase 2+ style)
        const packagesResult = await pool.query(
          `
          SELECT * FROM public.gantt_packages WHERE phase_id = $1 ORDER BY id
        `,
          [phase.id]
        );

        if (packagesResult.rows.length > 0) {
          phaseData.packages = [];

          for (const pkg of packagesResult.rows) {
            const packageData = {
              name: pkg.name,
              budgetedCost: pkg.budgeted_cost,
              duration: pkg.duration,
              duration: pkg.duration,
              plannedValue: pkg.planned_value,
              earnedValue: pkg.earned_value,
              actualStart: pkg.actual_start,
              actualFinish: pkg.actual_finish,
              scheduleComplete: pkg.schedule_complete,
              performanceComplete: pkg.performance_complete,
              timeline: JSON.parse(pkg.timeline || "[]"),
            };

            // Get subpackages
            const subpackagesResult = await pool.query(
              `
              SELECT * FROM public.gantt_subpackages WHERE package_id = $1 ORDER BY id
            `,
              [pkg.id]
            );

            if (subpackagesResult.rows.length > 0) {
              packageData.subpackages = [];

              for (const subpkg of subpackagesResult.rows) {
                const subpackageData = {
                  name: subpkg.name,
                  duration: subpkg.duration,
                  budgetedCost: subpkg.budgeted_cost,
                  plannedValue: subpkg.planned_value,
                  earnedValue: subpkg.earned_value,
                  actualStart: subpkg.actual_start,
                  actualFinish: subpkg.actual_finish,
                  scheduleComplete: subpkg.schedule_complete,
                  performanceComplete: subpkg.performance_complete,
                  timeline: JSON.parse(subpkg.timeline || "[]"),
                };

                // Get subsubpackages
                const subsubpackagesResult = await pool.query(
                  `
                  SELECT * FROM public.gantt_subsubpackages WHERE subpackage_id = $1 ORDER BY id
                `,
                  [subpkg.id]
                );

                if (subsubpackagesResult.rows.length > 0) {
                  subpackageData.subsubpackages = [];

                  for (const subsubpkg of subsubpackagesResult.rows) {
                    const subsubpackageData = {
                      name: subsubpkg.name,
                      duration: subsubpkg.duration,
                      budgetedCost: subsubpkg.budgeted_cost,
                      plannedValue: subsubpkg.planned_value,
                      earnedValue: subsubpkg.earned_value,
                      actualStart: subsubpkg.actual_start,
                      actualFinish: subsubpkg.actual_finish,
                      scheduleComplete: subsubpkg.schedule_complete,
                      performanceComplete: subsubpkg.performance_complete,
                      timeline: JSON.parse(subsubpkg.timeline || "[]"),
                    };

                    // Get activities for subsubpackage
                    const activitiesResult = await pool.query(
                      `
                      SELECT * FROM public.gantt_activities 
                      WHERE parent_id = $1 AND parent_type = 'subsubpackage' 
                      ORDER BY id
                    `,
                      [subsubpkg.id]
                    );

                    if (activitiesResult.rows.length > 0) {
                      subsubpackageData.activities = activitiesResult.rows.map(
                        (activity) => ({
                          name: activity.name,
                          duration: activity.duration,
                          plannedValue: activity.planned_value,
                          earnedValue: activity.earned_value,
                          actualStart: activity.actual_start,
                          actualFinish: activity.actual_finish,
                          scheduleComplete: activity.schedule_complete,
                          performanceComplete: activity.performance_complete,
                          timeline: JSON.parse(activity.timeline || "[]"),
                        })
                      );
                    }

                    subpackageData.subsubpackages.push(subsubpackageData);
                  }
                }

                // Get activities for subpackage (direct activities)
                const subpackageActivitiesResult = await pool.query(
                  `
                  SELECT * FROM public.gantt_activities 
                  WHERE parent_id = $1 AND parent_type = 'subpackage' 
                  ORDER BY id
                `,
                  [subpkg.id]
                );

                if (subpackageActivitiesResult.rows.length > 0) {
                  subpackageData.activities =
                    subpackageActivitiesResult.rows.map((activity) => ({
                      name: activity.name,
                      duration: activity.duration,
                      plannedValue: activity.planned_value,
                      earnedValue: activity.earned_value,
                      actualStart: activity.actual_start,
                      actualFinish: activity.actual_finish,
                      scheduleComplete: activity.schedule_complete,
                      performanceComplete: activity.performance_complete,
                      timeline: JSON.parse(activity.timeline || "[]"),
                    }));
                }

                packageData.subpackages.push(subpackageData);
              }
            }

            phaseData.packages.push(packageData);
          }
        }

        phases.push(phaseData);
      }

      return phases;
    } catch (error) {
      console.error("Error fetching Gantt data:", error);
      throw error;
    }
  }

  static async insertSampleData() {
    // This method will be used to populate the database with the hardcoded data
    // Implementation will be in a separate script
    return true;
  }
}

module.exports = GanttCrudModel;
