# sessionStorage Schema：使用者登入工作階段

**功能分支**：`003-user-login`
**建立日期**：2026-02-09

## 總覽

本功能新增一筆 `sessionStorage` 項目來管理使用者的登入工作階段狀態。此儲存與現有的 `localStorage` 項目（待辦資料和主題偏好）完全獨立。

## 儲存項目

### `todo-webapp-session`

| 屬性         | 說明                  |
| ------------ | --------------------- |
| **儲存類型** | `sessionStorage`      |
| **鍵名**     | `todo-webapp-session` |
| **值型別**   | `string`              |
| **有效值**   | `"authenticated"`     |
| **未設定時** | `null`（鍵不存在）    |

### 操作

| 操作     | 方法                                                             | 時機                   |
| -------- | ---------------------------------------------------------------- | ---------------------- |
| 寫入     | `sessionStorage.setItem("todo-webapp-session", "authenticated")` | 登入驗證成功時         |
| 讀取     | `sessionStorage.getItem("todo-webapp-session")`                  | 頁面載入時檢查驗證狀態 |
| 刪除     | `sessionStorage.removeItem("todo-webapp-session")`               | 使用者點擊登出按鈕時   |
| 自動清除 | 由瀏覽器處理                                                     | 關閉分頁時             |

### 驗證邏輯

```
讀取值 = sessionStorage.getItem("todo-webapp-session")
已驗證 = (讀取值 === "authenticated")
```

## 與現有 localStorage 項目的關係

| 鍵名                  | 儲存類型           | 用途                 | 本功能是否變動 |
| --------------------- | ------------------ | -------------------- | -------------- |
| `todo-webapp-data`    | localStorage       | 待辦事項資料         | 否             |
| `todo-webapp-theme`   | localStorage       | 深色/淺色主題偏好    | 否             |
| `todo-webapp-session` | **sessionStorage** | **登入工作階段狀態** | **新增**       |

## 命名慣例

遵循現有命名模式 `todo-webapp-{用途}`：

- `todo-webapp-data`（既有）
- `todo-webapp-theme`（既有）
- `todo-webapp-session`（新增）
