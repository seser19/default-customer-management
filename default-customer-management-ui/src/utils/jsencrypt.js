import {
  JSEncrypt
} from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2btwSXrhar7GGMDJxILgLi7UH
mY5FiljsoT+8FItrhTDzTsk84Wycmz2DGGqsQzhQc251TU0g0zW9LejRu25RJry1
3W3T7Cej3VHBOwDkCnfNQEV2q5INYIOPD/h18dHGTALWrgLCTTDdrBtlhjAxugse
D+KmpA/W6uNpvYrChwIDAQAB`

const privateKey = `MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALZu3BJeuFqvsYYw
MnEguAuLtQeZjkWKWOyhP7wUi2uFMPNOyTzhbJybPYMYaqxDOFBzbnVNTSDTNb0t
6NG7blEmvLXdbdPsJ6PdUcE7AOQKd81ARXarkg1gg48P+HXx0cZMAtauAsJNMN2s
G2WGMDG6Cx4P4qakD9bq42m9isKHAgMBAAECgYBb/1G5bcy35qu2SK3XQLGvGNfE
qloFlXu8cKBsX0vjf7osqElxCxizbNG7P1/j2M4YO+2y97VyXTBXY0RqJ4O8S1de
uQA7gE4vFGlphPGj039cnfqUYpJO7rqd0iUPfBEi8ZnRX8wgIRmXoydWA+EOX8B5
+AU6YBtJSBNElwvymQJBAPIXhP5PbP0lfWYNPK+EqIG89yxR0G11Adhw8QMc1iST
++ZQQzarKRkubwzXlg8SI33fajZFFCT8EaKcMuTFzQMCQQDA6e3Xhyf2LQuHNodk
hXPBCNqTZXmhvu8gWzWWqVbu9IkxXe9UcTcc5bop73BZfvEIqRUo/uoCSmSX0X/v
r5MtAkB7DMdVd8t+9DJDz9CbqgL4RrMfvMoDCKkSeX2XRm32E53C1+MCA4eVPAvH
7EBikqalkQxsXzo4/kJ8c4ZOz9c/AkEAlP7YFOOtiKQHyFnkPk4YNhoZf0gbpkIq
vInVnNSTcSFrKLbNVyHOGEKSAzuMQYMatL6quiwQHs7IXL2RG1U2zQJBALPOInrk
3rENVcYjBEwJJxMCV8ZDylAkGKXhJvlVm3u5sjJvJYyxQUQCpoU6+QstR0TacgsU
K7DKUtQiatMfGUc=`

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}
