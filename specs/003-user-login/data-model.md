# 資料模型：使用者登入機制

**功能分支**：`003-user-login`
**建立日期**：2026-02-09

## 實體

### 1. 使用者憑證（UserCredentials）

固定的身分驗證資訊，寫死在應用程式碼中。

| 屬性     | 型別   | 說明 | 約束                                 |
| -------- | ------ | ---- | ------------------------------------ |
| username | string | 帳號 | 固定值 `"admin"`，比對時不區分大小寫 |
| password | string | 密碼 | 固定值 `"admin"`，比對時區分大小寫   |

**驗證規則**：

- 輸入值比對前去除前後空白（`.trim()`）
- 帳號比對：`input.trim().toLowerCase() === "admin"`
- 密碼比對：`input.trim() === "admin"`
- 帳號和密碼皆不可為空白

### 2. 工作階段狀態（SessionState）

代表使用者目前的驗證狀態，儲存於 `sessionStorage`。

| 屬性            | 儲存位置       | 鍵名                  | 值                          | 說明                                         |
| --------------- | -------------- | --------------------- | --------------------------- | -------------------------------------------- |
| isAuthenticated | sessionStorage | `todo-webapp-session` | `"authenticated"` 或 `null` | 已驗證時為字串值，未驗證時鍵不存在（`null`） |

**生命週期**：

- **建立**：登入成功時設定 `sessionStorage.setItem("todo-webapp-session", "authenticated")`
- **讀取**：頁面載入時檢查 `sessionStorage.getItem("todo-webapp-session") === "authenticated"`
- **刪除**：登出時執行 `sessionStorage.removeItem("todo-webapp-session")`
- **自動清除**：關閉瀏覽器分頁時由瀏覽器自動清除

### 3. 應用程式視圖狀態（ViewState）

代表目前顯示的畫面，透過 `<body>` 上的 CSS 類別控制。

| 狀態     | CSS 類別                            | 顯示的畫面                           |
| -------- | ----------------------------------- | ------------------------------------ |
| 未驗證   | `<body>`（無 `authenticated` 類別） | 登入畫面（`#login-screen`）          |
| 已驗證   | `<body class="authenticated">`      | 待辦事項主畫面（`.container`）       |
| 歡迎過渡 | `<body class="welcome">`            | 歡迎訊息（1-2 秒後自動切換至已驗證） |

## 關係圖

```
使用者輸入 → [驗證] → 工作階段狀態 → 視圖狀態
                ↓                       ↓
         比對固定憑證          控制 body CSS 類別
                ↓                       ↓
         成功/失敗           登入畫面 / 歡迎 / 主畫面
```

## 與現有資料的互動

| 現有資料     | 儲存位置                                 | 登入功能的影響                                   |
| ------------ | ---------------------------------------- | ------------------------------------------------ |
| 待辦事項資料 | `localStorage` (`todo-webapp-data`)      | 不影響。登入/登出不改變待辦資料。                |
| 主題偏好     | `localStorage` (`todo-webapp-theme`)     | 不影響。主題在登入檢查前套用，登入畫面自動跟隨。 |
| 登入工作階段 | `sessionStorage` (`todo-webapp-session`) | **新增**。獨立於既有儲存，不衝突。               |

## 狀態轉換

```
[頁面載入]
    │
    ├── sessionStorage 有 "authenticated"
    │   └── → 直接顯示主畫面（body.authenticated）
    │
    └── sessionStorage 無值
        └── → 顯示登入畫面
            │
            ├── 輸入正確 → 設定 sessionStorage → 顯示歡迎 → 1-2秒 → 主畫面
            │
            └── 輸入錯誤 → 顯示錯誤訊息 → 留在登入畫面
                          └── 密碼清空，帳號保留

[點擊登出]
    └── 移除 sessionStorage → 顯示登入畫面
```
