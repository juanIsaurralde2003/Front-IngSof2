import { useFonts } from '@expo-google-fonts/quicksand';
import React, { useEffect, useState } from 'react';
import { View, Text, useWindowDimensions, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import CustomRating from './Rating';
import StyledText from './StyledText';
import profilePicture from '../assets/profile_picture.png'

const ProfileComponent= ({ imagenURL, perfil, imagenPerfilURL, consigna, fecha, rating}) => {

    const { width } = useWindowDimensions();
    const [loadingImage, setLoadingImage] = useState(true);
    const [error, setError] = useState(false);

    let [fontsLoaded] = useFonts({
    'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    });

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

    useEffect(
        ()=>{
            console.log("El url de la pub es: " + imagenURL);
        }
    ,[imagenURL])


    if (!fontsLoaded) {
    return null; // Esperando a que se carguen las fuentes
    }

    return (
    <View style={[styles.container, { width: width }]}>
        <View style={styles.headerContainer}>
        <TouchableOpacity>
            <Image
            source = {(imagenPerfilURL !=='' ? {uri:"https://bucketeer-b382cbc0-b044-495d-a9ac-7722418d6f3f.s3.amazonaws.com/imagen1.png"} : profilePicture)}
            style={styles.profileImage}
            />
        </TouchableOpacity>
        <TouchableOpacity>
            <Text style={styles.userNameFeed}>
            {perfil}
            </Text>
        </TouchableOpacity>
        </View>
        <View style={{ width: width}}>
        <Image
            source={{uri:imagenURL}}
            style={{width: width, aspectRatio: 1}}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleLoadError}
            resizeMode='cover'
        />
        {loadingImage && (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="black" />
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
            <Text style={{fontFamily:'Quicksand-Bold'}}>Consigna: </Text>
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
    consignaContainer:{
        paddingLeft:15,
        paddingTop:17,

    },
    dateContainer:{
        paddingLeft:15,
        paddingTop:10,
    }
});

export default ProfileComponent;
