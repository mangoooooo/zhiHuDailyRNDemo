import {
    Linking,
} from 'react-native';

export default {
    onMessage (event) {
        let params = JSON.parse(event.nativeEvent.data);

        if(params.type == 'openLink') {
            this.openLink(params.href)
        }
    },
    openLink (url) {
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                alert('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }
}