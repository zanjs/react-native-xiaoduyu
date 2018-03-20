
const onScroll = (callback) => {

  let hasCallback = false

  return (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const height = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    console.log(hasCallback);

    if (y + height >= contentHeight - 20 && !hasCallback) {
      console.log('111111');
      hasCallback = true
      callback(()=>{
      //   setTimeout(()=>{
      //     hasCallback = false
      //   }, 10000)
      })
    }
  }
}

export default onScroll
