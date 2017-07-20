#1.  报错Expected a component class,got [Object Object ]
    原因： 引入组件的时候首字母没有大写
    正确写法：   import NewsItem from './newsItem';
                <NewsItem item={item} />

#2. css shadow
    shadowOffset这一套只适用于ios，
    android有个elevation，但是功能很局限，
    装个插件

#3. this 作用域问题
    尽量使用箭头函数：onPress={() => this.itemTap()}
    goDetail = (item) => {
            const { navigate } = this.props.navigation;
            navigate('NewsDetail', { id: item.id })
        }

#4. WebView
    onLoadEnd={this.injectJs} 不能  onLoadEnd={this.injectJs()}

#5. iconfont的引入和使用-android
    1)  将ttf文件放入Android/app/src/main/assets/fonts 目录下
    2)  使用：
        <Text style={{fontFamily: 'icomoon'}}>&#xe901;</Text>
        或
        let text = '\ue901';
        <Text style={{fontFamily: 'icomoon'}}>{text}</Text>