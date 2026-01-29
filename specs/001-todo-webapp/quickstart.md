# 快速入門：待辦事項網頁應用

**日期**：2026-01-29  
**功能**：001-todo-webapp

## 環境需求

- Python 3.11+ （用於啟動開發伺服器）
- 現代瀏覽器（Chrome、Firefox、Safari、Edge 最近兩個主要版本）

## 專案結構

```
src/
├── index.html           # 主頁面
├── css/
│   └── styles.css       # 樣式表
├── js/
│   └── app.js           # 應用程式邏輯
└── server.py            # Python 開發伺服器
```

## 快速開始

### 1. 啟動開發伺服器

```bash
cd src
python server.py
```

或使用 Python 內建模組：

```bash
cd src
python -m http.server 8000
```

### 2. 開啟瀏覽器

訪問 http://localhost:8000

## 開發指南

### 檔案職責

| 檔案 | 職責 |
|------|------|
| `index.html` | 頁面結構、語義化標籤、無障礙屬性 |
| `css/styles.css` | 視覺樣式、響應式設計、動畫效果 |
| `js/app.js` | CRUD 邏輯、localStorage 管理、事件處理 |
| `server.py` | 提供靜態檔案服務 |

### 命名慣例

- CSS 類別：使用 kebab-case（例如 `todo-item`、`btn-primary`）
- JavaScript：使用 camelCase（例如 `todoList`、`handleSubmit`）
- HTML ID：使用 kebab-case（例如 `todo-input`、`todo-list`）

### 測試方法

1. **手動功能測試**：依照規格的驗收情境逐一測試
2. **響應式測試**：使用瀏覽器開發者工具切換裝置模式
3. **無障礙測試**：
   - 安裝 axe DevTools 瀏覽器擴充功能
   - 使用 WAVE 線上工具檢測
   - 使用鍵盤完整操作應用程式

## 功能驗收清單

### P1 功能（核心）

- [ ] 新增待辦事項
  - [ ] 輸入文字後按新增按鈕
  - [ ] 按 Enter 鍵新增
  - [ ] 空白內容顯示提示
  - [ ] 100 字元限制
- [ ] 查看清單
  - [ ] 顯示所有項目
  - [ ] 未完成在上、已完成在下
  - [ ] 新項目顯示在最上方
  - [ ] 空狀態提示
- [ ] 標記完成狀態
  - [ ] 點擊切換狀態
  - [ ] 視覺區別已完成項目
  - [ ] 鍵盤操作（Space/Enter）

### P2 功能（次要）

- [ ] 編輯待辦事項
  - [ ] 點擊編輯按鈕進入編輯模式
  - [ ] 儲存變更
  - [ ] 取消/Escape 恢復原狀
  - [ ] 空白內容阻止儲存
- [ ] 刪除待辦事項
  - [ ] 確認提示
  - [ ] 確認後刪除
  - [ ] 取消保留

### 非功能需求

- [ ] 響應式設計（320px 以上）
- [ ] 無障礙標準（WCAG 2.1 AA）
- [ ] 鍵盤完整操作
- [ ] 資料持久化（重新整理後保留）
- [ ] 繁體中文介面

## 疑難排解

### localStorage 無法使用

**症狀**：資料在重新整理後消失

**可能原因**：
1. 使用 `file://` 協定開啟（部分瀏覽器限制）
2. 瀏覽器隱私模式
3. 儲存空間已滿

**解決方案**：
1. 使用開發伺服器（http://localhost:8000）
2. 關閉隱私模式
3. 清除其他網站的 localStorage

### Python 伺服器無法啟動

**症狀**：`Address already in use`

**解決方案**：
```bash
# 使用其他埠號
python -m http.server 8080
```
