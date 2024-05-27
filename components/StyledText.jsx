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
    ffrText: {
        color: '#000000',
        fontSize: 14,
        fontFamily: 'Quicksand',
        lineHeight: 16,
        textAlign: 'center',
        paddingTop:3
      },
    usernamePostText:{
        color: '#000000',
        fontSize: 14,
        fontFamily: 'Quicksand',
        lineHeight: 18,
    },
    consignaText:{
        color: '#000000',
        fontSize: 13,
        fontFamily: 'Quicksand',
        lineHeight: 16,
    },
    dateText:{
        color: '#656262',
        fontSize: 12,
        lineHeight: 16,
        fontWeight:'300'
    },
    
    
};

const StyledText = ({style,titleText,usernameText,ffrText,usernamePostText,dateText,consignaText,children}) => {
    const textStyles=[
        titleText && styles.titleText,
        usernameText && styles.usernameText,
        ffrText && styles.ffrText,
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