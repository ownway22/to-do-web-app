# 任務：深色模式切換

**輸入**：來自 `/specs/002-dark-mode-toggle/` 的設計文件  
**先決條件**：plan.md ✅、spec.md ✅、research.md ✅、data-model.md ✅、contracts/ ✅

**測試**：此功能規格未要求自動化測試，採用手動驗證。

**組織方式**：任務依使用者故事分組，以便每個故事可獨立實作與測試。

## 格式：`[ID] [P?] [Story] 描述`

- **[P]**：可平行執行（不同檔案、無相依性）
- **[Story]**：此任務所屬的使用者故事（US1、US2、US3）
- 描述中包含確切的檔案路徑

## 路徑慣例

此為單一網頁應用程式：
- `src/index.html` - HTML 結構
- `src/css/styles.css` - 樣式表
- `src/js/app.js` - 應用程式邏輯

---

## 階段 1：設置

**目的**：確認現有架構與準備工作

- [X] T001 確認 src/css/styles.css 中的 CSS 變數架構可支援主題覆寫
- [X] T002 確認 src/js/app.js 中的 localStorage 存取模式

---

## 階段 2：基礎建設

**目的**：建立深色模式的 CSS 變數覆寫基礎

**⚠️ 重要**：此階段完成前不可開始任何使用者故事工作

- [X] T003 在 src/css/styles.css 新增 `[data-theme="dark"]` 選擇器的完整顏色變數覆寫
- [X] T004 在 src/css/styles.css 為顏色過渡新增 transition 效果（符合 SC-001 的 0.3 秒要求）
- [X] T005 在 src/css/styles.css 新增 `.theme-toggle` 按鈕樣式（符合 SC-004 的 44x44px 觸控目標）

**檢查點**：CSS 基礎建設就緒——現在可以開始使用者故事實作

---

## 階段 3：使用者故事 1+3 - 切換深色模式與按鈕視覺識別（優先順序：P1）🎯 最小可行產品 (MVP)

**目標**：使用者可透過標題區的切換按鈕即時切換淺色/深色主題

**獨立測試**：點擊按鈕驗證所有介面元素顏色切換，按鈕圖示相應變化

> **備註**：使用者故事 1（切換功能）與使用者故事 3（按鈕視覺）高度耦合，合併為單一階段實作

### HTML 結構

- [X] T006 [US1][US3] 在 src/index.html 的 `<header>` 區塊新增主題切換按鈕元素
- [X] T007 [US1][US3] 修改 src/index.html 的 `.header` 結構以容納切換按鈕（flexbox 佈局）

### CSS 樣式

- [X] T008 [US3] 在 src/css/styles.css 調整 `.header` 樣式為相對定位佈局
- [X] T009 [P] [US3] 在 src/css/styles.css 新增深色模式下的 `.theme-toggle` 按鈕樣式

### JavaScript 邏輯

- [X] T010 [US1] 在 src/js/app.js 新增 ThemeManager 物件的基礎結構
- [X] T011 [US1] 在 src/js/app.js 實作 `ThemeManager.applyTheme(theme)` 方法（設定 data-theme 屬性）
- [X] T012 [US1] 在 src/js/app.js 實作 `ThemeManager.toggle()` 方法（切換主題狀態）
- [X] T013 [US1][US3] 在 src/js/app.js 實作 `ThemeManager.updateToggleButton(theme)` 方法（更新按鈕圖示與 aria-label）
- [X] T014 [US1] 在 src/js/app.js 實作 `ThemeManager.bindToggle()` 方法（綁定按鈕點擊事件）
- [X] T015 [US1] 在 src/js/app.js 的應用程式初始化流程中呼叫 ThemeManager

**檢查點**：此時使用者可點擊按鈕切換主題，按鈕圖示會相應變化（🌙 ↔ ☀️）

---

## 階段 4：使用者故事 2 - 記住使用者偏好（優先順序：P2）

**目標**：主題偏好保存於 localStorage，頁面重新載入後自動套用

**獨立測試**：切換主題後重新載入頁面，驗證主題設定被保留

### localStorage 整合

- [X] T016 [US2] 在 src/js/app.js 實作 `ThemeManager.saveTheme(theme)` 方法（寫入 localStorage）
- [X] T017 [US2] 在 src/js/app.js 實作 `ThemeManager.getSavedTheme()` 方法（讀取 localStorage）
- [X] T018 [US2] 在 src/js/app.js 新增 localStorage 錯誤處理（try-catch 包裝）

### 系統偏好偵測

- [X] T019 [US2] 在 src/js/app.js 實作 `ThemeManager.getSystemPreference()` 方法（使用 prefers-color-scheme）
- [X] T020 [US2] 在 src/js/app.js 實作 `ThemeManager.init()` 方法（整合優先順序邏輯：localStorage → 系統偏好 → 預設淺色）

### 整合

- [X] T021 [US2] 更新 src/js/app.js 的 `applyTheme()` 方法以呼叫 `saveTheme()`
- [X] T022 [US2] 更新 src/js/app.js 的應用程式初始化改為呼叫 `ThemeManager.init()`

**檢查點**：此時主題偏好會被保存，首次使用時會偵測系統偏好

---

## 階段 5：收尾與跨切面關注點

**目的**：驗證、最佳化與文件

- [X] T023 手動驗證所有 FR-006 列出的元件在深色模式下顏色正確對應
- [X] T024 驗證 WCAG AA 對比度標準（SC-002：文字與背景至少 4.5:1）
- [X] T025 驗證響應式設計：行動裝置上的觸控目標尺寸（SC-004：44x44px）
- [X] T026 驗證螢幕閱讀器體驗（SC-005：aria-label 正確宣告）
- [X] T027 驗證 prefers-reduced-motion 媒體查詢生效時過渡效果被禁用
- [X] T028 執行 quickstart.md 中的測試驗證流程

---

## 相依性與執行順序

### 階段相依性

```
階段 1（設置）
    │
    ▼
階段 2（基礎建設：CSS 變數覆寫）
    │
    ├─────────────────────────────────┐
    ▼                                 ▼
階段 3（US1+US3：切換功能與按鈕）    （可平行但建議先完成 US1+US3）
    │
    ▼
階段 4（US2：偏好持久化）
    │
    ▼
階段 5（收尾）
```

### 使用者故事相依性

- **使用者故事 1+3（P1）**：可在階段 2 完成後開始——核心 MVP
- **使用者故事 2（P2）**：相依於 US1 的 ThemeManager 基礎結構，在 US1 完成後開始

### 每個使用者故事內部

- HTML 結構優先於 CSS 樣式調整
- CSS 基礎建設優先於 JavaScript 邏輯
- 基礎方法優先於整合方法
- 核心功能優先於錯誤處理

### 平行執行機會

- T001 與 T002 可平行執行（設置階段）
- T003、T004、T005 需循序執行（CSS 覆寫有相依性）
- T009 可與其他階段 3 任務平行（獨立的深色模式按鈕樣式）
- T016、T017、T018、T019 可平行執行（獨立的方法實作）

---

## 平行執行範例：階段 4

```bash
# 終端 1：實作儲存方法
T016 → T018（saveTheme + 錯誤處理）

# 終端 2：實作讀取方法
T017 → T019（getSavedTheme + getSystemPreference）

# 完成後合併：
T020 → T021 → T022（init 整合）
```

---

## 實作策略建議

### 最小可行產品 (MVP) 範圍

**僅實作階段 1-3 即可交付 MVP**：
- 使用者可切換深色/淺色模式
- 按鈕顯示正確圖示
- 所有元件顏色正確對應

此 MVP 可獨立運作，使用者可立即獲得深色模式的價值。

### 增量交付

1. **第一次交付**：階段 1-3（MVP - 切換功能）
2. **第二次交付**：階段 4（偏好持久化）
3. **第三次交付**：階段 5（品質驗證）

---

## 任務統計

| 階段 | 任務數 | 描述 |
|------|--------|------|
| 階段 1 | 2 | 設置 |
| 階段 2 | 3 | 基礎建設 |
| 階段 3 | 10 | US1+US3（MVP） |
| 階段 4 | 7 | US2（偏好持久化） |
| 階段 5 | 6 | 收尾 |
| **總計** | **28** | |
