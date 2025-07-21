import React, { useState } from 'react';
import './RudaTimeline.css';

const RudaTimeline = () => {
  const [expandedPhases, setExpandedPhases] = useState(new Set([0]));

  const data = [
    // Phase 1
    {
        phase: 'PHASE 01',
        amount: '155,649',
        items: [
            { name: 'River Channelization (14.5 Km)', amount: '45,420', timeline: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Check Dams (02 Nos)', amount: '1,912', timeline: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Road Network (115 Km)', amount: '55,513', timeline: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Bridges (02 Nos) & Interchanges (04 Nos)', amount: '34,096', timeline: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Trunk Sewer Network (14 Km Both Sides)', amount: '9,709', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Power Transmission & Grid Stations (01 No)', amount: '9,000', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ]
    },
    // Phase 2
    {
        phase: 'PHASE 02',
        amount: '140,531',
        items: [
            { name: 'Preliminary Bunds Ph 02 and Ph 03 (30 km x 2)', amount: '10,000', timeline: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'River Channelization (16.5 Km)', amount: '53,020', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Check Dams (02 Nos)', amount: '1,702', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Road Network (78 Km)', amount: '25,495', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Bridges (01 No) & Interchanges (03 Nos)', amount: '22,280', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Trunk Sewer Network (15 Km Both Sides)', amount: '19,034', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
            { name: 'Power Transmission & Grid Stations (01 No)', amount: '9,000', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }
        ]
    },
    // Phase 3
    {
        phase: 'PHASE 03',
        amount: '102,995',
        items: [
            { name: 'River Channelization (15 Km)', amount: '43,000', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
            { name: 'Check Dams (01 No)', amount: '851', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
            { name: 'Road Network (56 Km)', amount: '26,550', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
            { name: 'Bridges (01 No)', amount: '8,000', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
            { name: 'Sewer & Storm Network (15 Km Both Sides)', amount: '24,594', timeline: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ]
    }
];
  const months = [
    'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar',
  ];

  return (
    <div className="ruda-container">
      <div className="ruda-header-container">
        <h1 className="ruda-title">RUDA DEVELOPMENT PLAN - TIMELINE</h1>
        <div className="ruda-logo">RAVI CITY</div>
      </div>

      <div style={{ position: 'relative' }}>
        <table className="ruda-table">
          {[263, 514, 763, 1014, 1264].map((left, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 60,
                left: `${195 + left}px`,
                width: '0.08px',
                height: '88%',
                backgroundColor: '#000000',
                zIndex: 10
              }}
            />
          ))}
          <thead>
            <tr>
              <th className="ruda-header" style={{ width: '200px' }} rowSpan="2">PHASES</th>
              <th className="ruda-header" style={{ width: '70px' }} rowSpan="2">Est.<br />Amount<br />(PKR, M)</th>
              {[...Array(5)].map((_, i) => (
                <th key={i} className="ruda-header" colSpan="12">FY {25 + i}-{26 + i}</th>
              ))}
            </tr>
            <tr>
              {months.map((month, index) => (
                <th key={index} className="ruda-month-header">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((phase, phaseIndex) => (
              <React.Fragment key={phaseIndex}>
                <tr
                  className="ruda-phase-row"
                  onClick={() => {
                    const newSet = new Set(expandedPhases);
                    newSet.has(phaseIndex) ? newSet.delete(phaseIndex) : newSet.add(phaseIndex);
                    setExpandedPhases(newSet);
                  }}
                >
                  <td className="ruda-phase-header">
                    {phase.phase} {expandedPhases.has(phaseIndex) ? '▲' : '▼'}
                  </td>
                  <td className="ruda-phase-header right">{phase.amount}</td>
                  <td colSpan={60} className="ruda-phase-header"></td>
                </tr>
                {expandedPhases.has(phaseIndex) &&
                  phase.items.map((item, itemIndex) => {
                    const start = item.timeline.findIndex(v => v === 1);
                    const duration = item.timeline.filter(v => v === 1).length;
                    return (
                      <tr key={itemIndex}>
                        <td className="ruda-cell indent">{item.name}</td>
                        <td className="ruda-cell ruda-bold right">{item.amount}</td>
                        <td colSpan={60} className="ruda-timeline-cell">
                          <div
                            className="ruda-bar"
                            style={{
                              left: `${start * 18}px`,
                              width: `${duration * 18}px`
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            ))}
            <tr>
              <td className="ruda-total-cell">Total</td>
              <td className="ruda-total-cell right">399,175</td>
              <td colSpan={60} className="ruda-total-cell"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RudaTimeline;
