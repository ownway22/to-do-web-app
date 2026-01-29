# localStorage 契約：待辦事項網頁應用

**日期**：2026-01-29  
**功能**：001-todo-webapp

## 概述

此專案為純前端應用，不使用後端 API。本文件定義 localStorage 資料結構作為「契約」，確保資料格式一致性。

## 儲存鍵值

| 鍵值 | 用途 | 類型 |
|------|------|------|
| `todo-webapp-data` | 儲存所有待辦事項 | JSON 字串 |

## 資料結構 Schema

### TodoData

```typescript
interface TodoData {
  todos: Todo[];
}

interface Todo {
  id: string;           // 唯一識別碼，格式：時間戳記字串
  text: string;         // 待辦事項內容，1-100 字元
  completed: boolean;   // 完成狀態
  createdAt: number;    // Unix 毫秒時間戳記
}
```

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "todos": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "唯一識別碼"
          },
          "text": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100,
            "description": "待辦事項內容"
          },
          "completed": {
            "type": "boolean",
            "description": "完成狀態"
          },
          "createdAt": {
            "type": "number",
            "description": "建立時間戳記（Unix 毫秒）"
          }
        },
        "required": ["id", "text", "completed", "createdAt"]
      }
    }
  },
  "required": ["todos"]
}
```

## 操作契約

### 讀取（Read）

```javascript
/**
 * 讀取所有待辦事項
 * @returns {Todo[]} 待辦事項陣列
 */
function loadTodos() {
  const data = localStorage.getItem('todo-webapp-data');
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return parsed.todos || [];
  } catch (e) {
    console.error('資料解析失敗，初始化為空陣列');
    return [];
  }
}
```

### 寫入（Write）

```javascript
/**
 * 儲存所有待辦事項
 * @param {Todo[]} todos 待辦事項陣列
 */
function saveTodos(todos) {
  localStorage.setItem('todo-webapp-data', JSON.stringify({ todos }));
}
```

## 範例資料

### 空狀態

```json
{
  "todos": []
}
```

### 包含資料

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

## 版本相容性

- 目前版本：1.0
- 未來若需變更結構，應在 TodoData 中加入 `version` 欄位
- 載入時檢查版本並執行必要的資料遷移
