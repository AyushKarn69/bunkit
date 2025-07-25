
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { BlurView } from 'expo-blur';

// Use the same background image as LoginScreen
const backgroundImage = require('../asset/loginbg.jpg');

const BACKEND_URL = 'http://192.168.29.69:8081/api/extract-timetable'; // Change to your IP

const extractTimetableData = async (fileUri, prompt) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const fileName = fileInfo.uri.split('/').pop();
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'application/pdf',
    });
    formData.append('prompt', prompt);

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to extract timetable data');
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error('extractTimetableData error:', err);
    throw err;
  }
};


const UploadPDFScreen = () => {
  const [semester, setSemester] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load saved semester PDF on mount
  useEffect(() => {
    const loadSavedPDF = async () => {
      const stored = await AsyncStorage.getItem('semesterPDF');
      if (stored) {
        setSemester(JSON.parse(stored));
      }
    };
    loadSavedPDF();
  }, []);

  const pickSemesterPDF = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: false,
    });

    if (result.type === 'success') {
      try {
        const fileName = `semester_${Date.now()}.pdf`;
        const destPath = FileSystem.documentDirectory + fileName;
        await FileSystem.copyAsync({ from: result.uri, to: destPath });

        const fileInfo = {
          ...result,
          localUri: destPath,
          name: result.name || fileName,
        };

        console.log('Picked file info:', fileInfo);

        setSemester(fileInfo);
        await AsyncStorage.setItem('semesterPDF', JSON.stringify(fileInfo));
        Alert.alert('Success', `Semester PDF "${fileInfo.name}" uploaded.`);
      } catch (err) {
        console.error('Error handling PDF:', err);
        Alert.alert('Error', 'Failed to process PDF.');
      }
    }
  };

  const sendPDFToBackend = async () => {
    if (!semester) {
      Alert.alert('Error', 'Please upload the Semester PDF.');
      return;
    }

    const prompt = `Extract a list of all subjects, the total number of classes for each subject, and the timing of each subject's class in a week from this semester PDF. This PDF has two parts: the timetable and the monthly calendar. Return the result as an array of objects: [{ subject, totalClasses, timings: [day, startTime, endTime] }]`;

    setLoading(true);
    try {
      const semData = await extractTimetableData(semester.localUri, prompt);
      console.log('Semester data:', semData);
      Alert.alert('Success', 'PDF processed and data extracted.');
    } catch (err) {
      Alert.alert('Extraction Error', 'Failed to extract data from PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <BlurView intensity={116} style={styles.blurContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Upload Semester PDF</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickSemesterPDF}
            activeOpacity={0.7}
          >
            <Text style={styles.uploadButtonText}>Upload Semester PDF</Text>
          </TouchableOpacity>
          {semester && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Semester PDF</Text>
              <Text style={styles.cardText}>
                PDF Name: {getPDFName(semester)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.processButton,
              { backgroundColor: semester ? '#007AFF' : '#d3d3d3', opacity: loading ? 0.7 : 1 },
            ]}
            onPress={sendPDFToBackend}
            disabled={!semester || loading}
            activeOpacity={0.7}
          >
            <Text style={styles.processButtonText}>
              {loading ? 'Processing...' : 'Process PDF'}
            </Text>
            {loading && <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />}
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
    marginBottom: 120,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    width: '90%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
  },
  processButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default UploadPDFScreen;
