import React from 'react'

const listContext = React.createContext({
  state: false,
  showCom: '',
  changeState(newVal?, com?) {
    this.state = newVal
  }
})
export {
  listContext,
}