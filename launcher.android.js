import React, { Component } from 'react';
import {
  AppRegistry,
  DrawerLayoutAndroid,
  View,
  Text,
} from 'react-native';

import {App} from './app/app.js'
import DrawerList from './app/component/drawerList.js'
import {StackNavigator} from 'react-navigation';

//import home from './app/page/home/home.js';
//import newsDetail from './app/page/detail/detail.js';
//
//const App = StackNavigator({
//    Home: {screen: home},
//    NewsDetail: {screen: newsDetail}
//});



class RootApp extends Component {
    mainView = null;

    constructor(props){
       super(props)

       this.state = {
         isLoading: true,
       }
    }

    _renderNavigationView() {
        return (
          <DrawerList onTap={(item) => {this.goTheme(item)}}/>
        );
    }

    goTheme(item) {
//        alert(this.mainView)
//        this.mainView.navigate('NewsDetail', { id: item.id })
    }

    render() {
        return (
            <DrawerLayoutAndroid drawerWidth={300}
                                 drawerPosition={DrawerLayoutAndroid.positions.Left}
                                 renderNavigationView={this._renderNavigationView.bind(this)}
                                 keyboardDismissMode="on-drag">
                <App ref={(mainView) => {this.mainView = mainView}} />
            </DrawerLayoutAndroid>
        );
    }
}


AppRegistry.registerComponent('zhiHuDailyRNDemo', () => RootApp);