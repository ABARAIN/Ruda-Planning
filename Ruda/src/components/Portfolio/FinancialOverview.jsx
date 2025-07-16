import React from 'react';
import { Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinancialOverview = () => {
  const data = [
    { name: 'Total Budget', value: 1.66 },
    { name: 'Utilized Budget', value: 0.79 },
    { name: 'Remaining Budget', value: 1.65 },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // Adjust to match the height of other components
        width: '100%',
        maxWidth: '100%', // Ensure full width
      }}
    >
      <Typography variant="h6" gutterBottom>Financial Overview</Typography>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default FinancialOverview;
