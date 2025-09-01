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
