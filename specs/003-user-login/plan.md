# 實作計畫：使用者登入機制

**分支**：`003-user-login` | **日期**：2026-02-09 | **規格**：[spec.md](./spec.md)
**輸入**：來自 `/specs/003-user-login/spec.md` 的功能規格

**備註**：此範本由 `/speckit.plan` 指令填寫。

## 摘要

為現有待辦事項應用增加前端登入閘門機制。使用者開啟應用時須先以固定帳密（admin/admin）通過驗證，成功後顯示短暫歡迎訊息再進入主畫面。工作階段透過 sessionStorage 維持（跨重新整理保留、關閉分頁失效）。主畫面 header 右上角新增登出按鈕。登入畫面需支援深色模式、響應式設計和自動對焦。

## 技術情境

**語言/版本**：HTML5 + CSS3 + JavaScript ES6+（原生，無框架）
**主要相依套件**：無（純原生前端應用）
**儲存方式**：localStorage（待辦事項資料）、sessionStorage（登入工作階段）
**測試工具**：手動測試（瀏覽器）
**目標平台**：現代瀏覽器（Chrome、Firefox、Safari、Edge），行動裝置和桌面
**專案類型**：單一前端網頁應用（搭配 Python 靜態檔案伺服器）
**效能目標**：登入驗證即時（< 100ms，純前端比對）
**約束條件**：不引入任何新的第三方相依套件；維持純前端架構
**規模/範圍**：單一使用者、單一頁面應用

## 憲章檢查

_關卡：必須在階段 0 研究前通過。階段 1 設計後重新檢查。_

> **狀態：不適用** — 憲章檔案 (`.specify/memory/constitution.md`) 為未填寫的範本，無具體約束條件。所有設計決策遵循功能規格中的假設和需求。

## 專案結構

### 文件（此功能）

```text
specs/[###-feature]/
├── plan.md              # 此檔案（/speckit.plan 指令輸出）
├── research.md          # 階段 0 輸出（/speckit.plan 指令）
├── data-model.md        # 階段 1 輸出（/speckit.plan 指令）
├── quickstart.md        # 階段 1 輸出（/speckit.plan 指令）
├── contracts/           # 階段 1 輸出（/speckit.plan 指令）
└── tasks.md             # 階段 2 輸出（/speckit.tasks 指令 - 非由 /speckit.plan 建立）
```

### 原始碼（儲存庫根目錄）

```text
src/
├── index.html           # 主頁面（新增登入畫面 HTML 結構）
├── server.py            # Python 靜態檔案伺服器（不變動）
├── css/
│   └── styles.css       # 樣式表（新增登入畫面樣式）
└── js/
    └── app.js           # 應用邏輯（新增登入驗證、工作階段管理、登出功能）
```

**結構決策**：沿用現有的單一前端應用結構（`src/` 下 HTML + CSS + JS 拆分），不新增目錄或檔案。所有變更在既有檔案內完成。

## 複雜度追蹤

> 無憲章違規，不需要填寫。
