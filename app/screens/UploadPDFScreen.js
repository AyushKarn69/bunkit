import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadPDFScreen = () => {
  const [timetable, setTimetable] = useState(null);
  const [calendar, setCalendar] = useState(null);

  const pickPDF = async (type) => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.type === 'success') {
      if (type === 'timetable') {
        setTimetable(result);
        await AsyncStorage.setItem('timetablePDF', JSON.stringify(result));
      } else {
        setCalendar(result);
        await AsyncStorage.setItem('calendarPDF', JSON.stringify(result));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload PDFs</Text>
      <Button title="Upload Timetable PDF" onPress={() => pickPDF('timetable')} />
      {timetable && <Text>Timetable: {timetable.name}</Text>}
      <Button title="Upload Calendar PDF" onPress={() => pickPDF('calendar')} />
      {calendar && <Text>Calendar: {calendar.name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    margin:20,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
});

export default UploadPDFScreen; 