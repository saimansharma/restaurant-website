import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addEmail } from '../../reducers/userSlice'
import './NewRegister.css';
import BeatLoader from 'react-spinners/BeatLoader'; 


const NewRegister = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [messageType, setMessageType] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 

        const name = `${firstName} ${lastName}`;
        const user = { name, email, password, mobileNo };
        dispatch(addEmail(email))

        try{
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        const data = await response.text();

        if (response.ok) {
            setMessageType('success');
            setMessage(data);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setMobileNo('');
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
            navigate('/verify-registration');
        }
        else{
            setShowMessage(true);
            setMessageType('error');
            setMessage(data);
            setTimeout(() => setShowMessage(false), 3000);
        }
        setLoading(false);
    }
    catch(err){
        setShowMessage(true);
        setMessageType('error');
        setMessage('Internal Server Error');
        setTimeout(() => setShowMessage(false), 3000);
        setLoading(false);
    }
    
    };

        return (
            <div class="register-body">
    {showMessage && <div className={`floating-message ${messageType}`}>{message}</div>}
    {loading && (
                <div className="overlay">
                    <BeatLoader color="#F5EFDB" loading={loading} size={20} />
                </div>
            )} 
    <div class="register-box">
                    <div class="register-header">
                        <header>Register</header>
                    </div>
                    <form onSubmit={handleSubmit}>
                    <div class="input-box" style={{display: "flex", gap: "10px"}}>
                        <input type="text" class="input-field" placeholder="First Name" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} autocomplete="off" required></input>
                        <input type="text" class="input-field" placeholder="Last Name" autocomplete="off" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required></input>
                    </div>
                    <div class="input-box">
                        <input type="text" class="input-field" placeholder="Email" autocomplete="off" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                    </div>
                    <div class="input-box">
                        <input type="text" class="input-field" placeholder="Mobile Number" autocomplete="off" id="mobileNo" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required></input>
                    </div>
                    <div class="input-box">
                        <input type="password" class="input-field" placeholder="Password" autocomplete="off" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                    </div>
                    <div class="input-submit">
                        <button type="submit" class="submit-btn" id="submit"></button>
                        <label for="submit">Sign Up</label>
                    </div>
                    <div class="login-link">
                        <p>Already have an account? <a href="/login">Login</a></p>
                    </div>
            </form>
        </div>
    </div>
);
};

export default NewRegister;