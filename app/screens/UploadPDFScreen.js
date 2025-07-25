// Common issues and solutions for PDF upload in React Native

// 1. Missing getPDFName function - Add this helper function
const getPDFName = (fileInfo) => {
  return fileInfo?.name || fileInfo?.uri?.split('/').pop() || 'Unknown PDF';
};

// 2. Enhanced error handling for pickSemesterPDF
const pickSemesterPDF = async () => {
  try {
    console.log('Starting document picker...');
    
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: false,
    });

    console.log('Document picker result:', result);

    // Check for different result formats (older vs newer expo-document-picker versions)
    if (result.type === 'success' || (result.assets && result.assets.length > 0)) {
      try {
        // Handle different result formats
        const fileData = result.assets ? result.assets[0] : result;
        
        console.log('File data:', fileData);

        const fileName = `semester_${Date.now()}.pdf`;
        const destPath = FileSystem.documentDirectory + fileName;
        
        console.log('Copying file from:', fileData.uri, 'to:', destPath);
        
        await FileSystem.copyAsync({ from: fileData.uri, to: destPath });

        const fileInfo = {
          ...fileData,
          localUri: destPath,
          name: fileData.name || fileName,
        };

        console.log('Final file info:', fileInfo);

        setSemester(fileInfo);
        await AsyncStorage.setItem('semesterPDF', JSON.stringify(fileInfo));
        Alert.alert('Success', `Semester PDF "${fileInfo.name}" uploaded.`);
      } catch (err) {
        console.error('Error processing PDF:', err);
        Alert.alert('Error', `Failed to process PDF: ${err.message}`);
      }
    } else if (result.type === 'cancel') {
      console.log('User cancelled document picker');
    } else {
      console.log('Unknown result:', result);
      Alert.alert('Error', 'No file selected or unknown error occurred');
    }
  } catch (err) {
    console.error('Document picker error:', err);
    Alert.alert('Error', `Failed to open document picker: ${err.message}`);
  }
};

// 3. Check permissions (add to your component or separate permission handler)
import * as MediaLibrary from 'expo-media-library';

const checkPermissions = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant storage permissions to upload files.');
      return false;
    }
    return true;
  } catch (err) {
    console.error('Permission error:', err);
    return false;
  }
};

// 4. Enhanced sendPDFToBackend with better error handling
const sendPDFToBackend = async () => {
  if (!semester) {
    Alert.alert('Error', 'Please upload the Semester PDF.');
    return;
  }

  // Check if file still exists
  try {
    const fileExists = await FileSystem.getInfoAsync(semester.localUri);
    if (!fileExists.exists) {
      Alert.alert('Error', 'PDF file not found. Please upload again.');
      setSemester(null);
      await AsyncStorage.removeItem('semesterPDF');
      return;
    }
  } catch (err) {
    console.error('File check error:', err);
    Alert.alert('Error', 'Could not verify PDF file.');
    return;
  }

  const prompt = `Extract a list of all subjects, the total number of classes for each subject, and the timing of each subject's class in a week from this semester PDF. This PDF has two parts: the timetable and the monthly calendar. Return the result as an array of objects: [{ subject, totalClasses, timings: [day, startTime, endTime] }]`;

  setLoading(true);
  try {
    console.log('Sending PDF to backend:', semester.localUri);
    const semData = await extractTimetableData(semester.localUri, prompt);
    console.log('Semester data:', semData);
    Alert.alert('Success', 'PDF processed and data extracted.');
  } catch (err) {
    console.error('Backend error:', err);
    Alert.alert('Extraction Error', `Failed to extract data from PDF: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

// 5. Enhanced extractTimetableData with better error handling
const extractTimetableData = async (fileUri, prompt) => {
  try {
    console.log('Extracting data from:', fileUri);
    
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log('File info:', fileInfo);
    
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    const fileName = fileInfo.uri.split('/').pop();
    const formData = new FormData();
    
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: 'application/pdf',
    });
    formData.append('prompt', prompt);

    console.log('Sending request to:', BACKEND_URL);

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data.data;
  } catch (err) {
    console.error('extractTimetableData error:', err);
    throw err;
  }
};

// 6. Network connectivity check
import NetInfo from '@react-native-community/netinfo';

const checkNetworkConnection = async () => {
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    Alert.alert('No Internet', 'Please check your internet connection and try again.');
    return false;
  }
  return true;
};

// 7. Backend URL validation
const testBackendConnection = async () => {
  try {
    const response = await fetch(BACKEND_URL.replace('/api/extract-timetable', '/health'), {
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch (err) {
    console.error('Backend connection test failed:', err);
    return false;
  }
};