import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const ChartContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
}));

const PieChartContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, #10b981 0deg, #10b981 0deg, #ef4444 0deg, #ef4444 0deg)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    margin: '20px 0',
}));

const CenterCircle = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
}));

const LegendContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
}));

const LegendItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const LegendColor = styled(Box)(({ color }) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: color,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
}));

const AttendancePieChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <ChartContainer>
                <Typography variant="body1" color="text.secondary">
                    No attendance data available
                </Typography>
            </ChartContainer>
        );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Calculate angles for pie chart
    let currentAngle = 0;
    const segments = data.map((item, index) => {
        const angle = (item.value / total) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;
        
        return {
            ...item,
            startAngle,
            endAngle: currentAngle,
            angle
        };
    });

    // Generate conic gradient for attendance (Present = Green, Absent = Red)
    const gradientStops = segments.map((segment, index) => {
        const colors = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6']; // Green, Red, Orange, Blue
        const color = colors[index % colors.length];
        return `${color} ${segment.startAngle}deg ${segment.endAngle}deg`;
    }).join(', ');

    return (
        <ChartContainer>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Attendance Overview
            </Typography>
            
            <PieChartContainer sx={{ background: `conic-gradient(${gradientStops})` }}>
                <CenterCircle>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {total.toFixed(1)}%
                    </Typography>
                </CenterCircle>
            </PieChartContainer>

            <LegendContainer>
                {data.map((item, index) => {
                    const colors = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];
                    const color = colors[index % colors.length];
                    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                    
                    return (
                        <LegendItem key={item.name}>
                            <LegendColor color={color} />
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                {item.name}: {item.value.toFixed(1)}% ({percentage}% of total)
                            </Typography>
                        </LegendItem>
                    );
                })}
            </LegendContainer>
        </ChartContainer>
    );
};

export default AttendancePieChart; 