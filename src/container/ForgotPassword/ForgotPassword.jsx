import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import { addEmail } from '../../reducers/userSlice';
import BeatLoader from 'react-spinners/BeatLoader'; 

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/auth/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email }),
        });

        const data = { message: await response.text() };
    
    console.log(data);
        if (response.ok) {
            setMessageType('success');
            setMessage(data.message);
            setShowMessage(true);
            console.log(data);
            setTimeout(() => setShowMessage(false), 1000);
            dispatch(addEmail(email))
            navigate('/verify');
        }
        else{
            console.log("Some error occured")
            setMessageType('error');
            setMessage(data.message || "Email does not exist!");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
        setLoading(false);
    };

    return (
        <div className="forgot-password-email-body">
    {showMessage && <div className={`floating-message ${messageType}`}>{message}</div>}
    {loading && (
                <div className="overlay">
                    <BeatLoader color="#ffffff" loading={loading} size={20} />
                </div>
            )} 
    <div className="forgot-password-email-box">
                <div className="verification-header">
                    <header>Identify your Account</header>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="instructions">
                        <p>Otp for reset password will be sent to your registered email address, if account is valid</p>
                    </div>
                    <div className="email-box">
                        <input
                            type="text"
                            className="email-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email Address"
                        />
                    </div>
                    <div class="input-submit">
                        <button type="submit" class="submit-btn" id="submit"></button>
                        <label for="submit">Next</label>
                    </div>
                </form>               
            </div>
        </div>
    );
};

export default ForgotPassword;