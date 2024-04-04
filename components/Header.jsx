import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = ({ userProfilePic }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: userProfilePic }} style={styles.profileImage} />
      </View>
      <Text style={styles.headerText}>
        <Text style={styles.dontText}>DON'T</Text>
        <Text style={styles.beRealText}> BE REAL</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingBottom: 10
  },
  profileContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'NotoSansTC-Regular', 
  },
  dontText: {
    color: '#000',
  },
  beRealText: {
    color: '#390294', 
  },
});

export default Header;

