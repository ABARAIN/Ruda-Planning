import React from 'react';
import { Paper, Typography } from '@mui/material';

const MasterPlan = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Ensure the component height is consistent
        width: '100%',  // Full width inside the Grid item
      }}
    >
      <Typography variant="h6" gutterBottom>Ravi City Master Plan</Typography>
      <img
        src="Img.png" // Replace with actual image URL
        alt="Ravi City Master Plan"
        style={{
          width: '100%',  // Makes the image responsive
          height: 'auto', // Maintains aspect ratio
          maxHeight: '250px', // Optional: Max height for better visual alignment
        }}
      />
    </Paper>
  );
};

export default MasterPlan;
