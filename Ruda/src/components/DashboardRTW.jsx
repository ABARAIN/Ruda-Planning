import React from 'react';
import {
    Box, Typography, Grid, Paper, Table, TableBody, TableRow, TableCell, Divider, Avatar
} from '@mui/material';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TimerIcon from '@mui/icons-material/Timer';

const landData = [
    { name: 'Available', value: 53 },
    { name: 'Remaining', value: 47 }
];
const pieColors = ['#4caf50', '#f44336'];

const physicalData = [
    { name: 'Planned', value: 76, fill: '#1565c0' },
    { name: 'Actual', value: 38, fill: '#fbc02d' }
];

const financialData = [
    { name: 'Contract Amount', value: 2520, fill: '#1976d2' },
    { name: 'Actual (Work Done)', value: 927, fill: '#8bc34a' },
    { name: 'Amount Paid & Certified', value: 740, fill: '#87ceeb' }
];


const kpiData = [
    { name: 'Earth Work (0+000 to 0+900)', value: 100 },
    { name: 'Stone Work (0+000 to 0+900)', value: 90 },
    { name: 'Earth Work (0+900 to 3+800)', value: 70 },
    { name: 'Stone Work (0+900 to 3+800)', value: 50 },
    { name: 'Earth Work (3+800 to 5+250)', value: 95 },
    { name: 'Stone Work (3+800 to 5+250)', value: 90 },
    { name: 'Earth Work (5+250 to 6+000)', value: 0 },
    { name: 'Stone Work (5+250 to 6+000)', value: 0 },
    { name: 'Stone Work (6+000 to 10+500)', value: 0 }
];

const curveData = [
    { month: 'Jul-24', planned: 2, actual: 1 },
    { month: 'Aug-24', planned: 5, actual: 1 },
    { month: 'Sep-24', planned: 9 , actual: 2},
    { month: 'Oct-24', planned: 13, actual: 5 },
    { month: 'Nov-24', planned: 21 , actual: 10},
    { month: 'Dec-24', planned: 29, actual: 12 },
    { month: 'Jan-25', planned: 31 , actual: 14},
    { month: 'Feb-25', planned: 34 , actual: 20},
    { month: 'Mar-25', planned: 37, actual: 22},
    { month: 'Apr-25', planned: 38, actual: 30 },
    { month: 'May-25', planned: 88 },
    { month: 'Jun-25', planned: 96 },
    { month: 'Jul-25', planned: 100 }
];

const firms = [
    { title: 'Employer', name: 'RUDA', img: '/Ruda.jpg' },
    { title: 'Design Consultant', name: 'NESPAK', img: '/Nespak.jpg' },
    { title: 'Supervision Consultant', name: 'P&D Directorate', img: '/Nespak.jpg' },
    { title: 'Contractor', name: 'Habib Construction', img: '/Habib.jpg' }
];

const SectionCard = ({ title, children, noStrip }) => (
    <Paper sx={{ border: noStrip ? 'none' : '1px solid black', boxShadow: 'none', bgcolor: '#fff' }}>
        {!noStrip && (
            <Box sx={{ bgcolor: '#000', color: '#fff', px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
            </Box>
        )}
        <Box sx={{ p: 2 }}>{children}</Box>
    </Paper>
);

export default function DashboardRTWExact() {
    return (
        <Box sx={{ width: '100vw', minHeight: '100vh', bgcolor: '#fff', overflowY: 'auto',
        maxHeight: '100vh',
        '::-webkit-scrollbar': {
          width: '6px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#aaa',
          borderRadius: '3px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#f0f0f0',
        }
       }}>
            <Box sx={{ bgcolor: '#000', color: '#fff', p: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    RTW PACKAGE‑02 (3 KM)
                </Typography>
                <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap' }}>
                    Date: 22-May-2025
                </Typography>
            </Box>


            <Box sx={{ px: 2, pt: 2, maxWidth: '1600px', mx: 'auto' }}>
                <Typography sx={{ mb: 1 }}>
                    The 3KM river training works project on the left side of the river aims to enhance flood protection and stabilize the riverbank.
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Paper sx={{ boxShadow: 'none', border: '1px solid black' }}>
                            <Box sx={{ p: 1, width: 600, }}>
                                <Typography variant="h6" fontWeight="bold">Location Map</Typography>
                                <Box component="img" src="/Img.png" width="100%" height="240px" sx={{ objectFit: 'cover' }} />
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={2.5}>
                        <Paper sx={{ boxShadow: 'none', p: 2 }}>
                            <Typography variant="h6" fontWeight="bold">Scope of Work</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">➤ Earthwork & Allied Activities</Typography>
                                    <Typography variant="body2" sx={{ color: 'gray', ml: 3 }}>(Filling & Cutting)</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">➤ Stone Works</Typography>
                                    <Typography variant="body2" sx={{ color: 'gray', ml: 3 }}>(Pitching, Apron & Filter Material)</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight="bold">➤ Coffer Dam & Cut-off Channel</Typography>
                                </Box>
                            </Box>

                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={2.5}>
                        <Paper sx={{ boxShadow: 'none', p: 2 }}>
                            <Typography variant="h6" fontWeight="bold">Land Status</Typography>
                            <PieChart width={210} height={150}>
                                <Pie data={landData} outerRadius={60} innerRadius={35} dataKey="value">
                                    {landData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index]} />
                                    ))}
                                </Pie>
                            </PieChart>
                            <Typography>➤ Available - 53% (1.6 km)</Typography>
                            <Typography>➤ Remaining - 47% (1.5 km)</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={1.5}>
                        <Paper sx={{ boxShadow: 'none', p: 2, textAlign: 'center' }}>
                            <AttachMoneyIcon fontSize="large" />
                            <Typography fontWeight="bold">Awarded Cost</Typography>
                            <Typography fontWeight="bold">PKR 2,520M</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={1.5}>
                        <Paper sx={{ boxShadow: 'none', p: 2, textAlign: 'center' }}>
                            <TimerIcon fontSize="large" />
                            <Typography fontWeight="bold">Duration</Typography>
                            <Typography fontWeight="bold">12 Months</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={2} mt={2}>
                    <Grid item xs={12} md={3}>
                        <SectionCard title="Progress Brief">
                            <Table size="small">
                                <TableBody>
                                    {[['Commencement Date', 'July 22, 2024'], ['Completion Date', 'July 09, 2025'], ['Actual Physical %', '38%'], ['Amount of Work Done', 'PKR 927 Million'], ['Amount Paid & Certified', 'PKR 740 Million'], ['Time Elapsed', '10 Months']].map(([label, value]) => (
                                        <TableRow key={label}>
                                            <TableCell>{label}</TableCell>
                                            <TableCell>{value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </SectionCard>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <SectionCard title="Physical Progress">
                            <BarChart width={300} height={200} data={physicalData}>
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4caf50" />
                            </BarChart>
                        </SectionCard>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <SectionCard title="Financial Progress">
                            <BarChart width={400} height={200} data={financialData} layout="vertical">
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={130} />
                                <Tooltip />
                                <Bar dataKey="value">
                                    {financialData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>

                            </BarChart>
                        </SectionCard>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <SectionCard title="Firms">
                            <Box height={200}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 2,
                                    textAlign: 'center',

                                }}
                            >
                                {firms.map((firm) => (
                                    <Box key={firm.title}>
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
                            <BarChart
                                width={700}
                                height={300} // Make same height as Progress Curve visually
                                data={kpiData}
                                layout="vertical"
                                margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={210}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip />
                                <Bar dataKey="value" fill="#82ca9d" barSize={14} />
                            </BarChart>
                        </SectionCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <SectionCard title="Progress Curve">
                            <LineChart width={700} height={300} data={curveData}>
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
