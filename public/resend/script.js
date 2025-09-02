/**************
 * main
 **************/
$(document).ready(function () {
    console.log('🌟 resend_ready ')
    $('#resend_button').click(function () {
        console.log('🌟 resend_button click')
        resendCode()
    })
})

async function resendCode() {
    const email = $("#resend_email").val()
    
    // メールアドレスが未入力の場合、処理を中断
    if (!email) {
        alert('メールアドレスを入力してください。')
        return false
    }
    
    try {        
        // 認証コード再送処理を直接実行
        const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
        const user = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool,
        })

        const result = await new Promise((resolve, reject) => {
            user.resendConfirmationCode((err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
        
        alert('確認コードを再送しました。メールをご確認ください。')
                
    } catch (e) {
        console.error(e)
        alert(`再送に失敗: ${e.code || ''} ${e.message || e}`)
    } 
}
