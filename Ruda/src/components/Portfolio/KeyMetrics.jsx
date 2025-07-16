import React from 'react';
import { Paper, Typography, Grid } from '@mui/material';
import { AttachMoney, AccessTime, Map, AccountBalance } from '@mui/icons-material';

const KeyMetrics = ({ totalBudget, totalArea, totalProjects }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Adjust to match the height of other components
        width: '100%',
      }}
    >
      <Typography variant="h6" gutterBottom>Key Metrics</Typography>
      <Grid container spacing={2} sx={{ width: '100%' }}>
        {/* Row 1: Budget and Duration */}
        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoney sx={{ fontSize: 40, marginRight: 2 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Development Budget:</Typography>
          <Typography variant="body1" sx={{ marginLeft: 1 }}>{totalBudget}</Typography>
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <AccessTime sx={{ fontSize: 40, marginRight: 2 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Overall Duration:</Typography>
          <Typography variant="body1" sx={{ marginLeft: 1 }}>{totalProjects} Years</Typography>
        </Grid>

        {/* Row 2: Area and Projects */}
        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Map sx={{ fontSize: 40, marginRight: 2 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Area:</Typography>
          <Typography variant="body1" sx={{ marginLeft: 1 }}>{totalArea}</Typography>
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalance sx={{ fontSize: 40, marginRight: 2 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Projects:</Typography>
          <Typography variant="body1" sx={{ marginLeft: 1 }}>{totalProjects}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default KeyMetrics;
