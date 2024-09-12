import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader'; 
import './NewLogin.css';
import { setAuthentication } from '../../reducers/userSlice';
import useCustomFetch from '../../reducers/useCustomFetch';

const NewLogin = () => {

        const { customFetch } = useCustomFetch();
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);
        const [message, setMessage] = useState('');
        const [messageType, setMessageType] = useState('');
        const [showMessage, setShowMessage] = useState(false);
        const dispatch = useDispatch();
        const navigate = useNavigate();

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true); 

            const user = { email, password };

            const response = await customFetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            const username = data.username;
            console.log(data.message);

            if (response.ok) {
                setMessageType('success');
                setMessage(data.message);
                console.log(data.message);
                dispatch(setAuthentication({ isAuthenticated: true, username: username }));
                navigate('/');
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 3000);
            }
                else{
                    setMessageType('error');
                    setMessage(data.error);
                    console.log(data.error);
                    setShowMessage(true);
                    setTimeout(() => setShowMessage(false), 3000);
                    }
            setLoading(false);
        };

        return (
    <div class="login-body">
    {showMessage && <div className={`floating-message ${messageType}`}>{message}</div>}
    {loading && (
                <div className="overlay">
                    <BeatLoader color="#ffffff" loading={loading} size={20} />
                </div>
            )}
    <div class="login-box">
        <div class="login-header">
            <header>Login</header>
        </div>
        <form onSubmit={handleSubmit}>
        <div class="input-box">
            <input type="text" class="input-field" placeholder="Email" autocomplete="off" value={email} onChange={(e) => setEmail(e.target.value)} required></input>
        </div>
        <div class="input-box">
            <input type="password" class="input-field" placeholder="Password" autocomplete="off" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
        </div>
        <div class="forgot">
            {/* <section>
                <input 
                    type="checkbox" 
                    id="check"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    />
                <label for="check">Remember me</label>
            </section> */}
            <section>
                <a href="/forgot-password">Forgot password?</a>
            </section>
        </div>
        <div class="input-submit">
            <button type="submit" class="submit-btn" id="submit"></button>
            <label for="submit">Sign In</label>
        </div>
        <div class="sign-up-link">
            <p>Don't have account? <a href="/register">Sign Up</a></p>
        </div>
        </form>
    </div>
    </div>
);
};

export default NewLogin;