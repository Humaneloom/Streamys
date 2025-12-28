import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { 
  CircularProgress, 
  Paper, 
  Tabs, 
  Tab, 
  Grid, 
  Typography, 
  Box 
} from '@mui/material';
import './AddTeacher.css';

const AddTeacher = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subjectID = params.id

  const { status, response, error } = useSelector(state => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  // Basic Information
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [nationality, setNationality] = useState('');
  const [religion, setReligion] = useState('');

  // Contact Information
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [email, setEmail] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // Professional Information
  const [employeeID, setEmployeeID] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experience, setExperience] = useState('');
  const [reportingManager, setReportingManager] = useState('');

  // Educational Qualifications
  const [highestQualification, setHighestQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [yearOfPassing, setYearOfPassing] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [additionalCertifications, setAdditionalCertifications] = useState('');

  // Identity & Compliance
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [teachingLicense, setTeachingLicense] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');

  // Payroll & HR
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [uanNumber, setUanNumber] = useState('');
  const [epfNumber, setEpfNumber] = useState('');
  const [esiNumber, setEsiNumber] = useState('');
  const [salaryStructure, setSalaryStructure] = useState('');
  const [taxDetails, setTaxDetails] = useState('');

  // System Access
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessLevel, setAccessLevel] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const role = "Teacher"
  const school = subjectDetails && subjectDetails.school
  const teachSubject = subjectDetails && subjectDetails._id
  const teachSclass = subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName._id

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fields = { 
    name, email, password, role, school, teachSubject, teachSclass,
    gender, dateOfBirth, bloodGroup, nationality, religion,
    phone, alternatePhone, residentialAddress, emergencyContactName, 
    emergencyContactRelation, emergencyContactPhone,
    employeeID, dateOfJoining, department, designation, employmentType, 
    experience, reportingManager,
    highestQualification, specialization, yearOfPassing, instituteName, 
    additionalCertifications,
    aadhaarNumber, panNumber, teachingLicense, employeeCode,
    bankAccountNumber, bankName, ifscCode, uanNumber, epfNumber, 
    esiNumber, salaryStructure, taxDetails,
    username, accessLevel
  }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(registerUser(fields, role))
  }

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl())
      navigate("/Admin/teachers")
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

  const renderBasicInfo = () => (
    <div className="formSection">
      <h3>Basic Information</h3>
      <div className="formRow">
        <div className="formGroup">
          <label>Full Name *</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter teacher's full name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            required 
          />
        </div>
        <div className="formGroup">
          <label>Gender</label>
          <select 
            className="registerInput" 
            value={gender}
            onChange={(event) => setGender(event.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="formRow">
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
            placeholder="Enter nationality..."
            value={nationality}
            onChange={(event) => setNationality(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Religion</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter religion..."
            value={religion}
            onChange={(event) => setReligion(event.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="formSection">
      <h3>Contact Information</h3>
      <div className="formRow">
        <div className="formGroup">
          <label>Mobile Number</label>
          <input 
            className="registerInput" 
            type="tel" 
            placeholder="Enter mobile number..."
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Alternate Mobile Number</label>
          <input 
            className="registerInput" 
            type="tel" 
            placeholder="Enter alternate mobile..."
            value={alternatePhone}
            onChange={(event) => setAlternatePhone(event.target.value)}
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Email Address *</label>
          <input 
            className="registerInput" 
            type="email" 
            placeholder="Enter email address..."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required 
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Residential Address</label>
          <textarea 
            className="registerInput" 
            placeholder="Enter residential address..."
            value={residentialAddress}
            onChange={(event) => setResidentialAddress(event.target.value)}
            rows="3"
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Emergency Contact Name</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter emergency contact name..."
            value={emergencyContactName}
            onChange={(event) => setEmergencyContactName(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Emergency Contact Relation</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter relation..."
            value={emergencyContactRelation}
            onChange={(event) => setEmergencyContactRelation(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Emergency Contact Phone</label>
          <input 
            className="registerInput" 
            type="tel" 
            placeholder="Enter emergency phone..."
            value={emergencyContactPhone}
            onChange={(event) => setEmergencyContactPhone(event.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="formSection">
      <h3>Professional Information</h3>
      <div className="formRow">
        <div className="formGroup">
          <label>Employee ID *</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter employee ID..."
            value={employeeID}
            onChange={(event) => setEmployeeID(event.target.value)}
            required 
          />
        </div>
        <div className="formGroup">
          <label>Date of Joining</label>
          <input 
            className="registerInput" 
            type="date" 
            value={dateOfJoining}
            onChange={(event) => setDateOfJoining(event.target.value)}
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Department</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter department..."
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Designation</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter designation..."
            value={designation}
            onChange={(event) => setDesignation(event.target.value)}
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Employment Type</label>
          <select 
            className="registerInput" 
            value={employmentType}
            onChange={(event) => setEmploymentType(event.target.value)}
          >
            <option value="">Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
        <div className="formGroup">
          <label>Experience (in years)</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter experience..."
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Reporting Manager/Supervisor</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter reporting manager..."
            value={reportingManager}
            onChange={(event) => setReportingManager(event.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderEducationalInfo = () => (
    <div className="formSection">
      <h3>Educational Qualifications</h3>
      <div className="formRow">
        <div className="formGroup">
          <label>Highest Qualification</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter highest qualification..."
            value={highestQualification}
            onChange={(event) => setHighestQualification(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Specialization/Skills</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter specialization..."
            value={specialization}
            onChange={(event) => setSpecialization(event.target.value)}
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Year of Passing</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter year of passing..."
            value={yearOfPassing}
            onChange={(event) => setYearOfPassing(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Institute Name</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter institute name..."
            value={instituteName}
            onChange={(event) => setInstituteName(event.target.value)}
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Additional Certifications</label>
          <textarea 
            className="registerInput" 
            placeholder="Enter additional certifications..."
            value={additionalCertifications}
            onChange={(event) => setAdditionalCertifications(event.target.value)}
            rows="3"
          />
        </div>
      </div>
    </div>
  );

  const renderIdentityInfo = () => (
    <div className="formSection">
      <h3>Identity & Compliance</h3>
      <div className="formRow">
        <div className="formGroup">
          <label>Aadhaar Number</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter Aadhaar number..."
            value={aadhaarNumber}
            onChange={(event) => setAadhaarNumber(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>PAN Number</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter PAN number..."
            value={panNumber}
            onChange={(event) => setPanNumber(event.target.value)}
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Teaching License/Certification Number</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter license number..."
            value={teachingLicense}
            onChange={(event) => setTeachingLicense(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Employee Code</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter employee code..."
            value={employeeCode}
            onChange={(event) => setEmployeeCode(event.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderPayrollInfo = () => (
    <div className="formSection">
      <h3>Payroll & HR</h3>
      <div className="formRow">
        <div className="formGroup">
          <label>Bank Account Number</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter bank account number..."
            value={bankAccountNumber}
            onChange={(event) => setBankAccountNumber(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Bank Name</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter bank name..."
            value={bankName}
            onChange={(event) => setBankName(event.target.value)}
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>IFSC Code</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter IFSC code..."
            value={ifscCode}
            onChange={(event) => setIfscCode(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>UAN Number</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter UAN number..."
            value={uanNumber}
            onChange={(event) => setUanNumber(event.target.value)}
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>EPF Number</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter EPF number..."
            value={epfNumber}
            onChange={(event) => setEpfNumber(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>ESI Number</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter ESI number..."
            value={esiNumber}
            onChange={(event) => setEsiNumber(event.target.value)}
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Salary Structure</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter salary structure..."
            value={salaryStructure}
            onChange={(event) => setSalaryStructure(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Tax Details</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter tax details..."
            value={taxDetails}
            onChange={(event) => setTaxDetails(event.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderSystemAccess = () => (
    <div className="formSection">
      <h3>System Access & Permissions</h3>
      <div className="formRow">
        <div className="formGroup">
          <label>Username</label>
          <input 
            className="registerInput" 
            type="text" 
            placeholder="Enter username..."
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="formGroup">
          <label>Password *</label>
          <input 
            className="registerInput" 
            type="password" 
            placeholder="Enter password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required 
          />
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Access Level</label>
          <select 
            className="registerInput" 
            value={accessLevel}
            onChange={(event) => setAccessLevel(event.target.value)}
          >
            <option value="">Select Access Level</option>
            <option value="Basic">Basic</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>
      
      <div className="formRow">
        <div className="formGroup">
          <label>Subject</label>
          <input 
            className="registerInput" 
            type="text" 
            value={subjectDetails && subjectDetails.subName}
            disabled 
          />
        </div>
        <div className="formGroup">
          <label>Class</label>
          <input 
            className="registerInput" 
            type="text" 
            value={subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
            disabled 
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Teacher</span>
          
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
              <Tab label="Contact" />
              <Tab label="Professional" />
              <Tab label="Education" />
              <Tab label="Identity" />
              <Tab label="Payroll" />
              <Tab label="System Access" />
            </Tabs>
          </Paper>

          {activeTab === 0 && renderBasicInfo()}
          {activeTab === 1 && renderContactInfo()}
          {activeTab === 2 && renderProfessionalInfo()}
          {activeTab === 3 && renderEducationalInfo()}
          {activeTab === 4 && renderIdentityInfo()}
          {activeTab === 5 && renderPayrollInfo()}
          {activeTab === 6 && renderSystemAccess()}

          {/* Navigation Buttons */}
          <div className="formSection" style={{ marginTop: '20px' }}>
            <div className="formRow" style={{ gridTemplateColumns: '1fr 1fr 2fr', gap: '15px', alignItems: 'end' }}>
              <button 
                type="button"
                className="registerButton secondary" 
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                disabled={activeTab === 0}
              >
                Previous
              </button>
              
              <button 
                type="button"
                className="registerButton secondary" 
                onClick={() => setActiveTab(Math.min(6, activeTab + 1))}
                disabled={activeTab === 6}
              >
                Next
              </button>
              
              <button className="registerButton" type="submit" disabled={loader}>
                {loader ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Register Teacher'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  )
}

export default AddTeacher