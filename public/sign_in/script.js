$(document).ready(function () {
    console.log('🌟 sign_in_ready ')

    // サインイン
    $('#sign_in_btn').click(function () {
        console.log('🌟 sign_in_btn click')

        // 画面上の入力値であるメールアドレス＋パスワードを代入する
        const email = $("#email").val()
        const password = $("#password").val()

        // バリデーション        
        if (!email || !password) {
            alert('メールアドレスとパスワードを入力してください')
            return
        }

        // Cognito認証データの設定
        const authenticationData = {
            Username: email,
            Password: password,
        }

        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)

        const userData = {
            Username: email,
            Pool: userPool
        }

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
        
        // 認証実行
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('サインイン成功:', result)
                alert('サインインに成功しました！')

                /*resultにはtoken関連の情報が含まれる。
                    accessToken: {jwtToken: 'eyJraWQiOiJSNEVNK29heDJTZG5JQjBGVVVlNStaUVZPZnlTeV…LYqONmoOsW4xdgktceTmZa0bY_B3Z5Arey1l6jBLWuPtJPPNg', payload: {…}}
                    idToken:  {jwtToken: 'eyJraWQiOiJSRHdKaHUrdmlna09ESkxOQjJvbjRIbTNpTTltWl…aAf-8uEzbO_IVZD9GNCsHqkzLuy8H975969A3QqR3VY-thnvg', payload: {…}}
                    refreshToken:  {token: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUl…BWQykiQIawknY2viPmObW8aSEn.UaAzKxAo5ldn06cXY08beg'}
                
                    memo: これらのtokenを何処に保存するか
                        - cookie/localstorageの場合はhttpOnly推奨。でないと悪意あるjsに弱い。
                          httponlyで設定する場合は、一旦サーバ側に渡す必要あり。
                        - そもそもブラウザ側に持たず、サーバーサイドに持つ方法もある。その場合cognitoからの情報取得以後はサーバーサイドで行う。
                */
                
                // とりあえずここでは、cookieに各tokenを保存しておく。これらのtokenがあることでログイン状態とする。
                document.cookie = 'accessToken=' + result.accessToken.jwtToken
                document.cookie = 'idToken=' + result.idToken.jwtToken
                document.cookie = 'refreshToken=' + result.refreshToken.token
                
                // またここでcognitoからユーザ情報を取得する
                cognitoUser.getUserAttributes(function (err, result) {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log('ユーザ情報:', result)
                    alert(result)
                })


            },

            onFailure: function (err) {
                console.log('サインインエラー:', err)
                alert('サインインに失敗しました: ' + err.message)
            },

            newPasswordRequired: function (userAttributes, requiredAttributes) {
                console.log('新しいパスワードが必要です')
                alert('初回ログインのため、新しいパスワードの設定が必要です')
                // 新しいパスワード設定の処理を実装する場合はここに追加
            }
        })
    })
})
