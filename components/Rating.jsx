import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SERVER } from '../utils/utils';
import { useAuth } from './AuthContext';

const CustomRating = ({ maxRating, defaultRating, onRatingChange, readOnly, imageUrl, username}) => {

  const [rating, setRating] = useState(defaultRating);
  const {token} = useAuth();

  useEffect(()=>{
    setRating(defaultRating);
  },[defaultRating])


    /* imageURL
username 
score */
  const handleRating = async (rate) => {
    setRating(rate);
    onRatingChange(rate);
    
    console.log("Rating: ", rate);
    
    const url = `${SERVER}/posts/score`
  
    const data = {
      imageURL: imageUrl,
      username: username,
      score: rate,
    }
  
    try {
      const respuesta = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    
      if (respuesta.status === 200) {
        console.log('Rating exitoso');
      } else {
        console.error('Respuesta HTTP no exitosa:', respuesta.status);
         
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        readOnly ?
          <Icon name="star" key={i} size={24} color={i <= rating ? 'gold' : '#A9A6A6'} />    
        :
          <TouchableOpacity key={i} onPress={() => handleRating(i)}>
            <Icon name="star" size={24} color={i <= rating ? 'gold' : '#A9A6A6'} />
          </TouchableOpacity>
      );
    }
    return stars;
  };

  return <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>{renderStars()}</View>;
};

export default CustomRating;