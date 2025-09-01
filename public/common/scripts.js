/**
 * AWS Cognito 共通設定
 */

// Amazon Cognito 認証情報プロバイダーを初期化します
AWS.config.region = 'ap-northeast-1' // リージョンの指定
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1_ZUb9eZ874',//IDプールのID
})

// Amazon Cognito Userpoolとクライアントアプリの指定
let poolData = {
    UserPoolId: 'ap-northeast-1_ZUb9eZ874', //ユーザープールのID
    ClientId: '3iic3a54dpvujkoudvqqc846tm' //クライアントアプリの設定上のID
}

//ユーザープール＋クライアントアプリの情報を格納
let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
var cognitoUser = userPool.getCurrentUser()
console.log(cognitoUser)
