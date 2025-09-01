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



$(document).ready(function () {
    console.log('🌟 sign_up_ready ')
    // 新規登録
    $('#user_add_btn').click(function () {
        console.log('🌟 user_add_btn click')
        //画面上の入力値であるメールアドレス＋パスワードを代入する
        userName = $("#user_name").val()
        email = $("#email").val()
        password = $("#password").val()
        //バリデーション        
        if (!userName || !password || !email) {
            alert('入力されていない項目があります')
            return
        }
        var attributeList = []
        // ユーザ属性リストの生成
        var dataName = {
            Name: "name",
            Value: userName
        }

        var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName)
        attributeList.push(attributeName)

        // Cognito Identity JSライブラリを使用（SECRET_HASHなし => 
        // cognitoのクライアント設定でsecret_hashが不要なsap用かmobile用を作成しておく）
        userPool.signUp(email, password, attributeList, null, function (err, result) {
            if (err) {
                console.log(err)
                alert('エラーが発生しました: ' + err.message)
            } else {
                console.log('サインアップ成功:', result)
                alert('サインアップが完了しました。確認メールをご確認ください。')
            }
        })
    })
})

