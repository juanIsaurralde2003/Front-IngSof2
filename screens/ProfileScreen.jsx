import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet,View,Image,Text , SafeAreaView, ActivityIndicator } from "react-native";
import ProfileUserInfo from "../components/ProfileUserInfo";
import FeedComponentWithActionSheet from "../components/FeedComponent";
import ProfileComponent from "../components/ProfileComponent";
import { useAuth } from "../components/AuthContext";
import { SERVER } from '../utils/utils';
import { useRoute } from "@react-navigation/native";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

function ProfileScreen({navigation}){
    const {token} = useAuth()
    const [publicaciones, setPublicaciones] = useState([]);
    const [profileUserInfo,setProfileUserInfo] = useState({});
    const [retosUser, setRetosUser] = useState(0);
    const [loading, setLoading] = useState(true);
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

    const calculateDaysBetween = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    

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
    
    // const getPublicacionesUsuario = async () => {
    //   try {
    //     const url = `${SERVER}/users/posts/${encodeURIComponent(userData)}`;
    //     console.log("el usuario es:" + userData);
    //     const response = await fetch(url, {method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`
    //       }
    //     });
    
    //     if (response.ok) {
    //       const data = await response.json();
    //       console.log("las publicaciones son: " + JSON.stringify(data, null, 2));
    //       const publicacionesCom = data.user.map( (item) => {
    //         const publicacion = {
    //           fecha: item.prompt.date && convertDate(item.prompt.date),
    //           //consigna:'Sacar una foto que...', 
    //           consigna: item.prompt.prompt,
    //           rating: item.post.score || 0, 
    //           imagenURL: item.post.imageURL, 
    //         }
    //         return publicacion
    //       });
    //       setPublicaciones(publicacionesCom);
    //     } else {
    //       console.error("Respuesta HTTP no exitosa",response.status);
    //     }
    
    //   } catch (error) {
    //     console.error('Hubo un problema con la solicitud fetch:', error);
    //   }
    // };

    const getPublicacionesUsuario = async () => {
      try {
        const url = `${SERVER}/users/posts/${encodeURIComponent(userData)}`;
        console.log("el usuario es:" + userData);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log("las publicaciones son: " + JSON.stringify(data, null, 2));
    
          let totalScore = 0;
          let firstPostDate = null;
    
          const publicacionesCom = data.user.map((item) => {
            if (!firstPostDate || new Date(item.prompt.date) < new Date(firstPostDate)) {
              firstPostDate = item.prompt.date;
            }
    
            totalScore += item.post.score || 0;
    
            return {
              fecha: item.prompt.date && convertDate(item.prompt.date),
              consigna: item.prompt.prompt,
              rating: item.post.score || 0,
              imagenURL: item.post.imageURL,
            };
          });
    
          if (publicacionesCom.length > 0 && firstPostDate) {
            const today = new Date().toISOString().split('T')[0];
            const daysOnPlatform = calculateDaysBetween(firstPostDate, today);
            const averageScore = totalScore / daysOnPlatform;
            console.log('Ranking promedio del usuario:', averageScore.toFixed(2));
            setProfileUserInfo((prevInfo) => ({
              ...prevInfo,
              rating: averageScore.toFixed(2)
            }));
          } else {
            // Si no hay publicaciones, establecer el ranking promedio en 0
            setProfileUserInfo((prevInfo) => ({
              ...prevInfo,
              rating: 0
            }));
          }
    
          setPublicaciones(publicacionesCom);
        } else {
          console.error("Respuesta HTTP no exitosa", response.status);
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

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          await getProfileUserInfo();
          console.log("el rating es" + profileUserInfo.rating);
          await getPublicacionesUsuario();
          await getCantidadPosts();
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [userData]);
    
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

    if (loading) {
      return (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e5e5e5'}}>
              <ActivityIndicator size="large" color="#390294" />
          </View>
      );
  }

    return (
        <ActionSheetProvider>
            <FlatList 
                style={styles.lista}
                ListHeaderComponent={()=><ProfileUserInfo 
                                            navigation={navigation}
                                            rating={profileUserInfo.rating}
                                            usuario={profileUserInfo.usuario}
                                            userdata={userData}
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
      </ActionSheetProvider>
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