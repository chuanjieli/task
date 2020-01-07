import CryptoJS from 'crypto-js'

function getAesString (data, key, iv) { // 加密
  let keyd = CryptoJS.enc.Utf8.parse(key)
  let ivd = CryptoJS.enc.Utf8.parse(iv)
  var encrypted = CryptoJS.AES.encrypt(data, keyd,
    {
      iv: ivd,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
  return encrypted.toString() // 返回的是base64格式的密文
}
function getDAesString (encrypted, key, iv) { // 解密
  let keyd = CryptoJS.enc.Utf8.parse(key)
  let ivd = CryptoJS.enc.Utf8.parse(iv)
  var decrypted = CryptoJS.AES.decrypt(encrypted, keyd,
    {
      iv: ivd,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

function getAES (data) { // 加密
  var key = 'xsvUKTMHNUzkSwlBrERAfNxghFMEYI9p' // 密钥
  var iv = 'c9IATj7kAX1eML2H'
  var encrypted = getAesString(data, key, iv) // 密文
  //   var encrypted1 = CryptoJS.enc.Utf8.parse(encrypted)
  return encrypted
}

function getDAes (data) { // 解密
  var key = 'xsvUKTMHNUzkSwlBrERAfNxghFMEYI9p' // 密钥
  var iv = 'c9IATj7kAX1eML2H'
  var decryptedStr = getDAesString(data, key, iv)
  return decryptedStr
}
export default {
  getAES,
  getDAes
}
