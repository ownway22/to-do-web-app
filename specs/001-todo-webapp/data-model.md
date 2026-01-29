# 資料模型：待辦事項網頁應用

**日期**：2026-01-29  
**功能**：001-todo-webapp

## 實體定義

### Todo（待辦事項）

代表使用者需要完成的一個任務。

| 屬性 | 類型 | 說明 | 約束 |
|------|------|------|------|
| `id` | string | 唯一識別碼 | 必填，使用 UUID 或時間戳記產生 |
| `text` | string | 待辦事項內容 | 必填，1-100 字元，不可為空白 |
| `completed` | boolean | 完成狀態 | 必填，預設為 `false` |
| `createdAt` | number | 建立時間戳記 | 必填，Unix 毫秒時間戳記 |

**範例**：
```json
{
  "id": "1706515200000",
  "text": "購買牛奶",
  "completed": false,
  "createdAt": 1706515200000
}
```

### TodoList（待辦事項清單）

待辦事項的集合，儲存於 localStorage。

| 屬性 | 類型 | 說明 |
|------|------|------|
| `todos` | Todo[] | 待辦事項陣列 |

**localStorage 鍵值**：`todo-webapp-data`

**範例**：
```json
{
  "todos": [
    {
      "id": "1706515200000",
      "text": "購買牛奶",
      "completed": false,
      "createdAt": 1706515200000
    },
    {
      "id": "1706515100000",
      "text": "繳電費",
      "completed": true,
      "createdAt": 1706515100000
    }
  ]
}
```

## 狀態轉換

### Todo 生命週期

```
┌─────────────┐
│  新增輸入   │
└──────┬──────┘
       │ 建立（completed=false）
       ▼
┌─────────────┐     標記完成      ┌─────────────┐
│   未完成    │ ◄──────────────► │   已完成    │
│ completed=  │    取消完成      │ completed=  │
│   false     │                   │   true      │
└──────┬──────┘                   └──────┬──────┘
       │                                  │
       │ 刪除（確認後）                    │ 刪除（確認後）
       ▼                                  ▼
┌─────────────┐                   ┌─────────────┐
│   已刪除    │                   │   已刪除    │
└─────────────┘                   └─────────────┘
```

## 排序規則

顯示時依照以下規則排序：

1. **分群**：未完成項目在上，已完成項目在下
2. **未完成項目排序**：按 `createdAt` 降序（最新在最上方）
3. **已完成項目排序**：按 `createdAt` 降序（最新完成的在最上方）

**排序演算法**：
```javascript
todos.sort((a, b) => {
  // 未完成優先於已完成
  if (a.completed !== b.completed) {
    return a.completed ? 1 : -1;
  }
  // 同狀態內按時間降序
  return b.createdAt - a.createdAt;
});
```

## 驗證規則

### 新增/編輯驗證

| 規則 | 說明 | 錯誤訊息 |
|------|------|----------|
| 非空白 | text.trim().length > 0 | 「請輸入待辦事項內容」 |
| 長度限制 | text.length <= 100 | 「內容不可超過 100 字元」 |

### 刪除驗證

| 規則 | 說明 |
|------|------|
| 確認提示 | 刪除前須顯示「確認刪除？」並取得使用者確認 |

## 資料持久化

### 儲存時機

- 新增待辦事項後
- 編輯待辦事項後
- 切換完成狀態後
- 刪除待辦事項後

### 儲存方法

```javascript
// 儲存
localStorage.setItem('todo-webapp-data', JSON.stringify({ todos }));

// 讀取
const data = JSON.parse(localStorage.getItem('todo-webapp-data') || '{"todos":[]}');
```

### 錯誤處理

- JSON 解析失敗時，初始化為空陣列
- localStorage 不可用時，顯示警告訊息但仍可操作（資料不持久化）
