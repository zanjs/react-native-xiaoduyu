import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native'

// import SimplePicker from 'react-native-simple-picker'
import ModalPicker from 'react-native-modal-picker-2'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchCountries } from '../../actions/countries'
import { getCountries } from '../../reducers/countries'

class SelectCountry extends Component {

  constructor (props) {
    super(props)
    this.state = {
      item: null
    }
  }

  componentWillMount() {

    const self = this
    const { onChoose } = this.props

    this.props.fetchCountries({
      callback: (res)=>{
        if (res && res.success) {
          onChoose(res.data[0])
          self.setState({ item: res.data[0] })
        }
      }
    })
  }

  render() {

    const self = this
    const { countries, onChoose } = this.props
    const { item } = this.state
    // const options = []

    // countries.map(item=>{ options.push(item.name + '' + item.code) })

    const data = []
    let index = 0

    countries.map(item=>{
      data.push({
        key: index++,
        label: item.name + '' + item.code
      })
    })

    return (<View>

      <ModalPicker
          data={data}
          initValue="Select something yummy!"
          onChange={(option)=>{
            self.setState({ item: countries[option.key] })
            onChoose(countries[option.key])
          }}>

          <View style={styles.select}>
          {item ? <Text style={styles.selectText}>{item.name + item.code}</Text> : null}
          {/*item ? <Image source={require('./images/select.png')} style={styles.selectIcon} /> : null*/}
          </View>

      </ModalPicker>

        {/*
        <TouchableOpacity onPress={()=>this.refs.picker.show()} style={styles.select}>
          {item ? <Text>{item.name + item.code}</Text> : null}
          {item ? <Image source={require('./images/select.png')} style={styles.selectIcon} /> : null}
        </TouchableOpacity>

        <SimplePicker
          ref={'picker'}
          options={options}
          confirmText="确定"
          cancelText="取消"
          buttonStyle={{ fontSize: 18, padding:10 }}
          onSubmit={(option) => {
            let index = options.indexOf(option)
            self.setState({ item: countries[index] })
            onChoose(countries[index])
          }}
        />
        */}

    </View>)
  }
}

const styles = StyleSheet.create({
  select: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#fff',
    padding:5,
    borderRadius:5
  },
  selectIcon: {
    width: 20,
    height: 20
  },
  selectText: {
    fontWeight: 'bold',
    color: '#0262a6'
  }
})

SelectCountry.defaultProps = {
  onChoose: (item)=>{ }
}

export default connect(
  (state, props) => {
    return {
      countries: getCountries(state)
    }
  },
  (dispatch, props) => ({
    fetchCountries: bindActionCreators(fetchCountries, dispatch)
  })
)(SelectCountry)
