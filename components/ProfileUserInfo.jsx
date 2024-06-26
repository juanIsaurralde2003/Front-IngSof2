import React,{useEffect, useState}from "react";
import { StyleSheet,View,Image,Text,TouchableOpacity, ActionSheetIOS,ActivityIndicator, Platform} from "react-native";
import profilePicture from '../assets/person.jpg'
import StyledText from "./StyledText";
import { MaterialIcons,Entypo } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useAuth } from "./AuthContext";
import ProfileStats from "./ProfileStats";
import CustomRating from "./Rating";
import { tr } from "date-fns/locale";
import FollowerOptions from "./FollowerOptions";
import { SERVER } from "../utils/utils";
import { useActionSheet } from '@expo/react-native-action-sheet';




function ProfileUserInfo({navigation, usuario, imagenPerfilURL, email, birthday, seguidores, seguidos, retos, rating, fromScreen, userdata}){

    const {token,signOut,user} = useAuth();
    const [loadingImage, setLoadingImage] = useState(true);
    const [error, setError] = useState(false);
    const [sessionUser,setSessionUser] = useState(false);
    const [isVisible,setIsVisible] = useState(false);
    const [following,setFollowing] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [isLoadingUnfollow, setIsLoadingUnfollow] = useState(false);
    const [seguimientoVerificado,setSeguimientoVerificado] = useState(false);
    const { showActionSheetWithOptions } = useActionSheet();

    const isFollowing = async () => {
        const seguidor = user;
        const seguido = usuario && usuario.slice(1);
        const url = `${SERVER}/users/isfollowing/${encodeURIComponent(seguidor)}/${encodeURIComponent(seguido)}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setFollowing(data.user);
                setSeguimientoVerificado(true);
            } else {
                //console.error('No se pudo verificar el estado de seguimiento:', response.status);
            }
        } catch (error) {
            //console.error('Error al verificar si el usuario está siguiendo:', error.message);
        }
    }

    useEffect(()=>{
        isFollowing();
        console.log(usuario + '   ' +imagenPerfilURL)
    },[following])

    useEffect(()=>{
        if("@"+user===usuario){
            setSessionUser(true);
        }
    },[])

    const toggleVisibility = () => {
        setIsVisible(true);
    }

    const handleLoadStart = () => {
        setLoadingImage(true);
        setError(false);
    };

    const handleLoadEnd = () => {
        setLoadingImage(false);
    };

    const handleLoadError = () => {
        setLoadingImage(false);
        setError(true);
    };

    const showActionSheet = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Editar Perfil', 'Cerrar Sesión','Cancelar'],
                    cancelButtonIndex:2,
                    destructiveButtonIndex: 1,
                },
            buttonIndex => {
                if (buttonIndex === 0) {
                    navigation.navigate('EditProfile', {usuario: userdata, imagenPerfilURLOri: imagenPerfilURL, emailOri: email, birthdayOri: birthday, fromScreen: fromScreen})
                } else if (buttonIndex === 1) {
                    signOut();  //REVISAR ASINCRONÍA
                    navigation.navigate('login');
                }
            }
            )
        } else {
            console.log('SHOW ACTION SHEET')
            showActionSheetWithOptions(
                {
                    options: ['Editar Perfil', 'Cerrar Sesión','Cancelar'],
                    cancelButtonIndex:2,
                    destructiveButtonIndex: 1,
                },
            buttonIndex => {
                if (buttonIndex === 0) {
                    navigation.navigate('EditProfile', {usuario: userdata, imagenPerfilURLOri: imagenPerfilURL, emailOri: email, birthdayOri: birthday, fromScreen: fromScreen})
                } else if (buttonIndex === 1) {
                    signOut();  //REVISAR ASINCRONÍA
                    navigation.navigate('login');
                }
            }
            )
        }
    };

    const handleFollow = async () => {
        setIsLoading(true);
        const seguidor = user;
        const seguido = usuario && usuario.slice(1);
        const url = `${SERVER}/users/follow/${encodeURIComponent(seguidor)}/${encodeURIComponent(seguido)}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 200) {
                console.log('User followed successfully');
                setFollowing(true);
            } else {
                //console.error('Hubo un problema con la solicitud HTTP:', response.status);
            }
        } catch (error) {
            //console.error('Error en la operación de follow:', error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleUnfollow = async () => {
        setIsVisible(false)
        setIsLoadingUnfollow(true);
        const seguidor = user;
        const seguido = usuario && usuario.slice(1);
        const url = `${SERVER}/users/unfollow/${encodeURIComponent(seguidor)}/${encodeURIComponent(seguido)}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 200) {
                console.log('User unfollowed successfully');
                setFollowing(false);
            } else {
                //console.error('Hubo un problema con la solicitud HTTP:', response.status);
            }
        } catch (error) {
            //console.error('Error en la operación de follow:', error.message);
        } finally {
            setIsLoadingUnfollow(false);
        }
    }


      return(
        <View style={styles.container}>
            <View style={styles.optionsContainer}>
                {sessionUser &&
                <TouchableOpacity onPress={showActionSheet} style={styles.menuStyle}>
                    <Entypo name={'menu'} size={30} color={'black'}/>
                </TouchableOpacity>
                }
                <TouchableOpacity onPress={()=>{navigation.navigate(fromScreen)}} style={sessionUser ? styles.closeStyle : styles.closeStyleAlong}>
                    <MaterialIcons name={'close'} size={30} color={'black'} />
                </TouchableOpacity>
            </View>
            <Image
                source = {(typeof imagenPerfilURL !=='undefined' ? {uri:imagenPerfilURL} : profilePicture)}     //CAMBIAR POR URL DE LA BD
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleLoadError}
                resizeMode='cover'
                style = {styles.profilePicture}
            />
            <View style={styles.usernameTextContainer}>
                <StyledText usernameText>{usuario}</StyledText>
            </View>
            <View style={styles.raitingContainer}>
                <CustomRating
                    defaultRating={rating}
                    readOnly={true}
                    maxRating={5}
                />
            <ProfileStats
                usuario={userdata}
                seguidores={seguidores}
                seguidos={seguidos}
                retos={retos}
                navigation={navigation}
                fromScreen={fromScreen}
            />
            </View>
            {!sessionUser && seguimientoVerificado &&
            <View>
                {!following ?
                    <TouchableOpacity disabled={isLoading} onPress={handleFollow} style = {styles.followButton}>
                        {isLoading ?
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        :
                            <Text style={styles.followText}>Follow</Text>
                        }
                    </TouchableOpacity>
                    :
                    <TouchableOpacity disabled={isLoadingUnfollow} onPress={()=>{setIsVisible(true)}} style = {styles.followingButton}>
                        {isLoadingUnfollow ?
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        :
                            <Text style={styles.followingText}>Following</Text>
                        }
                    </TouchableOpacity>
                }
                {
                isVisible && (
                    <FollowerOptions
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        usuarioDelPerfil={usuario}
                        imageURL={imagenPerfilURL}
                        handleUnfollow={handleUnfollow}
                    />
                )}
            </View>
            }
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop:130,
        paddingBottom:19

    },
    closeStyleAlong:{
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
        marginTop:10,
        right:-175
    },
    raiting:{
        marginTop:20
    },
    optionsContainer: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-start',
        marginBottom:40,
    },
    profilePicture: {
        width: 120, // Ajusta el ancho como necesites
        height: 120, // Ajusta la altura como necesites
        borderRadius: 10000,
    },
    usernameTextContainer:{
        paddingTop:20,
        paddingBottom:7
    },
    raitingContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:7
    },
    menuStyle:{
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
        marginTop:10,
        paddingHorizontal:160
      },
      closeStyle:{
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 30,
        marginTop:10,
        paddingHorizontal:160
      },
      followButton:{
        paddingVertical:14,
        backgroundColor: '#4402b2', // Color de fondo del botón
        paddingHorizontal: 5,      // Espaciado horizontal dentro del botón
        borderRadius: 14,           // Bordes redondeados
        width:200,
        alignItems:'center',
        marginTop:30
      },
      followText:{
        color:"#e5e5e5",
        fontFamily:'Quicksand-bold'
      },
      followingButton:{
        paddingVertical:14,
        backgroundColor: "transparent", // Color de fondo del botón
        paddingVertical: 14,        // Espaciado vertical dentro del botón
        paddingHorizontal: 5,      // Espaciado horizontal dentro del botón
        borderRadius: 14,           // Bordes redondeados
        width:200,
        alignItems:'center',
        marginTop:30,
        borderWidth:1.2,
        borderColor:'#4402b2',
      },
      followingText:{
        color:'#4402b2',
        fontFamily:'Quicksand-bold'
      }

    });


export default ProfileUserInfo;