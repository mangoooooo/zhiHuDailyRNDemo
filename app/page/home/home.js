import React, { Component, PureComponent } from 'react';
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
import Swiper from 'react-native-swiper';

import api from '../../api';
import NewsItem from './newsItem';

const {width} = Dimensions.get('window');
let iconfont = require('../../style/iconfont');

export default class home extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        if(!state.params){
            state.params = {};
        }

        const headerTitle = state.params.theme && state.params.theme.name || '首页';      //  动态修改title
        const themeId     = state.params.theme && state.params.theme.id || 0;

        return {
            title: headerTitle,
            headerLeft: (
                <TouchableOpacity onPress={state.params.openMenu} activeOpacity={1}>
                    <Text style={styles.icomoon}>&#xe9bd;</Text>
                </TouchableOpacity>
            ),
            headerStyle: {backgroundColor: '#00a2ed',},
            headerTitleStyle : {color: '#ffffff'},
            headerRight: themeId == 0 ?
                (<View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={state.params.viewMessage} activeOpacity={1}>
                        <Text style={styles.icomoon}>&#xe96d;</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={state.params.viewMore} activeOpacity={1}>
                        <Text style={styles.icomoon}>&#xeaa3;</Text>
                    </TouchableOpacity>
                </View>) :
                (<View style={{flexDirection: 'row'}}>
                     <TouchableOpacity onPress={state.params.followTheme} activeOpacity={1}>
                         <Text style={styles.icomoon}>&#xe96d;</Text>
                     </TouchableOpacity>
                </View>)
        };
    };

    constructor(props){
       super(props)

       this.state = {
         isLoading: false,
         isRequesting: false,
         items: [],
         imageList: [],
         themeInfo: null,
         currentTheme: {
            id: 0,
            name: '首页'
         },
       }
    }
    componentWillMount() {
        const { setParams, state } = this.props.navigation;

        setParams({
            viewMessage: this.viewMessage,
            viewMore: this.viewMore,
            openMenu: this.openMenu,
            followTheme: this.followTheme,
        });
    }
    componentDidMount() {
        this.msgListener = DeviceEventEmitter.addListener('Drawer',(item) => {
                                this.selectTheme(item)
                           });

        this.loadFirstPage(this.state.currentTheme)
    }
    componentWillUpdate(nextProps, nextState) {
        console.log('componentWillUpdate')
    }
    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate')
    }
    componentWillUnmount() {
        console.log('componentWillUnmount')
        this.msgListener && this.msgListener.remove();
    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps')
    }
//    shouldComponentUpdate(nextProps, nextState) {     //  PureComponent 不能有
//        console.log('shouldComponentUpdate')
//        return true
//    }

    selectTheme(item) {
        this.setState({
            currentTheme: item,
        })

        const { setParams, state } = this.props.navigation;
        setParams({
            name: item.name,
            theme: item
        });

        this.loadFirstPage(item)
    }

    loadFirstPage (item) {
        this.setState({
            isLoading: true,
            items: []
        })

        this.fetchList(item)
    }

    fetchList(theme) {
        if (theme.id == 0) {    //  首页
            api.getHomeLatest().then(data => {
                this.setState({
                    isLoading: false,
                    isRequesting: false,
                    imageList: data.top_stories || [],
                    items: data.stories || [],
                })
            });
        } else {    //  主题
            api.getThemeDetail(theme.id).then(data => {
                this.setState({
                    isLoading: false,
                    isRequesting: false,
                    items: data.stories || [],
                    themeInfo: data
                })
            }, err => {
                alert('加载失败！')
            })
        }
    }

    goDetail = (item) => {
        const { navigate } = this.props.navigation;
        navigate('NewsDetail', { id: item.id })
    }

    _renderItem = ({item}) => {
        return (<NewsItem item={item} onTap={() => {this.goDetail(item)}} />)
    }

    _onRefresh = () => {
        this.setState({
            isRequesting: true,
        })

        this.fetchList(this.state.currentTheme)
    }

    _onEndReached = () => {
        alert('加载下一页')
    };

    _keyExtractor = (item, index) => {
        return item.id
    }

    _HomeHeader = () => {
        return (
            <View>
                <Swiper style={[styles.swiper]}
                        showsButtons={true}
                        width={width}
                        height={0.65 * width}
                        paginationStyle={{bottom: 10}}
                        dot={<View style={[styles.dot]} />}
                        activeDot={<View style={[styles.dot, styles.activedot]} />}
                        nextButton={<Text></Text>}
                        prevButton={<Text></Text>}>
                        {
                            this.state.imageList.map((item, i) =>
                                <View style={[styles.wrapper]} key={i}>
                                    <TouchableOpacity onPress={() => {this.goDetail(item)}} activeOpacity={1}>
                                        <Image source={{uri: item.image}} style={[styles.image]} />
                                        <View style={styles.titleWrap}>
                                            <Text style={styles.title}>{item.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                </Swiper>
                <Text style={[styles.grouptitle]}>今日热闻</Text>
            </View>
        )
    }

    _ThemeHeader = () => {
        return (
            <View>
                <View style={[{height: 0.65 * width, width: width, position: 'relative'}]}>
                    <Image source={{uri: this.state.themeInfo.background}} style={[styles.image]} />
                    <View style={styles.titleWrap}>
                        <Text style={styles.title}>{this.state.themeInfo.description}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', padding: 15, alignItems: 'center'}}>
                    <Text>主编</Text>
                    {
                        this.state.themeInfo.editors.map(item =>
                            <Image source={{uri: item.avatar}} style={[styles.avatar]} />
                        )
                    }
                </View>
            </View>
        )
    }


    openMenu = () => {
        this.props.navigation.navigate('DrawerOpen')
    }

    viewMessage = () => {
        alert('ss');
    }

    viewMore = () => {
        alert('more');
    }

    followTheme = () => {
        alert('follow');
    }

    render() {
        let content = this.state.isLoading ?
            (<View style={[styles.wrapper, styles.loading]}>
                <Text>正在加载...</Text>
            </View>) : this.state.currentTheme.id == 0 ?
            (<View style={[styles.background, styles.wrapper]}>
                    <FlatList
                        data={this.state.items}
                        renderItem={this._renderItem}
                        onRefresh={this._onRefresh}
                        onEndReached={this._onEndReached}
                        refreshing={this.state.isRequesting}
                        keyExtractor={this._keyExtractor}
                        ListHeaderComponent={this._HomeHeader}
                        onEndReachedThreshold={0.25}
                    />
            </View>) :
            (<View style={[styles.background, styles.wrapper]}>
                    <FlatList
                      data={this.state.items}
                      renderItem={this._renderItem}
                      onRefresh={this._onRefresh}
                      onEndReached={this._onEndReached}
                      refreshing={this.state.isRequesting}
                      keyExtractor={this._keyExtractor}
                      ListHeaderComponent={this._ThemeHeader}
                    />
            </View>);

        return content;
    }
}

const styles = StyleSheet.create({
    theme: {
//        color: '#ffffff',
        backgroundColor: '#00a2ed',
    },
    background: {
        backgroundColor: '#f3f3f3',
    },
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
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },

    swiper: {
    },
    image: {
        width: width,
        height: width * 0.65,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 7,
        marginLeft: 2,
        marginRight: 2,
        backgroundColor: 'rgba(255,255,255,.3)'
    },
    activedot: {
       backgroundColor: '#ffffff',
    },
    titleWrap: {
        width: width,
        height: width * 0.65,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,.2)'
    },
    title: {
        color: '#ffffff',
        fontSize: 22,
        position: 'absolute',
        bottom: 5,
        padding: 20,
        paddingRight: 40
    },

    grouptitle: {
        padding: 15
    },

    avatar: {
        width: 30,
        height: 30,
        borderRadius: 30,
        marginLeft: 15
    },
})