import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    ScrollView,
    WebView,
} from 'react-native';
import {StackNavigator} from 'react-navigation';

import api from '../../api';

const {width} = Dimensions.get('window');

export default class newsDetail extends Component {
    webview = null;

    static navigationOptions = {
        title: '详情',
    };
    constructor(props){
       super(props)

       this.state = {
         isLoading: true,
         info: null,
       }
    }
    componentDidMount() {
        this.fetchDetail()
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
                      }`;

        if (this.webview) {
            this.webview.injectJavaScript(script);
        }
    }

    onNavigationStateChange(data) {
        console.log(data)
    }
    onMessage(event) {
        let params = JSON.parse(event.nativeEvent.data);
        alert(params.type)
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
                                   onLoadEnd={this.injectJs}/>
                          <View style={styles.headerWrap}>
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
                           </View>
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