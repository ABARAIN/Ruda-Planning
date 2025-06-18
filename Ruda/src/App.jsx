// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { AppBar, Box, Toolbar, Typography } from '@mui/material';
// import LayerFilterPanel from './components/LayerFilterPanel';
// import MapView from './components/MapView';

// function getRandomColor() {
//   const hue = Math.floor(Math.random() * 360);
//   return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
// }

// const App = () => {
//   const [features, setFeatures] = useState([]);
//   const [selectedPhases, setSelectedPhases] = useState([]);
//   const [selectedPackages, setSelectedPackages] = useState([]);
//   const [selectedProjects, setSelectedProjects] = useState([]);
//   const [colorMap, setColorMap] = useState({});
//   const [districtBoundaries, setDistrictBoundaries] = useState([]);

//   useEffect(() => {
//     const fetchBoundaries = async () => {
//       try {
//         const [sheikhupura, lahore] = await Promise.all([
//           axios.get('http://localhost:5000/api/sheikhpura'),
//           axios.get('http://localhost:5000/api/lahore')
//         ]);
  
//         setDistrictBoundaries([
//           ...sheikhupura.data.features.map(f => ({ ...f, properties: { ...f.properties, district: 'Sheikhupura' } })),
//           ...lahore.data.features.map(f => ({ ...f, properties: { ...f.properties, district: 'Lahore' } }))
//         ]);
//       } catch (err) {
//         console.error('Error loading district boundaries:', err);
//       }
//     };
  
//     fetchBoundaries();
//   }, []);
  




//   useEffect(() => {
//     axios.get('http://localhost:5000/api/all').then(res => {
//       const feats = res.data.features || [];
//       setFeatures(feats);

//       const names = [...new Set(feats.map(f => f.properties?.name).filter(Boolean))];
//       setColorMap(prev => {
//         const newMap = { ...prev };
//         names.forEach(name => {
//           if (!newMap[name]) newMap[name] = getRandomColor();
//         });
//         return newMap;
//       });
//     });
//   }, []);

//   useEffect(() => {
//     const phases = [...new Set(
//       features.filter(f => f.properties?.name?.startsWith('Phase')).map(f => f.properties.name)
//     )];
//     setSelectedPhases(phases);
//   }, [features]);

//   useEffect(() => {
//     const pkgs = [...new Set(
//       features.filter(f =>
//         f.properties?.name?.startsWith('RTW Package') &&
//         f.properties?.ruda_phase &&
//         selectedPhases.includes(f.properties.ruda_phase)
//       ).map(f => f.properties.name)
//     )];
//     setSelectedPackages(pkgs);
//   }, [features, selectedPhases]);

//   useEffect(() => {
//     const projs = [...new Set(
//       features.filter(f =>
//         (f.properties?.name?.startsWith('RTW P') || f.properties?.name === '11') &&
//         f.properties?.rtw_pkg &&
//         selectedPackages.includes(f.properties.rtw_pkg)
//       ).map(f => f.properties.name)
//     )];
//     setSelectedProjects(projs);
//   }, [features, selectedPackages]);

//   const filteredFeatures = features.filter(f => {
//     const name = f.properties.name;
//     return (
//       selectedPhases.includes(name) ||
//       selectedPackages.includes(name) ||
//       selectedProjects.includes(name)
//     );
//   });

//   const handleColorChange = (name, newColor) => {
//     setColorMap(prev => ({
//       ...prev,
//       [name]: newColor
//     }));
//   };

//   return (
//     <>
//       {/* ✅ Header */}
//       <AppBar position="static" color="primary">
//         <Toolbar>
//           <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
//             (RUDA)  Ravi Urban Development Authority
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       {/* ✅ Main Layout */}
//       <Box display="flex" height="calc(100vh - 64px)">
//         <Box width="380px" bgcolor="#191c20" color="#fff" overflow="auto">
//           <LayerFilterPanel
//             features={features}
//             selectedPhases={selectedPhases}
//             setSelectedPhases={setSelectedPhases}
//             selectedPackages={selectedPackages}
//             setSelectedPackages={setSelectedPackages}
//             selectedProjects={selectedProjects}
//             setSelectedProjects={setSelectedProjects}
//             colorMap={colorMap}
//             onColorChange={handleColorChange}
//           />
//         </Box>
//         <Box flex={1}>
//         <MapView
//   features={filteredFeatures}
//   colorMap={colorMap}
//   selectedNames={[...selectedPhases, ...selectedPackages, ...selectedProjects]}
//   districtBoundaries={districtBoundaries}
// />


//         </Box>
//       </Box>
//     </>
//   );
// };

// export default App;



import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import DashboardRTW from './components/DashboardRTW'; // adjust the path if needed

const App = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <DashboardRTW />
      </Container>
    </>
  );
};

export default App;
