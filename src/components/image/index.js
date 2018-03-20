import React from 'react'
import { Image } from 'react-native'
import Dimensions from 'Dimensions'
const screenWidth = Dimensions.get('window').width
// const screenHeight = Dimensions.get('window').height

import Lightbox from 'react-native-lightbox'

class Img extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
    }
  }

  componentDidMount() {

    const self = this
    const { offset = 0 } = this.props

    Image.getSize(this.props.image, (width, height) => {

      if (width < screenWidth - offset) {
        self.setState({ width, height })
        return
      }

      height = (screenWidth - offset) * height / width; //按照屏幕宽度进行等比缩放

      if (!self._reactInternalInstance) return

      self.setState({
        width: screenWidth - offset,
        height
      })
    })
  }

  render() {
    return (
        <Image
          style={{width: this.state.width, height: this.state.height, marginTop: 5, marginBottom: 5 }}
          source={{uri: this.props.image}} />
    )
  }
}

export default Img
