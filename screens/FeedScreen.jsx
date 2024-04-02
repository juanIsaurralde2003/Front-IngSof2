import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import FeedComponentWithActionSheet from '../components/FeedComponent';

const FeedScreen = () => {
   
    return (
      <SafeAreaView>
      <ScrollView styles={{flex: 1, marginTop: 40}}>
       <FeedComponentWithActionSheet imagenURL={require('../assets/imagenFeedComponentEjemplo.png')} perfil={'@usuario'}  imagenPerfilURL={require('../assets/imagenUsuarioEjemplo.jpg')}  />
       <FeedComponentWithActionSheet imagenURL={require('../assets/imagenFeedComponentEjemplo2.png')} perfil={'@usuario2'}  imagenPerfilURL={require('../assets/imagenUsuarioEjemplo2.jpg')}  />
      </ScrollView>
      </SafeAreaView>
  );
};

export default FeedScreen;