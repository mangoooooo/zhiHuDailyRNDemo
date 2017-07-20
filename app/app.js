import React, { Component } from 'react';
import {View, StyleSheet} from 'react-native';
import {StackNavigator} from 'react-navigation';

import home from './page/home/home.js';
import newsDetail from './page/detail/detail.js';

const App = StackNavigator({
    Home: {screen: home},
    NewsDetail: {screen: newsDetail}
})

export default App;