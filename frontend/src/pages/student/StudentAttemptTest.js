import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Box, Typography, Paper, CircularProgress, Alert, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

const StudentAttemptTest = () => {
  const { testId } = useParams();
  const { currentUser } = useSelector(state => state.user);
  const [testPaper, setTestPaper] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestPaper = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/TestPapers/${testId}`);
        setTestPaper(res.data);
      } catch (err) {
        setError('Failed to load test paper.');
      } finally {
        setLoading(false);
      }
    };
    if (testId) fetchTestPaper();
  }, [testId, API_BASE_URL]);

  const handleChange = (qIdx, value) => {
    setAnswers(prev => ({ ...prev, [qIdx]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${API_BASE_URL}/TestResult/attempt`, {
        student: currentUser._id,
        testPaper: testId,
        answers: Object.entries(answers).map(([idx, answer]) => ({ question: testPaper.questions[idx].question, answer })),
      });
      const marks = response.data.marks;
      setSuccess(marks !== undefined ? `Test submitted successfully! Your score: ${marks}/${testPaper.questions.length}` : 'Test submitted successfully!');
      setTimeout(() => navigate('/Student/testpapers'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit test.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!testPaper) return null;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Attempt Test: {testPaper.title}</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          {testPaper.questions.map((q, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">{idx + 1}. {q.question}</FormLabel>
                <RadioGroup
                  value={answers[idx] || ''}
                  onChange={e => handleChange(idx, e.target.value)}
                >
                  {q.options.map((opt, oidx) => (
                    <FormControlLabel key={oidx} value={opt} control={<Radio />} label={opt} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
          <Button type="submit" variant="contained" disabled={submitting}>
            Submit
          </Button>
        </form>
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
};

export default StudentAttemptTest; 