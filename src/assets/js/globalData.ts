let globalData = {

}
export default {
  get: (key: string) => {
    return globalData[key]
  },
  set: (key: string, data: any) => {
    return globalData[key] = data
  }
}