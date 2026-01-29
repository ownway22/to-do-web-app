# LocalStorage Schema：主題偏好

**功能**：002-dark-mode-toggle  
**日期**：2026-01-29

## 儲存結構

### 鍵：`todo-webapp-theme`

| 欄位 | 說明 |
|------|------|
| **鍵名** | `todo-webapp-theme` |
| **值類型** | `string` |
| **可能值** | `"light"` \| `"dark"` |
| **預設值** | 無（使用系統偏好或預設淺色） |

## 操作說明

### 讀取

```javascript
const theme = localStorage.getItem('todo-webapp-theme');
// 回傳: "light" | "dark" | null
```

### 寫入

```javascript
localStorage.setItem('todo-webapp-theme', 'dark');
```

### 刪除（重設為系統偏好）

```javascript
localStorage.removeItem('todo-webapp-theme');
```

## 錯誤處理

當 localStorage 不可用時（隱私模式、配額超過）：

```javascript
try {
    localStorage.setItem('todo-webapp-theme', theme);
} catch (e) {
    console.warn('無法儲存主題偏好:', e.message);
    // 繼續運作，但偏好不會被保存
}
```

## 與現有資料的關係

| 鍵 | 用途 | 資料結構 |
|---|------|---------|
| `todo-webapp-data` | 待辦事項資料 | `{ todos: [...] }` |
| `todo-webapp-theme` | 主題偏好 | `"light"` \| `"dark"` |

兩者獨立儲存，互不影響。

## 遷移說明

此為新增功能，無需遷移現有資料。

舊版使用者首次載入時：
1. `todo-webapp-theme` 不存在
2. 系統偵測 `prefers-color-scheme`
3. 套用對應主題
4. 使用者手動切換後才會寫入值
