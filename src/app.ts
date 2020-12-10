import { Component } from 'react'
import 'taro-ui/dist/style/index.scss' // 全局引入taro-ui
import './app.less'

class App extends Component {

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // this.props.children 是将要会渲染的页面
  render() {
    return (
      this.props.children
    )
  }
}

export default App
