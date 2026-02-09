# 研究報告：使用者登入機制

**功能分支**：`003-user-login`
**建立日期**：2026-02-09
**輸入**：來自 `spec.md` 的功能需求 + 現有程式碼分析

## 1. 工作階段儲存：sessionStorage vs localStorage

**決策**：使用 `sessionStorage`，鍵名 `todo-webapp-session`，值為 `"authenticated"`。

**理由**：

- `sessionStorage` 範圍為單一分頁、單一來源（per-tab, per-origin）——頁面重新整理（F5）後保留，關閉分頁後清除。完全符合 FR-009。
- 應用已使用 `localStorage` 儲存待辦資料（`todo-webapp-data`）和主題（`todo-webapp-theme`）。使用 `sessionStorage` 儲存登入狀態可清楚區分：持久性使用者資料放 `localStorage`，臨時工作階段放 `sessionStorage`。
- 儲存簡單字串值 `"authenticated"`，`sessionStorage.getItem()` 未設定時回傳 `null`，用 `=== "authenticated"` 檢查既明確又安全。

**注意事項**：

- `sessionStorage` 不跨分頁共享。開新分頁需重新登入（符合規格）。
- 複製分頁（Ctrl+click / 「複製分頁」）在大多數瀏覽器中會複製 `sessionStorage`——工作階段會延續。此為可接受行為。

**考慮的替代方案**：

- `localStorage` 搭配旗標：關閉分頁後仍保留——違反 FR-009
- Session cookie：對純前端應用增加不必要複雜度
- JavaScript 記憶體變數：重新整理後即消失——違反 FR-009

## 2. 登入畫面與主畫面切換方式

**決策**：使用兩個並列的 `<div>` 區塊（登入畫面 + 現有 `.container`），透過 `<body>` 上的 CSS 類別 `authenticated` 切換顯示。預設狀態為登入畫面可見、主應用隱藏。

**理由**：

- 預設：`#login-screen` 可見，`.container` 為 `display: none`
- 設定 `body.authenticated` 後：`#login-screen` 變為 `display: none`，`.container` 顯示
- 這是最佳無障礙做法——`display: none` 會將元素從無障礙樹中移除，螢幕閱讀器不會讀取已隱藏的內容
- 在 `<body>` 上切換單一類別可將 JS 操作降到最低

**考慮的替代方案**：

- 透過 JS 設定行內 `style`：可行但難以維護
- `hidden` 屬性：類似 `display: none` 但不夠靈活（歡迎訊息的過渡效果需要更多控制）
- 分離的 HTML 頁面搭配重新導向：違反單頁應用架構

## 3. 憑證比對方式

**決策**：輸入值前後空白用 `.trim()` 去除。帳號比對不區分大小寫（`toLowerCase()`），密碼比對區分大小寫。使用嚴格等號（`===`）。

**理由**：

- 規格明確要求去除空白（FR-010），邊界情境確認 `" admin "` 應為有效
- 帳號不區分大小寫是標準使用者體驗——使用者不應因為大小寫鎖定（Caps Lock）開啟而登入失敗
- 密碼區分大小寫是普遍的安全慣例
- 使用統一錯誤訊息「帳號或密碼錯誤」（FR-005），避免洩漏哪一個欄位錯誤

**注意事項**：

- 憑證寫死在客戶端 JS 中，任何人都可透過開發者工具查看。這在規格中已被接受。不需要混淆處理。
- 僅去除前後空白，不去除字串內部空白

**考慮的替代方案**：

- 雜湊密碼：增加複雜度但無安全收益（比對邏輯和雜湊都在客戶端）
- 帳號區分大小寫：技術上更安全，但對個人工具的使用者體驗不佳

## 4. sessionStorage 瀏覽器支援

**決策**：`sessionStorage` 可安全使用，不需要 polyfill。

**理由**：

- `sessionStorage` 屬於 Web Storage API（HTML5），所有現代瀏覽器皆支援（Chrome 4+、Firefox 3.5+、Safari 4+、Edge 全版本）
- 全球支援率超過 98%
- 應用已使用 `localStorage`（同一 Web Storage API），若 `localStorage` 可用則 `sessionStorage` 必然可用
- 使用 `try/catch` 包裹以防安全性限制，與現有 `TodoStore.load()` 模式一致

## 5. 深色模式整合

**決策**：在登入檢查之前套用主題。ThemeManager 初始化應在頁面載入時立即執行，獨立於驗證狀態。

**理由**：

- 現有 `ThemeManager.init()` 從 `localStorage` 讀取主題並設定 `data-theme` 到 `<html>` 上。這是視覺偏好，不受驗證閘門限制。
- 若在登入檢查之後才套用主題，使用者會在登入畫面看到淺色模式閃1下的不良體驗（FOUC）。
- 登入畫面「免費」繼承深色模式——應用使用 `[data-theme="dark"]` 在 `:root` 層級定義 CSS 自訂屬性。登入畫面只要使用相同的 CSS 變數即可。
- 登入畫面不需要主題切換按鈕——按鈕在主應用 header 中，登入時已隱藏。

**執行順序**：

1. `ThemeManager.init()`（套用主題）
2. 檢查 `sessionStorage` 中的驗證狀態
3. 根據狀態顯示登入畫面或主畫面
