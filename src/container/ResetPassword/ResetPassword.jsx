import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader'; 


import './ResetPassword.css';

const ResetPassword = () => {
        const [newPasssword, setNewPassword] = useState('');
        const [message, setMessage] = useState('');
        const [messageType, setMessageType] = useState('');
        const [showMessage, setShowMessage] = useState(false);
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();

        const handleSubmit = async (e) => {
            e.preventDefault();
        setLoading(true);

            const response = await fetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({newPassword: newPasssword}),
            });

            const data = await response.json();

            if (response.ok) {
                setMessageType('success');
                setMessage(data.message);
                navigate('/');
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 3000);
                // Perform additional actions like redirecting the user
            }
        else{
            setMessageType('error');
            setMessage(data.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
            }
        setLoading(false);
        };

        return (
    <div class="reset-password-body">
    {showMessage && <div className={`floating-message ${messageType}`}>{message}</div>}
    {loading && (
                <div className="overlay">
                    <BeatLoader color="#ffffff" loading={loading} size={20} />
                </div>
            )} 
    <div class="reset-password-box">
        <div class="reset-password-header">
            <header>Reset Password</header>
        </div>
        <form onSubmit={handleSubmit}>
        <div class="input-box">
            <input type="text" class="input-field" placeholder="Enter New Password" autocomplete="off" value={newPasssword} onChange={(e) => setNewPassword(e.target.value)} required></input>
        </div>
        <div class="input-submit">
            <button type="submit" class="submit-btn" id="submit"></button>
            <label for="submit">Submit</label>
        </div>
        </form>
    </div>
    </div>
);
};

export default ResetPassword;