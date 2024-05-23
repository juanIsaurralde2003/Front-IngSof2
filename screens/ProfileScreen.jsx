import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet,View,Image,Text , SafeAreaView } from "react-native";
import ProfileUserInfo from "../components/ProfileUserInfo";
import FeedComponentWithActionSheet from "../components/FeedComponent";
import ProfileComponent from "../components/ProfileComponent";
import { useAuth } from "../components/AuthContext";
import { SERVER } from '../utils/utils';
import { useRoute } from "@react-navigation/native";

function ProfileScreen({navigation}){
    const {token} = useAuth()
    const [publicaciones, setPublicaciones] = useState([]);
    const [profileUserInfo,setProfileUserInfo] = useState({});
    const [retosUser, setRetosUser] = useState(0);
    const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"];
    const route = useRoute();
    const { fromScreen, userData } = route.params;

    const convertDate = (date)=>{
      let profileDate = '';
      let month = date.split('-')[1]-1
      let day = date.split('-')[2]
      let year = date.split('-')[0]
      profileDate = months[month] + " " + day + ", " + year
      return profileDate;
      
    }

    const getCantidadPosts = async () => {
      try {
        const url = `${SERVER}/users/completedprompts/${encodeURIComponent(userData)}`;
        console.log("el usuario es:" + userData);
        const response = await fetch(url, {method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Imprimo cantidad de posts');
          setRetosUser(data.totalPrompts);
          console.log(data);
        } else {
          console.error("Respuesta HTTP no exitosa",response.status);
        }
    
      } catch (error) {
        console.error('Hubo un problema con la solicitud cantidad fetch:', error);
      }
    }
    
    const getPublicacionesUsuario = async () => {
      try {
        const url = `${SERVER}/users/posts/${encodeURIComponent(userData)}`;
        console.log("el usuario es:" + userData);
        const response = await fetch(url, {method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log("las publicaciones son: " + JSON.stringify(data, null, 2));
          const publicacionesCom = data.user.map( (item) => {
            const publicacion = {
              fecha: item.prompt.date && convertDate(item.prompt.date),
              //consigna:'Sacar una foto que...', 
              consigna: item.prompt.prompt,
              rating: item.post.score && item.post.score.low || 0, 
              imagenURL: item.post.imageURL, 
            }
            return publicacion
          });
          setPublicaciones(publicacionesCom);
        } else {
          console.error("Respuesta HTTP no exitosa",response.status);
        }
    
      } catch (error) {
        console.error('Hubo un problema con la solicitud fetch:', error);
      }
    };
    
    const getProfileUserInfo = async () => {
      try {
        const url = `${SERVER}/users/followInfo/${encodeURIComponent(userData)}`
        console.log("el usuario es aca:" + userData);
        const response = await fetch(url,{method: 'GET',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          }
        });
        if(response.ok){
          const data = await response.json();
          console.log(data);
          setProfileUserInfo({
            rating: (data && data.user && data.user.score) || 3,
            usuario: '@' + data.user.user.username,
            imagenPerfilURL:data && data.user && data.user.user && data.user.user.profilePicture,
            seguidores: data && data.user && data.user.followers, // pedir seguidores, seguidos, rating y cantidad de retos a back
            seguidos: data && data.user && data.user.following,
            retos: data && data.user && data.user.retos || 206
          })
        }
        else{
          console.error("Respuesta HTTP no existosa",response.status)
        }
      }
      catch (error) {
        console.error('Hubo un error en la petición',error);
      }
    }

    useEffect(()=>{
      getProfileUserInfo();
      console.log("el rating es" + profileUserInfo.rating)
      getPublicacionesUsuario();
      getCantidadPosts();
    },[])
    
    const profileUserInfoHC = {
      rating: 3,
      usuario: "@usuario",
      seguidores:500,
      seguidos:120,
      retos:15,
    }

    const publicacionesHC = [
      { fecha: "January 5, 2020", consigna: "Sacar una foto de unas plantas y unas sillas marrones en un balcón...", rating: 2, imagenURL: require('../assets/imagenFeedComponentEjemplo.png'), perfil: '@usuario', imagenPerfilURL: require('../assets/profile_picture.png') },
      { fecha: "December 7, 2019", consigna: "Sacar una foto que tenga al menos 5 plantas diferentes y una medialuna con café", rating: 1, imagenURL: require('../assets/imagenFeedComponentEjemplo2.png'), perfil: '@usuario2', imagenPerfilURL: require('../assets/profile_picture.png') }
    ]

    return(
            <FlatList 
                style={styles.lista}
                ListHeaderComponent={()=><ProfileUserInfo 
                                            navigation={navigation}
                                            rating={profileUserInfo.rating}
                                            usuario={profileUserInfo.usuario}
                                            imagenPerfilURL={profileUserInfo.imagenPerfilURL}
                                            seguidores={profileUserInfo.seguidores}
                                            seguidos={profileUserInfo.seguidos}
                                            retos={retosUser}
                                            fromScreen={fromScreen}
                                    
                                          />}
                data={publicaciones}
                renderItem={({item,index})=>(
                    <ProfileComponent 
                        key={index}
                        imagenURL={item.imagenURL}
                        perfil={profileUserInfo.usuario}
                        imagenPerfilURL={profileUserInfo.imagenPerfilURL}
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