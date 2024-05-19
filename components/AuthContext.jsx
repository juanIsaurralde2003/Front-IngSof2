import React, { useState, useEffect, useContext } from "react";
import { Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dailyPost, setDailyPost] = useState(false);

    const loadUserInfo = async () => {
        try {
            const credentials = await SecureStore.getItemAsync('userToken');
            const username = await SecureStore.getItemAsync('user');
            const url = await SecureStore.getItemAsync('profilePicture');
            if (credentials && username && url) {
                setToken(credentials);
                setUser(username);
                setProfilePicture(url);
            }
        } catch (error) {
            console.error('Error al cargar la info del usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadDailyPost = async () => {
        try {
            const post = await SecureStore.getItemAsync('dailyPost');
            if (post) {
                if(post === 'true')
                    setDailyPost(true);
                else
                    setDailyPost(false)
            }
        } catch (error) {
            console.error('Error al cargar si se hizo daily post:', error);
        }
    };

    useEffect(() => {
        loadDailyPost();
    }, []);

    const setDailyPostDone = async (boolean) => {
        try {
            await SecureStore.setItemAsync('dailyPost', boolean.toString());
            setDailyPost(boolean);
        } catch (error) {
            console.error('Error en daily post done', error);
        }
    };

    const signIn = async (newToken, newUsername, newUrl) => {
        try {
            await SecureStore.setItemAsync('userToken', newToken);
            await SecureStore.setItemAsync('user', newUsername);

            console.log('Imprimo newUrl')
            console.log(newUrl);

            if (typeof newUrl !== "undefined") {
                console.log('Entro a not null');
                // Si la URL de la imagen no es null, la guardamos en SecureStore
                await SecureStore.setItemAsync('profilePicture', newUrl);
                setProfilePicture(newUrl);
            } else {
                console.log('Entro a null')
                // Si la URL de la imagen es null, guardamos la imagen predeterminada en SecureStore
                const defaultProfilePicture = require("../assets/person.jpg");
                console.log(defaultProfilePicture);
                const defaultUrl = Image.resolveAssetSource(require("../assets/person.jpg")).uri; // Obtenemos la URI de la imagen predeterminada
                console.log(defaultUrl)
                await SecureStore.setItemAsync('profilePicture', defaultUrl);
                setProfilePicture(defaultUrl);
            }
            setToken(newToken);
            setUser(newUsername);
        } catch (error) {
            console.error('Error en sign-in', error);
        }
    };

    const signOut = async () => {
        try {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('user');
            await SecureStore.deleteItemAsync('profilePicture');
            setToken(null);
            setUser(null);
            setProfilePicture(null);
        } catch (error) {
            console.error('Error al borrar el token:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, profilePicture, loading, signIn, signOut, dailyPost, setDailyPostDone }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
