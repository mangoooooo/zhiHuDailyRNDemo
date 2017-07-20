import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableHighlight,
    TouchableNativeFeedback,
    Platform
} from 'react-native';

export default class newsItem extends Component {
    constructor(props){
       super(props);
//       this.itemTap = this.itemTap.bind(this);
    }
    itemTap () {
        this.props.onTap();
    }

    render () {
        let image = null;
        let tips  = null;

        if (this.props.item.multipic) {
            tips = <View style={styles.tipsWrap}><Text style={styles.tips}>多图</Text></View>
        }
        if (this.props.item.images.length) {
            image = <View style={styles.imageWrap}>
                        <Image source={{uri: this.props.item.images[0]}} style={styles.itemImage} />
                        {tips}
                    </View>
        }

        let TouchableElement = TouchableHighlight;
        if (Platform.OS == 'android') {
            TouchableElement = TouchableNativeFeedback;
        }

        let content =
            <View>
                <TouchableElement onPress={() => this.itemTap()}>
                    <View style={styles.itemWrap}>
                        <Text numberOfLines={3} style={styles.itemTitle}>{this.props.item.title}</Text>
                        {image}
                    </View>
                </TouchableElement>
            </View>;


        return content;
    }
}

const styles = StyleSheet.create({
    imageWrap: {
        position: 'relative',
        height: 70,
        marginLeft: 10,
        width: 80,
    },
    itemWrap: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginVertical: 5,
        borderColor: '#dddddd',
        borderStyle: null,
        borderWidth: 0.5,
        borderRadius: 5,
        shadowOffset: { width:2, height:2 },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    itemTitle: {
        flex: 1,
        fontSize: 18,
        color: '#333333',
    },
    itemImage: {
        backgroundColor: '#dddddd',
        flex: 1,
    },
    tipsWrap: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 3,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'rgba(0,0,0,.5)',
    },
    tips: {
        color: '#ffffff',
        fontSize: 12,
    }
})