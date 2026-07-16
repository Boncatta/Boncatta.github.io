(() => {
  const C = window.BONCATTA;
  const API = window.BONCATTA_API;
  if (!C || !API) return;

  const $ = (id) => document.getElementById(id);
  const UPDATE_API = "https://api.github.com/repos/Boncatta/Boncatta.github.io/releases?per_page=5";
  const state = { user: null, meta: null, rooms: [], room: null, poll: 0, mode: "duel" };

  function modeKeys() {
    return Object.keys(state.meta?.modes || {});
  }

  function characters() {
    return state.meta?.characters || [];
  }

  function charById(id) {
    return characters().find((item) => item.id === id) || characters()[0] || { id: "undead", name: "亡灵战神", skills: [] };
  }

  function statusText(status) {
    return status === "playing" ? "对战中" : status === "finished" ? "已结束" : status === "ready" ? "可开始" : "等待中";
  }

  function escape(value) {
    return C.escapeHtml(value);
  }

  async function loadMeta() {
    if (!state.meta) state.meta = await API.meta();
    return state.meta;
  }

  async function loadMe() {
    if (!API.token) return null;
    try {
      const payload = await API.me();
      state.user = payload.user;
      if (!API.roomCode && payload.rooms?.[0]) API.roomCode = payload.rooms[0].code;
      return payload;
    } catch (error) {
      if (error.status === 401) API.setToken("");
      state.user = null;
      return null;
    }
  }

  function renderRoomCards(node, rooms) {
    if (!node) return;
    node.innerHTML = rooms.length ? rooms.map((room) => {
      const mine = Boolean(room.mySeats?.length);
      return `
      <article class="room-card ${mine ? "mine" : ""}" data-room-code="${escape(room.code)}">
        <div>
          <strong>${escape(room.code)}</strong>
          <span>${escape(room.label)}</span>
        </div>
        <em>${statusText(room.status)}</em>
        <p>${room.summary ? escape(room.summary) : "&#31561;&#24453;&#29609;&#23478;&#20837;&#22330;"}</p>
        <small>${C.fmt.format(room.count || 0)} / ${C.fmt.format(room.maxSeats || 0)} &#20154;</small>
        <footer class="room-card-actions">
          ${mine
            ? `<button class="primary-cta" type="button" data-room-action="enter">&#36827;&#20837;&#25151;&#38388;</button><button class="ghost-cta" type="button" data-room-action="leave">&#36864;&#20986;&#25151;&#38388;</button>`
            : `<button class="primary-cta" type="button" data-room-action="join">&#21152;&#20837;&#25151;&#38388;</button>`}
        </footer>
      </article>
    `;
    }).join("") : `<div class="empty-state">&#26242;&#26080;&#25151;&#38388;&#12290;&#21435;&#26292;&#22612;&#39029;&#24320;&#19968;&#23616;&#12290;</div>`;
  }

  async function refreshRooms() {
    const payload = await API.rooms();
    state.rooms = payload.rooms || [];
    renderRoomCards($("homeRoomList"), state.rooms);
    return state.rooms;
  }

  async function loginFromPage() {
    const name = $("loginName")?.value || "";
    const password = $("loginPassword")?.value || "";
    const msg = $("loginMessage");
    try {
      const payload = await API.login(name, password);
      API.setToken(payload.token);
      state.user = payload.user;
      if (msg) msg.textContent = "登录成功。";
      C.toast("已进入大厅");
      await renderHome();
    } catch (error) {
      if (msg) msg.textContent = error.message;
    }
  }

  async function renderHome() {
    C.renderNav("home");
    await loadMeta();
    const me = await loadMe();
    const authed = Boolean(me?.user);
    if ($("homeLogin")) $("homeLogin").hidden = authed;
    if ($("homeLobby")) $("homeLobby").hidden = !authed;
    if (!authed) return;
    $("homeGreeting").textContent = `${state.user.username} 的大厅`;
    await refreshRooms();
  }

  function defaultSelections(count = 1) {
    const user = state.user?.username || "玩家";
    const chars = characters();
    return Array.from({ length: count }, (_, index) => ({
      name: count > 1 ? `${user}${index + 1}` : user,
      characterId: chars[index]?.id || chars[0]?.id || "undead",
    }));
  }

  function currentSelectionCount() {
    return state.meta?.modes?.[state.mode]?.setup === "team" ? 2 : 1;
  }

  function selectionCountForMode(mode) {
    return state.meta?.modes?.[mode]?.setup === "team" ? 2 : 1;
  }

  function collectSelections() {
    return Array.from(document.querySelectorAll("[data-role-index]")).map((card) => ({
      name: card.querySelector("input")?.value || state.user?.username || "玩家",
      characterId: card.querySelector("select")?.value || characters()[0]?.id || "undead",
    }));
  }

  function renderModeStrip() {
    const node = $("modeStrip");
    if (!node) return;
    const modes = state.meta?.modes || {};
    node.innerHTML = modeKeys().map((key) => `
      <button type="button" class="mode-card ${key === state.mode ? "active" : ""}" data-mode="${key}">
        <strong>${escape(modes[key].short)}</strong>
        <span>${escape(modes[key].label)}</span>
        <small>${escape(modes[key].note)}</small>
      </button>
    `).join("");
    node.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.mode = button.dataset.mode;
        renderModeStrip();
        renderRoleEditor();
      });
    });
  }

  function renderRoleEditor() {
    const node = $("roleEditor");
    if (!node) return;
    const count = currentSelectionCount();
    const selections = defaultSelections(count);
    const options = characters().map((char) => `<option value="${escape(char.id)}">${escape(char.name)}</option>`).join("");
    node.innerHTML = selections.map((selection, index) => {
      const def = charById(selection.characterId);
      return `<article class="role-card" data-role-index="${index}">
        <span>${count > 1 ? `${index + 1} 号角色` : "我的角色"}</span>
        <input maxlength="18" value="${escape(selection.name)}">
        <select>${options}</select>
        <small>${escape(def.desc || "")}</small>
      </article>`;
    }).join("");
    node.querySelectorAll("select").forEach((select, index) => {
      select.value = selections[index].characterId;
      select.addEventListener("change", () => {
        const small = select.closest(".role-card")?.querySelector("small");
        if (small) small.textContent = charById(select.value).desc || "";
        pushSelectionSoon();
      });
    });
    node.querySelectorAll("input").forEach((input) => input.addEventListener("input", pushSelectionSoon));
  }

  let selectionTimer = 0;
  function pushSelectionSoon() {
    window.clearTimeout(selectionTimer);
    selectionTimer = window.setTimeout(async () => {
      if (!state.room?.code || state.room.status === "playing" || state.room.status === "finished") return;
      try {
        const payload = await API.selection(state.room.code, collectSelections());
        state.room = payload.room;
        renderGameRoom();
      } catch {}
    }, 350);
  }

  async function createRoom() {
    try {
      const payload = await API.createRoom(state.mode, collectSelections());
      state.room = payload.room;
      API.roomCode = state.room.code;
      C.toast(`房间 ${state.room.code} 已创建`);
      renderGameRoom();
      startPoll();
    } catch (error) {
      C.toast(error.message);
    }
  }

  async function joinRoom() {
    const code = $("joinCode")?.value.trim().toUpperCase();
    if (!code) return C.toast("请输入房间码");
    try {
      const payload = await API.joinRoom(code, collectSelections());
      state.room = payload.room;
      state.mode = state.room.mode;
      API.roomCode = state.room.code;
      C.toast(`已加入 ${state.room.code}`);
      renderGameRoom();
      startPoll();
    } catch (error) {
      C.toast(error.message);
    }
  }

  async function joinRoomFromLobby(code) {
    const room = state.rooms.find((item) => item.code === code);
    if (!room) return C.toast("房间不存在");
    try {
      const selections = defaultSelections(selectionCountForMode(room.mode));
      const payload = await API.joinRoom(code, selections);
      state.room = payload.room;
      state.mode = state.room.mode;
      API.roomCode = state.room.code;
      C.navigate("game.html");
    } catch (error) {
      C.toast(error.message);
    }
  }

  async function leaveRoomFromLobby(code) {
    try {
      await API.leave(code);
      if (API.roomCode === code) API.roomCode = "";
      await refreshRooms();
      C.toast("已退出房间");
    } catch (error) {
      C.toast(error.message);
    }
  }

  async function loadCurrentRoom() {
    if (!API.roomCode) return null;
    try {
      const payload = await API.room(API.roomCode);
      state.room = payload.room;
      state.mode = state.room.mode;
      return state.room;
    } catch (error) {
      if (error.status === 404) API.roomCode = "";
      state.room = null;
      return null;
    }
  }

  function renderGameShell() {
    const authed = Boolean(state.user);
    if ($("gameLoginGate")) $("gameLoginGate").hidden = authed;
    if ($("createStage")) $("createStage").hidden = !authed || Boolean(state.room);
    if ($("roomStage")) $("roomStage").hidden = !authed || !state.room;
    if ($("gameStatus")) $("gameStatus").textContent = !authed ? "未登录" : state.room ? "房间同步中" : "准备开局";
  }

  function renderSeats() {
    const node = $("seatBoard");
    if (!node || !state.room) return;
    node.innerHTML = state.room.seats.map((seat) => {
      const def = charById(seat.selection?.characterId);
      const mine = state.room.mySeats?.includes(seat.index);
      return `<article class="seat-card ${seat.occupied ? "occupied" : ""} ${mine ? "mine" : ""}">
        <span>${seat.index + 1}</span>
        <strong>${seat.occupied ? escape(seat.selection.name) : "空位"}</strong>
        <small>${escape(seatTeamLabel(state.room.mode, seat.index))} · ${seat.occupied ? escape(def.name) : "等待加入"}</small>
      </article>`;
    }).join("");
  }

  function seatTeamLabel(mode, index) {
    if (mode === "ffa") return `阵营 ${index + 1}`;
    if (mode === "team4") return index === 0 || index === 2 ? "一队" : "二队";
    if (mode === "commander") return index < 2 ? "一队" : "二队";
    return index === 0 ? "房主" : "访客";
  }

  function renderBattle() {
    const battle = state.room?.battle;
    const board = $("battleBoard");
    if (!board) return;
    board.hidden = !battle;
    if (!battle) return;
    $("roundText").textContent = `第 ${battle.phase || 1} 回合`;
    $("turnText").textContent = battle.skillText || "等待行动";
    $("rollText").textContent = battle.lastRoll
      ? `随机数 ${battle.lastRoll.roll}/${battle.lastRoll.max} · ${battle.lastRoll.skill} · ${battle.lastRoll.target}`
      : "随机数：等待首次行动";
    $("fighterBoard").innerHTML = (battle.players || []).map((player, index) => {
      const hp = Math.max(0, Math.min(100, Number(player.health) || 0));
      return `<article class="fighter-card ${battle.current === index ? "current" : ""} ${player.health <= 0 ? "dead" : ""}">
        <div><strong>${escape(player.displayName)}</strong><small>${escape(seatTeamLabel(state.room.mode, player.seatIndex))}</small></div>
        <div class="hp-bar"><span style="width:${hp}%"></span></div>
        <footer><span>HP ${Math.max(0, player.health)}</span><span>盾 ${player.shield || 0}</span><span>点 ${player.actionPoints || 0}</span></footer>
      </article>`;
    }).join("");
    $("battleLog").innerHTML = (battle.logs || []).map((entry) => `<p ${entry.color ? `style="color:${entry.color}"` : ""}>${escape(entry.text)}</p>`).join("");
    $("logCount").textContent = C.fmt.format((battle.logs || []).length);
    renderTargets();
  }

  function renderTargets() {
    const battle = state.room?.battle;
    const ids = ["targetPrimary", "targetSecondary", "targetTertiary", "targetMulti"];
    const current = battle?.players?.[battle.current];
    const canAct = Boolean(current && state.room.mySeats?.includes(current.seatIndex) && !battle.gameOver);
    const living = (battle?.players || []).map((player, index) => ({ player, index })).filter(({ player }) => player.health > 0);
    const html = living.length ? living.map(({ player, index }) => `<option value="${index}">${escape(player.displayName)} · HP ${Math.max(0, player.health)}</option>`).join("") : `<option value="">无目标</option>`;
    ids.forEach((id) => {
      const node = $(id);
      if (!node) return;
      node.innerHTML = html;
      node.disabled = !canAct;
    });
    $("actButton").disabled = !canAct;
  }

  function collectTargets() {
    return {
      primary: Number($("targetPrimary").value),
      secondary: Number($("targetSecondary").value),
      tertiary: Number($("targetTertiary").value),
      multi: Array.from($("targetMulti").selectedOptions).map((option) => Number(option.value)),
    };
  }

  function renderGameRoom() {
    renderGameShell();
    if (!state.room) return;
    const mode = state.meta?.modes?.[state.room.mode];
    $("roomMode").textContent = mode?.label || "暴塔房间";
    $("roomCode").textContent = state.room.code;
    $("roomState").textContent = statusText(state.room.status);
    const isHost = state.room.host === state.user?.username;
    const inRoom = Boolean(state.room.mySeats?.length);
    const locked = state.room.status === "playing" || state.room.status === "finished";
    $("startBattle").hidden = !isHost || locked;
    $("addAi").hidden = !isHost || locked || state.room.count >= state.room.maxSeats;
    $("leaveRoom").hidden = !inRoom || state.room.status === "playing";
    $("backLobby").hidden = false;
    $("resetBattle").hidden = state.room.host !== state.user?.username || !state.room.battle;
    renderSeats();
    renderBattle();
  }

  async function startBattle() {
    try {
      const payload = await API.start(state.room.code);
      state.room = payload.room;
      renderGameRoom();
    } catch (error) {
      C.toast(error.message);
    }
  }

  async function act() {
    try {
      const payload = await API.act(state.room.code, collectTargets());
      state.room = payload.room;
      renderGameRoom();
    } catch (error) {
      C.toast(error.message);
    }
  }

  async function leaveRoom() {
    if (!state.room) return;
    try {
      await API.leave(state.room.code);
    } catch (error) {
      C.toast(error.message);
      return;
    }
    state.room = null;
    API.roomCode = "";
    renderGameShell();
  }

  async function resetBattle() {
    try {
      const payload = await API.reset(state.room.code);
      state.room = payload.room;
      renderGameRoom();
    } catch (error) {
      C.toast(error.message);
    }
  }

  async function addAi() {
    if (!state.room?.code) return;
    try {
      const payload = await API.addAi(state.room.code);
      state.room = payload.room;
      renderGameRoom();
    } catch (error) {
      C.toast(error.message);
    }
  }

  function backLobby() {
    C.navigate("index.html");
  }

  function startPoll() {
    window.clearInterval(state.poll);
    state.poll = window.setInterval(async () => {
      if (!state.room?.code) return;
      await loadCurrentRoom();
      renderGameRoom();
    }, 1500);
  }

  async function renderGame() {
    C.renderNav("game");
    await loadMeta();
    await loadMe();
    renderGameShell();
    if (!state.user) return;
    renderModeStrip();
    renderRoleEditor();
    await loadCurrentRoom();
    renderGameRoom();
    startPoll();
  }

  async function getInstalledAppInfo() {
    const fallback = { versionName: "网页", versionCode: 0, native: false };
    try {
      const plugin = window.Capacitor?.Plugins?.App;
      if (!plugin?.getInfo) return fallback;
      const info = await plugin.getInfo();
      return { versionName: info.version || "未知", versionCode: Number(info.build || 0), native: true };
    } catch {
      return fallback;
    }
  }

  function parseReleaseMeta(release) {
    const body = String(release?.body || "");
    const json = body.match(/\{[\s\S]*\}/)?.[0] || "{}";
    let meta = {};
    try { meta = JSON.parse(json); } catch { meta = {}; }
    const assets = release?.assets || [];
    const apk = assets.find((asset) => asset.name === meta.apkFile)
      || assets.find((asset) => /^boncatta-.*\.apk$/i.test(asset.name || ""))
      || assets.find((asset) => /\.apk$/i.test(asset.name || ""));
    return {
      versionCode: Number(meta.versionCode || 0),
      versionName: meta.versionName || release?.name || "未知",
      apkUrl: apk?.browser_download_url || release?.html_url || "https://github.com/Boncatta/Boncatta.github.io/releases/tag/apk-latest",
    };
  }

  async function checkUpdate(manual = true) {
    const status = $("updateStatus");
    const link = $("downloadUpdate");
    if (!status || !link) return;
    if (manual) status.textContent = "正在检查新版 APK...";
    link.hidden = true;
    const current = await getInstalledAppInfo();
    $("appVersionInfo").textContent = current.native ? `当前 APK：${current.versionName} (${current.versionCode || "未知"})` : "当前为调试/网页模式。";
    try {
      let latest;
      try {
        latest = await API.request(`/api/app/latest?t=${Date.now()}`);
      } catch (apiError) {
        if (window.Capacitor?.isNativePlatform?.()) throw apiError;
        const response = await fetch(`${UPDATE_API}&t=${Date.now()}`, { cache: "no-store" });
        const payload = await response.json();
        const release = Array.isArray(payload) ? payload.find((item) => item.tag_name === "apk-latest") || payload[0] : payload;
        latest = parseReleaseMeta(release);
      }
      status.textContent = latest.versionCode > current.versionCode
        ? `发现新版：${latest.versionName} (${latest.versionCode})。`
        : `已是最新版：${current.versionName} (${current.versionCode || "未知"})。`;
      link.href = latest.apkUrl;
      link.hidden = false;
    } catch (error) {
      status.textContent = `检查失败：${error.message || error}`;
    }
  }

  async function renderMe() {
    C.renderNav("me");
    await loadMe();
    if (!state.user) {
      $("profileName").textContent = "未登录";
      $("statsGrid").innerHTML = `<a class="primary-cta" href="/index.html">去登录</a>`;
    } else {
      const stats = state.user.stats || {};
      $("profileName").textContent = state.user.username;
      $("statsGrid").innerHTML = [
        ["对局", stats.games || 0],
        ["胜场", stats.wins || 0],
        ["负场", stats.losses || 0],
        ["行动", stats.actions || 0],
        ["建房", stats.roomsCreated || 0],
      ].map(([label, value]) => `<div><span>${label}</span><strong>${C.fmt.format(value)}</strong></div>`).join("");
    }
    $("logoutButton")?.addEventListener("click", async () => {
      await API.logout();
      C.navigate("index.html");
    });
    $("checkUpdate")?.addEventListener("click", () => checkUpdate(true));
    $("downloadUpdate")?.addEventListener("click", (event) => {
      if (window.Capacitor?.isNativePlatform?.()) {
        event.preventDefault();
        window.open(event.currentTarget.href, "_system");
      }
    });
    getInstalledAppInfo().then((info) => {
      if ($("appVersionInfo")) $("appVersionInfo").textContent = info.native ? `当前 APK：${info.versionName} (${info.versionCode || "未知"})` : "当前为调试/网页模式。";
    });
  }

  function bindHome() {
    $("loginButton")?.addEventListener("click", loginFromPage);
    ["loginName", "loginPassword"].forEach((id) => $(id)?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") loginFromPage();
    }));
    $("refreshLobby")?.addEventListener("click", () => refreshRooms().catch((error) => C.toast(error.message)));
    $("homeRoomList")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-room-action]");
      if (!button) return;
      const card = event.target.closest("[data-room-code]");
      if (!card) return;
      const code = card.dataset.roomCode;
      if (button.dataset.roomAction === "enter") {
        API.roomCode = code;
        C.navigate("game.html");
      } else if (button.dataset.roomAction === "join") {
        joinRoomFromLobby(code);
      } else if (button.dataset.roomAction === "leave") {
        leaveRoomFromLobby(code);
      }
    });
  }

  function bindGame() {
    $("createRoom")?.addEventListener("click", createRoom);
    $("joinRoom")?.addEventListener("click", joinRoom);
    $("startBattle")?.addEventListener("click", startBattle);
    $("addAi")?.addEventListener("click", addAi);
    $("leaveRoom")?.addEventListener("click", leaveRoom);
    $("backLobby")?.addEventListener("click", backLobby);
    $("resetBattle")?.addEventListener("click", resetBattle);
    $("actButton")?.addEventListener("click", act);
    $("gameRefresh")?.addEventListener("click", async () => {
      await loadCurrentRoom();
      renderGameRoom();
      C.toast("已同步");
    });
  }

  async function init() {
    try {
      if (document.body.classList.contains("page-home")) {
        bindHome();
        await renderHome();
      } else if (document.body.classList.contains("page-game")) {
        bindGame();
        await renderGame();
      } else if (document.body.classList.contains("page-me")) {
        await renderMe();
      }
    } catch (error) {
      C.toast(error.message || "加载失败");
    }
  }

  init();
})();
