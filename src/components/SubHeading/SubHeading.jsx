import React from 'react';

import { images } from '../../constants'

const SubHeading = ({ title, txtstyle, imgStyle}) => (
  <div style={{ marginBottom: '1rem'}}>
    <p className='p__cormorant' style={txtstyle}>{title}</p>
    <img src={images.spoon} alt="spoon" className='spoon__img' style={imgStyle}/>
  </div>
);

export default SubHeading;
