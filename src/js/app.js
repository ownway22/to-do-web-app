/**
 * 待辦事項網頁應用 - 應用程式邏輯
 * 包含 CRUD 操作、localStorage 管理、事件處理
 */

(function () {
  "use strict";

  // ===== 常數 =====
  const STORAGE_KEY = "todo-webapp-data";
  const MAX_LENGTH = 100;
  const SESSION_KEY = "todo-webapp-session";
  const SESSION_VALUE = "authenticated";
  const WELCOME_DURATION = 1500; // 1.5 秒

  // ===== 工作階段管理（T009）=====
  const SessionManager = {
    /**
     * 檢查是否已驗證
     * @returns {boolean}
     */
    checkSession() {
      try {
        return sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE;
      } catch (e) {
        console.warn("無法讀取工作階段:", e.message);
        return false;
      }
    },

    /**
     * 設定已驗證狀態
     */
    setSession() {
      try {
        sessionStorage.setItem(SESSION_KEY, SESSION_VALUE);
      } catch (e) {
        console.warn("無法設定工作階段:", e.message);
      }
    },

    /**
     * 清除工作階段
     */
    clearSession() {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch (e) {
        console.warn("無法清除工作階段:", e.message);
      }
    },
  };

  // ===== 憑證驗證（T010）=====
  /**
   * 驗證使用者帳號密碼
   * @param {string} username 帳號
   * @param {string} password 密碼
   * @returns {boolean} 是否驗證成功
   */
  function validateCredentials(username, password) {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();
    return trimmedUser === "admin" && trimmedPass === "admin";
  }

  // ===== DOM 元素 =====
  const elements = {
    form: document.getElementById("todo-form"),
    input: document.getElementById("todo-input"),
    charCount: document.getElementById("char-count"),
    formError: document.getElementById("form-error"),
    pendingList: document.getElementById("pending-list"),
    completedList: document.getElementById("completed-list"),
    pendingGroup: document.getElementById("pending-group"),
    completedGroup: document.getElementById("completed-group"),
    emptyState: document.getElementById("empty-state"),
    announcer: document.getElementById("announcer"),
    // 登入相關
    loginForm: document.getElementById("login-form"),
    loginUsername: document.getElementById("login-username"),
    loginPassword: document.getElementById("login-password"),
    loginError: document.getElementById("login-error"),
    loginBtn: document.getElementById("login-btn"),
    logoutBtn: document.getElementById("logout-btn"),
    welcomeScreen: document.getElementById("welcome-screen"),
  };

  // ===== TodoStore 類別 =====
  class TodoStore {
    constructor() {
      this.todos = this.load();
    }

    /**
     * 從 localStorage 載入資料
     * @returns {Array} 待辦事項陣列
     */
    load() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed.todos) ? parsed.todos : [];
      } catch (e) {
        console.error("載入資料失敗:", e);
        return [];
      }
    }

    /**
     * 儲存資料到 localStorage
     */
    save() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ todos: this.todos }),
        );
      } catch (e) {
        console.error("儲存資料失敗:", e);
      }
    }

    /**
     * 取得排序後的待辦事項
     * @returns {Object} { pending: [], completed: [] }
     */
    getSorted() {
      const pending = this.todos
        .filter((t) => !t.completed)
        .sort((a, b) => b.createdAt - a.createdAt);

      const completed = this.todos
        .filter((t) => t.completed)
        .sort((a, b) => b.createdAt - a.createdAt);

      return { pending, completed };
    }

    /**
     * 新增待辦事項
     * @param {string} text 內容
     * @returns {Object} 新建的待辦事項
     */
    add(text) {
      const todo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      this.todos.unshift(todo);
      this.save();
      return todo;
    }

    /**
     * 更新待辦事項
     * @param {string} id 識別碼
     * @param {Object} updates 更新內容
     * @returns {Object|null} 更新後的待辦事項
     */
    update(id, updates) {
      const todo = this.todos.find((t) => t.id === id);
      if (!todo) return null;

      Object.assign(todo, updates);
      this.save();
      return todo;
    }

    /**
     * 刪除待辦事項
     * @param {string} id 識別碼
     * @returns {boolean} 是否成功刪除
     */
    delete(id) {
      const index = this.todos.findIndex((t) => t.id === id);
      if (index === -1) return false;

      this.todos.splice(index, 1);
      this.save();
      return true;
    }

    /**
     * 切換完成狀態
     * @param {string} id 識別碼
     * @returns {Object|null} 更新後的待辦事項
     */
    toggleComplete(id) {
      const todo = this.todos.find((t) => t.id === id);
      if (!todo) return null;

      todo.completed = !todo.completed;
      this.save();
      return todo;
    }

    /**
     * 取得待辦事項
     * @param {string} id 識別碼
     * @returns {Object|null} 待辦事項
     */
    get(id) {
      return this.todos.find((t) => t.id === id) || null;
    }

    /**
     * 檢查是否為空
     * @returns {boolean}
     */
    isEmpty() {
      return this.todos.length === 0;
    }
  }

  // ===== 渲染器 =====
  const renderer = {
    /**
     * 渲染所有待辦事項
     */
    renderAll() {
      const { pending, completed } = store.getSorted();

      // 渲染未完成
      elements.pendingList.innerHTML = "";
      pending.forEach((todo) => {
        elements.pendingList.appendChild(this.createTodoElement(todo));
      });

      // 渲染已完成
      elements.completedList.innerHTML = "";
      completed.forEach((todo) => {
        elements.completedList.appendChild(this.createTodoElement(todo));
      });

      // 更新群組顯示狀態
      elements.pendingGroup.style.display =
        pending.length > 0 ? "block" : "none";
      elements.completedGroup.style.display =
        completed.length > 0 ? "block" : "none";

      // 空狀態
      elements.emptyState.hidden = !store.isEmpty();
    },

    /**
     * 建立待辦項目元素
     * @param {Object} todo 待辦事項
     * @returns {HTMLElement}
     */
    createTodoElement(todo) {
      const li = document.createElement("li");
      li.className = `todo-item${todo.completed ? " completed" : ""}`;
      li.dataset.id = todo.id;

      li.innerHTML = `
                <button
                    type="button"
                    class="todo-checkbox"
                    role="checkbox"
                    aria-checked="${todo.completed}"
                    aria-label="${todo.completed ? "標記為未完成" : "標記為已完成"}"
                    data-action="toggle"
                ></button>
                <div class="todo-content">
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                </div>
                <div class="todo-actions">
                    <button
                        type="button"
                        class="btn btn-icon"
                        aria-label="編輯"
                        data-action="edit"
                        title="編輯"
                    >✏️</button>
                    <button
                        type="button"
                        class="btn btn-icon"
                        aria-label="刪除"
                        data-action="delete"
                        title="刪除"
                    >🗑️</button>
                </div>
            `;

      return li;
    },

    /**
     * 進入編輯模式
     * @param {HTMLElement} todoElement 待辦項目元素
     * @param {Object} todo 待辦事項
     */
    enterEditMode(todoElement, todo) {
      const content = todoElement.querySelector(".todo-content");
      const originalText = todo.text;

      content.innerHTML = `
                <input
                    type="text"
                    class="todo-edit-input"
                    value="${this.escapeHtml(originalText)}"
                    maxlength="${MAX_LENGTH}"
                    aria-label="編輯待辦事項"
                >
                <div class="edit-actions">
                    <button type="button" class="btn btn-primary btn-sm" data-action="save">儲存</button>
                    <button type="button" class="btn btn-secondary btn-sm" data-action="cancel">取消</button>
                </div>
                <p class="error-message" role="alert"></p>
            `;

      const input = content.querySelector(".todo-edit-input");
      input.focus();
      input.select();

      // 儲存原始文字
      todoElement.dataset.originalText = originalText;
      todoElement.classList.add("editing");
    },

    /**
     * 退出編輯模式
     * @param {HTMLElement} todoElement 待辦項目元素
     * @param {string} text 顯示的文字
     */
    exitEditMode(todoElement, text) {
      const content = todoElement.querySelector(".todo-content");
      content.innerHTML = `<span class="todo-text">${this.escapeHtml(text)}</span>`;
      todoElement.classList.remove("editing");
      delete todoElement.dataset.originalText;
    },

    /**
     * 顯示刪除確認
     * @param {HTMLElement} todoElement 待辦項目元素
     */
    showDeleteConfirm(todoElement) {
      const actions = todoElement.querySelector(".todo-actions");
      actions.innerHTML = `
                <div class="delete-confirm">
                    <span class="delete-confirm-text">確認刪除？</span>
                    <button type="button" class="btn btn-danger btn-sm" data-action="confirm-delete">刪除</button>
                    <button type="button" class="btn btn-secondary btn-sm" data-action="cancel-delete">取消</button>
                </div>
            `;
    },

    /**
     * 隱藏刪除確認
     * @param {HTMLElement} todoElement 待辦項目元素
     */
    hideDeleteConfirm(todoElement) {
      const actions = todoElement.querySelector(".todo-actions");
      actions.innerHTML = `
                <button type="button" class="btn btn-icon" aria-label="編輯" data-action="edit" title="編輯">✏️</button>
                <button type="button" class="btn btn-icon" aria-label="刪除" data-action="delete" title="刪除">🗑️</button>
            `;
    },

    /**
     * HTML 跳脫（XSS 防護）
     * @param {string} text 原始文字
     * @returns {string} 跳脫後的文字
     */
    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    },
  };

  // ===== 事件處理 =====
  const handlers = {
    /**
     * 處理表單提交（新增）
     * @param {Event} e 事件
     */
    handleSubmit(e) {
      e.preventDefault();

      const text = elements.input.value.trim();

      // 驗證
      if (!text) {
        showError("請輸入待辦事項內容");
        elements.input.focus();
        return;
      }

      if (text.length > MAX_LENGTH) {
        showError(`內容不可超過 ${MAX_LENGTH} 字元`);
        return;
      }

      // 新增
      store.add(text);
      elements.input.value = "";
      updateCharCount();
      clearError();
      renderer.renderAll();

      // 宣告
      announce("已新增待辦事項");
      elements.input.focus();
    },

    /**
     * 處理輸入變化
     */
    handleInput() {
      updateCharCount();
      clearError();
    },

    /**
     * 處理清單點擊（事件委派）
     * @param {Event} e 事件
     */
    handleListClick(e) {
      const button = e.target.closest("[data-action]");
      if (!button) return;

      const action = button.dataset.action;
      const todoElement = e.target.closest(".todo-item");
      if (!todoElement) return;

      const id = todoElement.dataset.id;
      const todo = store.get(id);
      if (!todo) return;

      switch (action) {
        case "toggle":
          this.handleToggle(id, todoElement);
          break;
        case "edit":
          renderer.enterEditMode(todoElement, todo);
          break;
        case "save":
          this.handleSave(todoElement, id);
          break;
        case "cancel":
          renderer.exitEditMode(todoElement, todoElement.dataset.originalText);
          break;
        case "delete":
          renderer.showDeleteConfirm(todoElement);
          break;
        case "confirm-delete":
          this.handleDelete(id, todoElement);
          break;
        case "cancel-delete":
          renderer.hideDeleteConfirm(todoElement);
          break;
      }
    },

    /**
     * 處理完成狀態切換
     * @param {string} id 識別碼
     * @param {HTMLElement} todoElement 待辦項目元素
     */
    handleToggle(id, todoElement) {
      const todo = store.toggleComplete(id);
      if (!todo) return;

      renderer.renderAll();
      announce(todo.completed ? "已標記為完成" : "已標記為未完成");
    },

    /**
     * 處理儲存編輯
     * @param {HTMLElement} todoElement 待辦項目元素
     * @param {string} id 識別碼
     */
    handleSave(todoElement, id) {
      const input = todoElement.querySelector(".todo-edit-input");
      const errorElement = todoElement.querySelector(".error-message");
      const text = input.value.trim();

      // 驗證
      if (!text) {
        errorElement.textContent = "內容不可為空";
        input.focus();
        return;
      }

      if (text.length > MAX_LENGTH) {
        errorElement.textContent = `內容不可超過 ${MAX_LENGTH} 字元`;
        return;
      }

      // 更新
      store.update(id, { text });
      renderer.exitEditMode(todoElement, text);
      announce("已儲存變更");
    },

    /**
     * 處理刪除
     * @param {string} id 識別碼
     * @param {HTMLElement} todoElement 待辦項目元素
     */
    handleDelete(id, todoElement) {
      // 動畫
      todoElement.classList.add("removing");

      setTimeout(() => {
        store.delete(id);
        renderer.renderAll();
        announce("已刪除待辦事項");
      }, 200);
    },

    /**
     * 處理鍵盤事件
     * @param {KeyboardEvent} e 事件
     */
    handleKeydown(e) {
      const todoElement = e.target.closest(".todo-item");

      // 編輯模式中的 Escape
      if (
        e.key === "Escape" &&
        todoElement &&
        todoElement.classList.contains("editing")
      ) {
        renderer.exitEditMode(todoElement, todoElement.dataset.originalText);
        e.preventDefault();
      }

      // 編輯模式中的 Enter
      if (e.key === "Enter" && e.target.classList.contains("todo-edit-input")) {
        const id = todoElement.dataset.id;
        this.handleSave(todoElement, id);
        e.preventDefault();
      }
    },
  };

  // ===== 輔助函式 =====

  /**
   * 更新字元計數
   */
  function updateCharCount() {
    const count = elements.input.value.length;
    elements.charCount.textContent = `${count}/${MAX_LENGTH}`;

    // 更新樣式
    elements.charCount.classList.remove("warning", "limit");
    if (count >= MAX_LENGTH) {
      elements.charCount.classList.add("limit");
    } else if (count >= MAX_LENGTH * 0.8) {
      elements.charCount.classList.add("warning");
    }
  }

  /**
   * 顯示錯誤訊息
   * @param {string} message 訊息
   */
  function showError(message) {
    elements.formError.textContent = message;
  }

  /**
   * 清除錯誤訊息
   */
  function clearError() {
    elements.formError.textContent = "";
  }

  /**
   * 螢幕閱讀器宣告
   * @param {string} message 訊息
   */
  function announce(message) {
    elements.announcer.textContent = message;
    setTimeout(() => {
      elements.announcer.textContent = "";
    }, 1000);
  }

  /**
   * 檢查 localStorage 可用性
   * @returns {boolean}
   */
  function isLocalStorageAvailable() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // ===== ThemeManager（深色模式切換）=====
  const THEME_STORAGE_KEY = "todo-webapp-theme";

  const ThemeManager = {
    /**
     * T020: 初始化主題管理器
     * 優先順序：localStorage → 系統偏好 → 預設淺色
     */
    init() {
      const saved = this.getSavedTheme();
      const theme = saved || this.getSystemPreference();
      this.applyTheme(theme, false); // 初始化時不保存
      this.bindToggle();
    },

    /**
     * T017: 從 localStorage 讀取保存的主題
     * @returns {string|null} 'light' | 'dark' | null
     */
    getSavedTheme() {
      try {
        return localStorage.getItem(THEME_STORAGE_KEY);
      } catch (e) {
        console.warn("無法讀取主題偏好:", e.message);
        return null;
      }
    },

    /**
     * T016/T018: 保存主題到 localStorage（含錯誤處理）
     * @param {string} theme - 'light' | 'dark'
     */
    saveTheme(theme) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (e) {
        console.warn("無法儲存主題偏好:", e.message);
      }
    },

    /**
     * T019: 偵測系統偏好
     * @returns {string} 'light' | 'dark'
     */
    getSystemPreference() {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
      return "light";
    },

    /**
     * T011/T021: 套用主題
     * @param {string} theme - 'light' | 'dark'
     * @param {boolean} save - 是否保存到 localStorage
     */
    applyTheme(theme, save = true) {
      document.documentElement.setAttribute("data-theme", theme);
      this.updateToggleButton(theme);
      if (save) {
        this.saveTheme(theme);
      }
    },

    /**
     * T012: 切換主題
     */
    toggle() {
      const current =
        document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      this.applyTheme(next);
    },

    /**
     * T013: 更新切換按鈕圖示與 aria-label
     * @param {string} theme - 'light' | 'dark'
     */
    updateToggleButton(theme) {
      const button = document.getElementById("theme-toggle");
      if (!button) return;

      if (theme === "dark") {
        button.textContent = "☀️";
        button.setAttribute("aria-label", "切換到淺色模式");
      } else {
        button.textContent = "🌙";
        button.setAttribute("aria-label", "切換到深色模式");
      }
    },

    /**
     * T014: 綁定切換按鈕點擊事件
     */
    bindToggle() {
      const button = document.getElementById("theme-toggle");
      if (button) {
        button.addEventListener("click", () => this.toggle());
      }
    },
  };

  // ===== 初始化 =====
  let store;
  let welcomeTimerId = null; // T012: 歡迎計時器 ID

  // ===== 登入/登出處理（T011, T012, T014, T015, T016, T017, T020）=====
  const AuthHandlers = {
    /**
     * T011/T014/T015/T020: 處理登入表單提交
     * @param {Event} e 事件
     */
    handleLogin(e) {
      e.preventDefault();

      const username = elements.loginUsername.value;
      const password = elements.loginPassword.value;

      // T015: 空白欄位檢查
      if (!username.trim() || !password.trim()) {
        this.showLoginError("請輸入帳號和密碼");
        return;
      }

      // T020: 防重複點擊 — 禁用登入按鈕
      elements.loginBtn.disabled = true;

      // T010: 驗證憑證
      if (validateCredentials(username, password)) {
        // 成功
        SessionManager.setSession();
        this.clearLoginError();
        this.showWelcome();
      } else {
        // T014: 失敗分支
        this.showLoginError("帳號或密碼錯誤");
        elements.loginPassword.value = "";
        elements.loginPassword.focus();
        // T020: 恢復按鈕
        elements.loginBtn.disabled = false;
      }
    },

    /**
     * T012: 顯示歡迎訊息並在 1.5 秒後切換至主畫面
     */
    showWelcome() {
      document.body.className = "welcome";
      welcomeTimerId = setTimeout(() => {
        welcomeTimerId = null;
        document.body.className = "authenticated";
        // T020: 恢復按鈕
        elements.loginBtn.disabled = false;
      }, WELCOME_DURATION);
    },

    /**
     * T017: 處理登出
     */
    handleLogout() {
      // 清除 pending 的歡迎計時器
      if (welcomeTimerId !== null) {
        clearTimeout(welcomeTimerId);
        welcomeTimerId = null;
      }
      SessionManager.clearSession();
      document.body.className = "";
      // 清空表單欄位
      elements.loginUsername.value = "";
      elements.loginPassword.value = "";
      this.clearLoginError();
      elements.loginUsername.focus();
      // T020: 確保按鈕啟用
      elements.loginBtn.disabled = false;
    },

    /**
     * 顯示登入錯誤訊息
     * @param {string} message 訊息
     */
    showLoginError(message) {
      elements.loginError.textContent = message;
    },

    /**
     * T016: 清除登入錯誤訊息
     */
    clearLoginError() {
      elements.loginError.textContent = "";
    },
  };

  function init() {
    // T015/T022: 初始化主題管理器（在驗證檢查前套用，避免 FOUC）
    ThemeManager.init();

    // T013: 檢查工作階段狀態
    if (SessionManager.checkSession()) {
      document.body.className = "authenticated";
    } else {
      document.body.className = "";
      elements.loginUsername.focus();
    }

    // 檢查 localStorage
    if (!isLocalStorageAvailable()) {
      showError("您的瀏覽器不支援本地儲存功能，資料將無法保存。");
    }

    // 初始化 Store
    store = new TodoStore();

    // 綁定待辦事項事件
    elements.form.addEventListener("submit", (e) => handlers.handleSubmit(e));
    elements.input.addEventListener("input", () => handlers.handleInput());
    elements.pendingList.addEventListener("click", (e) =>
      handlers.handleListClick(e),
    );
    elements.completedList.addEventListener("click", (e) =>
      handlers.handleListClick(e),
    );
    document.addEventListener("keydown", (e) => handlers.handleKeydown(e));

    // T011: 綁定登入表單事件
    elements.loginForm.addEventListener("submit", (e) =>
      AuthHandlers.handleLogin(e),
    );

    // T016: 輸入時清除登入錯誤訊息
    elements.loginUsername.addEventListener("input", () =>
      AuthHandlers.clearLoginError(),
    );
    elements.loginPassword.addEventListener("input", () =>
      AuthHandlers.clearLoginError(),
    );

    // T017: 綁定登出按鈕事件
    elements.logoutBtn.addEventListener("click", () =>
      AuthHandlers.handleLogout(),
    );

    // 初始渲染
    renderer.renderAll();
    updateCharCount();

    console.log("✅ 待辦事項應用已初始化");
  }

  // DOM 載入完成後初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
