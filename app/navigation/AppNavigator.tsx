import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import UploadPDFScreen from '../screens/UploadPDFScreen';
import HomeScreen from '../screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const checkPDFsUploaded = async () => {
  const timetable = await AsyncStorage.getItem('timetablePDF');
  const calendar = await AsyncStorage.getItem('calendarPDF');
  return timetable && calendar;
};

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="UploadPDF" component={UploadPDFScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 