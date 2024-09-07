import React, {useEffect, useState} from "react";
import {Container, Link} from 'react-floating-action-button'
import './TopArrow.css'
import '@fortawesome/fontawesome-free/css/all.min.css';


const TopArrow = () => {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) { // Adjust the value to your preference
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return(
        <div className="floating-button-container">
        {isVisible && (
       <Container  className="floating-button">
            <Link href="#home"
                tooltip="Scroll to Top"
                icon="fas fa-arrow-up-long fa-lg"
                className="custom-floating-button"
            />
       </Container>
    )};
    </div>
    )
}

export default TopArrow;