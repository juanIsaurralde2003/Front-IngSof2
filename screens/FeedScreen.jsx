import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import FeedComponentWithActionSheet from '../components/FeedComponent';

const FeedScreen = () => {
   
    return (
      <ScrollView styles={{flex: 1}}>
       <FeedComponentWithActionSheet imagenURL={require('../assets/imagenFeedComponentEjemplo.png')} perfil={'@usuario'}  imagenPerfilURL={require('../assets/imagenUsuarioEjemplo.jpg')}  />
      </ScrollView>
  );
};

export default FeedScreen;