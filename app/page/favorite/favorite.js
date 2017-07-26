import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Button,
    DeviceEventEmitter
} from 'react-native';
import {StackNavigator} from 'react-navigation';

import api from '../../api';
import NewsItem from '../home/newsItem';

const {width} = Dimensions.get('window');
let iconfont = require('../../style/iconfont');

export default class favorite extends Component {
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        if(!state.params){
            state.params = {};
        }

        const listLength = state.params && state.params.count || 0;

        return {
            title: listLength + '条收藏',
            headerLeft: (
                <TouchableOpacity onPress={state.params.openMenu} activeOpacity={1}>
                    <Text style={styles.icomoon}>&#xe9bd;</Text>
                </TouchableOpacity>
            ),
            headerStyle: {backgroundColor: '#00a2ed',},
            headerTitleStyle : {color: '#ffffff'},
        };
    };

    constructor(props){
       super(props)

       this.state = {
         isLoading: false,
         items: [],
       }
    }

    componentDidMount() {
        this.fetchList()
    }

    fetchList(theme) {
        this.setState({
            isLoading: true,
            items: []
        })


        api.getHomeLatest().then(data => {
            this.setState({
                isLoading: false,
                items: data.stories || [],
            })

            const { setParams, state } = this.props.navigation;
            setParams({
                count: data.stories && data.stories.length || 0,
            });
        });

    }

    goDetail = (item) => {
        const { navigate } = this.props.navigation;
        navigate('NewsDetail', { id: item.id })
    }

    _renderItem = ({item}) => {
        return (<NewsItem item={item} onTap={() => {this.goDetail(item)}} />)
    }

    render() {
        let content = this.state.isLoading ?
            (<View style={[styles.wrapper, styles.loading]}>
                <Text>正在加载...</Text>
            </View>) :
            (<View style={[styles.background, styles.wrapper]}>
                <ScrollView>
                    <FlatList
                      data={this.state.items}
                      renderItem={this._renderItem}
                    />
                </ScrollView>
            </View>);

        return content;
    }
}

const styles = StyleSheet.create({
    icomoon: {
        ...iconfont.iconfont,
    },
    wrapper: {
        flex: 1,
        position: 'relative',
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        backgroundColor: '#f3f3f3',
    },
})