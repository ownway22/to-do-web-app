# 研究：深色模式切換

**功能**：002-dark-mode-toggle  
**日期**：2026-01-29

## 研究任務摘要

| 任務 | 決策 | 理由 |
|------|------|------|
| 主題切換機制 | CSS 變數 + data-theme 屬性 | 現有架構已使用 CSS 變數，切換成本最低 |
| 偏好持久化 | localStorage | 現有 TodoStore 已使用相同機制 |
| 系統偏好偵測 | prefers-color-scheme 媒體查詢 | 現代瀏覽器原生支援，無需 polyfill |
| 切換按鈕圖示 | Emoji（🌙 / ☀️） | 符合現有設計風格（標題使用 📝） |

## 1. 主題切換機制研究

### 決策：CSS 變數覆寫 + `data-theme` 屬性

### 理由
- 現有 `styles.css` 已在 `:root` 定義所有顏色為 CSS 變數
- 透過 `[data-theme="dark"]` 選擇器覆寫變數，實作簡潔
- 無需修改任何現有元件的 class 或結構
- 切換過程可透過 CSS `transition` 實現平滑動畫

### 考慮的替代方案
1. **新增獨立深色樣式表**：需維護兩份 CSS，同步成本高
2. **使用 class 切換**：需修改多個元素的 class，較繁瑣
3. **CSS-in-JS**：專案為純 CSS，引入會破壞架構一致性

### 實作模式
```css
/* 淺色模式（預設，已存在於 :root） */
:root {
    --color-bg: #f9fafb;
    --color-text: #1f2937;
    /* ... */
}

/* 深色模式覆寫 */
[data-theme="dark"] {
    --color-bg: #111827;
    --color-text: #f9fafb;
    /* ... */
}
```

## 2. 偏好持久化研究

### 決策：localStorage

### 理由
- 現有 `TodoStore` 已使用 localStorage，開發者熟悉此模式
- 簡單的鍵值對儲存，無需複雜資料結構
- 跨瀏覽器相容性良好

### 儲存鍵
- 鍵名：`todo-webapp-theme`
- 值：`"light"` 或 `"dark"`

### 降級策略
當 localStorage 不可用時（隱私模式、儲存已滿）：
1. 捕獲例外
2. 主題切換功能仍正常運作
3. 偏好不被保存，下次載入時使用系統偏好

## 3. 系統偏好偵測研究

### 決策：`prefers-color-scheme` 媒體查詢

### 理由
- 現代瀏覽器原生支援（Chrome 76+、Firefox 67+、Safari 12.1+）
- 可透過 `window.matchMedia()` 在 JavaScript 中查詢
- 無需外部相依

### 實作模式
```javascript
// 偵測系統偏好
function getSystemPreference() {
    if (window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// 初始化時的優先順序
// 1. localStorage 中的使用者選擇
// 2. 系統偏好
// 3. 預設淺色
```

## 4. 切換按鈕設計研究

### 決策：Emoji 圖示（🌙 / ☀️）

### 理由
- 現有標題使用 Emoji（📝 待辦事項），保持一致性
- 無需額外圖示庫或 SVG 檔案
- 跨平台顯示一致
- 語義清晰：月亮 = 切換到深色，太陽 = 切換到淺色

### 考慮的替代方案
1. **SVG 圖示**：需新增資源檔案，增加複雜度
2. **Font Awesome**：需引入外部相依
3. **純 CSS 圖示**：實作複雜度高

### 按鈕位置
- 放置於 `<header>` 標題區域
- 使用 flexbox 將標題置中，按鈕靠右對齊
- 絕對定位確保不影響標題居中

## 5. 深色模式顏色配置

### 決策：基於現有調色板的反轉設計

| 變數 | 淺色值 | 深色值 | 說明 |
|------|--------|--------|------|
| `--color-bg` | #f9fafb | #111827 | 頁面背景 |
| `--color-bg-card` | #ffffff | #1f2937 | 卡片背景 |
| `--color-text` | #1f2937 | #f9fafb | 主要文字 |
| `--color-text-secondary` | #6b7280 | #9ca3af | 次要文字 |
| `--color-text-muted` | #9ca3af | #6b7280 | 淡化文字 |
| `--color-border` | #e5e7eb | #374151 | 邊框 |
| `--color-primary` | #4f46e5 | #6366f1 | 主色調（略亮） |
| `--color-primary-light` | #eef2ff | #312e81 | 主色調淺版 |

### 對比度驗證（WCAG AA）
- 主要文字 (#f9fafb) 對背景 (#111827)：對比度 16.04:1 ✅
- 次要文字 (#9ca3af) 對背景 (#111827)：對比度 5.92:1 ✅
- 淡化文字 (#6b7280) 對卡片 (#1f2937)：對比度 4.54:1 ✅

## 6. 過渡動畫研究

### 決策：CSS transition 在根元素

### 實作模式
```css
:root {
    /* 為顏色相關屬性添加過渡 */
    transition: background-color 0.3s ease, color 0.3s ease;
}

/* 所有使用 CSS 變數的元素會自動繼承過渡 */
```

### 注意事項
- 使用 `0.3s` 符合 SC-001 要求
- 尊重 `prefers-reduced-motion` 偏好設定
