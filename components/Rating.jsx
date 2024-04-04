import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomRating = ({ maxRating, defaultRating, onRatingChange }) => {
  const [rating, setRating] = useState(defaultRating);

  const handleRating = (rate) => {
    setRating(rate);
    onRatingChange(rate);
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleRating(i)}>
          <Icon name="star" size={30} color={i <= rating ? 'gold' : 'gray'} />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>{renderStars()}</View>;
};

export default CustomRating;