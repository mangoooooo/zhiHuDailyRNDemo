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
import Swiper from 'react-native-swiper';

import api from '../../api';
import NewsItem from './newsItem';

const {width} = Dimensions.get('window');
let iconfont = require('../../style/iconfont');

export default class home extends Component {

    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        if(!state.params){
            state.params = {};
        }

        const headerTitle = state.params.theme && state.params.theme.name || '首页';      //  动态修改title

        return {
            title: headerTitle,
            headerLeft: (
                <TouchableOpacity onPress={state.params.openMenu} activeOpacity={1}>
                    <Text style={styles.icomoon}>&#xe9bd;</Text>
                </TouchableOpacity>
            ),
            headerStyle: {backgroundColor: '#00a2ed',},
            headerTitleStyle : {color: '#ffffff'},
            headerRight: (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={state.params.viewMessage} activeOpacity={1}>
                        <Text style={styles.icomoon}>&#xe96d;</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={state.params.viewMore} activeOpacity={1}>
                        <Text style={styles.icomoon}>&#xeaa3;</Text>
                    </TouchableOpacity>
                </View>

            )
        };
    };

    constructor(props){
       super(props)

       this.state = {
         isLoading: false,
         items: [],
         imageList: [],
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
        });
    }
    componentDidMount() {
        this.msgListener = DeviceEventEmitter.addListener('Drawer',(item) => {
                                this.selectTheme(item)
                           });

        this.fetchList(this.state.currentTheme)
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
    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate')
        return true
    }

    selectTheme(item) {
        this.setState({
            currentTheme: item,
        })

        const { setParams, state } = this.props.navigation;
        setParams({
            name: item.name,
            theme: item
        });

        this.fetchList(item)
    }

    fetchList(theme) {
        this.setState({
            isLoading: true,
            items: []
        })

        if (theme.id == 0) {    //  首页
            api.getHomeLatest().then(data => {
                console.log(data)
                this.setState({
                    isLoading: false,
                    imageList: data.top_stories || [],
                    items: data.stories || [],
                })
            });
        } else {    //  主题
            api.getThemeDetail(theme.id).then(data => {
                console.log(data.stories)
                this.setState({
                    isLoading: false,
                    items: data.stories || [],
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

    openMenu = () => {
        this.props.navigation.navigate('DrawerOpen')
    }

    viewMessage = () => {
        alert('ss');
    }

    viewMore = () => {
        alert('more');
    }

    render() {
        let content = this.state.isLoading ?
            (<View style={[styles.wrapper, styles.loading]}>
                <Text>正在加载...</Text>
            </View>) :
            (<View style={[styles.background, styles.wrapper]}>
                <ScrollView>
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
    }
})