import React, { Component } from 'react';
import {StackNavigator, DrawerNavigator} from 'react-navigation';

import home from './page/home/home.js';
import newsDetail from './page/detail/detail.js';
import Drawer from './component/drawer.js';

const App = StackNavigator({
    Home: {screen: home},
    NewsDetail: {screen: newsDetail}
})

const RootApp = DrawerNavigator({
    Root: {screen: App,},
},{
    drawerWidth: 300, // 抽屉宽
    drawerPosition: 'left', // 抽屉在左边还是右边
    contentComponent: Drawer,  // 自定义抽屉组件
    contentOptions: {
        initialRouteName: App, // 默认页面组件
        activeTintColor: '#008AC9',  // 选中文字颜色
        activeBackgroundColor: '#f5f5f5', // 选中背景颜色
        inactiveTintColor: '#000',  // 未选中文字颜色
        inactiveBackgroundColor: '#fff', // 未选中背景颜色
        style: {  // 样式

        }
    }
});

export default RootApp;