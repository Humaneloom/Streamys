import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import axios from 'axios';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  IconButton, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Fade,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  Subject as SubjectIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '1px solid rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
  },
}));

const TeacherCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #e8ecf1 100%)',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  border: '1px solid rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    '& .MuiCardContent-root': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
    },
    '& .teacher-label': {
      color: 'rgba(255, 255, 255, 0.9) !important',
    },
    '& .teacher-value': {
      color: '#ffffff !important',
      fontWeight: '600 !important',
    },
    '& .teacher-name': {
      color: '#ffffff !important',
    },
    '& .salary-chip': {
      background: 'rgba(255, 255, 255, 0.2) !important',
      color: '#ffffff !important',
    }
  },
  '& .MuiCardContent-root': {
    transition: 'all 0.3s ease-in-out',
  }
}));

const GradientIcon = styled(Box)(({ theme, color }) => ({
  width: 60,
  height: 60,
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  '& .MuiSvgIcon-root': {
    fontSize: '2rem',
    color: '#ffffff',
  },
}));

const TeacherSalaryManagement = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { teachersList, loading, error } = useSelector(state => state.teacher);

  // Transform teachers data to include salary information
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  // Available classes and subjects for selection
  const availableClasses = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const availableSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Literature', 'Hindi', 'Sanskrit', 'History', 'Geography', 'Civics', 'Economics', 'Computer Science', 'General Studies', 'Art & Craft', 'Physical Education'];

  // Fetch teachers from database
  useEffect(() => {
    console.log('Current User:', currentUser);
    console.log('School Name:', currentUser?.schoolName);
    
    if (currentUser?.schoolName) {
      // Use school name to fetch teachers instead of finance user ID
      dispatch(getAllTeachers(currentUser.schoolName));
    }
  }, [dispatch, currentUser?.schoolName]);

  // Transform teachers data when it's loaded
  useEffect(() => {
    console.log('TeachersList received:', teachersList);
    console.log('TeachersList type:', typeof teachersList);
    console.log('TeachersList length:', teachersList?.length);
    
    if (teachersList && teachersList.length > 0) {
      const transformedTeachers = teachersList.map((teacher, index) => ({
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone || '+91 98765 43210',
        salary: teacher.salary || 35000, // Default salary if not set
        classes: teacher.teachSclass ? [teacher.teachSclass.sclassName] : [],
        subjects: teacher.teachSubject ? [teacher.teachSubject.subName] : [],
        experience: teacher.experience || '5 years',
        qualification: teacher.qualification || 'M.Sc.',
        joiningDate: teacher.createdAt ? new Date(teacher.createdAt).toISOString().split('T')[0] : '2023-01-01',
        status: 'Active',
        originalTeacher: teacher // Keep reference to original data
      }));
      console.log('Transformed teachers:', transformedTeachers);
      setTeachers(transformedTeachers);
    } else {
      console.log('No teachers found or empty array');
      setTeachers([]);
    }
  }, [teachersList]);

  // Calculate totals
  const totalSalary = teachers.reduce((sum, teacher) => sum + teacher.salary, 0);
  const averageSalary = teachers.length > 0 ? Math.round(totalSalary / teachers.length) : 0;
  const activeTeachers = teachers.filter(t => t.status === 'Active').length;

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setEditData({ ...teacher });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/TeacherSalary/${editingId}`,
        {
          salary: editData.salary,
          experience: editData.experience,
          qualification: editData.qualification,
          phone: editData.phone
        }
      );

      if (response.data) {
        // Update local state
        setTeachers(prev => 
          prev.map(teacher => teacher.id === editingId ? editData : teacher)
        );
        
        setEditingId(null);
        setEditData({});
        setSnackbar({ open: true, message: 'Teacher salary updated successfully!', severity: 'success' });
      }
    } catch (error) {
      console.error('Error updating teacher salary:', error);
      setSnackbar({ open: true, message: 'Failed to update teacher salary!', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddNewTeacher = () => {
    setOpenDialog(true);
  };

  const handleAddTeacher = () => {
    const newTeacher = {
      id: Date.now(), // Temporary ID
      name: editData.name || '',
      email: editData.email || '',
      phone: editData.phone || '',
      salary: editData.salary || 0,
      classes: editData.classes || [],
      subjects: editData.subjects || [],
      experience: editData.experience || '',
      qualification: editData.qualification || '',
      joiningDate: editData.joiningDate || new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    
    setTeachers(prev => [...prev, newTeacher]);
    setOpenDialog(false);
    setEditData({});
    setSnackbar({ open: true, message: 'New teacher added successfully!', severity: 'success' });
  };

  const handleDelete = (id) => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== id));
    setSnackbar({ open: true, message: 'Teacher removed successfully!', severity: 'success' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error loading teachers: {error}
        </Typography>
      </Box>
    );
  }

  // Debug section - remove this after fixing
  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          No current user found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header Section */}
          <GradientCard sx={{ mb: 4, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
                  Teacher Salary Management
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
                  Manage teacher salaries and class assignments
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNewTeacher}
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                Add New Teacher
              </Button>
            </Box>
          </GradientCard>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon sx={{ mx: 'auto', mb: 2 }}>
                    <PersonIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {teachers.length}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Total Teachers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <MoneyIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    ₹{totalSalary.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Total Salary
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <MoneyIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    ₹{averageSalary.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Average Salary
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <GradientIcon color="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" sx={{ mx: 'auto', mb: 2 }}>
                    <SchoolIcon />
                  </GradientIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {activeTeachers}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    Active Teachers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Teacher Salary Table */}
          <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', mb: 4 }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Teacher</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Contact</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Salary</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Classes</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Subjects</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>Experience</TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id} sx={{ '&:hover': { background: 'rgba(102, 126, 234, 0.05)' } }}>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {teacher.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                              {teacher.qualification}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{teacher.email}</Typography>
                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                              {teacher.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {editingId === teacher.id ? (
                            <TextField
                              size="small"
                              type="number"
                              value={editData.salary || ''}
                              onChange={(e) => handleInputChange('salary', parseInt(e.target.value) || 0)}
                              sx={{ width: 100 }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#27ae60' }}>
                              ₹{teacher.salary.toLocaleString()}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === teacher.id ? (
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                              <Select
                                multiple
                                value={editData.classes || []}
                                onChange={(e) => handleInputChange('classes', e.target.value)}
                                input={<OutlinedInput />}
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                      <Chip key={value} label={value} size="small" />
                                    ))}
                                  </Box>
                                )}
                              >
                                {availableClasses.map((className) => (
                                  <MenuItem key={className} value={className}>
                                    {className}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {teacher.classes.map((className) => (
                                <Chip key={className} label={className} size="small" />
                              ))}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === teacher.id ? (
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                              <Select
                                multiple
                                value={editData.subjects || []}
                                onChange={(e) => handleInputChange('subjects', e.target.value)}
                                input={<OutlinedInput />}
                                renderValue={(selected) => (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                      <Chip key={value} label={value} size="small" />
                                    ))}
                                  </Box>
                                )}
                              >
                                {availableSubjects.map((subject) => (
                                  <MenuItem key={subject} value={subject}>
                                    {subject}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {teacher.subjects.map((subject) => (
                                <Chip key={subject} label={subject} size="small" />
                              ))}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === teacher.id ? (
                            <TextField
                              size="small"
                              value={editData.experience || ''}
                              onChange={(e) => handleInputChange('experience', e.target.value)}
                              sx={{ width: 100 }}
                            />
                          ) : (
                            <Typography variant="body2">{teacher.experience}</Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {editingId === teacher.id ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Save Changes">
                                <IconButton
                                  onClick={handleSave}
                                  disabled={saving}
                                  sx={{
                                    color: '#27ae60',
                                    '&:hover': {
                                      background: 'rgba(39, 174, 96, 0.1)',
                                    }
                                  }}
                                >
                                  {saving ? <CircularProgress size={20} /> : <SaveIcon />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel">
                                <IconButton
                                  onClick={handleCancel}
                                  disabled={saving}
                                  sx={{
                                    color: '#e74c3c',
                                    '&:hover': {
                                      background: 'rgba(231, 76, 60, 0.1)',
                                    }
                                  }}
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Edit Teacher">
                                <IconButton
                                  onClick={() => handleEdit(teacher)}
                                  sx={{
                                    color: '#667eea',
                                    '&:hover': {
                                      background: 'rgba(102, 126, 234, 0.1)',
                                    }
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Remove Teacher">
                                <IconButton
                                  onClick={() => handleDelete(teacher.id)}
                                  sx={{
                                    color: '#e74c3c',
                                    '&:hover': {
                                      background: 'rgba(231, 76, 60, 0.1)',
                                    }
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Card View */}
          <Grid container spacing={3}>
            {teachers.map((teacher) => (
              <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                <TeacherCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }} className="teacher-name">
                        {teacher.name}
                      </Typography>
                      <Chip 
                        label={`₹${teacher.salary.toLocaleString()}`}
                        size="small" 
                        className="salary-chip"
                        sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: '#ffffff',
                          fontWeight: 600
                        }} 
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="teacher-label">
                          Email:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} className="teacher-value">
                          {teacher.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="teacher-label">
                          Phone:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} className="teacher-value">
                          {teacher.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="teacher-label">
                          Experience:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} className="teacher-value">
                          {teacher.experience}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#7f8c8d' }} className="teacher-label">
                          Qualification:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} className="teacher-value">
                          {teacher.qualification}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1 }} className="teacher-label">
                        Classes Teaching:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {teacher.classes.map((className) => (
                          <Chip key={className} label={className} size="small" />
                        ))}
                      </Box>
                      <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1 }} className="teacher-label">
                        Subjects:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {teacher.subjects.map((subject) => (
                          <Chip key={subject} label={subject} size="small" />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Tooltip title="Edit Teacher">
                        <IconButton
                          onClick={() => handleEdit(teacher)}
                          sx={{
                            color: '#667eea',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.1)',
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove Teacher">
                        <IconButton
                          onClick={() => handleDelete(teacher.id)}
                          sx={{
                            color: '#e74c3c',
                            '&:hover': {
                              background: 'rgba(231, 76, 60, 0.1)',
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </TeacherCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

      {/* Add New Teacher Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff' }}>
          Add New Teacher
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teacher Name"
                value={editData.name || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter teacher name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editData.email || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="teacher@school.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={editData.phone || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary"
                type="number"
                value={editData.salary || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                placeholder="45000"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience"
                value={editData.experience || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="5 years"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Qualification"
                value={editData.qualification || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, qualification: e.target.value }))}
                placeholder="M.Sc. Mathematics"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Classes Teaching</InputLabel>
                <Select
                  multiple
                  value={editData.classes || []}
                  onChange={(e) => setEditData(prev => ({ ...prev, classes: e.target.value }))}
                  input={<OutlinedInput label="Classes Teaching" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableClasses.map((className) => (
                    <MenuItem key={className} value={className}>
                      {className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Subjects</InputLabel>
                <Select
                  multiple
                  value={editData.subjects || []}
                  onChange={(e) => setEditData(prev => ({ ...prev, subjects: e.target.value }))}
                  input={<OutlinedInput label="Subjects" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableSubjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, background: 'rgba(102, 126, 234, 0.1)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
                  Monthly Salary: ₹{(editData.salary || 0).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#7f8c8d' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddTeacher}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            Add Teacher
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeacherSalaryManagement; 