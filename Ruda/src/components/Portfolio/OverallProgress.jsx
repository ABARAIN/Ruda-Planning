import React from 'react';
import { Paper, Typography, Grid, LinearProgress } from '@mui/material';

const OverallProgress = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#f3f4f6',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Overall Progress
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Planned: 1.2% | Actual: 1.1%
      </Typography>

      {/* Displaying planned and actual progress side by side */}
      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#1976d2' }}>Planned %</Typography>
          <LinearProgress variant="determinate" value={1.2} sx={{ height: 12, borderRadius: 5, backgroundColor: '#d0d0d0' }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#388e3c' }}>Actual %</Typography>
          <LinearProgress variant="determinate" value={1.1} sx={{ height: 12, borderRadius: 5, backgroundColor: '#d0d0d0' }} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OverallProgress;
