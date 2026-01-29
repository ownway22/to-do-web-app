# 快速開始：深色模式切換

**功能**：002-dark-mode-toggle  
**日期**：2026-01-29

## 概述

此功能為待辦事項應用程式新增深色模式切換按鈕，讓使用者可以在淺色與深色主題之間切換。

## 修改檔案

| 檔案 | 變更類型 | 說明 |
|------|---------|------|
| `src/index.html` | 修改 | 在標題區新增切換按鈕元素 |
| `src/css/styles.css` | 修改 | 新增深色模式 CSS 變數覆寫與按鈕樣式 |
| `src/js/app.js` | 修改 | 新增 ThemeManager 模組處理主題邏輯 |

## 實作順序

### 1. HTML：新增切換按鈕

在 `<header>` 區塊新增主題切換按鈕：

```html
<header class="header">
    <h1>📝 待辦事項</h1>
    <button 
        id="theme-toggle" 
        class="btn btn-icon theme-toggle" 
        aria-label="切換到深色模式"
        title="切換顏色模式"
    >🌙</button>
</header>
```

### 2. CSS：深色模式樣式

新增深色主題的 CSS 變數覆寫：

```css
/* 深色模式變數覆寫 */
[data-theme="dark"] {
    --color-bg: #111827;
    --color-bg-card: #1f2937;
    --color-text: #f9fafb;
    --color-text-secondary: #9ca3af;
    --color-text-muted: #6b7280;
    --color-border: #374151;
    --color-primary: #6366f1;
    --color-primary-light: #312e81;
    /* ... 其他顏色 */
}

/* 切換按鈕樣式 */
.theme-toggle {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.25rem;
    padding: var(--spacing-sm);
    min-width: 44px;
    min-height: 44px;
}
```

### 3. JavaScript：主題管理

新增 ThemeManager 模組：

```javascript
const ThemeManager = {
    STORAGE_KEY: 'todo-webapp-theme',
    
    init() {
        const saved = this.getSavedTheme();
        const theme = saved || this.getSystemPreference();
        this.applyTheme(theme);
        this.bindToggle();
    },
    
    getSavedTheme() {
        try {
            return localStorage.getItem(this.STORAGE_KEY);
        } catch (e) {
            return null;
        }
    },
    
    getSystemPreference() {
        if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    },
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateToggleButton(theme);
        this.saveTheme(theme);
    },
    
    // ... 其他方法
};
```

## 測試驗證

1. **手動切換**：點擊按鈕應立即切換主題
2. **偏好保存**：重新載入頁面應保持選擇的主題
3. **系統偏好**：清除 localStorage 後應遵循系統設定
4. **無障礙**：使用螢幕閱讀器驗證按鈕標籤

## 相關文件

- [功能規格](./spec.md)
- [資料模型](./data-model.md)
- [研究](./research.md)
- [LocalStorage Schema](./contracts/localstorage-schema.md)
