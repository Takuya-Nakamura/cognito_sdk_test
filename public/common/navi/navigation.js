/**
 * 共通ナビゲーション機能
 */

/**
 * ナビゲーションメニューを作成する関数
 * @param {string} currentPage - 現在のページ識別子 ('index', 'sign_up', 'activate')
 */
function createNavigation(currentPage = '') {
  // ナビゲーションのHTML構造を作成
  const nav = document.createElement('nav');
  nav.className = 'main-navigation';

  const navList = document.createElement('ul');

  // ナビゲーションアイテムの定義
  const navItems = [
    { id: 'index', label: 'ホーム', href: getRelativePath(currentPage, '') },
    { id: 'sign_in', label: 'サインイン', href: getRelativePath(currentPage, 'sign_in/') },
    { id: 'sign_up', label: '新規登録', href: getRelativePath(currentPage, 'sign_up/') },
    { id: 'activate', label: 'メール認証', href: getRelativePath(currentPage, 'activate/') },
    { id: 'resend', label: '認証コード再送', href: getRelativePath(currentPage, 'resend/') }
  ];

  // ナビゲーションアイテムを作成
  navItems.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    
    a.href = item.href;
    a.textContent = item.label;

    // 現在のページの場合はactiveクラスを追加
    if (item.id === currentPage) {
      a.classList.add('active');
    }

    li.appendChild(a);
    navList.appendChild(li);
  });

  nav.appendChild(navList);
  return nav;
}

/**
 * 現在のページから目的のページへの相対パスを取得
 * @param {string} currentPage - 現在のページ識別子
 * @param {string} targetPath - 目的のパス
 * @returns {string} 相対パス
 */
function getRelativePath(currentPage, targetPath) {
  switch (currentPage) {
    case 'index':
      return targetPath ? `./${targetPath}index.html` : './index.html';
    case 'sign_in':
    case 'sign_up':
    case 'activate':
    case 'resend':
      return targetPath === '' ? '../index.html' : `../${targetPath}index.html`;
    default:
      return targetPath ? `./${targetPath}index.html` : './index.html';
  }
}

/**
 * 現在のページを自動判定する関数
 * @returns {string} 現在のページ識別子
 */
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('/sign_in/')) {
    return 'sign_in';
  } else if (path.includes('/sign_up/')) {
    return 'sign_up';
  } else if (path.includes('/activate/')) {
    return 'activate';
  } else if (path.includes('/resend/')) {
    return 'resend';
  } else {
    return 'index';
  }
}

/**
 * ページ読み込み時にナビゲーションを挿入
 * @param {string} currentPage - 現在のページ識別子
 */
function initNavigation(currentPage) {
  document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const nav = createNavigation(currentPage);
    
    // bodyの最初の子要素として挿入
    if (body.firstChild) {
      body.insertBefore(nav, body.firstChild);
    } else {
      body.appendChild(nav);
    }
    
    // メインコンテンツが左側ナビゲーションに重ならないようにクラスを追加
    body.classList.add('has-navigation');
  });
}

// main
initNavigation(getCurrentPage());
