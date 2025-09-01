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
  nav.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: 200px;
    height: 100vh;
    background-color: #f8f9fa;
    padding: 2rem 1rem;
    border-right: 1px solid #dee2e6;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    z-index: 1000;
  `;

  const navList = document.createElement('ul');
  navList.style.cssText = `
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `;

  // ナビゲーションアイテムの定義
  const navItems = [
    { id: 'index', label: 'ホーム', href: getRelativePath(currentPage, '') },
    { id: 'sign_up', label: '新規登録', href: getRelativePath(currentPage, 'sign_up/') },
    { id: 'activate', label: 'メール認証', href: getRelativePath(currentPage, 'activate/') }
  ];

  // ナビゲーションアイテムを作成
  navItems.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    
    a.href = item.href;
    a.textContent = item.label;
    a.style.cssText = `
      text-decoration: none;
      color: #007bff;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    `;

    // 現在のページの場合はスタイルを変更
    if (item.id === currentPage) {
      a.style.cssText += `
        background-color: #007bff;
        color: white;
      `;
    } else {
      // ホバー効果を追加
      a.addEventListener('mouseenter', function() {
        if (item.id !== currentPage) {
          this.style.backgroundColor = '#e9ecef';
        }
      });
      a.addEventListener('mouseleave', function() {
        if (item.id !== currentPage) {
          this.style.backgroundColor = 'transparent';
        }
      });
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
    case 'sign_up':
    case 'activate':
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
  if (path.includes('/sign_up/')) {
    return 'sign_up';
  } else if (path.includes('/activate/')) {
    return 'activate';
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
    
    // メインコンテンツが左側ナビゲーションに重ならないように左マージンを追加
    body.style.marginLeft = '220px';
    body.style.padding = '2rem';
  });
}

// 自動実行：ページ読み込み時に現在のページを判定してナビゲーションを初期化
initNavigation(getCurrentPage());
