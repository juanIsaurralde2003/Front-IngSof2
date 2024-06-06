import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../components/AuthContext';
import { isLoading } from 'expo-font';

const InitScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const {token,dailyPost} = useAuth();
    useEffect(()=>{
        try{
            console.log(dailyPost);
            setLoading(true);
            if(token){
                  if(dailyPost){
                      navigation.navigate('feed')
                  }
                  else{
                      navigation.navigate('challenge')
                  }
              }
              else{
                  navigation.navigate('login')
            }
         }
         
        catch(error){
            console.error("InitScreen:error en el proceso de cargar credenciales ",error)
        }
        finally{
            setLoading(false);
        }
    },[token,dailyPost]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#390294" />
      </View>
    );
  }

  return null;
};

export default InitScreen;
