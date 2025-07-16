import React from 'react';
import { Paper, Typography, Grid } from '@mui/material';

const Sustainability = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Ensures the height of the container is consistent with other components
        width: '100%',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Sustainability Highlights
      </Typography>

      <Grid container spacing={3} sx={{ width: '100%' }}>
        {/* Row 1: River Channelization and Solid Waste Management */}
        <Grid
          item
          xs={6} sm={3}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#1e88e5' }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            River Channelization:
          </Typography>
          <Typography variant="body1">46 km</Typography>
        </Grid>
        <Grid
          item
          xs={6} sm={3}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#e64a19' }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Solid Waste Management:
          </Typography>
          <Typography variant="body1">Initiated</Typography>
        </Grid>

        {/* Row 2: Afforestation and Trunk Infrastructure */}
        <Grid
          item
          xs={6} sm={3}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#388e3c' }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Afforestation:
          </Typography>
          <Typography variant="body1">3.5M Trees</Typography>
        </Grid>
        <Grid
          item
          xs={6} sm={3}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#0288d1' }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Trunk Infrastructure:
          </Typography>
          <Typography variant="body1">Initiated</Typography>
        </Grid>

        {/* Row 3: Dry Utilities */}
        <Grid
          item
          xs={6} sm={3}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#6a1b9a' }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Dry Utilities:
          </Typography>
          <Typography variant="body1">Initiated</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Sustainability;
