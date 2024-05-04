import React, {useState, useEffect, useContext } from "react";
import * as SecureStore from 'expo-secure-store';


const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token,setToken] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [loading,setLoading] = useState(true);

    const loadToken = async ()=>{
        try {
            
            const credentials = await SecureStore.getItemAsync('userToken');
            const username = await SecureStore.getItemAsync('user');
            const profilePicture = await SecureStore.getItemAsync('profilePic');
            if (credentials && username) {
                setToken(credentials);
                setUser(username);
                setProfilePic(profilePicture);
            }
        } 
        catch (error) {
            console.error('Error al cargar el token:', error);
        }
        finally {
            setLoading(false);
        }
        };
    
    useEffect(() => {
        loadToken();
    }, []);
        
    const signIn = async (newToken, newUsername, newProfilePic) => {
        try{
            await SecureStore.setItemAsync('userToken', newToken);
            await SecureStore.setItemAsync('user', newUsername);
            await SecureStore.setItemAsync('profilePic', newProfilePic);
            setToken(newToken);
            setUser(newUsername);
            setProfilePic(newProfilePic);
        }
        catch(error){
            console.error('Error en sign-in',error)
        }
    }
    const signOut = async () => {
        try {
          await SecureStore.deleteItemAsync('userToken')
          await SecureStore.deleteItemAsync('user');
          await SecureStore.deleteItemAsync('profilePic');
          setToken(null);
          setUser(null);
          setProfilePic(null);
        }
        catch (error) {
            console.error('Error al borrar el token:', error);
        }
      };
    
      return (
        <AuthContext.Provider value={{user, token, profilePic, loading, signIn, signOut }}>
          {children}
        </AuthContext.Provider>
      );
};
    
export const useAuth = () => useContext(AuthContext);