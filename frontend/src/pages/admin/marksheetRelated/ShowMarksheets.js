import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Grid,
    Pagination,
    Tooltip,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Publish as PublishIcon,
    Lock as FinalizeIcon,
    Download as DownloadIcon,
    FilterList as FilterIcon,
    Search as SearchIcon,
    Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { 
    getAllMarksheets, 
    deleteMarksheet, 
    publishMarksheet, 
    finalizeMarksheet,
    getMarksheetAnalytics
} from '../../../redux/marksheetRelated/marksheetHandle';
import { clearState } from '../../../redux/marksheetRelated/marksheetSlice';
import { BlueButton, RedButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';

const ShowMarksheets = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { currentUser } = useSelector(state => state.user);
    const { 
        marksheetsList, 
        loading, 
        error, 
        response, 
        statestatus, 
        pagination,
        marksheetAnalytics 
    } = useSelector(state => state.marksheet);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMarksheet, setSelectedMarksheet] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');
    
    // Filter states
    const [filters, setFilters] = useState({
        academicYear: '',
        term: '',
        status: '',
        classId: '',
        examType: '',
        search: ''
    });
    
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const queryParams = {
            page: currentPage,
            limit: 10,
            ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''))
        };
        
        dispatch(getAllMarksheets(currentUser._id, queryParams));
        dispatch(getMarksheetAnalytics(currentUser._id, {
            academicYear: filters.academicYear,
            term: filters.term
        }));
    }, [dispatch, currentUser._id, currentPage, filters]);

    useEffect(() => {
        if (response) {
            setMessage(response);
            setShowPopup(true);
            setDeleteDialogOpen(false);
            dispatch(clearState());
        } else if (error) {
            setMessage(error);
            setShowPopup(true);
            dispatch(clearState());
        }
    }, [response, error, dispatch]);

    const handleMenuOpen = (event, marksheet) => {
        setAnchorEl(event.currentTarget);
        setSelectedMarksheet(marksheet);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMarksheet(null);
    };

    const handleView = () => {
        navigate(`/Admin/marksheet/${selectedMarksheet._id}`);
        handleMenuClose();
    };

    const handleEdit = () => {
        navigate(`/Admin/marksheet/edit/${selectedMarksheet._id}`);
        handleMenuClose();
    };

    const handlePublish = () => {
        dispatch(publishMarksheet(selectedMarksheet._id));
        handleMenuClose();
    };

    const handleFinalize = () => {
        dispatch(finalizeMarksheet(selectedMarksheet._id));
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = () => {
        dispatch(deleteMarksheet(selectedMarksheet._id));
    };

    const handleFilterApply = () => {
        setCurrentPage(1);
        setFilterDialogOpen(false);
    };

    const handleFilterClear = () => {
        setFilters({
            academicYear: '',
            term: '',
            status: '',
            classId: '',
            examType: '',
            search: ''
        });
        setCurrentPage(1);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Draft': return 'default';
            case 'Published': return 'success';
            case 'Finalized': return 'error';
            default: return 'default';
        }
    };

    const getGradeColor = (grade) => {
        const gradeColors = {
            'A+': '#4caf50',
            'A': '#8bc34a',
            'B+': '#2196f3',
            'B': '#03a9f4',
            'C+': '#ff9800',
            'C': '#ffc107',
            'D': '#ff5722',
            'F': '#f44336'
        };
        return gradeColors[grade] || '#9e9e9e';
    };

    const canEdit = (marksheet) => marksheet.status === 'Draft';
    const canPublish = (marksheet) => marksheet.status === 'Draft';
    const canFinalize = (marksheet) => marksheet.status === 'Published';
    const canDelete = (marksheet) => marksheet.status === 'Draft';

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Marksheet Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        startIcon={<FilterIcon />}
                        onClick={() => setFilterDialogOpen(true)}
                        variant="outlined"
                    >
                        Filters
                    </Button>
                    <BlueButton
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/Admin/marksheet/create')}
                    >
                        Create Marksheet
                    </BlueButton>
                </Box>
            </Box>

            {/* Analytics Cards */}
            {marksheetAnalytics && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {marksheetAnalytics.summary?.total || 0}
                                </Typography>
                                <Typography variant="body2">Total Marksheets</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {marksheetAnalytics.summary?.published || 0}
                                </Typography>
                                <Typography variant="body2">Published</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {marksheetAnalytics.summary?.finalized || 0}
                                </Typography>
                                <Typography variant="body2">Finalized</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)' }}>
                            <CardContent sx={{ color: 'white', textAlign: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {marksheetAnalytics.summary?.draft || 0}
                                </Typography>
                                <Typography variant="body2">Draft</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Marksheets Table */}
            <Card>
                <CardContent>
                    {marksheetsList.length === 0 && !loading ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                No marksheets found
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Create your first marksheet to get started
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer component={Paper} elevation={0}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Student</TableCell>
                                            <TableCell>Class</TableCell>
                                            <TableCell>Academic Year</TableCell>
                                            <TableCell>Term</TableCell>
                                            <TableCell>Exam Type</TableCell>
                                            <TableCell>Overall Grade</TableCell>
                                            <TableCell>Percentage</TableCell>
                                            <TableCell>Rank</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {marksheetsList.map((marksheet) => (
                                            <TableRow key={marksheet._id} hover>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {marksheet.student?.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Roll: {marksheet.student?.rollNum}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{marksheet.class?.sclassName}</TableCell>
                                                <TableCell>{marksheet.academicYear}</TableCell>
                                                <TableCell>{marksheet.term}</TableCell>
                                                <TableCell>{marksheet.examType}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={marksheet.overall?.grade}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: getGradeColor(marksheet.overall?.grade),
                                                            color: 'white',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{marksheet.overall?.percentage}%</TableCell>
                                                <TableCell>
                                                    {marksheet.overall?.rank ? 
                                                        `${marksheet.overall.rank}/${marksheet.overall.totalStudents}` 
                                                        : '-'
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={marksheet.status}
                                                        size="small"
                                                        color={getStatusColor(marksheet.status)}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={(e) => handleMenuOpen(e, marksheet)}
                                                        size="small"
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Pagination
                                        count={pagination.pages}
                                        page={currentPage}
                                        onChange={(e, page) => setCurrentPage(page)}
                                        color="primary"
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Action Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleView}>
                    <ViewIcon sx={{ mr: 1 }} fontSize="small" />
                    View Details
                </MenuItem>
                {selectedMarksheet && canEdit(selectedMarksheet) && (
                    <MenuItem onClick={handleEdit}>
                        <EditIcon sx={{ mr: 1 }} fontSize="small" />
                        Edit
                    </MenuItem>
                )}
                {selectedMarksheet && canPublish(selectedMarksheet) && (
                    <MenuItem onClick={handlePublish}>
                        <PublishIcon sx={{ mr: 1 }} fontSize="small" />
                        Publish
                    </MenuItem>
                )}
                {selectedMarksheet && canFinalize(selectedMarksheet) && (
                    <MenuItem onClick={handleFinalize}>
                        <FinalizeIcon sx={{ mr: 1 }} fontSize="small" />
                        Finalize
                    </MenuItem>
                )}
                <MenuItem onClick={() => {}}>
                    <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
                    Download PDF
                </MenuItem>
                {selectedMarksheet && canDelete(selectedMarksheet) && (
                    <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                        <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                        Delete
                    </MenuItem>
                )}
            </Menu>

            {/* Filter Dialog */}
            <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Filter Marksheets</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Academic Year"
                                value={filters.academicYear}
                                onChange={(e) => setFilters(prev => ({ ...prev, academicYear: e.target.value }))}
                                placeholder="e.g., 2023-24"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Term</InputLabel>
                                <Select
                                    value={filters.term}
                                    label="Term"
                                    onChange={(e) => setFilters(prev => ({ ...prev, term: e.target.value }))}
                                >
                                    <MenuItem value="">All Terms</MenuItem>
                                    <MenuItem value="Term 1">Term 1</MenuItem>
                                    <MenuItem value="Term 2">Term 2</MenuItem>
                                    <MenuItem value="Final">Final</MenuItem>
                                    <MenuItem value="Annual">Annual</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filters.status}
                                    label="Status"
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                >
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="Draft">Draft</MenuItem>
                                    <MenuItem value="Published">Published</MenuItem>
                                    <MenuItem value="Finalized">Finalized</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Exam Type</InputLabel>
                                <Select
                                    value={filters.examType}
                                    label="Exam Type"
                                    onChange={(e) => setFilters(prev => ({ ...prev, examType: e.target.value }))}
                                >
                                    <MenuItem value="">All Types</MenuItem>
                                    <MenuItem value="Unit Test">Unit Test</MenuItem>
                                    <MenuItem value="Mid Term">Mid Term</MenuItem>
                                    <MenuItem value="Final">Final</MenuItem>
                                    <MenuItem value="Annual">Annual</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Search Student"
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                placeholder="Search by student name or roll number"
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilterClear}>Clear All</Button>
                    <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
                    <BlueButton onClick={handleFilterApply}>Apply Filters</BlueButton>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this marksheet? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <RedButton onClick={handleDeleteConfirm}>Delete</RedButton>
                </DialogActions>
            </Dialog>

            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Container>
    );
};

export default ShowMarksheets;