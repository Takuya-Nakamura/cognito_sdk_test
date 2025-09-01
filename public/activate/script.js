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
