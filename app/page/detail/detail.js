import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    ScrollView,
    WebView,
    Modal,
    TouchableOpacity,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import ImageViewer from 'react-native-image-zoom-viewer';

import api from '../../api';
import util from '../../util';

const {width, height} = Dimensions.get('window');
let iconfont = require('../../style/iconfont');

export default class newsDetail extends Component {
    webview = null;

    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        if(!state.params){
            state.params = {};
        }

        return {
            title: '',
            headerStyle: {backgroundColor: '#00a2ed'},
            headerTintColor : '#ffffff',
            headerRight:
                (<View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={state.params.viewMessage} activeOpacity={1}>
                        <Text style={styles.icomoon}>&#xea82;</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={state.params.viewMore} activeOpacity={1}>
                        <Text style={styles.icomoon}>&#xe9d9;</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={state.params.viewMore} activeOpacity={1}>
                        <Text style={styles.icomoon}>&#xe96d;</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={state.params.viewMore} activeOpacity={1}>
                        <Text style={styles.icomoon}>&#xea03;</Text>
                    </TouchableOpacity>
                </View>)
        };
    };

    constructor(props){
       super(props)

       this.state = {
         isLoading: true,
         info: null,
         modalShow: false,
         images: [],
       }
    }

    componentWillMount() {
        const { setParams, state } = this.props.navigation;

        setParams({
            viewMessage: this.viewMessage,
            viewMore: this.viewMore,
        });
    }

    componentDidMount() {
        this.fetchDetail()
    }

    viewMessage = () => {
            alert('ss');
        }

    viewMore = () => {
        alert('more');
    }

    fetchDetail() {
        const { params } = this.props.navigation.state;

        this.setState({
            isLoading: true,
        })

        api.getDetail(params.id).then(data => {
            this.setState({
                info: data,
                isLoading: false,
            })
        });
    }

    injectJs = () => {
        let script = `var a = document.querySelectorAll('a');
                      for(var i = 0; i < a.length; i++) {
                          a[i].addEventListener('click', function (event) {
                             event.preventDefault();

                             var params = {
                                type: 'openLink',
                                href: event.currentTarget.getAttribute('href'),
                             };
                             window.postMessage(JSON.stringify(params));
                          });
                      }
                      var imgs = document.querySelectorAll('img.content-image');
                      for(var i =0 ; i < imgs.length; i++) {
                          imgs[i].addEventListener('click', function (event) {
                              var params = {
                                  type: 'openImg',
                                  src: event.currentTarget.getAttribute('src'),
                              };
                              window.postMessage(JSON.stringify(params));
                          })
                      }
                      `;

        if (this.webview) {
            this.webview.injectJavaScript(script);
        }
    }

    onNavigationStateChange(data) {
        console.log(data)
    }

    onMessage = (event) => {
        let params = JSON.parse(event.nativeEvent.data);
        if(params.type == 'openImg') {
            var imgs = [];
            imgs.push({url: params.src});

            this.setState({
                modalShow: true,
                images:imgs
            });

            return true;
        }

        util.onMessage(event);
    }

    setModalVisible(visible) {
        this.setState({modalShow: visible});
    }

    render() {
        let content = '';
        if (this.state.isLoading) {
            content = <View style={[styles.wrapper, styles.loading]}>
                        <Text>正在加载...</Text>
                      </View>
        } else if (this.state.info) {
            let html = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"><link rel="stylesheet" type="text/css" href="'
                      + this.state.info.css[0]
                      + '" /></head><body>' + this.state.info.body
                      + '</body></html>';

            content = <View style={[styles.background, styles.wrapper]}>
                            <WebView source={{html: html}}
                                   style={styles.body}
                                   onMessage={this.onMessage}
                                   ref={(webview) => {this.webview = webview}}
                                   onLoadEnd={this.injectJs} />
                            {
                                this.state.info.image?
                                   (<View style={styles.headerWrap}>
                                       <Image source={{uri: this.state.info.image}} style={[styles.image]}>
                                           <View style={styles.imageTitleWrap}>
                                             <Text style={styles.imageTitle}>
                                               {this.state.info.image_source}
                                             </Text>
                                           </View>
                                       </Image>
                                       <View style={styles.titleWrap}>
                                           <Text style={styles.title}>{this.state.info.title}</Text>
                                       </View>
                                   </View>) : (<Text></Text>)
                            }

                            <Modal visible={this.state.modalShow}
                                   transparent={true}
                                   onRequestClose={() => {}}>
                                <ImageViewer imageUrls={this.state.images}
                                             onClick={() => { this.setModalVisible(false) }}/>
                            </Modal>
                      </View>
        } else {
            content = <View style={[styles.wrapper, styles.loading]}>
                        <Text>没有内容</Text>
                      </View>
        }

        return content;
    }
}

const styles = StyleSheet.create({
    theme: {
        color: '#ffffff',
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
//        position: 'relative',
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
    image: {
        width: width,
        height: width * 0.56,
    },


    headerWrap: {
        position: 'absolute',
        width: width,
        height: width * 0.56,
        top: 0,
    },
    titleWrap: {
        width: width,
        height: width * 0.56,
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    title: {
        color: '#ffffff',
        fontSize: 22,
        position: 'absolute',
        bottom: 10,
        padding: 15,
    },

    imageTitleWrap: {
        flex: 1,
        bottom: 5,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 5
    },
    imageTitle: {
        fontSize: 12,
        color: '#ffffff',
    },

    body: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        flex: 1,
    }
})