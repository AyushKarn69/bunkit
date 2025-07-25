import React, { useEffect } from 'react';
import { useFonts, Quicksand_400Regular } from '@expo-google-fonts/quicksand';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { BlurView } from 'expo-blur';
import {  Nunito_400Regular } from '@expo-google-fonts/nunito';
import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

// Replace with your actual image path
const backgroundImage = require('../asset/loginbg.jpg');

type RootStackParamList = {
  Login: undefined;
  UploadPDF: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { name, rollNo, setName, setRollNo } = useAuthStore();


  useEffect(() => {
    const checkPDFs = async () => {
      const timetable = await AsyncStorage.getItem('timetablePDF');
      const calendar = await AsyncStorage.getItem('calendarPDF');
      const storedName = await AsyncStorage.getItem('userName');
      const storedRollNo = await AsyncStorage.getItem('userRollNo');
      if (storedName) setName(storedName);
      if (storedRollNo) setRollNo(storedRollNo);
      if (timetable && calendar) {
        navigation.replace('Home');
      }
    };
    checkPDFs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, setName, setRollNo]);

  const handleProceed = async () => {
    if (name && rollNo) {
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userRollNo', rollNo);
      const timetable = await AsyncStorage.getItem('timetablePDF');
      const calendar = await AsyncStorage.getItem('calendarPDF');
      if (timetable && calendar) {
        navigation.replace('Home');
      } else {
        navigation.replace('UploadPDF');
      }
    }
  };
  
  const [fontsLoaded] = useFonts({ Quicksand_400Regular, Nunito_400Regular });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <BlurView intensity={16} style={styles.blurContainer}>
        <View style={styles.container}>
          <Text style={[styles.title, { fontFamily: 'Quicksand_400Regular' }]}>Login</Text>
          <TextInput
            style={[styles.input, { fontFamily: 'Nunito_400Regular' }]}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, { fontFamily: 'Nunito_400Regular' }]}
            placeholder="Roll Number"
            value={rollNo}
            onChangeText={setRollNo}
            autoCapitalize="characters"
          />
          <TouchableOpacity 
            style={[
              {
                backgroundColor:  !name || !rollNo ? '#7F7F7F' :  '#007AFF',
                paddingVertical: 12,
                paddingHorizontal: 32,
                borderRadius: 8,
                marginTop: 8,
                opacity: !name || !rollNo ? 0.5 : 1,
              },
            ]}
            onPress={handleProceed}
            disabled={!name || !rollNo}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontFamily: 'Nunito_400Regular',
                textAlign: 'center',
              }}
            >
              Proceed
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'rgba(253, 253, 253, 0.4)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom:120,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});

export default LoginScreen; 