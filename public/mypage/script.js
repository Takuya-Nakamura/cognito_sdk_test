$(document).ready(function () {
    console.log('🌟 mypage_ready ')
    
    // ページ読み込み時にユーザー情報を取得
    checkUserSession()
    
    // ログアウトボタンのクリックイベント
    $('#logout-btn').click(function () {
        console.log('🌟 logout_btn click')
        logoutUser()
    })
})

/**
 * ユーザーセッションをチェックし、ログイン状態に応じて表示を切り替える
 *.  (memo)
 *   getSessionで判断できる。localstorageにsdkが保存した情報で判断している様子。
 *   なので、js上でのログイン判定はgetSessionでも問題なさそう。
 *.  時前のサービスにログインしているかの判定は別に考える必要があるか..?
 */
function checkUserSession() {
    const cognitoUser = userPool.getCurrentUser()
    
    if (cognitoUser != null) {
        console.log('Current user found:', cognitoUser.getUsername())
        
        cognitoUser.getSession(function(err, session) {
            if (err) {
                console.log('Session error:', err)
                showNotLoggedIn()
                return
            }
            
            if (session.isValid()) {
                console.log('Valid session found')
                getUserAttributes(cognitoUser)
            } else {
                console.log('Invalid session')
                showNotLoggedIn()
            }
        })
    } else {
        console.log('No current user found')
        showNotLoggedIn()
    }
}

/**
 * ユーザー属性を取得して表示する
 */
function getUserAttributes(cognitoUser) {
    cognitoUser.getUserAttributes(function(err, attributes) {
        if (err) {
            console.log('Error getting user attributes:', err)
            showNotLoggedIn()
            return
        }
        
        console.log('User attributes:', attributes)
        
        // 属性を連想配列に変換
        const userInfo = {}
        attributes.forEach(function(attribute) {
            userInfo[attribute.getName()] = attribute.getValue()
        })
        
        // ユーザー情報を表示
        displayUserInfo(cognitoUser, userInfo)
    })
}

/**
 * ユーザー情報を画面に表示する
 */
function displayUserInfo(cognitoUser, userInfo) {
    // ローディングを非表示
    $('#loading').hide()
    
    // ユーザー情報エリアを表示
    $('#user-info').show()
    
    // 各項目に値を設定
    $('#user-name').text(userInfo['name'] || userInfo['preferred_username'] || cognitoUser.getUsername())
    $('#user-email').text(userInfo['email'] || '-')
    $('#email-verified').text(userInfo['email_verified'] === 'true' ? '認証済み' : '未認証')
        
    console.log('User info displayed successfully')
}

/**
 * ログインしていない状態の表示
 */
function showNotLoggedIn() {
    $('#loading').hide()
    $('#not-logged-in').show()
}

/**
 * ユーザーをログアウトする
 */
function logoutUser() {
    const cognitoUser = userPool.getCurrentUser()
    
    if (cognitoUser != null) {
        cognitoUser.signOut()
        console.log('User signed out successfully')
        alert('ログアウトしました')
        
        // サインインページにリダイレクト
        window.location.href = '../sign_in/'
    } else {
        console.log('No user to sign out')
        alert('ログインしていません')
        window.location.href = '../sign_in/'
    }
}
