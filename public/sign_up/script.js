// とりあえず自分のuser_poolでテスト
// Amazon Cognito 認証情報プロバイダーを初期化します
AWS.config.region = 'ap-northeast-1'; // リージョンの指定
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1_ZUb9eZ874',//IDプールのID
});

// Amazon Cognito Userpoolとクライアントアプリの指定
let poolData = {
    UserPoolId: 'ap-northeast-1_ZUb9eZ874', //ユーザープールのID
    ClientId: '7ch3km8lb2do33sqmhv1gmmic' //クライアントアプリの設定上のID
    // セキュリティ上の理由でClientSecretは削除
    // AWS Cognitoコンソールでクライアントアプリの「クライアントシークレットを生成」を無効にしてください
};

//ユーザープール＋クライアントアプリの情報を格納
let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();
console.log(cognitoUser);



$(document).ready(function () {
    // 新規登録
    $('#user_add_btn').click(function () {
        console.log('🌟🌟user_add_btn')

        //画面上の入力値であるメールアドレス＋パスワードを代入する
        username = $("#username").val();
        mailaddress = $("#mailaddress").val();
        password = $("#password").val();
        //バリデーション
        
        if (!username || !password || !mailaddress) {
            alert('入力されていない項目があります');
            return false;
        }
        var attributeList = [];
        // ユーザ属性リストの生成
        var dataName = {
            Name: "name",
            Value: username
        }
        var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
        attributeList.push(attributeName);

        // Cognito Identity JSライブラリを使用（SECRET_HASHなし）
        userPool.signUp(mailaddress, password, attributeList, null, function (err, result) {
            if (err) {
                console.log(err);
                alert('エラーが発生しました: ' + err.message);
            } else {
                console.log('サインアップ成功:', result);
                alert('サインアップが完了しました。確認メールをご確認ください。');
                // 成功した時の処理
                $('.register-form').fadeOut(200, function () {
                    $('.activation-form').fadeIn(300);
                });
                cognitoUser = result.user;
            }
        });
    });
})
