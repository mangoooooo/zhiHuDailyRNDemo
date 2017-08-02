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

    或者使用react-native-vector-icons这个库

#6. react-navigation 给按钮添加事件
    1. 会遇到state.params 为undefined的情况，解决：
        if(!state.params){
            state.params = {};
        }
    2.给header的按钮 onPress={state.params.viewMessage}     //  不能写成viewMessage()
    3.在组件生命周期中的mount钩子函数中绑定函数：、
        setParams({viewMessage: this.viewMessage});

#7. 兄弟组件间通信
    组件A: DeviceEventEmitter.emit(actionName, data);
    组件B: componentDidMount中：this.msgListener = DeviceEventEmitter.addListener(actionName, (data) => {})
           componentWillUnmount中：this.msgListener && this.msgListener.remove();

#8. FlatList
    1)  getItemLayout对性能优化来说很重要
        getItemLayout={(data, index) => (
          // 120 是被渲染 item 的高度 ITEM_HEIGHT。
          {length: 120, offset: 120 * index, index}
        )}