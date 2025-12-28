import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Fade, Grow, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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

const GitHubGrid = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    alignItems: 'flex-start',
    width: '100%',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    borderRadius: '6px',
    padding: theme.spacing(2),
    border: '1px solid #475569',
    overflow: 'hidden',
}));

const MonthLabels = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1),
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
}));

const MonthLabel = styled(Typography)(({ theme }) => ({
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
    textAlign: 'center',
    position: 'absolute',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
}));

const GridContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    overflow: 'hidden',
}));

const WeekdayLabels = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    width: '40px',
}));

const WeekdayLabel = styled(Typography)(({ theme }) => ({
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
    height: '15px',
    display: 'flex',
    alignItems: 'center',
}));

const WeekColumn = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    height: 'fit-content',
}));

const DayCell = styled(Box, {
    shouldForwardProp: (prop) => !['status', 'isToday', 'isHovered'].includes(prop)
})(({ theme, status, isToday, isHovered }) => ({
    width: 12,
    height: 12,
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: isToday ? '1px solid #f78166' : '1px solid transparent',
    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
    boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
    zIndex: isHovered ? 2 : 1,
    
    // Blue-violet to purple gradient theme colors
    background: status === 'present' ? '#10b981' : 
                status === 'absent' ? '#ef4444' : 
                status === 'late' ? '#f59e0b' :
                status === 'excused' ? '#7F3FBF' :
                '#1e293b', // Darker background for better visibility
}));

const LegendContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: '1px solid #475569',
    width: '100%',
}));

const LegendText = styled(Typography)(({ theme }) => ({
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
}));

const StatsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    background: 'linear-gradient(135deg, rgba(106, 106, 240, 0.1) 0%, rgba(127, 63, 191, 0.1) 100%)',
    borderRadius: '6px',
    border: '1px solid #475569',
}));

const StatItem = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(0.5),
}));

const CustomAttendanceGrid = ({ data }) => {
    const [hoveredDay, setHoveredDay] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Debug logging
    console.log('CustomAttendanceGrid data:', data);

    // Generate simple GitHub-style grid for the last 6 months
    const generateSimpleGrid = (attendanceData) => {
        const grid = [];
        const today = new Date();
        const startDate = new Date(today.getFullYear(), 0, 1); // January 1st of current year
        const endDate = new Date(today.getFullYear(), 11, 31); // December 31st of current year
        
        // Create a map of attendance data by date
        const attendanceMap = {};
        if (attendanceData && Array.isArray(attendanceData)) {
            attendanceData.forEach(item => {
                try {
                    let date;
                    if (typeof item.date === 'string') {
                        date = new Date(item.date);
                    } else if (item.date instanceof Date) {
                        date = item.date;
                    } else {
                        console.warn('Invalid date format:', item.date);
                        return;
                    }
                    
                    if (isNaN(date.getTime())) {
                        console.warn('Invalid date value:', item.date);
                        return;
                    }
                    
                    // Use local date to avoid timezone issues
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const dateKey = `${year}-${month}-${day}`;
                    attendanceMap[dateKey] = item.status.toLowerCase();
                } catch (error) {
                    console.warn('Error processing date:', item.date, error);
                }
            });
        }

        // Generate grid data for the entire year (Jan 1 to Dec 31)
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            // Use local date to avoid timezone issues
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateKey = `${year}-${month}-${day}`;
            
            const status = attendanceMap[dateKey] || 'no-data';
            
            // Compare with today's local date
            const todayYear = today.getFullYear();
            const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
            const todayDay = String(today.getDate()).padStart(2, '0');
            const todayKey = `${todayYear}-${todayMonth}-${todayDay}`;
            const isToday = dateKey === todayKey;
            const dayOfWeek = currentDate.getDay();
            
            grid.push({
                date: dateKey,
                status,
                isToday,
                displayDate: currentDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                }),
                dayOfWeek: dayOfWeek,
                month: currentDate.getMonth()
            });
            
            // Debug: Log first few days to verify alignment
            if (grid.length <= 10) {
                console.log(`Day ${grid.length}: ${dateKey} - ${currentDate.toLocaleDateString('en-US', { weekday: 'long' })} (${dayOfWeek})`);
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return grid;
    };

    // Group into months with proper alignment and spacing
    const groupIntoMonths = (grid) => {
        const months = [];
        let currentMonth = [];
        let currentMonthIndex = -1;
        
        grid.forEach(day => {
            if (day.month !== currentMonthIndex) {
                // Start a new month
                if (currentMonth.length > 0) {
                    months.push(currentMonth);
                }
                currentMonth = [];
                currentMonthIndex = day.month;
            }
            currentMonth.push(day);
        });
        
        // Add the last month
        if (currentMonth.length > 0) {
            months.push(currentMonth);
        }
        
        return months;
    };

    // Group weeks within each month with proper weekday alignment
    const groupWeeksInMonth = (monthDays) => {
        const weeks = [];
        let currentWeek = [];
        
        // Find the first day of the month and align weeks properly
        const firstDay = new Date(monthDays[0]?.date || new Date());
        const dayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < dayOfWeek; i++) {
            currentWeek.push(null);
        }
        
        monthDays.forEach(day => {
            currentWeek.push(day);
            if (currentWeek.length === 7) {
                weeks.push([...currentWeek]);
                currentWeek = [];
            }
        });
        
        // Add remaining days if any
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            weeks.push(currentWeek);
        }
        
        return weeks;
    };

    const attendanceGrid = generateSimpleGrid(data);
    const months = groupIntoMonths(attendanceGrid);
    const monthWeeks = months.map(monthDays => groupWeeksInMonth(monthDays));

    // Get month labels for the entire year
    const getMonthLabels = () => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthLabels = [];
        
        monthWeeks.forEach((month, monthIdx) => {
            const monthName = monthNames[monthIdx];
            const weekCount = month.length;
            
            // Add month label for each week in this month
            for (let i = 0; i < weekCount; i++) {
                if (i === 0) {
                    monthLabels.push(monthName);
                } else {
                    monthLabels.push('');
                }
            }
        });
        
        return monthLabels;
    };

    // Get month label positions for proper alignment
    const getMonthLabelPositions = () => {
        const positions = [];
        let currentPosition = 0;
        
        monthWeeks.forEach((month, monthIdx) => {
            const weekCount = month.length;
            positions.push({
                month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIdx],
                start: currentPosition,
                width: weekCount
            });
            currentPosition += weekCount;
        });
        
        console.log('Month positions:', positions);
        return positions;
    };

    const monthLabels = getMonthLabels();

    // Calculate statistics
    const stats = attendanceGrid.reduce((acc, day) => {
        if (day.status === 'present') acc.present++;
        else if (day.status === 'absent') acc.absent++;
        else if (day.status === 'late') acc.late++;
        else if (day.status === 'excused') acc.excused++;
        return acc;
    }, { present: 0, absent: 0, late: 0, excused: 0 });

    const totalDays = attendanceGrid.length;
    const presentPercentage = totalDays > 0 ? (stats.present / totalDays) * 100 : 0;

    // Calculate current streak
    const calculateCurrentStreak = () => {
        let streak = 0;
        for (let i = attendanceGrid.length - 1; i >= 0; i--) {
            if (attendanceGrid[i].status === 'present') {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const currentStreak = calculateCurrentStreak();

    if (!data || data.length === 0) {
        return (
            <ChartContainer>
                <Fade in={isLoaded} timeout={800}>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        textAlign: 'center',
                        py: 4
                    }}>
                        <Box sx={{ 
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mb: 2
                        }}>
                            <CalendarTodayIcon sx={{ fontSize: 40, color: '#94a3b8' }} />
                        </Box>
                        <Typography variant="h6" sx={{ color: '#64748b', mb: 1, fontWeight: 600 }}>
                            No Attendance Records
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 200 }}>
                            Your attendance streak will appear here once you have records
                        </Typography>
                    </Box>
                </Fade>
            </ChartContainer>
        );
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'present': return 'Present';
            case 'absent': return 'Absent';
            case 'late': return 'Late';
            case 'excused': return 'Excused';
            default: return 'No Data';
        }
    };

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <ChartContainer>
            <Grow in={isLoaded} timeout={1000}>
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                    {/* GitHub-style Attendance Grid */}
                    <GitHubGrid>
                        {/* Month Labels */}
                        <MonthLabels>
                            {monthWeeks.map((month, monthIndex) => (
                                <Box 
                                    key={monthIndex} 
                                    sx={{ 
                                        display: 'flex', 
                                        gap: '6px',
                                        width: `${month.length * 18}px`,
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        height: 'fit-content',
                                        paddingLeft: monthIndex >= 3 ? '82px' : '0px', // Move April onwards to the right
                                    }}
                                >
                                    <Typography 
                                        sx={{ 
                                            color: '#ffffff',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex]}
                                    </Typography>
                                </Box>
                            ))}
                        </MonthLabels>

                        {/* Grid Container */}
                        <GridContainer>
                            {/* Attendance Grid */}
                            <Box sx={{ 
                                display: 'flex',
                                gap: '12px',
                                width: '100%',
                                overflow: 'auto',
                                flexWrap: 'nowrap',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                '&::-webkit-scrollbar': {
                                    height: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: '#1e293b',
                                    borderRadius: '3px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#475569',
                                    borderRadius: '3px',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: '#64748b',
                                },
                            }}>
                                {monthWeeks.map((month, monthIndex) => (
                                    <Box 
                                        key={monthIndex} 
                                        sx={{ 
                                            display: 'flex', 
                                            gap: '6px',
                                            height: 'fit-content',
                                        }}
                                    >
                                        {month.map((week, weekIndex) => (
                                            <WeekColumn key={`${monthIndex}-${weekIndex}`}>
                                                {week.map((day, dayIndex) => (
                                                    day ? (
                                                        <Tooltip
                                                            key={dayIndex}
                                                            title={`${day.displayDate}: ${getStatusLabel(day.status)}`}
                                                            arrow
                                                        >
                                                            <DayCell
                                                                status={day.status}
                                                                isToday={day.isToday}
                                                                isHovered={hoveredDay === `${monthIndex}-${weekIndex}-${dayIndex}`}
                                                                onMouseEnter={() => setHoveredDay(`${monthIndex}-${weekIndex}-${dayIndex}`)}
                                                                onMouseLeave={() => setHoveredDay(null)}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Box
                                                            key={dayIndex}
                                                            sx={{
                                                                width: 12, 
                                                                height: 12, 
                                                                borderRadius: '2px',
                                                                background: 'transparent',
                                                            }}
                                                        />
                                                    )
                                                ))}
                                            </WeekColumn>
                                        ))}
                                    </Box>
                                ))}
                            </Box>
                        </GridContainer>

                        {/* Legend */}
                        <LegendContainer>
                            <LegendText>Less</LegendText>
                            <Box sx={{ display: 'flex', gap: '2px' }}>
                                <DayCell status="no-data" />
                                <DayCell status="present" />
                                <DayCell status="present" />
                                <DayCell status="present" />
                            </Box>
                            <LegendText>More</LegendText>
                        </LegendContainer>
                    </GitHubGrid>

                    {/* Statistics */}
                    <StatsContainer>
                        <StatItem>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#6A6AF0' }}>
                                {currentStreak}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 600 }}>
                                Day Streak
                            </Typography>
                        </StatItem>
                        <StatItem>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#667eea' }}>
                                {presentPercentage.toFixed(1)}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 600 }}>
                                Attendance Rate
                            </Typography>
                        </StatItem>
                        <StatItem>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#6A6AF0' }}>
                                {stats.present}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 600 }}>
                                Present Days
                            </Typography>
                        </StatItem>
                    </StatsContainer>
                </Box>
            </Grow>
        </ChartContainer>
    );
};

export default CustomAttendanceGrid; 