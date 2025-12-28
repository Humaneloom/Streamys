import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const AddFinance = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { status, response, error, currentUser } = useSelector(state => state.user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false)

  const role = "Finance"
  const schoolName = currentUser?.schoolName || "Sample School" // Use admin's school name
  const department = "Finance Department"

  const fields = { name, email, password, role, schoolName, phone, department }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    
    // Ensure we have the correct school name at submission time
    const currentSchoolName = currentUser?.schoolName || "Sample School"
    const updatedFields = { ...fields, schoolName: currentSchoolName }
    
    console.log('Submitting finance registration with fields:', updatedFields);
    console.log('School name being used:', currentSchoolName);
    console.log('Current user school name:', currentUser?.schoolName);
    
    dispatch(registerUser(updatedFields, role))
  }

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl())
      setMessage("Finance personnel created successfully! They can now login with their credentials.")
      setShowPopup(true)
      setLoader(false)
      // Clear form
      setName('')
      setEmail('')
      setPassword('')
      setPhone('')
    }
    else if (status === 'failed') {
      setMessage(response)
      setShowPopup(true)
      setLoader(false)
    }
    else if (status === 'error') {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/Admin/finances')}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Back to Finance List
        </Button>
      </div>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Finance Personnel</span>
          <br />
          
          <label>Name</label>
          <input className="registerInput" type="text" placeholder="Enter finance personnel's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name" required />

          <label>Email</label>
          <input className="registerInput" type="email" placeholder="Enter finance personnel's email..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email" required />

          <label>Phone</label>
          <input className="registerInput" type="tel" placeholder="Enter phone number..."
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel" required />

          <label>Password</label>
          <input className="registerInput" type="password" placeholder="Enter finance personnel's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password" required />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
      <Popup showPopup={showPopup} setShowPopup={setShowPopup} message={message} />
    </div>
  )
}

export default AddFinance 