import React, {useState, useEffect, useContext } from "react";
import * as SecureStore from 'expo-secure-store';


const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {

    const [token,setToken] = useState(null);
    const [loading,setLoading] = useState(true);

    const loadToken = async ()=>{
        try {
            
            const credentials = await SecureStore.getItemAsync('userToken');
            if (credentials) {
                setToken(credentials);
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
        
    const signIn = async (newToken) => {
        try{
            await SecureStore.setItemAsync('userToken',newToken);
            setToken(newToken);
        }
        catch(error){
            console.error('Error en sign-in',error)
        }
    }
    const signOut = async () => {
        try {
          await SecureStore.deleteItemAsync('userToken')
          setToken(null);
        }
        catch (error) {
            console.error('Error al borrar el token:', error);
        }
      };
    
      return (
        <AuthContext.Provider value={{ token, loading, signIn, signOut }}>
          {children}
        </AuthContext.Provider>
      );
};
    
export const useAuth = () => useContext(AuthContext);