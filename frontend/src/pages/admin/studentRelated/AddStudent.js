import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress, Grid, Box, Typography, Divider, Tabs, Tab, Paper } from '@mui/material';
import './AddStudent.css';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    // Basic Information
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('')
    const [gender, setGender] = useState('Male');
    const [className, setClassName] = useState('')
    const [sclassName, setSclassName] = useState('')
    
    // New Fields
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [nationality, setNationality] = useState('Indian');
    const [religion, setReligion] = useState('');
    const [caste, setCaste] = useState('');
    const [subCaste, setSubCaste] = useState('');
    
    // Admission Details
    const [academicYear, setAcademicYear] = useState('');
    const [dateOfAdmission, setDateOfAdmission] = useState('');
    const [section, setSection] = useState('');
    const [admissionType, setAdmissionType] = useState('Regular');
    const [studentStatus, setStudentStatus] = useState('Active');
    
    // Contact Information
    const [permanentAddress, setPermanentAddress] = useState('');
    const [currentAddress, setCurrentAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [phone, setPhone] = useState('');
    
    // Parent/Guardian Details
    const [fatherName, setFatherName] = useState('');
    const [fatherMobile, setFatherMobile] = useState('');
    const [fatherEmail, setFatherEmail] = useState('');
    const [fatherOccupation, setFatherOccupation] = useState('');
    const [fatherQualification, setFatherQualification] = useState('');
    const [motherName, setMotherName] = useState('');
    const [motherMobile, setMotherMobile] = useState('');
    const [motherEmail, setMotherEmail] = useState('');
    const [motherOccupation, setMotherOccupation] = useState('');
    const [motherQualification, setMotherQualification] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [guardianMobile, setGuardianMobile] = useState('');
    const [guardianEmail, setGuardianEmail] = useState('');
    const [guardianOccupation, setGuardianOccupation] = useState('');
    const [guardianQualification, setGuardianQualification] = useState('');
    
    // Emergency Contact
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
    const [emergencyContactMobile, setEmergencyContactMobile] = useState('');
    
    // Identity & Transport
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [modeOfTransport, setModeOfTransport] = useState('');
    const [busRoute, setBusRoute] = useState('');
    const [busStop, setBusStop] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [hostelRequired, setHostelRequired] = useState(false);
    const [hostelRoomNumber, setHostelRoomNumber] = useState('');

    // Tab state
    const [activeTab, setActiveTab] = useState(0);

    const adminID = currentUser._id
    const role = "Student"
    const attendance = []

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
        // Set current academic year
        const currentYear = new Date().getFullYear();
        setAcademicYear(`${currentYear}-${currentYear + 1}`);
        setDateOfAdmission(new Date().toISOString().split('T')[0]);
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList.find(
                (classItem) => classItem.sclassName === event.target.value
            );
            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    }

    const fields = { 
        name, email, rollNum, password, gender, sclassName, adminID, role, attendance,
        admissionNumber, dateOfBirth, bloodGroup, nationality, religion, caste, subCaste,
        academicYear, dateOfAdmission, section, admissionType, studentStatus,
        permanentAddress, currentAddress, city, state, pinCode, phone,
        fatherName, fatherMobile, fatherEmail, fatherOccupation, fatherQualification,
        motherName, motherMobile, motherEmail, motherOccupation, motherQualification,
        guardianName, guardianMobile, guardianEmail, guardianOccupation, guardianQualification,
        emergencyContactName, emergencyContactRelation, emergencyContactMobile,
        aadhaarNumber, modeOfTransport, busRoute, busStop, vehicleNumber, hostelRequired, hostelRoomNumber
    }

    const submitHandler = (event) => {
        event.preventDefault()
        
        console.log('Form submission started');
        console.log('Form data:', fields);
        
        if (sclassName === "") {
            setMessage("Please select a classname")
            setShowPopup(true)
        }
        else if (!admissionNumber.trim()) {
            setMessage("Please enter admission number")
            setShowPopup(true)
        }
        else if (!email.trim()) {
            setMessage("Please enter email address")
            setShowPopup(true)
        }
        else if (!name.trim()) {
            setMessage("Please enter student name")
            setShowPopup(true)
        }
        else if (!rollNum || rollNum <= 0) {
            setMessage("Please enter a valid roll number")
            setShowPopup(true)
        }
        else if (!password.trim()) {
            setMessage("Please enter password")
            setShowPopup(true)
        }
        else {
            setLoader(true)
            console.log('Dispatching registerUser with fields:', fields);
            dispatch(registerUser(fields, role))
        }
    }

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl())
            navigate(-1)
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

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const renderBasicInfo = () => (
        <div className="formSection">
            <h3>Basic Information</h3>
            <div className="formRow">
                <div className="formGroup">
                    <label>Admission Number *</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Enter admission number..."
                        value={admissionNumber}
                        onChange={(event) => setAdmissionNumber(event.target.value)}
                        required 
                    />
                </div>
                <div className="formGroup">
                    <label>Full Name *</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Enter student's name..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name" 
                        required 
                    />
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>Gender *</label>
                    <select
                        className="registerInput"
                        value={gender}
                        onChange={(event) => setGender(event.target.value)} 
                        required
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="formGroup">
                    <label>Date of Birth</label>
                    <input 
                        className="registerInput" 
                        type="date" 
                        value={dateOfBirth}
                        onChange={(event) => setDateOfBirth(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Blood Group</label>
                    <select
                        className="registerInput"
                        value={bloodGroup}
                        onChange={(event) => setBloodGroup(event.target.value)}
                    >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>Nationality</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Nationality"
                        value={nationality}
                        onChange={(event) => setNationality(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Religion</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Religion"
                        value={religion}
                        onChange={(event) => setReligion(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Caste</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Caste"
                        value={caste}
                        onChange={(event) => setCaste(event.target.value)}
                    />
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>Sub Caste</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Sub Caste"
                        value={subCaste}
                        onChange={(event) => setSubCaste(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Aadhaar Number</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Aadhaar Number"
                        value={aadhaarNumber}
                        onChange={(event) => setAadhaarNumber(event.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    const renderAdmissionDetails = () => (
        <div className="formSection">
            <h3>Admission Details</h3>
            <div className="formRow">
                <div className="formGroup">
                    <label>Academic Year *</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="e.g., 2024-2025"
                        value={academicYear}
                        onChange={(event) => setAcademicYear(event.target.value)}
                        required 
                    />
                </div>
                <div className="formGroup">
                    <label>Date of Admission</label>
                    <input 
                        className="registerInput" 
                        type="date" 
                        value={dateOfAdmission}
                        onChange={(event) => setDateOfAdmission(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Class *</label>
                    {situation === "Student" && (
                            <select
                                className="registerInput"
                                value={className}
                            onChange={changeHandler} 
                            required
                        >
                                <option value='Select Class'>Select Class</option>
                                {sclassesList.map((classItem, index) => (
                                    <option key={index} value={classItem.sclassName}>
                                        {classItem.sclassName}
                                    </option>
                                ))}
                            </select>
                    )}
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>Section</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Section (A, B, C...)"
                        value={section}
                        onChange={(event) => setSection(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Admission Type</label>
                    <select
                        className="registerInput"
                        value={admissionType}
                        onChange={(event) => setAdmissionType(event.target.value)}
                    >
                        <option value="Regular">Regular</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Re-admission">Re-admission</option>
                    </select>
                </div>
                <div className="formGroup">
                    <label>Student Status</label>
                    <select
                        className="registerInput"
                        value={studentStatus}
                        onChange={(event) => setStudentStatus(event.target.value)}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Transferred">Transferred</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderContactInfo = () => (
        <div className="formSection">
            <h3>Contact Information</h3>
            <div className="formRow">
                <div className="formGroup">
                    <label>Permanent Address</label>
                    <textarea 
                        className="registerInput" 
                        placeholder="Permanent Address"
                        value={permanentAddress}
                        onChange={(event) => setPermanentAddress(event.target.value)}
                        rows="2"
                    />
                </div>
                <div className="formGroup">
                    <label>Current Address</label>
                    <textarea 
                        className="registerInput" 
                        placeholder="Current Address"
                        value={currentAddress}
                        onChange={(event) => setCurrentAddress(event.target.value)}
                        rows="2"
                    />
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>City</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="City"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>State</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="State"
                        value={state}
                        onChange={(event) => setState(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>PIN Code</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="PIN Code"
                        value={pinCode}
                        onChange={(event) => setPinCode(event.target.value)}
                    />
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>Phone Number</label>
                    <input 
                        className="registerInput" 
                        type="tel" 
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Email Address *</label>
                    <input 
                        className="registerInput" 
                        type="email" 
                        placeholder="Email Address"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required 
                    />
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>Mode of Transport</label>
                    <select
                        className="registerInput"
                        value={modeOfTransport}
                        onChange={(event) => setModeOfTransport(event.target.value)}
                    >
                        <option value="">Select Mode of Transport</option>
                        <option value="School Bus">School Bus</option>
                        <option value="Private Vehicle">Private Vehicle</option>
                        <option value="Public Transport">Public Transport</option>
                        <option value="Walking">Walking</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="formGroup">
                    <label>Bus Route</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Bus Route"
                        value={busRoute}
                        onChange={(event) => setBusRoute(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Bus Stop</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Bus Stop"
                        value={busStop}
                        onChange={(event) => setBusStop(event.target.value)}
                    />
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>Vehicle Number</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Vehicle Number"
                        value={vehicleNumber}
                        onChange={(event) => setVehicleNumber(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Hostel Required</label>
                    <select
                        className="registerInput"
                        value={hostelRequired}
                        onChange={(event) => setHostelRequired(event.target.value === 'true')}
                    >
                        <option value={false}>No</option>
                        <option value={true}>Yes</option>
                    </select>
                </div>
                <div className="formGroup">
                    <label>Hostel Room Number</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Hostel Room Number"
                        value={hostelRoomNumber}
                        onChange={(event) => setHostelRoomNumber(event.target.value)}
                        disabled={!hostelRequired}
                    />
                </div>
            </div>
        </div>
    );

    const renderParentDetails = () => (
        <div className="formSection">
            <h3>Parent/Guardian Details</h3>
            
            {/* Father's Information - 3 columns */}
            <div className="formRow">
                <div className="formGroup">
                    <label>Father's Name</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Father's Name"
                        value={fatherName}
                        onChange={(event) => setFatherName(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Father's Mobile</label>
                    <input 
                        className="registerInput" 
                        type="tel" 
                        placeholder="Father's Mobile"
                        value={fatherMobile}
                        onChange={(event) => setFatherMobile(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Father's Email</label>
                    <input 
                        className="registerInput" 
                        type="email" 
                        placeholder="Father's Email"
                        value={fatherEmail}
                        onChange={(event) => setFatherEmail(event.target.value)}
                    />
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>Father's Occupation</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Father's Occupation"
                        value={fatherOccupation}
                        onChange={(event) => setFatherOccupation(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Father's Qualification</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Father's Qualification"
                        value={fatherQualification}
                        onChange={(event) => setFatherQualification(event.target.value)}
                    />
                </div>
            </div>
            
            {/* Mother's Information - 3 columns */}
            <div className="formRow">
                <div className="formGroup">
                    <label>Mother's Name</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Mother's Name"
                        value={motherName}
                        onChange={(event) => setMotherName(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Mother's Mobile</label>
                    <input 
                        className="registerInput" 
                        type="tel" 
                        placeholder="Mother's Mobile"
                        value={motherMobile}
                        onChange={(event) => setMotherMobile(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Mother's Email</label>
                    <input 
                        className="registerInput" 
                        type="email" 
                        placeholder="Mother's Email"
                        value={motherEmail}
                        onChange={(event) => setMotherEmail(event.target.value)}
                    />
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>Mother's Occupation</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Mother's Occupation"
                        value={motherOccupation}
                        onChange={(event) => setMotherOccupation(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Mother's Qualification</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Mother's Qualification"
                        value={motherQualification}
                        onChange={(event) => setMotherQualification(event.target.value)}
                    />
                </div>
            </div>
            
            {/* Guardian's Information - 3 columns */}
            <div className="formRow">
                <div className="formGroup">
                    <label>Guardian's Name</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Guardian's Name (if applicable)"
                        value={guardianName}
                        onChange={(event) => setGuardianName(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Guardian's Mobile</label>
                    <input 
                        className="registerInput" 
                        type="tel" 
                        placeholder="Guardian's Mobile"
                        value={guardianMobile}
                        onChange={(event) => setGuardianMobile(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Guardian's Email</label>
                    <input 
                        className="registerInput" 
                        type="email" 
                        placeholder="Guardian's Email"
                        value={guardianEmail}
                        onChange={(event) => setGuardianEmail(event.target.value)}
                    />
                </div>
            </div>
            
            <div className="formRow">
                <div className="formGroup">
                    <label>Guardian's Occupation</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Guardian's Occupation"
                        value={guardianOccupation}
                        onChange={(event) => setGuardianOccupation(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Guardian's Qualification</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Guardian's Qualification"
                        value={guardianQualification}
                        onChange={(event) => setGuardianQualification(event.target.value)}
                    />
                </div>
            </div>
            
            {/* Emergency Contact - 3 columns */}
            <div className="formRow">
                <div className="formGroup">
                    <label>Emergency Contact Name</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Emergency Contact Name"
                        value={emergencyContactName}
                        onChange={(event) => setEmergencyContactName(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Emergency Contact Relation</label>
                    <input 
                        className="registerInput" 
                        type="text" 
                        placeholder="Relation to Student"
                        value={emergencyContactRelation}
                        onChange={(event) => setEmergencyContactRelation(event.target.value)}
                    />
                </div>
                <div className="formGroup">
                    <label>Emergency Contact Mobile</label>
                    <input 
                        className="registerInput" 
                        type="tel" 
                        placeholder="Emergency Contact Mobile"
                        value={emergencyContactMobile}
                        onChange={(event) => setEmergencyContactMobile(event.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    const renderSystemAccess = () => (
        <div className="formSection">
            <h3>System Access</h3>
            <div className="formRow">
                <div className="formGroup">
                    <label>Roll Number *</label>
                    <input 
                        className="registerInput" 
                        type="number" 
                        placeholder="Enter student's Roll Number..."
                        value={rollNum}
                        onChange={(event) => setRollNum(event.target.value)}
                        required 
                    />
                </div>
                <div className="formGroup">
                    <label>Password *</label>
                    <input 
                        className="registerInput" 
                        type="password" 
                        placeholder="Enter student's password..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password" 
                        required 
                    />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">Add Student</span>
                    
                    <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
                        <Tabs 
                            value={activeTab} 
                            onChange={handleTabChange} 
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ 
                                borderBottom: 1, 
                                borderColor: 'divider',
                                '& .MuiTab-root': {
                                    minWidth: 120,
                                    fontWeight: 600
                                }
                            }}
                        >
                            <Tab label="Basic Info" />
                            <Tab label="Admission" />
                            <Tab label="Contact & Transport" />
                            <Tab label="Parents & Emergency" />
                            <Tab label="System Access" />
                        </Tabs>
                    </Paper>

                    {activeTab === 0 && renderBasicInfo()}
                    {activeTab === 1 && renderAdmissionDetails()}
                    {activeTab === 2 && renderContactInfo()}
                    {activeTab === 3 && renderParentDetails()}
                    {activeTab === 4 && renderSystemAccess()}

                    <div className="formSection">
                        <div className="formRow">
                            <div className="formGroup">
                                <button 
                                    type="button" 
                                    className="registerButton secondary"
                                    onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                                    disabled={activeTab === 0}
                                >
                                    Previous
                                </button>
                            </div>
                            <div className="formGroup">
                                <button 
                                    type="button" 
                                    className="registerButton secondary"
                                    onClick={() => setActiveTab(Math.min(4, activeTab + 1))}
                                    disabled={activeTab === 4}
                                >
                                    Next
                                </button>
                            </div>
                            <div className="formGroup">
                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                                        'Add Student'
                        )}
                    </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    )
}

export default AddStudent