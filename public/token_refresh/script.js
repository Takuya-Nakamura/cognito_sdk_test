$(document).ready(function () {
    console.log('🌟 token_refresh_ready ')

    // ページ読み込み時にトークン情報を取得
    loadTokenInfo()

    // トークン更新ボタンのクリックイベント
    $('#refresh-token-btn').click(function () {
        console.log('🌟 refresh_token_btn click')
        refreshTokens()
    })
})

/**
 * トークン情報を読み込んで表示する
 *. 
 */
function loadTokenInfo() {
    const cognitoUser = userPool.getCurrentUser()

    if (cognitoUser != null) {
        console.log('Current user found:', cognitoUser.getUsername())

        cognitoUser.getSession(function (err, session) {
            if (err) {
                console.log('Session error:', err)
                showNotLoggedIn()
                return
            }

            if (session.isValid()) {
                console.log('Valid session found')
                displayTokenInfo(session)
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
 * トークン情報を画面に表示する
 */
function displayTokenInfo(session) {
    // ローディングを非表示
    $('#loading').hide()

    // トークン情報エリアを表示
    $('#token-info').show()

    // Access Token
    const accessToken = session.getAccessToken()
    $('#access-token').text(accessToken.getJwtToken())

    const accessTokenExp = new Date(accessToken.getExpiration() * 1000)
    $('#access-token-exp').text(formatDateTime(accessTokenExp))

    const accessTokenStatus = isTokenExpired(accessToken.getExpiration()) ? 'expired' : 'valid'
    $('#access-token-status')
        .text(accessTokenStatus === 'valid' ? '有効' : '期限切れ')
        .removeClass('valid expired')
        .addClass(accessTokenStatus)

    // ID Token
    const idToken = session.getIdToken()
    $('#id-token').text(idToken.getJwtToken())

    const idTokenExp = new Date(idToken.getExpiration() * 1000)
    $('#id-token-exp').text(formatDateTime(idTokenExp))

    const idTokenStatus = isTokenExpired(idToken.getExpiration()) ? 'expired' : 'valid'
    $('#id-token-status')
        .text(idTokenStatus === 'valid' ? '有効' : '期限切れ')
        .removeClass('valid expired')
        .addClass(idTokenStatus)

    // Refresh Token
    const refreshToken = session.getRefreshToken()
    $('#refresh-token').text(refreshToken.getToken())

    // Refresh Tokenの有効期限を取得・表示
    const refreshTokenExp = getRefreshTokenExpiration(refreshToken.getToken())
    if (refreshTokenExp) {
        $('#refresh-token-exp').text(formatDateTime(refreshTokenExp))

        const refreshTokenStatus = isTokenExpiredByDate(refreshTokenExp) ? 'expired' : 'valid'
        $('#refresh-token-status')
            .text(refreshTokenStatus === 'valid' ? '有効' : '期限切れ')
            .removeClass('valid expired')
            .addClass(refreshTokenStatus)
    } else {
        $('#refresh-token-exp').text('取得できませんでした')
        $('#refresh-token-status')
            .text('不明')
            .removeClass('valid expired')
    }

    console.log('Token info displayed successfully')
}

/**
 * ログインしていない状態の表示
 */
function showNotLoggedIn() {
    $('#loading').hide()
    $('#not-logged-in').show()
}

/**
 * 日時をフォーマットする
 */
function formatDateTime(date) {
    if (!date || isNaN(date.getTime())) {
        return '-'
    }

    return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

/**
 * トークンが期限切れかどうかを判定する
 */
function isTokenExpired(expiration) {
    const now = Math.floor(Date.now() / 1000)
    return now >= expiration
}

/**
 * Refresh Tokenを使用してAccess TokenとID Tokenを更新する
 */
function refreshTokens() {
    const cognitoUser = userPool.getCurrentUser()

    if (!cognitoUser) {
        showRefreshResult('ユーザーが見つかりません', 'error')
        return
    }

    // ボタンを無効化
    $('#refresh-token-btn').prop('disabled', true).text('更新中...')

    /**
    getSession = 現在のユーザーのセッション情報（トークン類）を取得する
    accessToken / idToken の期限が切れていない場合 → そのまま返す
      •	期限が切れている場合
        • refreshToken が残っていれば、自動的にCognitoへリクエストして新しいトークンを発行
        • refreshToken も期限切れなら、セッションは無効になりエラー
     */
    cognitoUser.getSession(function (err, session) {
        if (err) {
            console.log('Session error:', err)
            showRefreshResult('セッションエラー: ' + err.message, 'error')
            resetRefreshButton()
            return
        }

        // Refresh Tokenを取得
        const refreshToken = session.getRefreshToken()

        // Refresh Tokenを使用してセッションを更新
        cognitoUser.refreshSession(refreshToken, function (err, newSession) {
            if (err) {
                console.log('Refresh error:', err)
                showRefreshResult('トークン更新エラー: ' + err.message, 'error')
                resetRefreshButton()
                return
            }

            console.log('Tokens refreshed successfully:', newSession)

            // 新しいトークンをCookieに保存（既存のサインイン処理と同様）
            document.cookie = 'accessToken=' + newSession.getAccessToken().getJwtToken()
            document.cookie = 'idToken=' + newSession.getIdToken().getJwtToken()
            document.cookie = 'refreshToken=' + newSession.getRefreshToken().getToken()

            // 画面を更新
            displayTokenInfo(newSession)

            showRefreshResult('トークンが正常に更新されました', 'success')
            resetRefreshButton()
        })
    })
}

/**
 * 更新結果を表示する
 */
function showRefreshResult(message, type) {
    $('#refresh-message')
        .text(message)
        .removeClass('success error')
        .addClass(type)

    $('#refresh-result').show()

    // 5秒後に結果を非表示にする
    setTimeout(function () {
        $('#refresh-result').hide()
    }, 5000)
}

/**
 * 更新ボタンを元の状態に戻す
 */
function resetRefreshButton() {
    $('#refresh-token-btn').prop('disabled', false).text('トークンを更新')
}

/**
 * Refresh Tokenの有効期限を取得する
 * Refresh TokenはJWTではないため、デコードできない場合があります
 * Cognitoの設定により通常30日間有効です
 */
function getRefreshTokenExpiration(refreshTokenString) {
    try {
        // Refresh TokenがJWT形式の場合はデコードを試行
        if (refreshTokenString && refreshTokenString.split('.').length === 3) {
            const payload = JSON.parse(atob(refreshTokenString.split('.')[1]))
            if (payload.exp) {
                return new Date(payload.exp * 1000)
            }
        }

    } catch (error) {
        console.log('Refresh token expiration parsing error:', error)

        // エラーの場合も30日後を推定値として返す
        const estimatedExp = new Date()
        estimatedExp.setDate(estimatedExp.getDate() + 30)
        return estimatedExp
    }
}

/**
 * 日付オブジェクトを使用してトークンが期限切れかどうかを判定する
 */
function isTokenExpiredByDate(expirationDate) {
    const now = new Date()
    return now >= expirationDate
}
