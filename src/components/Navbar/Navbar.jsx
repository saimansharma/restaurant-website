import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import {Link, useLocation, useNavigate } from 'react-router-dom';

import images from '../../constants/images';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../reducers/userSlice';
// import { logout } from '../../reducers/userSlice'
import Cookies from 'js-cookie';
import useCustomFetch from '../../reducers/useCustomFetch';



const Navbar = () => {

   const { customFetch } = useCustomFetch();
   const [toggleMenu, setToggleMenu] = useState(false);
   const location = useLocation();
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
   const username = useSelector((state) => state.user.username);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, []);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/book-table' || location.pathname === '/profile';
  const prevLocationRef = useRef(location.pathname);

  useEffect(() => {
    if (!isAuthPage && prevLocationRef.current !== location.pathname) {
      fetchUserProfile();
    }
    
    prevLocationRef.current = location.pathname;
  }, [location.pathname, isAuthPage, fetchUserProfile]);


  const handleLogout = async () => {

    const response = await customFetch('https://restaurant-springboot-backend-admin-hvbsbzg5hvekhedz.uksouth-01.azurewebsites.net/api/auth/user/logout', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
    });

    if(response.ok) {
      setUser(null);
      dispatch(logout());
      navigate('/login');
    }

  }


   return (
     <nav className='app__navbar' id="home">
       <div className='app__navbar-logo'>
         <Link to="/"><img src={images.gericht} alt="app logo" /></Link>
       </div>
       {!isAuthPage && (
         <ul className='app__navbar__links'>
           <li className='p__opensans'><Link to="/">Home</Link></li>
           <li className='p__opensans'><a href="#about">About</a></li>
           <li className='p__opensans'><a href="#menu">Menu</a></li>
           <li className='p__opensans'><a href="#awards">Awards</a></li>
           <li className='p__opensans'><a href="#contact">Contacts</a></li>
         </ul>
       )}
       <div className='app__navbar__login'>
       {isAuthenticated ? (
          <>
            <Link to="/profile" className='p__opensans'>{username}</Link>
            <div />
            <Link to="/book-table" className='p__opensans'>Book Table</Link>
            <div />
            <Link onClick={handleLogout} className='p__opensans'>Logout</Link>
          </>
        ) 
        : (
          <>
            <Link to="/login" className='p__opensans'>Log In</Link>
            <div />
            <Link to="/register" className='p__opensans'>Register</Link>
            <div />
            <Link to="/book-table" className='p__opensans'>Book Table</Link>
          </>
        )}
       </div>
       <div className='app__navbar__smallscreen'>
         <GiHamburgerMenu color='#fff' fontSize={27} onClick={() => setToggleMenu(true)} />
         {toggleMenu && (
           <div className='app__navbar-smallscreen_overlay flex__center slide-bottom'>
             <MdOutlineRestaurantMenu fontSize={27} className="overlay__close" onClick={() => setToggleMenu(false)} />
             <ul className='app__navbar-smallscreen_links'>
               <li className='p__opensans'><Link to="/" onClick={() => setToggleMenu(false)}></Link></li>
               {isAuthenticated ? (
                <>
                   <li className='p__opensans'><a href="/book-table">Book Table</a></li>
                  <li className='p__opensans'><Link to="/profile" onClick={() => setToggleMenu(false)}>{username}</Link></li>
                  <li className='p__opensans'><button style={{padding: '10px 20px', fontSize: "1.25rem"}} onClick={() => { setToggleMenu(false); handleLogout(); }}>Logout</button></li>
                </>
              ) : (
                <>
                   <li className='p__opensans'><a href="/book-table">Book Table</a></li>
                  <li className='p__opensans'><Link to="/login" onClick={() => setToggleMenu(false)}>Log In</Link></li>
                  <li className='p__opensans'><Link to="/register" onClick={() => setToggleMenu(false)}>Register</Link></li>
                </>
              )}
             </ul>
           </div>
         )}
       </div>
     </nav>
   );
};

export default Navbar;
