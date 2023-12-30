import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppointmentHistory from '../../screens/UserModule/AppointmentHistory';
import AppointmentForm from '../../screens/UserModule/AppointmentForm';
import '../../../../FirebaseConfig';
import auth from '@react-native-firebase/auth';

const Tab = createBottomTabNavigator();

const UserBottomNavigator = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      alert('Logout Successfully');
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarLabel: '',
        headerShown: true,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#908e8c',
        tabBarStyle: {
          height: 60,
          paddingTop: 5,
          backgroundColor: '#000',
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#fff',
          fontSize: 25,
          fontFamily: 'Montserrat-Medium',
        },
        headerStyle: {
          backgroundColor: '#0094D4',
          height: 60,
        },
      })}>
      <Tab.Screen
        options={{
          headerRight: () => {
            return (
              <View className="mr-[10px]">
                <TouchableOpacity onPress={handleLogout}>
                  <MaterialCommunityIcons
                    name="logout"
                    size={30}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            );
          },
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name={focused ? 'checkbook' : 'checkbook'}
              color={focused ? '#0094D4' : '#908e8c'}
              size={30}
            />
          ),
        }}
        name="Appointments"
        component={AppointmentForm}
      />

      <Tab.Screen
        options={{
          headerRight: () => {
            return (
              <View className="mr-[10px]">
                <TouchableOpacity onPress={handleLogout}>
                  <MaterialCommunityIcons
                    name="logout"
                    size={30}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            );
          },
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name={focused ? 'history' : 'history'}
              color={focused ? '#0094D4' : '#908e8c'}
              size={30}
            />
          ),
        }}
        name="Appointment History"
        component={AppointmentHistory}
      />
    </Tab.Navigator>
  );
};

export default UserBottomNavigator;
