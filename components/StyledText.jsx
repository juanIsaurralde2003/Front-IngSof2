import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = {
    
    titleText:{
        color: '#390294',
        fontSize: 50,
        fontFamily: 'Noto Sans TC',
        fontWeight: 700,
        lineHeight: 65,
    },
    
};

const StyledText = ({style,titleText,children}) => {
    const textStyles=[
        titleText && styles.titleText,
        style
    ]

  return (
    <Text style={textStyles}>
        {children}
    </Text>
  );
};

export default StyledText;