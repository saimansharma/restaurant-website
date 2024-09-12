import React, { useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import BeatLoader from 'react-spinners/BeatLoader'; 
import { useNavigate, useLocation } from 'react-router-dom';
import './Verification.css';
import { removeEmail, setAuthentication } from '../../reducers/userSlice';

const Verification = () => {
    const retrievedEmail = useSelector(state => state.user.email)

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [currentEmail, setCurrentEmail] = useState(retrievedEmail)
    const [newEmail, setNewEmail] = useState(retrievedEmail);
    const [resendEnabled, setResendEnabled] = useState(true);
    const [countdown, setCountdown] = useState(60); // 60 seconds countdown
    const [showChangeEmailBox, setShowChangeEmailBox] = useState(false);
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const RegistrationPage = location.pathname === '/verify-registration';

    useEffect(() => {
        let timer;
        if (!resendEnabled && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setResendEnabled(true); // Enable resend button after countdown finishes
            setCountdown(60); // Reset countdown
        }
        return () => clearTimeout(timer);
    }, [resendEnabled, countdown]);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        const response = await fetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ otp }),
        });

        const data = await response.json();
        const username = data.username;
        console.log("Outside",username);

        if (response.ok) {
            setMessageType('success');
            setMessage(data.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 1000);
            dispatch(removeEmail());
            console.log("inside",username);
            dispatch(setAuthentication({ isAuthenticated: true, username: username }));
            if(RegistrationPage){
                navigate('/');
            } else {
                navigate('/reset-password');
            }
        }
        else{
            setMessageType('error');
            setMessage(data.message || "Verification Failed");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
    setLoading(false);
    };

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Changing email from', currentEmail, 'to', newEmail); // Add logging here for debugging

        const response = await fetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/update-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({ currentEmail: currentEmail, newEmail: newEmail})
        });

        const data = await response.json();
        setMessage(data.message);
        
        if(response.ok){
            setMessageType('success')
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
            setCurrentEmail(newEmail);
            console.log(newEmail);
            setShowChangeEmailBox(false);
        }
        else{
            setMessageType('error' || "Operation Failed");
            setMessage(data.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
            }
        setLoading(false);
    };

    const handleResendVerification = async (e) => {
        setLoading(true);
        setResendEnabled(false);
        setCountdown(60);
        console.log('Sending verification code to', currentEmail);

        const response = await fetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: currentEmail })
        });

        const data = await response.text();
        
        if(response.ok){
            setMessageType('success');
            setMessage(data.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
        else{
            setMessageType('error' || "Operation Failed");
            setMessage(data.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
            }
        setLoading(false);
    };


    return (
        <div className="verification-body">
    {showMessage && <div className={`floating-message ${messageType}`}>{message}</div>}
    {loading && (
                <div className="overlay">
                    <BeatLoader color="#ffffff" loading={loading} size={20} />
                </div>
            )} 
    <div className="verification-box">
                <div className="verification-header">
                    <header>Account Verification</header>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="instructions">
                        <p>Please check your email and enter the OTP sent to your email below:</p>
                        <p id='showCurrentEmail'>{currentEmail}</p>
                    </div>
                    <div className="otp-box">
                        <input
                            type="text"
                            maxLength="6"
                            className="otp-field"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                        />
                    </div>
                    <div class="input-submit">
                        <button type="submit" class="submit-btn" id="submit" disabled={showChangeEmailBox ? true : false}></button>
                        <label for="submit">Verify</label>
                    </div>
                </form>
                <div className='verify-links'>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleResendVerification();
                        }}
                        className={`resend-link ${resendEnabled ? '' : 'disabled'}`}
                    >
                        {resendEnabled ? 'Resend Code' : `Resend Code (${countdown})`}
                    </a>
                </div>
                {RegistrationPage && (
                <div className='verify-links'>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowChangeEmailBox(true);
                        }}
                        className="change-email-link"
                    >
                        Change Email Address
                    </a>
                </div>
                )}
                {showChangeEmailBox && (
                    <div className="floating-box">
                        <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={() => setShowChangeEmailBox(false)} />
                        <form onSubmit={handleChangeEmail}>
                        <div className="verification-header">
                            <header>Change Email</header>
                        </div>
                            <div className="update-email">
                                <input
                                    type="email"
                                    className="input-field"
                                    value={newEmail}
                                    onChange={(e) => {
                                        console.log('Setting email to:', e.target.value); // Add logging here for debugging
                                        setNewEmail(e.target.value);
                                    }}
                                    placeholder="Enter New Email"
                                />
                            </div>
                            <div class="input-submit">
                                <button type="submit" class="email-submit-btn" id="submit"></button>
                                <label for="submit">Update Email</label>
                            </div>
                        
                        </form>
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default Verification;