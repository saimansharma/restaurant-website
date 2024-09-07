import React, { useEffect, useState } from 'react';

import { SubHeading, MenuItem } from '../../components'
import { images} from '../../constants'
import './SpecialMenu.css';

const SpecialMenu = () => {

    const [wines, setWines] = useState([]);
    const [cocktails, setCocktails] = useState([]);

      useEffect(() => {
        // Fetch events when the component mounts
        fetchData();
      }, []);

      const fetchData = async () => {
        try {
          // Make a request to the backend to fetch awards
          const [winesResponse, cocktailsResponse] = await Promise.all([
              fetch('http://localhost:8080/api/activewines'),
              fetch('http://localhost:8080/api/activecocktails')
              ]);
          if (winesResponse.ok && cocktailsResponse.ok) {
            // If the request is successful, parse the response and set the awards state
            const winesData = await winesResponse.json();
            const cocktailsData = await cocktailsResponse.json();
            setWines(winesData);
            setCocktails(cocktailsData);

          } else {
            console.error('Failed to fetch wines or cocktails');
          }
        } catch (error) {
          console.error('Error occurred while fetching wines or cocktails:', error);
        }
      };

      return (

  <div className='app__specialMenu flex__center section__padding' id='menu'>
    <div className='app__specialMenu__title'>
       <SubHeading title="Menu that fits you palatte" />
       <h1 className='headtext__cormorant'>Today'Special</h1>
    </div>

    <div className='app__specialMenu__menu'>
       <div className='app__specialMenu-menu_wine flex__center'>
        <p className='app__specialMenu-menu_heading'>Wine & Beer</p>
        <div className='app__specialMenu_menu_items'>
          {wines.map((wine) => (
            <MenuItem key={wine.id} title={wine.title} price={wine.price} tags={wine.wineTags} />
          ))}
        </div>
       </div>

       <div className='app__specialMenu-menu_img' >
        <img src={images.menu} alt="menu img" />
       </div>

       <div className='app__specialMenu-menu_cocktails flex__center'>
        <p className='app__specialMenu-menu_heading'>Cocktails</p>
        <div className='app__specialMenu_menu_items'>
          {cocktails.map((cocktail) => (
            <MenuItem key={cocktail.id} title={cocktail.title} price={cocktail.price} tags={cocktail.cocktailTags} />
          ))}
        </div>
       </div>


    </div>

    <div style={{marginTop: '15px'}}>
       <button type='button' className='custom__button'>View More</button>
    </div>
  </div>
  );
};

export default SpecialMenu;
