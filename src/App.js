import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, AboutUs, Chef, Intro, Gallery, FindUs, Footer, SpecialMenu, Laurels, NewLogin, NewRegister, Verification, UserProfile, ForgotPassword, ResetPassword, BookTable} from './container';
import PrivateRoute from './reducers/PrivateRoute';
import { Navbar, GoToTop } from './components';
import './App.css';

function App() {
  return (
     <BrowserRouter>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                <Header />
                <GoToTop />
                <AboutUs />
                <SpecialMenu />
                <Chef />
                <Laurels />
                <Intro />
                <Gallery />
                <FindUs />
                <Footer />
                </>
              } />
              <Route path="/login" element={<NewLogin />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />
              <Route path="/register" element={<NewRegister />} />
              <Route path="/verify-registration" element={<Verification />} />
              <Route path="/verify" element={<Verification />} />
              <Route path='/profile' element={<UserProfile/>} />
              <Route path='/book-table' element={<PrivateRoute><BookTable/></PrivateRoute>} />
            </Routes>
          </div>
        </BrowserRouter>
  );
}


export default App;
