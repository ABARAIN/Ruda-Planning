import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Table, TableBody, TableRow, TableCell, Avatar, CircularProgress, useMediaQuery
} from '@mui/material';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimerIcon from '@mui/icons-material/Timer';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const pieColors = ['#4caf50', '#f44336'];

const bounceStyle = `
@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = bounceStyle;
document.head.appendChild(styleSheet);

// Shared reusable section container
const SectionCard = ({ title, children, noStrip }) => (
  <Paper sx={{ border: noStrip ? 'none' : '1px solid black', boxShadow: 'none', bgcolor: '#fff' }}>
    {!noStrip && (
      <Box sx={{ bgcolor: '#000', color: '#fff', px: 2, py: 1 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ textTransform: 'uppercase', textAlign: 'center' }}
        >
          {title}
        </Typography>
      </Box>
    )}
    <Box sx={{ p: 2 }}>{children}</Box>
  </Paper>
);

export default function DashboardRTWExact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios.get('https://ruda-backend-ny14.onrender.com/api/all')
      .then(res => {
        const pkg = res.data.features.find(f => f.properties.name === "RTW Package-02");
        if (pkg) {
          setData(pkg.properties);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{
        height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#121212', flexDirection: 'column',
      }}>
        <Box component="img" src="/ruda.png" alt="Loading..." sx={{ width: 180, animation: 'bounce 1.5s infinite ease-in-out' }} />
      </Box>
    );
  }

  if (!data) return null;

  return isMobile ? <MobileView data={data} /> : <DesktopView data={data} />;
}

function MobileView({ data }) {
  return (
    <Box sx={{ px: 2, py: 2 }}>
      <Typography variant="h5" align="center" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>{data.name}</Typography>
      <Typography align="center" sx={{ mb: 2 }}>Date: {data.completion_date}</Typography>
      <Box component="img" src="/Img.png" width="100%" height="200px" sx={{ objectFit: 'cover', mb: 2 }} />

      <SectionCard title="Scope of Work">
        {data.scope_of_work.map((item, i) => {
          const match = item.match(/^(.+?)\s*\((.+)\)$/);
          return (
            <Box key={i}>
              <Typography variant="body1" fontWeight="bold">➤ {match ? match[1] : item}</Typography>
              {match && <Typography variant="body2" sx={{ color: 'gray', ml: 2 }}>({match[2]})</Typography>}
            </Box>
          );
        })}
      </SectionCard>

      <SectionCard title="Land Status">
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie data={[
              { name: 'Available', value: data.land_available_pct },
              { name: 'Remaining', value: data.land_remaining_pct }
            ]} outerRadius={60} innerRadius={35} dataKey="value">
              {pieColors.map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Typography>➤ Available - {data.land_available_pct}% ({data.land_available_km} km)</Typography>
        <Typography>➤ Remaining - {data.land_remaining_pct}% ({data.land_remaining_km} km)</Typography>
      </SectionCard>

      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid item xs={6}>
          <SectionCard title="Cost">
            <Box textAlign="center">
              <AttachMoneyIcon sx={{ fontSize: 50 }} />
              <Typography fontWeight="bold">PKR {data.awarded_cost}M</Typography>
            </Box>
          </SectionCard>
        </Grid>
        <Grid item xs={6}>
          <SectionCard title="Duration">
            <Box textAlign="center">
              <TimerIcon sx={{ fontSize: 50 }} />
              <Typography fontWeight="bold">{data.duration_months} Months</Typography>
            </Box>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard title="Progress Brief">
        <Table size="small">
          <TableBody>
            <TableRow><TableCell>Start</TableCell><TableCell>{data.commencement_date}</TableCell></TableRow>
            <TableRow><TableCell>End</TableCell><TableCell>{data.completion_date}</TableCell></TableRow>
            <TableRow><TableCell>Actual Physical</TableCell><TableCell>{data.physical_actual_pct}%</TableCell></TableRow>
            <TableRow><TableCell>Work Done</TableCell><TableCell>PKR {data.work_done_million}M</TableCell></TableRow>
            <TableRow><TableCell>Certified</TableCell><TableCell>PKR {data.certified_million}M</TableCell></TableRow>
            <TableRow><TableCell>Elapsed</TableCell><TableCell>{data.elapsed_months} Months</TableCell></TableRow>
          </TableBody>
        </Table>
      </SectionCard>

      <SectionCard title="Physical Progress">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.physical_chart}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="value">
              {data.physical_chart.map((entry, index) => (
                <Cell key={index} fill={
                  entry.name === 'Planned' ? '#1565c0' :
                    entry.name === 'Actual' ? '#fbc02d' : '#4caf50'
                } />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Financial Progress">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.financial_chart} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="value">
              {data.financial_chart.map((entry, index) => (
                <Cell key={index} fill={['#1976d2', '#8bc34a', '#87ceeb'][index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Firms">
        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          {data.firms.map((firm, index) => (
            <Box key={index} textAlign="center">
              <Avatar src={firm.img} sx={{ width: 56, height: 56, mx: 'auto' }} />
              <Typography variant="caption" fontWeight="bold">{firm.title}</Typography>
              <Typography variant="body2">{firm.name}</Typography>
            </Box>
          ))}
        </Box>
      </SectionCard>

      <SectionCard title="Scope KPIs">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.kpi_chart} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="Progress Curve">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.curve_chart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="planned" stroke="#1976d2" />
            <Line type="monotone" dataKey="actual" stroke="#f44336" />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>
    </Box>
  );
}

// NOTE: Your existing full Desktop layout code remains untouched.
// It should be placed here as DesktopView component:
function DesktopView({ data }) {
    return (
      <Box sx={{
        width: '100vw', minHeight: '100vh', bgcolor: '#fff', overflowY: 'auto',
        maxHeight: '100vh',
        '::-webkit-scrollbar': { width: '6px' },
        '::-webkit-scrollbar-thumb': { backgroundColor: '#aaa', borderRadius: '3px' },
        '::-webkit-scrollbar-track': { backgroundColor: '#f0f0f0' }
      }}>
        <Box sx={{ bgcolor: '#000', color: '#fff', p: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {data.name}
          </Typography>
          <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
            Date: {data.completion_date}
          </Typography>
        </Box>
  
        <Box sx={{ px: 2, pt: 2, maxWidth: '1600px', mx: 'auto' }}>
          <Typography sx={{ mb: 1 }}>{data.description}</Typography>
  
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Paper sx={{ boxShadow: 'none', border: '1px solid black' }}>
                <Box sx={{ p: 0.5, width: 580 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ textTransform: 'uppercase', textAlign: 'center' }}
                  >
                    Location Map
                  </Typography>
                  <Box component="img" src="/Img.png" width="100%" height="240px" sx={{ objectFit: 'cover' }} />
                </Box>
              </Paper>
            </Grid>
  
            <Grid item xs={12} md={2.5}>
              <Paper sx={{ boxShadow: 'none', p: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
                  Scope of Work
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                  {data.scope_of_work.map((item, i) => {
                    const match = item.match(/^(.+?)\s*\((.+)\)$/);
                    return (
                      <Box key={i}>
                        <Typography variant="body1" fontWeight="bold">➤ {match ? match[1] : item}</Typography>
                        {match && <Typography variant="body2" sx={{ color: 'gray', ml: 3 }}>({match[2]})</Typography>}
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
  
            <Grid item xs={12} md={2.5}>
              <Paper sx={{ boxShadow: 'none', p: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'uppercase', textAlign: 'center' }}>
                  Land Status
                </Typography>
                <PieChart width={210} height={150}>
                  <Pie data={[
                    { name: 'Available', value: data.land_available_pct },
                    { name: 'Remaining', value: data.land_remaining_pct }
                  ]} outerRadius={60} innerRadius={35} dataKey="value">
                    {pieColors.map((color, index) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>
                </PieChart>
                <Typography>➤ Available - {data.land_available_pct}% ({data.land_available_km} km)</Typography>
                <Typography>➤ Remaining - {data.land_remaining_pct}% ({data.land_remaining_km} km)</Typography>
              </Paper>
            </Grid>
  
            <Grid item xs={12} md={1.5}>
              <Paper sx={{ boxShadow: 'none', p: 2, textAlign: 'center' }}>
                <AttachMoneyIcon sx={{ fontSize: 60, color: '#000000' }} />
                <Typography fontWeight="bold" fontSize="small">Awarded Cost</Typography>
                <Typography fontWeight="bold" fontSize="large">PKR {data.awarded_cost}M</Typography>
              </Paper>
            </Grid>
  
            <Grid item xs={12} md={1.5}>
              <Paper sx={{ boxShadow: 'none', p: 2, textAlign: 'center' }}>
                <TimerIcon sx={{ fontSize: 60, color: '#000000' }} />
                <Typography fontWeight="bold" fontSize="small">Duration</Typography>
                <Typography fontWeight="bold" fontSize="large">{data.duration_months} Months</Typography>
              </Paper>
            </Grid>
          </Grid>
  
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={3}>
              <SectionCard title="Progress Brief">
                <Table size="small">
                  <TableBody>
                    <TableRow><TableCell>Commencement Date</TableCell><TableCell>{data.commencement_date}</TableCell></TableRow>
                    <TableRow><TableCell>Completion Date</TableCell><TableCell>{data.completion_date}</TableCell></TableRow>
                    <TableRow><TableCell>Actual Physical %</TableCell><TableCell>{data.physical_actual_pct}%</TableCell></TableRow>
                    <TableRow><TableCell>Amount of Work Done</TableCell><TableCell>PKR {data.work_done_million} Million</TableCell></TableRow>
                    <TableRow><TableCell>Amount Paid & Certified</TableCell><TableCell>PKR {data.certified_million} Million</TableCell></TableRow>
                    <TableRow><TableCell>Time Elapsed</TableCell><TableCell>{data.elapsed_months} Months</TableCell></TableRow>
                  </TableBody>
                </Table>
              </SectionCard>
            </Grid>
  
            <Grid item xs={12} md={3}>
              <SectionCard title="Physical Progress">
                <BarChart width={300} height={200} data={data.physical_chart}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value">
                    {data.physical_chart.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.name === 'Planned' ? '#1565c0' :
                              entry.name === 'Actual' ? '#fbc02d' : '#4caf50'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </SectionCard>
            </Grid>
  
            <Grid item xs={12} md={3}>
              <SectionCard title="Financial Progress">
                <BarChart width={400} height={200} data={data.financial_chart} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={130} />
                  <Tooltip />
                  <Bar dataKey="value">
                    {data.financial_chart.map((entry, index) => (
                      <Cell key={index} fill={['#1976d2', '#8bc34a', '#87ceeb'][index]} />
                    ))}
                  </Bar>
                </BarChart>
              </SectionCard>
            </Grid>
  
            <Grid item xs={12} md={3}>
              <SectionCard title="Firms">
                <Box height={200} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, textAlign: 'center' }}>
                  {data.firms.map((firm, index) => (
                    <Box key={index}>
                      <Avatar src={firm.img} sx={{ width: 56, height: 56, mx: 'auto', mb: 0 }} />
                      <Typography variant="caption" fontWeight="bold">{firm.title}</Typography>
                      <Typography variant="body2">{firm.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </SectionCard>
            </Grid>
          </Grid>
  
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={6}>
              <SectionCard title="Scope KPIs">
                <Box sx={{
                  height: 300,
                  overflowY: 'hidden',
                  '&:hover': { overflowY: data.kpi_chart.length * 35 > 300 ? 'auto' : 'hidden' },
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '3px' }
                }}>
                  <BarChart width={695} height={Math.max(300, data.kpi_chart.length * 35)} data={data.kpi_chart} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={210} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" barSize={14} />
                  </BarChart>
                </Box>
              </SectionCard>
            </Grid>
  
            <Grid item xs={12} md={6}>
              <SectionCard title="Progress Curve">
                <LineChart width={700} height={300} data={data.curve_chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="planned" stroke="#1976d2" />
                  <Line type="monotone" dataKey="actual" stroke="#f44336" />
                </LineChart>
              </SectionCard>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
  