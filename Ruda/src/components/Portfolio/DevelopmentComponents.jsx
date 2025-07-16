import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const DevelopmentComponents = () => {
  const data = {
    labels: ['Water Treatment Plants', 'Road Network', 'Power Networks', 'Housing Projects', 'Others'],
    datasets: [
      {
        data: [20, 30, 15, 25, 10], // Replace with actual data
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Paper sx={{ padding: 2 }}>
        <Typography variant="body1" color="textSecondary" paragraph>
          <Doughnut data={data} />
        </Typography>
      </Paper>
    </Box>
  );
};

export default DevelopmentComponents;
