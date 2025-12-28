import {
    TableCell,
    TableRow,
    styled,
    tableCellClasses,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
} from "@mui/material";

const drawerWidth = 240

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: theme.palette.common.white,
        fontWeight: 600,
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        padding: '20px 16px',
        borderBottom: 'none',
        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
        }
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '20px 16px',
        borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
        verticalAlign: 'middle',
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgba(102, 126, 234, 0.03)',
    },
    '&:nth-of-type(even)': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    '&:hover': {
        backgroundColor: 'rgba(102, 126, 234, 0.08)',
        transition: 'background-color 0.2s ease-in-out',
        transform: 'scale(1.01)',
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    transition: 'all 0.2s ease-in-out',
}));

export const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            backgroundColor: '#333333',
            color: '#ffffff', // Added white text color
            '& .MuiListItemIcon-root': {
                color: '#ffffff', // Added white color for icons
            },
            '& .MuiListItemText-root': {
                color: '#ffffff', // Added white color for text
            },
            '& .MuiDivider-root': {
                borderColor: 'rgba(255, 255, 255, 0.12)', // Added lighter color for dividers
            },
            '& .MuiListSubheader-root': {
                color: '#ffffff', // Added white color for subheaders
                backgroundColor: '#333333', // Added to match drawer background
                lineHeight: '48px',
            },
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);