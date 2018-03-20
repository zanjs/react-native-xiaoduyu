import Qiniu,{ Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu'


export const uploadFile = ({ name, imagePath, qiniu, callback })=>{

  Rpc.uploadFile(imagePath, qiniu.token, { key : name }).then((response) => {

    if (response.responseText) {
      let res = JSON.parse(response.responseText)
      let imageUrl = qiniu.url+'/'+res.key
      callback(100, imageUrl)
    }

  }).then((responseText) => {
    // console.log(responseText);
  }).catch((error) => {
    // console.warn(error);
  })

}
