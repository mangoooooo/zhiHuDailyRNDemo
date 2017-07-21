const api = {};

const request = ({url, params, type}) => {
    return fetch(url)
           .then((response) => response.json())
           .then((responseJson) => {
               return responseJson;
           })
           .catch((error) => {
               console.error(error);
           });
}

api.getHomeLatest = () => {
    return request({
        url: 'https://news-at.zhihu.com/api/4/news/latest',
    });
}

api.getDetail = (id) => {
    return request({
        url: 'https://news-at.zhihu.com/api/4/news/' + id,
    });
}

api.getThemeList = () => {
    return request({
        url: 'https://news-at.zhihu.com/api/4/themes',
    });
}

export default api;