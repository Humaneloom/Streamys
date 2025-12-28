import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Box, Typography } from '@mui/material';

const CustomLineChart = ({ data, title, dataKey, strokeColor = "#667eea", fillColor = "rgba(102, 126, 234, 0.1)" }) => {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: strokeColor, fontWeight: 600 }}>
                        {dataKey}: {payload[0].value}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis 
                        dataKey="name" 
                        stroke="rgba(0,0,0,0.6)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis 
                        stroke="rgba(0,0,0,0.6)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                        type="monotone" 
                        dataKey={dataKey} 
                        stroke={strokeColor} 
                        strokeWidth={3}
                        fill="url(#colorValue)"
                        dot={{ fill: strokeColor, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: strokeColor, strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CustomLineChart; 