import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Paper,
    CircularProgress,
    Alert,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Button,
    Card,
    CardContent,
    Chip,
    Avatar,
    Tooltip,
    IconButton,
    Divider,
    Grid
} from '@mui/material';
import {
    Assessment as AssessmentIcon,
    Person as PersonIcon,
    Grade as GradeIcon,
    Save as SaveIcon,
    Publish as PublishIcon,
    CheckCircle as CheckCircleIcon,
    TrendingUp as TrendingUpIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ProgressReport = () => {
  const { currentUser } = useSelector(state => state.user);
  const [students, setStudents] = useState([]);
  const [testPapers, setTestPapers] = useState([]);
  const [results, setResults] = useState({}); // {studentId: {testPaperId: {marks, remarks}}}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [releaseStatus, setReleaseStatus] = useState({});
  const [releaseMsg, setReleaseMsg] = useState('');
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';
  const sclass = currentUser.teachSclass?._id;
  const subject = currentUser.teachSubject?._id;
  const teacher = currentUser._id;

  // Fetch students and test papers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [studentsRes, testPapersRes, resultsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Sclass/Students/${sclass}`),
          axios.get(`${API_BASE_URL}/TestPapers?sclass=${sclass}&subject=${subject}`),
          axios.get(`${API_BASE_URL}/TestResults?sclass=${sclass}`)
        ]);
        setStudents(studentsRes.data);
        setTestPapers(testPapersRes.data);
        // Map results for quick lookup
        const resultMap = {};
        const releaseMap = {};
        resultsRes.data.forEach(r => {
          if (!resultMap[r.student._id]) resultMap[r.student._id] = {};
          resultMap[r.student._id][r.testPaper._id] = { marks: r.marks, remarks: r.remarks, _id: r._id };
          if (r.testPaper && r.release) releaseMap[r.testPaper._id] = true;
        });
        setResults(resultMap);
        setReleaseStatus(releaseMap);
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    if (sclass && subject) fetchData();
  }, [sclass, subject, API_BASE_URL, success, releaseMsg]);

  // Handle mark/remark change
  const handleChange = (studentId, testPaperId, field, value) => {
    setResults(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [testPaperId]: {
          ...((prev[studentId] && prev[studentId][testPaperId]) || {}),
          [field]: value
        }
      }
    }));
  };

  // Save a result
  const handleSave = async (studentId, testPaperId) => {
    setSaving(true);
    setError('');
    setSuccess('');
    const entry = results[studentId][testPaperId];
    try {
      await axios.post(`${API_BASE_URL}/TestResult`, {
        student: studentId,
        testPaper: testPaperId,
        marks: entry.marks,
        remarks: entry.remarks,
        teacher
      });
      setSuccess('Progress updated!');
    } catch (err) {
      setError('Failed to save progress.');
    } finally {
      setSaving(false);
    }
  };

  const handleRelease = async (testPaperId) => {
    setReleaseMsg('');
    try {
      await axios.post(`${API_BASE_URL}/TestResult/release`, { testPaper: testPaperId });
      setReleaseMsg('Results released!');
      setReleaseStatus(prev => ({ ...prev, [testPaperId]: true }));
    } catch (err) {
      setReleaseMsg('Failed to release results.');
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
        Progress Report Management
      </Typography>

      {/* Statistics Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <PersonIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {students.length}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <AssessmentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {testPapers.length}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Test Papers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <TrendingUpIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                85%
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Avg Performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <CheckCircleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {Object.values(releaseStatus).filter(Boolean).length}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Released Results
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {releaseMsg && <Alert severity="info" sx={{ mb: 2 }}>{releaseMsg}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card sx={{
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{
              p: 3,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                Student Progress Matrix
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Manage marks and remarks for all students across test papers
              </Typography>
            </Box>

            <Box sx={{ overflow: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#667eea' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" />
                        Student
                      </Box>
                    </TableCell>
                    {testPapers.map(tp => (
                      <TableCell key={tp._id} sx={{ fontWeight: 700, color: '#667eea' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssessmentIcon fontSize="small" />
                            {tp.title}
                          </Box>
                          <Chip
                            label={`${tp.questions.length} Questions`}
                            size="small"
                            sx={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              fontSize: '0.7rem'
                            }}
                          />
                          <Button
                            variant={releaseStatus[tp._id] ? "outlined" : "contained"}
                            startIcon={releaseStatus[tp._id] ? <CheckCircleIcon /> : <PublishIcon />}
                            size="small"
                            onClick={() => handleRelease(tp._id)}
                            disabled={releaseStatus[tp._id]}
                            sx={{
                              fontSize: '0.7rem',
                              ...(releaseStatus[tp._id] ? {
                                borderColor: '#4caf50',
                                color: '#4caf50',
                                '&:hover': {
                                  borderColor: '#45a049',
                                  backgroundColor: 'rgba(76, 175, 80, 0.04)'
                                }
                              } : {
                                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)'
                                }
                              })
                            }}
                          >
                            {releaseStatus[tp._id] ? 'Released' : 'Release'}
                          </Button>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow
                      key={student._id}
                      sx={{
                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.02)' },
                        '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.04)' }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontSize: '1rem',
                              fontWeight: 700
                            }}
                          >
                            {student.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {student.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Roll #{student.rollNum}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      {testPapers.map(tp => (
                        <TableCell key={tp._id}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <TextField
                              label="Marks"
                              type="number"
                              size="small"
                              value={results[student._id]?.[tp._id]?.marks || ''}
                              onChange={e => handleChange(student._id, tp._id, 'marks', e.target.value)}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover': {
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                  }
                                }
                              }}
                            />
                            <TextField
                              label="Remarks"
                              size="small"
                              value={results[student._id]?.[tp._id]?.remarks || ''}
                              onChange={e => handleChange(student._id, tp._id, 'remarks', e.target.value)}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover': {
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                  }
                                }
                              }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<SaveIcon />}
                              onClick={() => handleSave(student._id, tp._id)}
                              disabled={saving}
                              sx={{
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                                }
                              }}
                            >
                              Save
                            </Button>
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProgressReport; 