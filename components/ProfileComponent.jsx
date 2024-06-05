import { useFonts } from '@expo-google-fonts/quicksand';
import React, { useEffect, useState } from 'react';
import { View, Text, useWindowDimensions, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ActionSheetIOS, Platform } from 'react-native';
import CustomRating from './Rating';
import StyledText from './StyledText';
import { Ionicons } from '@expo/vector-icons';
import { SERVER } from '../utils/utils';
import { useAuth } from './AuthContext';

const ProfileComponent = ({ imagenURL, perfil, imagenPerfilURL, consigna, fecha, rating, getPosts }) => {

    const { width } = useWindowDimensions();
    const [loadingImage, setLoadingImage] = useState(true);
    const [error, setError] = useState(false);

    const {user, token} = useAuth();

    let [fontsLoaded] = useFonts({
        'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    });

    // const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

    // const convertDate = (date) => {
    //     let profileDate = '';
    //     let month = date.split('-')[1] - 1
    //     let day = date.split('-')[2]
    //     let year = date.split('-')[0]
    //     profileDate = months[month] + " " + day + ", " + year
    //     return profileDate;
    
    //   }

    const showActionSheet = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Eliminar publicación', 'Cancelar'],
                    cancelButtonIndex: 2,
                    destructiveButtonIndex: 1,
                },
                buttonIndex => {
                    if (buttonIndex === 0) {
                        handleDeletePost();
                    }
                }
            )
        } else {
            console.log('SHOW ACTION SHEET')
            showActionSheetWithOptions(
                {
                    options: ['Editar Perfil', 'Cerrar Sesión', 'Cancelar'],
                    cancelButtonIndex: 2,
                    destructiveButtonIndex: 1,
                },
                buttonIndex => {
                    if (buttonIndex === 0) {
                        navigation.navigate('EditProfile');
                    } else if (buttonIndex === 1) {
                        signOut();
                        navigation.navigate('login');
                    }
                }
            )
        }
    };

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

    const handleDeletePost = async () => {
        const url = `${SERVER}/posts/delete`;

        const data = {
            username: user,
          imageURL: imagenURL,
        }
    
        try {
          const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
    
          if (respuesta.ok) {
            console.log('borrado');
            getPosts();
    
    
          } else {
            console.error('Respuesta HTTP no exitosa:', respuesta.status);
    
          }
        } catch (error) {
          console.error('Error al realizar la solicitud:', error);
        }
        console.log('Delete')
    }

    useEffect(
        () => {
            console.log("El url de la pub es: " + imagenURL);
            console.log("La imagen de perfil es: " + imagenPerfilURL)
        }
        , [imagenURL])


    if (!fontsLoaded) {
        return null; // Esperando a que se carguen las fuentes
    }

    return (
        <View style={[styles.container, { width: width }]}>
            <View style={styles.headerContainer}>
                <TouchableOpacity>
                    {/* <Image
            source={imagenPerfilURL === '' ? { uri: "https://bucketeer-b382cbc0-b044-495d-a9ac-7722418d6f3f.s3.amazonaws.com/imagen1.png" } : { uri: imagenPerfilURL }}
            style={styles.profileImage}
            /> */}
                    {typeof imagenPerfilURL === "undefined" ?
                        <Image
                            source={require("../assets/person.jpg")}
                            style={styles.profileImage}
                        />
                        :
                        <Image
                            source={{ uri: imagenPerfilURL }}
                            style={styles.profileImage}
                        />
                    }
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.userNameFeed}>
                        {perfil}
                    </Text>
                </TouchableOpacity>
                {/* {
                    fecha===convertDate(new Date()) && ( */}
                        <View style={{ flex: 1, flexGrow: 1, flexDirection: 'row', alignContent: 'flex-end' }}>
                            <TouchableOpacity onPress={showActionSheet}>
                                <Ionicons name='ellipsis-vertical' size={24} color={'black'} />
                            </TouchableOpacity>
                        </View>
                    {/* )
                }; */}
            </View>
            <View style={{ width: width }}>
                <Image
                    source={{ uri: imagenURL }}
                    style={{ width: width, aspectRatio: 1 }}
                    onLoadStart={handleLoadStart}
                    onLoadEnd={handleLoadEnd}
                    onError={handleLoadError}
                    resizeMode='cover'
                />
                {loadingImage && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#390294" />
                    </View>
                )}
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={{ color: 'red' }}>No se pudo cargar la imagen</Text>
                    </View>
                )}
            </View>
            <View style={styles.ratingContainer}>
                <CustomRating
                    defaultRating={rating}
                    readOnly={true}
                    maxRating={5}
                />
            </View>
            <View style={styles.consignaContainer}>
                <StyledText consignaText>
                    <Text style={{ fontFamily: 'Quicksand-Bold' }}>Consigna: </Text>
                    {consigna}
                </StyledText>
            </View>
            <View style={styles.dateContainer}>
                <StyledText dateText>
                    {fecha}
                </StyledText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#e5e5e5',
        paddingVertical: 10,
    },
    headerContainer: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        width: '100%',
    },
    imageFeed: {
        width: 50,
        height: 50,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft: 5,
    },
    userNameFeed: {
        fontFamily: 'Quicksand-Regular',
        paddingHorizontal: 20,
        fontSize: 14,
        alignSelf: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingTop: 10,
    },
    consignaContainer: {
        paddingLeft: 15,
        paddingTop: 17,

    },
    dateContainer: {
        paddingLeft: 15,
        paddingTop: 10,
    }
});

export default ProfileComponent;
