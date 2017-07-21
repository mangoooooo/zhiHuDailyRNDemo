import React, { Component } from 'react';
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
        navigate('NewsDetail', { id: item.id })
    }

    render() {
        return (
            <DrawerList onTap={(item) => {this.goTheme(item)}}/>
        );
    }
}