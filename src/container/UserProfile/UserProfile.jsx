import React, { useState, useEffect} from "react"

import './UserProfile.css'
import { setAuthentication } from "../../reducers/userSlice";
import { useDispatch } from 'react-redux';
import BeatLoader from 'react-spinners/BeatLoader'; 


const UserProfile = () => {

    const [activeTab, setActiveTab] = useState('content1');
    const [profile, setProfile] = useState({name: '', email: '', phone: ''});
    const [updateData, setUpdateData] = useState({name: '', phone: ''});
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({currentPassword: '', newPassword: ''});
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const dispatch = useDispatch();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://restaurant-backend-springboot-fwcdbhdkdscvdhhe.uksouth-01.azurewebsites.net/api/auth/user/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if(response.ok){
                    const data = await response.json();
                    setProfile({name: data.name, email: data.email, phone: data.mobileNo});
                    setUpdateData({name: data.name, phone: data.mobileNo});
                }
                }
            catch (error) {
                console.error("Error fetching profile");
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (event, setter) => {
        const { name, value } = event.target;
        setter((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch('https://restaurant-backend-springboot-fwcdbhdkdscvdhhe.uksouth-01.azurewebsites.net/api/auth/user/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name: updateData.name, mobileNo: updateData.phone}),
        });

        const data = await response.json();

        if(response.ok) {
            setMessageType('success');
            setMessage(data.message);
            dispatch(setAuthentication({username : updateData.name}));
            setProfile({name: updateData.name, phone: updateData.phone});
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
        else{
            setMessageType('error');
            setMessage(data.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
        setLoading(false);
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch('https://restaurant-backend-springboot-fwcdbhdkdscvdhhe.uksouth-01.azurewebsites.net/api/auth/user/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ oldPassword: passwordData.currentPassword, newPassword: passwordData.newPassword}),
        });

        const data = await response.json();

        if(response.ok) {
            setMessageType('success');
            setMessage(data.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
        else{
            setMessageType('error');
            setMessage(data.message);
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
        setLoading(false);
    }


    return (
        <div className="profile-body">
            {showMessage && <div className={`floating-message ${messageType}`}>{message}</div>}
            {loading && (
                <div className="overlay">
                    <BeatLoader color="#ffffff" loading={loading} size={20} />
                </div>
            )} 
             <div className="tabs">
                <div className="tab-buttons">
                    <button
                    className={`tab-button ${activeTab === 'content1' ? 'active' : ''}`}
                    onClick={() => handleTabClick('content1')}
                    >
                    Profile Details
                    </button>
                    <button
                    className={`tab-button ${activeTab === 'content2' ? 'active' : ''}`}
                    onClick={() => handleTabClick('content2')}
                    >
                    Update Profile
                    </button>
                    <button
                    className={`tab-button ${activeTab === 'content3' ? 'active' : ''}`}
                    onClick={() => handleTabClick('content3')}
                    >
                    Change Password
                    </button>
                </div>

                <div className={`tab-content ${activeTab === 'content1' ? 'active' : ''}`} id="content1">
                    <h2>Profile Details</h2>
                    <p>Name: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                    <p>Phone: {profile.phone}</p>
                </div>

                <div className={`tab-content ${activeTab === 'content2' ? 'active' : ''}`} id="content2">
                    <h2>Update Profile</h2>
                    <form onSubmit={handleUpdateProfile} className="profile-form">
                    <div className="user-details-input">
                        <label htmlFor="name">Name: </label>
                        <input type="text" id="name" name="name" value={updateData.name} onChange={(event) => handleInputChange(event, setUpdateData)}/>
                    </div>
                    <div className="user-details-input">
                        <label htmlFor="phone">Phone: </label>
                        <input type="text" id="phone" name="phone" value={updateData.phone} onChange={(event) => handleInputChange(event, setUpdateData)}/>
                    </div>
                    <div className="user-details-button">
                       <button type='submit' >Update</button>
                    </div>
                    </form>
                </div>

                <div className={`tab-content ${activeTab === 'content3' ? 'active' : ''}`} id="content3">
                    <h2>Change Password</h2>
                    <form onSubmit={handleChangePassword} className="profile-form">
                    <div className="user-details-input">
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword}  onChange={(event) => handleInputChange(event, setPasswordData)}/>
                    </div>
                    <div className="user-details-input">
                    <label htmlFor="newPassword">New Password:</label>
                    <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={(event) => handleInputChange(event, setPasswordData)} />
                    </div>
                    <div className="user-details-button">
                        <button type='submit'>Change Password</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;