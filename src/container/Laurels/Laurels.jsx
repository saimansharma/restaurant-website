import React, { useEffect, useState } from 'react';
import { SubHeading } from '../../components';
import { images } from '../../constants';
import './Laurels.css';

const Laurels = () => {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    // Fetch events when the component mounts
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      // Make a request to the backend to fetch awards
      const response = await fetch('https://restaurant-backend-springboot-fwcdbhdkdscvdhhe.uksouth-01.azurewebsites.net/api/awards');
      if (response.ok) {
        // If the request is successful, parse the response and set the awards state
        const data = await response.json();
        setAwards(data);

      } else {
        console.error('Failed to fetch awards');
      }
    } catch (error) {
      console.error('Error occurred while fetching awards:', error);
    }
  };

  return (

<div className="app__bg app__wrapper section__padding" id="awards">
    <div className="app__wrapper_info">
      <SubHeading title="Awards & recognition" />
      <h1 className="headtext__cormorant">Our Laurels</h1>

      <div className="app__laurels_awards">
        {awards.map((award) => <div key={award.id} className="app__laurels_awards-card">
                                         <img src={`https://restaurant-backend-springboot-fwcdbhdkdscvdhhe.uksouth-01.azurewebsites.net${award.imageUrl}`} alt="awards"/>
                                        <div className="app__laurels_awards-card_content">
                                          <p className="p__cormorant" style={{ color: '#DCCA87' }}>{award.title}</p>
                                          <p className="p__opensans">{award.subtitle}</p>
                                        </div>
                                      </div>)}
      </div>
    </div>
    <div className="app__wrapper_img">
      <img src={images.laurels} alt="laurels_img" />
    </div>
  </div>
);
};


export default Laurels;