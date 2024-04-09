import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet,View,Image,Text , SafeAreaView } from "react-native";
import ProfileUserInfo from "../components/ProfileUserInfo";
import FeedComponentWithActionSheet from "../components/FeedComponent";
import ProfileComponent from "../components/ProfileComponent";
import { useAuth } from "../components/AuthContext";

function ProfileScreen({navigation}){
    const {token} = useAuth()
    const [publicaciones, setPublicaciones] = useState(null);
    //const [profileUserInfo,setProfileUserInfo] = useState(null);
    const getPublicaciones = async () => {
        try {
          const url = 'https://api.com/publicaciones';
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
      
          if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
          }
      
          const data = await response.json();
          setPublicaciones(data)
        } catch (error) {
          console.error('Hubo un problema con la solicitud fetch:', error);
        }
      };
    
    /*const getProfileUserInfo = async () => {
      try {
        const url = 'http://miurl.com/profileInfo'
        const response = await fetch(url,{
          method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
        });
        if(!response.ok){
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
      }
      catch (error) {
        console.error('Hubo un error en la petición',error);
      }
    }*/

    
    const profileUserInfo = {
      rating: 3,
      usuario: "@usuario",
      seguidores:500,
      seguidos:120,
      retos:15,

    }

    const publicacionesHC = [
      { fecha: "January 5, 2020", consigna: "Sacar una foto de unas plantas y unas sillas marrones en un balcón...", rating: 3, imagenURL: require('../assets/imagenFeedComponentEjemplo.png'), perfil: '@usuario', imagenPerfilURL: require('../assets/profile_picture.png') },
      { fecha: "December 7, 2019", consigna: "Sacar una foto que tenga al menos 5 plantas diferentes y una medialuna con café", rating: 2, imagenURL: require('../assets/imagenFeedComponentEjemplo2.png'), perfil: '@usuario2', imagenPerfilURL: require('../assets/profile_picture.png') }
    ]

    return(
            <FlatList 
                style={styles.lista}
                ListHeaderComponent={()=><ProfileUserInfo 
                                          navigation={navigation}
                                          rating={profileUserInfo.rating}
                                          usuario={profileUserInfo.usuario}
                                          imageURI={profileUserInfo.imageURI}
                                          seguidores={profileUserInfo.seguidores}
                                          seguidos={profileUserInfo.seguidos}
                                          retos={profileUserInfo.retos}
                                    
                                          />}
                data={publicacionesHC}
                renderItem={({item,index})=>(
                    <ProfileComponent 
                        key={index}
                        imagenURL={item.imagenURL}
                        perfil={item.perfil}
                        imagenPerfilURL={item.imagenPerfilURL}
                        rating={item.rating}
                        fecha={item.fecha}
                        consigna={item.consigna}
                    />
                )}

            />
    )
    
}

const styles= {
    container:{
        flex:1,
        backgroundColor:'#e5e5e5'
    },
    lista:{
        marginTop:-75,
        flex:1,
        backgroundColor:'#e5e5e5'

    },
}


export default ProfileScreen;