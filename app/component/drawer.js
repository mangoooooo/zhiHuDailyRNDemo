import React, { Component } from 'react';
import {
    DeviceEventEmitter
} from 'react-native';

import DrawerList from './drawerList.js';

export default class Drawer extends Component {

    constructor(props){
       super(props)

       this.state = {
         isLoading: true,
       }
    }

    goTheme(item) {
        const { navigate } = this.props.navigation;
        DeviceEventEmitter.emit('Drawer', item);
    }

    render() {
        return (
            <DrawerList onTap={(item) => {this.goTheme(item)}}/>
        );
    }
}