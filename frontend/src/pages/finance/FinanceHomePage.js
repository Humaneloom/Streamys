import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Chip,
    LinearProgress,
    CircularProgress,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemAvatar,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    AttachMoney as MoneyIcon,
    TrendingUp as TrendingUpIcon,
    AccountBalance as AccountIcon,
    Receipt as ReceiptIcon,
    Payment as PaymentIcon,
    Assessment as ReportIcon,
    TrendingDown as TrendingDownIcon,
    People as PeopleIcon,
    School as SchoolIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.8)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    },
}));

const StatCard = styled(Card)(({ theme, color }) => ({
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    },
}));

const ChartCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.8)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    },
}));

const COLORS = ['#1e40af', '#059669', '#dc2626', '#ea580c', '#7c3aed', '#0891b2', '#be185d', '#16a34a'];

const FinanceHomePage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // For demo purposes, using 'KLPD' as school ID - you can make this dynamic
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5000'}/FinanceDashboard/KLPD`);
            setDashboardData(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh' 
            }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button 
                    variant="contained" 
                    onClick={fetchDashboardData}
                    sx={{ mt: 2 }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    // Use mock data if no real data is available
    const data = dashboardData || {
        overview: {
            totalRevenue: 125000,
            totalPaidAmount: 89500,
            totalPendingAmount: 35500,
            totalExpenses: 45000,
            totalTeacherSalaries: 35000,
            netProfit: 45000,
            totalStudents: 150,
            totalTeachers: 12
        },
        monthlyData: [
            { month: 'Jan', revenue: 12000, expenses: 8000, profit: 4000 },
            { month: 'Feb', revenue: 15000, expenses: 9000, profit: 6000 },
            { month: 'Mar', revenue: 18000, expenses: 10000, profit: 8000 },
            { month: 'Apr', revenue: 14000, expenses: 8500, profit: 5500 },
            { month: 'May', revenue: 16000, expenses: 9500, profit: 6500 },
            { month: 'Jun', revenue: 19000, expenses: 11000, profit: 8000 },
            { month: 'Jul', revenue: 17000, expenses: 9000, profit: 8000 },
            { month: 'Aug', revenue: 20000, expenses: 12000, profit: 8000 },
            { month: 'Sep', revenue: 18000, expenses: 10000, profit: 8000 },
            { month: 'Oct', revenue: 16000, expenses: 9500, profit: 6500 },
            { month: 'Nov', revenue: 14000, expenses: 8500, profit: 5500 },
            { month: 'Dec', revenue: 22000, expenses: 13000, profit: 9000 }
        ],
        expenseCategories: {
            maintenance: 15000,
            utilities: 12000,
            function: 8000,
            coffee: 3000,
            temple: 2000,
            other: 5000
        },
        paymentStatus: {
            Paid: 120,
            Partial: 20,
            Pending: 8,
            Overdue: 2
        },
        classRevenue: {
            'Class 10A': 25000,
            'Class 10B': 22000,
            'Class 9A': 20000,
            'Class 9B': 18000,
            'Class 8A': 15000,
            'Class 8B': 15000
        },
        recentTransactions: [
            { type: 'fee', amount: 5000, description: 'Student Fee - John Doe', date: new Date(), status: 'Paid' },
            { type: 'expense', amount: -1500, description: 'School Supplies', date: new Date(), category: 'maintenance' },
            { type: 'fee', amount: 4500, description: 'Student Fee - Jane Smith', date: new Date(), status: 'Partial' }
        ]
    };

    const stats = [
        {
            title: 'Total Revenue',
            value: `₹${data.overview.totalRevenue.toLocaleString()}`,
            change: '+12.5%',
            icon: <MoneyIcon />,
            color: '#059669',
            progress: 75
        },
        {
            title: 'Net Profit',
            value: `₹${data.overview.netProfit.toLocaleString()}`,
            change: '+8.7%',
            icon: <TrendingUpIcon />,
            color: '#1e40af',
            progress: 60
        },
        {
            title: 'Total Expenses',
            value: `₹${data.overview.totalExpenses.toLocaleString()}`,
            change: '-5.2%',
            icon: <TrendingDownIcon />,
            color: '#dc2626',
            progress: 45
        },
        {
            title: 'Pending Payments',
            value: `₹${data.overview.totalPendingAmount.toLocaleString()}`,
            change: '-15.3%',
            icon: <PaymentIcon />,
            color: '#ea580c',
            progress: 30
        }
    ];

    const expenseCategoryData = Object.entries(data.expenseCategories).map(([category, amount]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value: amount
    }));

    const paymentStatusData = Object.entries(data.paymentStatus).map(([status, count]) => ({
        name: status,
        value: count
    }));

    const classRevenueData = Object.entries(data.classRevenue).map(([className, revenue]) => ({
        name: className,
        revenue: revenue
    }));

    return (
        <Box sx={{ p: 3 }}>
            {/* Welcome Section with Gradient Background */}
            <Box sx={{ 
                mb: 4, 
                p: 4, 
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    transform: 'translate(50%, -50%)'
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '150px',
                    height: '150px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, 50%)'
                }} />
                <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    mb: 2,
                    position: 'relative',
                    zIndex: 1
                }}>
                    Financial Dashboard
                </Typography>
                <Typography variant="h6" sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    Comprehensive overview of revenue, expenses, and financial performance
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatCard color={stat.color}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            width: 48,
                                            height: 48
                                        }}
                                    >
                                        {stat.icon}
                                    </Avatar>
                                    <Chip
                                        label={stat.change}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            fontWeight: 600
                                        }}
                                    />
                                </Box>
                                <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                                    {stat.title}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={stat.progress}
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: 'white'
                                        }
                                    }}
                                />
                            </CardContent>
                        </StatCard>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Monthly Revenue & Expenses Chart */}
                <Grid item xs={12} lg={8}>
                    <ChartCard>
                        <CardHeader
                            title="Monthly Revenue & Expenses"
                            subheader="12-month trend analysis"
                            sx={{
                                '& .MuiCardHeader-title': {
                                    color: '#1e293b',
                                    fontWeight: 700
                                },
                                '& .MuiCardHeader-subheader': {
                                    color: '#64748b'
                                }
                            }}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data.monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="month" 
                                        tick={{ fill: '#475569', fontSize: 12 }}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#475569', fontSize: 12 }}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#059669" 
                                        strokeWidth={4}
                                        name="Revenue"
                                        dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                                        activeDot={{ r: 8, stroke: '#059669', strokeWidth: 2, fill: '#10b981' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="expenses" 
                                        stroke="#dc2626" 
                                        strokeWidth={4}
                                        name="Expenses"
                                        dot={{ fill: '#dc2626', strokeWidth: 2, r: 6 }}
                                        activeDot={{ r: 8, stroke: '#dc2626', strokeWidth: 2, fill: '#ef4444' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="profit" 
                                        stroke="#1e40af" 
                                        strokeWidth={4}
                                        name="Profit"
                                        dot={{ fill: '#1e40af', strokeWidth: 2, r: 6 }}
                                        activeDot={{ r: 8, stroke: '#1e40af', strokeWidth: 2, fill: '#3b82f6' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </ChartCard>
                </Grid>

                {/* Expense Categories Pie Chart */}
                <Grid item xs={12} lg={4}>
                    <ChartCard>
                        <CardHeader
                            title="Expense Categories"
                            subheader="Breakdown by category"
                            sx={{
                                '& .MuiCardHeader-title': {
                                    color: '#1e293b',
                                    fontWeight: 700
                                },
                                '& .MuiCardHeader-subheader': {
                                    color: '#64748b'
                                }
                            }}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={expenseCategoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {expenseCategoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </ChartCard>
                </Grid>
            </Grid>

            {/* Additional Charts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Payment Status Chart */}
                <Grid item xs={12} md={6}>
                    <ChartCard>
                        <CardHeader
                            title="Payment Status Distribution"
                            subheader="Student fee payment status"
                            sx={{
                                '& .MuiCardHeader-title': {
                                    color: '#1e293b',
                                    fontWeight: 700
                                },
                                '& .MuiCardHeader-subheader': {
                                    color: '#64748b'
                                }
                            }}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={paymentStatusData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fill: '#475569', fontSize: 12 }}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#475569', fontSize: 12 }}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#7c3aed"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </ChartCard>
                </Grid>

                {/* Class Revenue Chart */}
                <Grid item xs={12} md={6}>
                    <ChartCard>
                        <CardHeader
                            title="Revenue by Class"
                            subheader="Revenue distribution across classes"
                            sx={{
                                '& .MuiCardHeader-title': {
                                    color: '#1e293b',
                                    fontWeight: 700
                                },
                                '& .MuiCardHeader-subheader': {
                                    color: '#64748b'
                                }
                            }}
                        />
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={classRevenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fill: '#475569', fontSize: 12 }}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#475569', fontSize: 12 }}
                                        axisLine={{ stroke: '#cbd5e1' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="revenue" 
                                        fill="#0891b2"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </ChartCard>
                </Grid>
            </Grid>

            {/* Recent Transactions */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <ChartCard>
                        <CardHeader
                            title="Recent Transactions"
                            subheader="Latest financial activities"
                            sx={{
                                '& .MuiCardHeader-title': {
                                    color: '#1e293b',
                                    fontWeight: 700
                                },
                                '& .MuiCardHeader-subheader': {
                                    color: '#64748b'
                                }
                            }}
                        />
                        <CardContent>
                            <List>
                                {data.recentTransactions.map((transaction, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar sx={{ 
                                                    bgcolor: transaction.type === 'fee' ? '#059669' : '#dc2626' 
                                                }}>
                                                    {transaction.type === 'fee' ? <MoneyIcon /> : <ReceiptIcon />}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={transaction.description}
                                                secondary={new Date(transaction.date).toLocaleDateString()}
                                            />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: transaction.amount >= 0 ? '#059669' : '#dc2626',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    ${Math.abs(transaction.amount).toLocaleString()}
                                                </Typography>
                                                {transaction.status && (
                                                    <Chip 
                                                        label={transaction.status} 
                                                        size="small"
                                                        color={transaction.status === 'Paid' ? 'success' : 'warning'}
                                                    />
                                                )}
                                            </Box>
                                        </ListItem>
                                        {index < data.recentTransactions.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </ChartCard>
                </Grid>

                {/* Quick Stats */}
                <Grid item xs={12} md={4}>
                    <ChartCard>
                        <CardHeader
                            title="Quick Statistics"
                            subheader="Key financial metrics"
                            sx={{
                                '& .MuiCardHeader-title': {
                                    color: '#1e293b',
                                    fontWeight: 700
                                },
                                '& .MuiCardHeader-subheader': {
                                    color: '#64748b'
                                }
                            }}
                        />
                        <CardContent>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ color: '#1e293b', mb: 1 }}>
                                    Total Students
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#059669', fontWeight: 700 }}>
                                    {data.overview.totalStudents}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ color: '#1e293b', mb: 1 }}>
                                    Total Teachers
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#1e40af', fontWeight: 700 }}>
                                    {data.overview.totalTeachers}
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ color: '#1e293b', mb: 1 }}>
                                    Teacher Salaries
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#dc2626', fontWeight: 700 }}>
                                    ${data.overview.totalTeacherSalaries.toLocaleString()}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ color: '#1e293b', mb: 1 }}>
                                    Collection Rate
                                </Typography>
                                <Typography variant="h4" sx={{ color: '#7c3aed', fontWeight: 700 }}>
                                    {Math.round((data.overview.totalPaidAmount / data.overview.totalRevenue) * 100)}%
                                </Typography>
                            </Box>
                        </CardContent>
                    </ChartCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FinanceHomePage; 