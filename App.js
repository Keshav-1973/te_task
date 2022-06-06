//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomeComp from './Screens/HomeScreen';

// create a component
const App = () => {
  return (
    <View style={styles.container}>
      <HomeComp />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

//make this component available to the app
export default App;
