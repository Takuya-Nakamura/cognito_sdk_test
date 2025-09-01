/**************
 * conf
 **************/
// とりあえず自分のuser_poolでテスト
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


/**************
 * main
 **************/
$(document).ready(function () {
    console.log('🌟 activate_ready ')
    $('#activation_button').click(function () {
        console.log('🌟 activation_button click')
        activate()

    })
})



// 認証処理
var activate = function () {
    var email = $("#activation_email").val()
    var activationCode = $("#activation_code").val()
    // 何か1つでも未入力の項目がある場合、処理を中断
    console.log(email, activationCode)
    if (!email | !activationCode) {
        return false
    }
    var userData = {
        Username: email,
        Pool: userPool
    }
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    // アクティベーション処理
    cognitoUser.confirmRegistration(activationCode, true, function (err, result) {
        if (err) {
            // アクティベーション失敗の場合、エラーメッセージを画面に表示
            if (err.message != null) {
                alert(err.message)
            }
        } else {
            // 成功
            alert('アクティベーションが成功しました。')

            // アクティベーション成功の場合、サインイン画面に遷移
            console.log('成功')
        }
    })
}
