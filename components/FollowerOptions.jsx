import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet,Platform } from 'react-native';


const FollowerOptions = ({isVisible,setIsVisible, usuarioDelPerfil, imageURL}) => {
    const [width, setWidth] = useState(0); // Estado inicial para el ancho
    return(
        <View style={styles.bottomView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={()=>{setIsVisible(false)}}
            >
                <View style={styles.bottomView}>
                    <View 
                    onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setWidth(width);  // Actualizar el estado con el nuevo ancho
                    }}
                    style={styles.mainModalView}>
                        <Image
                            style={styles.profileImage}
                            source={{uri: imageURL}}
                        />
                        <Text style={styles.modalText}>El contenido de <Text style={{fontWeight:'bold'}}>{usuarioDelPerfil}</Text> no se mostrará en el feed</Text>
                        <View style={[styles.dividerContainer,{ width: '90%'}]}>
                            <View style={[styles.dividerLine, {width:'%50'}]} />
                        </View>
                        <TouchableOpacity
                            style={styles.unfollowButton} 
                            title="Unfollow"
                            onPress={() => setIsVisible(false)}
                        >
                            <Text style={styles.unfollowText}>Unfollow</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.secondaryModalView, { width: width }]}>
                        <TouchableOpacity
                            title="Cancel"
                            onPress={() => setIsVisible(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 22,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 22,
    },

    unfollowButton:{
        marginBottom:-10
    },
    
    unfollowText:{
        color:'#4402b2',
        fontSize:'18'
    },
      
    cancelText:{
        fontSize:'18'
    },
    mainModalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 30,
        paddingHorizontal:10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    
    secondaryModalView:{
        margin: 10,
        marginBottom:35,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical:20,
        width:400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginBottom:30
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#BDB0D0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
            },
            android: {
                elevation: 8,
            },
            web: {
                // Estilos específicos para web si los necesitas
            },
        }),
    }
  });

export default FollowerOptions