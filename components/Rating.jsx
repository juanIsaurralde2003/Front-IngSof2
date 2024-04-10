import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomRating = ({ maxRating, defaultRating, onRatingChange, readOnly}) => {
  const [rating, setRating] = useState(defaultRating);

  useEffect(()=>{
    setRating(defaultRating);
  },[defaultRating])
  const handleRating = (rate) => {
    setRating(rate);
    onRatingChange(rate);
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