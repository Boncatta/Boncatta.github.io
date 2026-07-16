(() => {
  const storage = window.localStorage;
  const tokenKey = "boncattaApiTokenV1";
  const roomKey = "boncattaCurrentRoomV1";
  const oldKeys = ["boncattaAccountsV1", "boncattaSessionV1"];
  oldKeys.forEach((key) => storage.removeItem(key));

  function inferBase() {
    const configured = String(window.BAOTA_API_BASE || "").replace(/\/$/, "");
    const isCapacitorHost = location.protocol === "capacitor:" || (location.protocol === "https:" && location.hostname === "localhost" && !location.port);
    if (isCapacitorHost) return configured || "http://localhost:8787";
    if (["localhost", "127.0.0.1"].includes(location.hostname)) return location.origin;
    if (configured) return configured;
    if (location.protocol === "file:") return "http://localhost:8787";
    return location.origin;
  }

  const api = {
    base: inferBase(),
    token: storage.getItem(tokenKey) || "",
    get roomCode() {
      return storage.getItem(roomKey) || "";
    },
    set roomCode(value) {
      if (value) storage.setItem(roomKey, value);
      else storage.removeItem(roomKey);
    },
    setToken(token) {
      this.token = token || "";
      if (this.token) storage.setItem(tokenKey, this.token);
      else storage.removeItem(tokenKey);
    },
    async request(path, options = {}) {
      const headers = { "content-type": "application/json", ...(options.headers || {}) };
      if (this.token) headers.authorization = `Bearer ${this.token}`;
      const response = await fetch(`${this.base}${path}`, {
        method: options.method || "GET",
        headers,
        body: options.body == null ? undefined : JSON.stringify(options.body),
      }).catch((error) => {
        throw new Error(`后端不可达：${this.base}（${error.message || error}）`);
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.ok === false) {
        const error = new Error(payload.error || `请求失败 ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return payload;
    },
    meta() { return this.request("/api/meta"); },
    login(username, password) { return this.request("/api/auth/login", { method: "POST", body: { username, password } }); },
    logout() { return this.request("/api/auth/logout", { method: "POST" }).finally(() => { this.setToken(""); this.roomCode = ""; }); },
    me() { return this.request("/api/me"); },
    rooms() { return this.request("/api/rooms"); },
    createRoom(mode, selections) { return this.request("/api/rooms", { method: "POST", body: { mode, selections } }); },
    room(code) { return this.request(`/api/rooms/${encodeURIComponent(code)}`); },
    joinRoom(code, selections) { return this.request(`/api/rooms/${encodeURIComponent(code)}/join`, { method: "POST", body: { selections } }); },
    selection(code, selections) { return this.request(`/api/rooms/${encodeURIComponent(code)}/selection`, { method: "POST", body: { selections } }); },
    start(code) { return this.request(`/api/rooms/${encodeURIComponent(code)}/start`, { method: "POST" }); },
    act(code, targets) { return this.request(`/api/rooms/${encodeURIComponent(code)}/action`, { method: "POST", body: { targets } }); },
    reset(code) { return this.request(`/api/rooms/${encodeURIComponent(code)}/reset`, { method: "POST" }); },
    leave(code) { return this.request(`/api/rooms/${encodeURIComponent(code)}/leave`, { method: "POST" }); },
  };

  window.BONCATTA_API = api;
})();
