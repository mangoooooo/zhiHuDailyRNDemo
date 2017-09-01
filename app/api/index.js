const api = {};

const request = ({url, params, type}) => {
    return new Promise((resolve, reject) => {
        fetch(url)
           .then((response) => response.json())
           .then((responseJson) => {
               resolve(responseJson);
               // todo: 根据项目情况添加成功、失败判断
           })
           .catch((error) => {
               reject(error);
           });
    })
}

api.getHomeLatest = () => {
    return request({
        url: 'https://news-at.zhihu.com/api/4/news/latest',
    });
}

api.getHomeBefore = (datetime) => {
    return request({
        url: 'https://news-at.zhihu.com/api/4/news/before/' + datetime
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

api.getThemeDetail = (id) => {
    return request({
        url: 'https://news-at.zhihu.com/api/4/theme/' + id,
    });
}

export default api;