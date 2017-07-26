import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableHighlight,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';

import api from '../api';
let iconfont = require('../style/iconfont');

export default class DrawerList extends Component {
    constructor(props){
       super(props)

       this.state = {
            items: [],
       }
    }

    componentWillMount() {}

    componentDidMount() {
        this.fetchList()
    }

    fetchList() {
        api.getThemeList().then(data => {
            this.setState({
                items: data.others,
            })
        })
    }

    _renderItem(item, index) {
        let TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
          TouchableElement = TouchableNativeFeedback;
        }

        return (
            <TouchableElement onPress={() => this.selectTheme(item)} key={index}>
                <View style={[styles.itemWrap, styles.itemWrap2]}>
                    <Text style={styles.itemText}>{item.name}</Text>
                    <Text style={[styles.icomoon, styles.iconAdd]}>&#xea0a;</Text>
                </View>
            </TouchableElement>
        );
    }

    selectTheme(item) {
        this.props.onTap('theme', item);
    }

    goSomewhere(nav) {
        this.props.onTap('other', nav);
    }

    render() {
        let TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
          TouchableElement = TouchableNativeFeedback;
        }
        return (
            <ScrollView>
                <View style={styles.headerWrap}>
                    <View style={styles.headerTitle}>
                        <Image style={styles.image} source={require('../assets/images/header.jpg')} />
                        <Text style={[styles.whiteText,styles.username]}>哩哩蒋</Text>
                    </View>
                    <View style={styles.headerFooter}>
                        <TouchableElement onPress={() => this.goSomewhere('Favorite')}>
                            <View style={styles.footerItem}>
                                <Text style={styles.icomoon}>&#xe9d9;</Text>
                                <Text style={styles.whiteText}>我的收藏</Text>
                            </View>
                        </TouchableElement>
                        <View style={styles.footerItem}>
                            <Text style={styles.icomoon}>&#xe9c7;</Text>
                            <Text style={styles.whiteText}>离线下载</Text>
                        </View>
                    </View>
                </View>
                <TouchableElement onPress={() => this.selectTheme({id: 0})}>
                    <View style={styles.itemWrap}>
                        <Text style={[styles.icomoon, styles.iconfont]}>&#xe901;</Text>
                        <Text style={styles.itemText}>首页</Text>
                    </View>
                </TouchableElement>
                {
                    this.state.items.map((item, index) =>
                        this._renderItem(item, index)
                    )
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
//    let themeColor = '#00a2ed';
    icomoon: {
        ...iconfont.iconfont,
        fontSize: 18
    },
    whiteText: {
        color: '#ffffff',
    },

    headerWrap: {
        backgroundColor: '#00a2ed',
    },
    headerTitle: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 40
    },
    username: {
        paddingLeft: 15,
        fontSize: 18,
    },

    headerFooter: {
        flexDirection: 'row',
        paddingBottom: 20,
    },
    footerItem: {
        flex: 1,
        flexDirection: 'row',
    },

    itemWrap: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center'
    },
    itemWrap2: {
        justifyContent: 'space-between',
    },
    iconfont: {
        color: '#000000',
        marginLeft: 0,
        fontSize: 20,
    },
    itemText: {
        color: '#000000',
        fontSize: 16,
    },
    iconAdd: {
        fontSize: 12,
        color: '#dddddd',
        width: 12,
        height: 12,
    }
});