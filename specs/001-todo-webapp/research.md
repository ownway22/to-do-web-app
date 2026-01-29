# 研究：待辦事項網頁應用

**日期**：2026-01-29  
**功能**：001-todo-webapp

## 技術決策

### 1. 後端技術：Python http.server

**決策**：使用 Python 內建的 `http.server` 模組作為開發伺服器

**理由**：
- 使用者指定使用 Python
- 此專案為純靜態網頁應用，不需要後端業務邏輯
- Python `http.server` 是內建模組，無需安裝額外套件
- 足以滿足開發和本地測試需求

**考慮的替代方案**：
- Flask/FastAPI：過度工程，此專案不需要 API 端點
- Node.js http-server：使用者指定 Python
- 直接開啟 HTML 檔案：部分瀏覽器對 localStorage 有 file:// 協定限制

### 2. 前端技術：原生 HTML/CSS/JavaScript

**決策**：使用原生技術，不引入前端框架

**理由**：
- 規格要求 HTML/CSS/JS 分離到獨立檔案
- 功能簡單（CRUD），原生 JavaScript 完全足夠
- 無需建構工具，降低複雜度
- 更好的效能和載入速度

**考慮的替代方案**：
- React/Vue/Angular：過度工程，增加不必要的複雜度
- jQuery：現代瀏覽器原生 API 已足夠，無需額外依賴
- TypeScript：增加建構步驟，此規模不需要

### 3. 資料儲存：localStorage

**決策**：使用瀏覽器 localStorage API

**理由**：
- 規格明確要求使用瀏覽器本地儲存
- 單一使用者設計，無需雲端同步
- 簡單可靠，無需後端資料庫
- 資料在瀏覽器關閉後仍然保留

**考慮的替代方案**：
- IndexedDB：功能過於強大，此專案不需要
- sessionStorage：資料會在瀏覽器關閉時清除，不符合需求
- 後端資料庫：增加複雜度，不符合規格

### 4. CSS 架構：原生 CSS + CSS 變數

**決策**：使用原生 CSS 搭配 CSS 自訂屬性（變數）

**理由**：
- 現代化設計可透過 CSS 變數實現主題化
- Flexbox/Grid 提供強大的響應式佈局能力
- 無需預處理器，保持簡單

**考慮的替代方案**：
- Tailwind CSS：需要建構工具
- SCSS/SASS：需要編譯步驟
- CSS 框架（Bootstrap）：增加檔案大小，降低自訂彈性

### 5. 無障礙實作策略

**決策**：採用語義化 HTML + ARIA 屬性 + 鍵盤事件處理

**理由**：
- 語義化標籤提供基本無障礙支援
- ARIA 屬性增強螢幕閱讀器體驗
- 完整的鍵盤操作支援（Tab、Enter、Space、Escape）

**實作重點**：
- 使用 `<main>`、`<section>`、`<article>`、`<button>` 等語義標籤
- 表單元素使用 `<label>` 關聯
- 互動元素加入適當的 `aria-label`
- 動態內容使用 `aria-live` 區域宣告變更

## 最佳實務

### JavaScript 模組化

- 使用模組模式或 ES6 模組組織程式碼
- 分離資料管理（TodoStore）與 UI 渲染（TodoRenderer）
- 事件處理採用事件委派模式，提升效能

### 響應式設計

- 行動優先（Mobile-first）設計方法
- 使用相對單位（rem、em、%）
- 斷點：320px（手機）、768px（平板）、1024px（桌面）

### localStorage 資料結構

- 使用 JSON 序列化儲存待辦事項陣列
- 每次操作後立即同步儲存
- 載入時處理可能的 JSON 解析錯誤

## 風險與緩解

| 風險 | 影響 | 緩解措施 |
|------|------|----------|
| localStorage 空間限制（約 5MB） | 低 - 100 字元/項目，可存 > 50,000 項 | 無需額外處理 |
| 瀏覽器不支援 localStorage | 低 - 現代瀏覽器皆支援 | 載入時檢查並顯示提示 |
| XSS 攻擊風險 | 中 | 使用 textContent 而非 innerHTML |
