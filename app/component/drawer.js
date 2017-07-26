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

    goSomewhere(type, item) {
        const { navigate } = this.props.navigation;
        if (type == 'theme') {
            DeviceEventEmitter.emit('Drawer', item);
        } else {
            navigate('Favorite')
        }
    }

    render() {
        return (
            <DrawerList onTap={(type, item) => {this.goSomewhere(type, item)}}/>
        );
    }
}