import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './src/components/screens/Splash';
import Login from './src/components/screens/Login';
import Signup from './src/components/screens/Signup';
import UserBottomNavigator from './src/components/navigation/UserBottomNavigator/UserBottomNavigator';
import AdminBottomNavigator from './src/components/navigation/AdminBottomNavigator/AdminBottomNavigator';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="UserHome" component={UserBottomNavigator} />
        <Stack.Screen name="AdminHome" component={AdminBottomNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
