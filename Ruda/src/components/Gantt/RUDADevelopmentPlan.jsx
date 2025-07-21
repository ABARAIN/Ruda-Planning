import React, { useState } from 'react';

const RudaTimeline = () => {
  const [expandedPhases, setExpandedPhases] = useState(new Set([0])); // Phase 01 open by default

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

  const headerStyle = {
    backgroundColor: '#1e3a5f',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px',
    padding: '8px 4px',
    border: '1px solid #2c4a6b',
    textAlign: 'center',
    verticalAlign: 'middle'
  };

  const phaseHeaderStyle = {
    backgroundColor: '#4a4a4a',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '13px',
    padding: '6px 8px',
    border: '1px solid #5a5a5a',
    textAlign: 'left'
  };

  const dataCellStyle = {
    padding: '4px 8px',
    fontSize: '11px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    textAlign: 'left'
  };

  const amountCellStyle = {
    padding: '4px 6px',
    fontSize: '11px',
    fontWeight: 'bold',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    textAlign: 'right',
    width: '60px'
  };

  const totalCellStyle = {
    backgroundColor: '#1e3a5f',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '13px',
    padding: '8px 6px',
    border: '1px solid #2c4a6b',
    textAlign: 'center'
  };

  const containerStyle = {
    width: '100%',
    overflowX: 'auto',
    fontFamily: 'Arial, sans-serif',
    fontSize: '12px'
  };

  const headerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e3a5f',
    color: 'white',
    padding: '12px 20px',
    marginBottom: '0'
  };

  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '20px',
    margin: '0'
  };

  const logoStyle = {
    color: '#c0c0c0',
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={headerContainerStyle}>
        <h1 style={titleStyle}>RUDA DEVELOPMENT PLAN - TIMELINE</h1>
        <div style={logoStyle}>
          <span style={{ marginRight: '6px', color: '#c0c0c0' }}></span>
          RAVI CITY
        </div>
      </div>

      <div style={{ position: 'relative' }}>

  {[278, 524, 771, 1019, 1266].map((left, i) => (
    <div key={i} style={{
      position: 'absolute',
      top: 60,           // adjust this value to align with table rows
      left: `${195 + left}px`, // 280px = width of Phase + Amount columns
      width: '0.08px',
      height: '88%',  // long enough to cover all rows
      backgroundColor: '#000000',
      zIndex: 10
    }} />
  ))}  <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '1400px' }}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, width: '200px' }} rowSpan="2">PHASES</th>
            <th style={{ ...headerStyle, width: '70px' }} rowSpan="2">Est.<br />Amount<br />(PKR, M)</th>
            <th style={headerStyle} colSpan="12">FY 25-26</th>
            <th style={headerStyle} colSpan="12">FY 26-27</th>
            <th style={headerStyle} colSpan="12">FY 27-28</th>
            <th style={headerStyle} colSpan="12">FY 28-29</th>
            <th style={headerStyle} colSpan="12">FY 29-30</th>
          </tr>
          <tr>
            {months.map((month, index) => (
              <th key={index} style={{ ...headerStyle, width: '18px', fontSize: '9px', padding: '4px 1px' }}>
                {month}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((phase, phaseIndex) => (
            <React.Fragment key={phaseIndex}>
              <tr
                onClick={() => {
                  const newSet = new Set(expandedPhases);
                  if (newSet.has(phaseIndex)) {
                    newSet.delete(phaseIndex);
                  } else {
                    newSet.add(phaseIndex);
                  }
                  setExpandedPhases(newSet);
                }}
                style={{ cursor: 'pointer' }}
              >
                <td style={phaseHeaderStyle}>
                  {phase.phase} {expandedPhases.has(phaseIndex) ? '▲' : '▼'}
                </td>
                <td style={{ ...phaseHeaderStyle, textAlign: 'right' }}>{phase.amount}</td>
                <td colSpan={60} style={phaseHeaderStyle}></td>
              </tr>

              {expandedPhases.has(phaseIndex) &&
                phase.items.map((item, itemIndex) => {
                  const start = item.timeline.findIndex(v => v === 1);
                  const duration = item.timeline.filter(v => v === 1).length;
                  return (
                    <tr key={itemIndex}>
                      <td style={{ ...dataCellStyle, paddingLeft: '12px' }}>{item.name}</td>
                      <td style={amountCellStyle}>{item.amount}</td>
                      <td colSpan={60} style={{ position: 'relative', height: '20px', border: '1px solid #ddd', backgroundColor: 'white' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: `${start * 18}px`,
                            width: `${duration * 18}px`,
                            height: '14px',
                            backgroundColor: '#4caf50',
                            borderRadius: '2px'
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
            </React.Fragment>
          ))}
          <tr>
            <td style={totalCellStyle}>Total</td>
            <td style={{ ...totalCellStyle, textAlign: 'right' }}>399,175</td>
            <td colSpan={60} style={totalCellStyle}></td>
          </tr>
        </tbody>
      </table>
    </div></div>
  );
};

export default RudaTimeline;
