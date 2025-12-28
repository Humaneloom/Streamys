import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Button,
    TextField,
    Paper,
    CircularProgress,
    Alert,
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    Chip,
    Avatar,
    Tooltip,
    Fade,
    Grow,
    Divider,
    Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Assignment as AssignmentIcon,
    School as SchoolIcon,
    Person as PersonIcon,
    Schedule as ScheduleIcon,
    Quiz as QuizIcon,
    CheckCircle as CheckCircleIcon,
    Publish as PublishIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const TestPapers = () => {
  const { currentUser } = useSelector(state => state.user);
  const [testPapers, setTestPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    questions: [
      { question: '', options: ['', '', '', ''], answer: '' }
    ]
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, paper: null });
  const [deleteLoading, setDeleteLoading] = useState('');
  const [releaseStatus, setReleaseStatus] = useState({});
  const [releaseMsg, setReleaseMsg] = useState('');
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';
  const sclass = currentUser.teachSclass?._id;
  const subject = currentUser.teachSubject?._id;
  const createdBy = currentUser._id;

  // Fetch test papers
  useEffect(() => {
    const fetchTestPapers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/TestPapers?sclass=${sclass}&subject=${subject}`);
        setTestPapers(res.data);
        // Fetch release status for each test
        const resultsRes = await axios.get(`${API_BASE_URL}/TestResults?sclass=${sclass}`);
        const statusMap = {};
        resultsRes.data.forEach(r => {
          if (r.testPaper && r.release) statusMap[r.testPaper._id] = true;
        });
        setReleaseStatus(statusMap);
      } catch (err) {
        setError('Failed to load test papers.');
      } finally {
        setLoading(false);
      }
    };
    if (sclass && subject) fetchTestPapers();
  }, [sclass, subject, API_BASE_URL, success, releaseMsg]);

  // Handle form changes
  const handleFormChange = (e, idx, optIdx) => {
    if (typeof idx === 'number') {
      // Question or option
      const updatedQuestions = [...form.questions];
      if (typeof optIdx === 'number') {
        updatedQuestions[idx].options[optIdx] = e.target.value;
      } else {
        updatedQuestions[idx][e.target.name] = e.target.value;
      }
      setForm({ ...form, questions: updatedQuestions });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Add/remove questions
  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, { question: '', options: ['', '', '', ''], answer: '' }] });
  };
  const removeQuestion = (idx) => {
    setForm({ ...form, questions: form.questions.filter((_, i) => i !== idx) });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${API_BASE_URL}/TestPaper`, {
        title: form.title,
        sclass,
        subject,
        questions: form.questions,
        createdBy
      });
      setSuccess('Test paper created!');
      setShowForm(false);
      setForm({ title: '', questions: [{ question: '', options: ['', '', '', ''], answer: '' }] });
    } catch (err) {
      setError('Failed to create test paper.');
    } finally {
      setSaving(false);
    }
  };

  // Edit logic
  const openEditDialog = (paper) => {
    setEditDialog({ open: true, paper: { ...paper, questions: paper.questions.map(q => ({ ...q })) } });
  };
  const closeEditDialog = () => {
    setEditDialog({ open: false, paper: null });
  };
  const handleEditChange = (e, idx, optIdx) => {
    const updated = { ...editDialog.paper };
    if (typeof idx === 'number') {
      if (typeof optIdx === 'number') {
        updated.questions[idx].options[optIdx] = e.target.value;
      } else {
        updated.questions[idx][e.target.name] = e.target.value;
      }
    } else {
      updated[e.target.name] = e.target.value;
    }
    setEditDialog({ ...editDialog, paper: updated });
  };
  const addEditQuestion = () => {
    setEditDialog(ed => ({ ...ed, paper: { ...ed.paper, questions: [...ed.paper.questions, { question: '', options: ['', '', '', ''], answer: '' }] } }));
  };
  const removeEditQuestion = (idx) => {
    setEditDialog(ed => ({ ...ed, paper: { ...ed.paper, questions: ed.paper.questions.filter((_, i) => i !== idx) } }));
  };
  const handleEditSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`${API_BASE_URL}/TestPaper/${editDialog.paper._id}`, editDialog.paper);
      setSuccess('Test paper updated!');
      closeEditDialog();
    } catch (err) {
      setError('Failed to update test paper.');
    } finally {
      setSaving(false);
    }
  };

  // Delete logic
  const handleDelete = async (id) => {
    setDeleteLoading(id);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${API_BASE_URL}/TestPaper/${id}`);
      setSuccess('Test paper deleted!');
    } catch (err) {
      setError('Failed to delete test paper.');
    } finally {
      setDeleteLoading('');
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
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Create & Manage Test Papers</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {releaseMsg && <Alert severity="info" sx={{ mb: 2 }}>{releaseMsg}</Alert>}
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(!showForm)} sx={{ mb: 2 }}>
        {showForm ? 'Cancel' : 'Add Test Paper'}
      </Button>
      {showForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Test Title"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                required
              />
              {form.questions.map((q, idx) => (
                <Box key={idx} sx={{ border: '1px solid #e0e7ef', borderRadius: 2, p: 2, mb: 2 }}>
                  <Stack spacing={1}>
                    <TextField
                      label={`Question ${idx + 1}`}
                      name="question"
                      value={q.question}
                      onChange={e => handleFormChange(e, idx)}
                      required
                    />
                    <Stack direction="row" spacing={1}>
                      {q.options.map((opt, optIdx) => (
                        <TextField
                          key={optIdx}
                          label={`Option ${optIdx + 1}`}
                          value={opt}
                          onChange={e => handleFormChange(e, idx, optIdx)}
                          required
                        />
                      ))}
                    </Stack>
                    <TextField
                      label="Answer"
                      name="answer"
                      value={q.answer}
                      onChange={e => handleFormChange(e, idx)}
                      required
                    />
                    <Button color="error" onClick={() => removeQuestion(idx)} disabled={form.questions.length === 1}>
                      Remove Question
                    </Button>
                  </Stack>
                </Box>
              ))}
              <Button onClick={addQuestion} variant="outlined">Add Another Question</Button>
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                {saving ? <CircularProgress size={20} /> : 'Create Test Paper'}
              </Button>
            </Stack>
          </form>
        </Paper>
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Test Papers Management
          </Typography>
          {testPapers.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
              <AssignmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                No Test Papers Found
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Create your first test paper to get started
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {testPapers.map((tp, index) => (
                <Grid item xs={12} md={6} lg={4} key={tp._id}>
                  <Grow in timeout={300 + index * 100}>
                    <Card sx={{
                      borderRadius: 4,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      height: '100%',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        {/* Header with Title and Actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#667eea' }}>
                              {tp.title}
                            </Typography>
                            <Chip
                              icon={<QuizIcon />}
                              label={`${tp.questions.length} Questions`}
                              size="small"
                              sx={{
                                background: 'rgba(102, 126, 234, 0.1)',
                                color: '#667eea',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Edit test paper">
                              <IconButton
                                size="small"
                                onClick={() => openEditDialog(tp)}
                                sx={{
                                  background: 'rgba(33, 150, 243, 0.1)',
                                  color: '#2196f3',
                                  '&:hover': { background: 'rgba(33, 150, 243, 0.2)' }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete test paper">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(tp._id)}
                                disabled={deleteLoading === tp._id}
                                sx={{
                                  background: 'rgba(244, 67, 54, 0.1)',
                                  color: '#f44336',
                                  '&:hover': { background: 'rgba(244, 67, 54, 0.2)' }
                                }}
                              >
                                {deleteLoading === tp._id ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Test Details */}
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {tp.sclass?.sclassName || '-'} • {tp.subject?.subName || '-'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Created by {tp.createdBy?.name || '-'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {new Date(tp.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button
                            variant="contained"
                            startIcon={<VisibilityIcon />}
                            onClick={() => openEditDialog(tp)}
                            sx={{
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                              }
                            }}
                          >
                            View & Edit
                          </Button>

                          <Button
                            variant={releaseStatus[tp._id] ? "outlined" : "contained"}
                            startIcon={releaseStatus[tp._id] ? <CheckCircleIcon /> : <PublishIcon />}
                            onClick={() => handleRelease(tp._id)}
                            disabled={releaseStatus[tp._id]}
                            sx={{
                              borderRadius: 2,
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
                            {releaseStatus[tp._id] ? 'Results Released' : 'Release Results'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={closeEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>Edit Test Paper</DialogTitle>
        <DialogContent>
          {editDialog.paper && (
            <Stack spacing={2}>
              <TextField
                label="Test Title"
                name="title"
                value={editDialog.paper.title}
                onChange={handleEditChange}
                required
              />
              {editDialog.paper.questions.map((q, idx) => (
                <Box key={idx} sx={{ border: '1px solid #e0e7ef', borderRadius: 2, p: 2, mb: 2 }}>
                  <Stack spacing={1}>
                    <TextField
                      label={`Question ${idx + 1}`}
                      name="question"
                      value={q.question}
                      onChange={e => handleEditChange(e, idx)}
                      required
                    />
                    <Stack direction="row" spacing={1}>
                      {q.options.map((opt, optIdx) => (
                        <TextField
                          key={optIdx}
                          label={`Option ${optIdx + 1}`}
                          value={opt}
                          onChange={e => handleEditChange(e, idx, optIdx)}
                          required
                        />
                      ))}
                    </Stack>
                    <TextField
                      label="Answer"
                      name="answer"
                      value={q.answer}
                      onChange={e => handleEditChange(e, idx)}
                      required
                    />
                    <Button color="error" onClick={() => removeEditQuestion(idx)} disabled={editDialog.paper.questions.length === 1}>
                      Remove Question
                    </Button>
                  </Stack>
                </Box>
              ))}
              <Button onClick={addEditQuestion} variant="outlined">Add Another Question</Button>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" disabled={saving}>
            {saving ? <CircularProgress size={20} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestPapers; 