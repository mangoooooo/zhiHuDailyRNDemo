const api = {};

api.getHomeLatest = () => {
    return fetch('https://news-at.zhihu.com/api/4/news/latest')
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.error(error);
        });
}

api.getDetail = (id) => {
    return fetch('https://news-at.zhihu.com/api/4/news/' + id)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.error(error);
        });
}

export default api;