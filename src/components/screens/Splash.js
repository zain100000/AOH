import React, {useEffect} from 'react';
import {View, SafeAreaView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import '../../../FirebaseConfig';
import {firebase} from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          const userRef = firebase.database().ref('users').child(user.uid);

          userRef
            .once('value')
            .then(snapshot => {
              const userData = snapshot.val();
              if (userData) {
                const {role} = userData;
                switch (role) {
                  case 'user':
                    navigation.navigate('UserHome');
                    break;
                  case 'admin':
                    navigation.navigate('AdminHome');
                    break;
                  default:
                    console.log('Invalid role');
                }
              } else {
                console.log('User data not found');
              }
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
            });
        } else {
          navigation.navigate('Login');
        }
      });
      return unsubscribe;
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center">
        <View className="items-center">
          <Animatable.Image
            source={require('../../assets/logo.png')}
            animation={'fadeIn'}
            duration={1500}
            className="w-[300px] h-[300px] object-contain shadow-black mb-5"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Splash;
