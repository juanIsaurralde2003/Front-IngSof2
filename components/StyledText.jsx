import React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = {
    
    titleText:{
        color: '#390294',
        fontSize: 50,
        fontWeight: 'bold',
        lineHeight: 65,
    },
    usernameText : {
        color: '#000000',
        fontSize: 24,
        fontFamily: 'Quicksand',
        lineHeight: 31,
        textAlign: 'center',
  },
    retosText: {
        color: '#000000',
        fontSize: 14,
        fontFamily: 'Quicksand',
        lineHeight: 16,
        textAlign: 'center',
      },
    usernamePostText:{
        color: '#000000',
        fontSize: 14,
        fontFamily: 'Quicksand',
        lineHeight: 18,
    },
    consignaText:{
        color: '#000000',
        fontSize: 12,
        fontFamily: 'Quicksand',
        fontWeight: '500',
        lineHeight: 16,
    },
    dateText:{
        color: '#424242',
        fontSize: 14,
        fontFamily: 'Roboto',
        lineHeight: 16,
    },
    
    
};

const StyledText = ({style,titleText,usernameText,retosText,usernamePostText,dateText,consignaText,children}) => {
    const textStyles=[
        titleText && styles.titleText,
        usernameText && styles.usernameText,
        retosText && styles.retosText,
        usernamePostText && styles.usernamePostText,
        dateText && styles.dateText,
        consignaText && styles.consignaText,
        style
    ]

  return (
    <Text style={textStyles}>
        {children}
    </Text>
  );
};

export default StyledText;