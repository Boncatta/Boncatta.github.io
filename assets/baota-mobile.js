(() => {
  const C = window.BONCATTA;
  const API = window.BONCATTA_API;
  if (!C || !API) return;

  const $ = (id) => document.getElementById(id);
  const UPDATE_API = "https://api.github.com/repos/Boncatta/Boncatta.github.io/releases?per_page=5";
  const state = { user: null, meta: null, rooms: [], room: null, poll: 0, mode: "duel", targets: { steps: [] }, replay: { match: null, index: 0 } };

  const SKILL_GUIDES = {
    normal_attack: ["攻击", "对一名敌人造成10点攻击伤害。", "enemy", 1],
    critical_hit: ["暴击", "对一名敌人造成20点暴击伤害。", "enemy", 1],
    gain_shield: ["护盾", "为自己添加1层护盾。", "self", 0],
    self_harm: ["反噬", "自己受到10点反噬伤害。", "self", 0],
    heal: ["治疗", "自己恢复10点生命值。", "self", 0],
    red_recovery: ["复苏", "自己恢复30点生命值。", "self", 0],
    critical_heal: ["暴疗", "自己恢复20点生命值。", "self", 0],
    two_more: ["追加行动", "获得2个额外行动点。", "self", 0],
    blood_swap: ["换血", "与一名其他角色交换生命值。", "anyOther", 1],
    blood_swap1: ["换血追击", "与一名其他角色交换生命值，并追击10点伤害。", "anyOther", 1],
    silence: ["沉默", "使一名敌人行动点减少3。", "enemy", 1],
    undead_ultimate: ["终焉", "选一名其他角色换血、暴击，并给自己加盾。", "anyOther", 1],
    ice_attack: ["寒冰攻击", "对一名敌人造成30点寒冰伤害。", "enemy", 1],
    ice_shield: ["冰晶护盾", "小法例外：可为自己或友方添加冰晶护盾。", "allySelf", 1, "multi"],
    ice_silence: ["寂灭冰封", "逐个指定其他角色，使其行动点减少1。", "anyOther", 1, "multi"],
    bomb_attack: ["爆裂", "逐个指定敌人造成20点爆裂伤害，自己受到反冲。", "enemy", 1, "multi"],
    double_attack: ["燃血轰击", "先对一名敌人造成20点伤害，再自己受到10点伤害。", "enemy", 1],
    poison_attack: ["毒药", "逐个指定敌人造成10点毒药伤害，自己受到反噬。", "enemy", 1, "multi"],
    mage_ultimate: ["绝对零度", "对一名敌人造成30点伤害，并恢复自己30点生命。", "enemy", 1],
    medicine_both_heal: ["群体治疗", "逐个指定自己或友方，恢复10点生命。", "allySelf", 1, "multi"],
    medicine_crit_heal: ["嗜血之疗", "暴击一名敌人，并治疗自己。", "enemy", 1],
    medicine_crit_silence: ["沉默重击", "暴击并沉默一名敌人。", "enemy", 1],
    medicine_boost_heal: ["治疗整备", "强化自己的下一次治疗效果。", "self", 0],
    medicine_mega_heal: ["愈合秘法", "自己恢复60点生命值。", "self", 0],
    double_normal_attack: ["双重打击", "按顺序选择2次敌人，可重复选择。", "enemy", 2],
    attack_and_draw: ["快速袭击", "攻击一名敌人，并获得1个额外行动点。", "enemy", 1],
    attack_and_heal: ["嗜血一击", "攻击一名敌人，并治疗自己。", "enemy", 1],
    attack_and_shield: ["持盾袭击", "攻击一名敌人，并为自己添加护盾。", "enemy", 1],
    half_hp_and_attack: ["裂空一击", "全场生命削减后，攻击一名敌人。", "enemy", 1],
    double_next_attack: ["力量凝聚", "自己的下次攻击威力翻倍。", "self", 0],
    self_harm_and_triple_critical: ["毁灭三连", "按顺序选择3次敌人，可重复选择。", "enemy", 3],
    double_deduction: ["无畏冲击", "全场受到10点伤害。", "any", 0],
    double_deduction_and_draw: ["无畏连打", "全场受到10点伤害，并获得1个额外行动点。", "any", 0],
    half_hp_both: ["生命削减", "全场生命减半。", "any", 0],
    attack_critical_draw: ["暴力连打", "先选择普通攻击目标，再选择暴击目标。", "enemy", 2],
    double_deduction_30_attack_critical_draw: ["终极连招", "全场冲击后，选择普通攻击与暴击目标。", "enemy", 2],
    both_heal_10: ["群体恢复", "逐个指定自己或友方，恢复10点生命。", "allySelf", 1, "multi"],
    critical_and_critical_heal_and_draw: ["未来之击", "暴击一名敌人，治疗自己并追加行动。", "enemy", 1],
    shield_and_self_harm_10: ["荆棘之盾", "为自己添加护盾，然后自己受到10点不可格挡伤害。", "self", 0],
    knight_ultimate: ["骑士奥义", "暴击一名敌人，追加行动，并给自己3层护盾。", "enemy", 1],
  };

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
            : `${room.status === "waiting" || room.status === "ready" ? `<button class="primary-cta" type="button" data-room-action="join">&#21152;&#20837;&#25151;&#38388;</button>` : ""}<button class="ghost-cta" type="button" data-room-action="watch">观战</button>`}
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
    return `${index + 1}号位`;
  }

  function hpTone(health) {
    if (health <= 30) return "low";
    if (health <= 60) return "mid";
    return "high";
  }

  function selectedOrders(index) {
    return state.targets.steps.map((value, position) => (value === index ? position + 1 : 0)).filter(Boolean);
  }

  function pendingAction() {
    return state.room?.battle?.pendingAction || null;
  }

  function canCurrentUserAct() {
    const battle = state.room?.battle;
    const current = battle?.players?.[battle.current];
    return Boolean(current && state.room?.mySeats?.includes(current.seatIndex) && !battle.gameOver);
  }

  function clearTargets() {
    state.targets.steps = [];
  }

  function guideFor(action) {
    const raw = SKILL_GUIDES[action?.handler] || [action?.name || "技能", "按提示选择目标。", "enemy", 1];
    return { title: raw[0], desc: raw[1], group: raw[2], count: raw[3], mode: raw[4] || "fixed" };
  }

  function groupLabel(group) {
    return {
      enemy: "敌方目标",
      anyOther: "自己以外的目标",
      allySelf: "自己或友方",
      self: "自己",
      any: "全场",
    }[group] || "目标";
  }

  function targetIndexes(group) {
    const battle = state.room?.battle;
    const current = battle?.players?.[battle.current];
    if (!battle || !current) return [];
    const currentTeam = current.team;
    return (battle.players || [])
      .map((player, index) => ({ player, index }))
      .filter(({ player, index }) => {
        if (!player || player.health <= 0) return false;
        if (group === "self") return index === battle.current;
        if (group === "any") return true;
        if (group === "anyOther") return index !== battle.current;
        if (group === "enemy") return player.team !== currentTeam;
        if (group === "allySelf") return player.team === currentTeam;
        return true;
      })
      .map(({ index }) => index);
  }

  function targetPlan() {
    const pending = pendingAction();
    if (!pending) return null;
    const guide = guideFor(pending);
    const candidates = targetIndexes(guide.group);
    const max = guide.mode === "multi" ? Math.max(guide.count, candidates.length) : guide.count;
    return { ...guide, min: guide.count, max, candidates };
  }

  function deadlineMs() {
    const battle = state.room?.battle;
    const deadline = Date.parse(battle?.pendingAction?.expiresAt || battle?.actionDeadlineAt || 0);
    return deadline ? Math.max(0, deadline - Date.now()) : 0;
  }

  function timeText() {
    const ms = deadlineMs();
    return ms ? `${Math.ceil(ms / 1000)}秒` : "0秒";
  }

  function renderEffects(player) {
    const shields = player.shields || [];
    const normal = shields.filter((shield) => shield.type !== "ice").length;
    const ice = shields.filter((shield) => shield.type === "ice").length;
    const effects = [];
    if (normal) effects.push(["shield", `护盾×${normal}`]);
    if (ice) effects.push(["ice", `冰盾×${ice}`]);
    if ((player.attackMultiplier || 1) > 1) effects.push(["attack", `攻击×${player.attackMultiplier}`]);
    if ((player.healMultiplier || 1) > 1) effects.push(["heal", `治疗×${player.healMultiplier}`]);
    if ((player.actionPoints || 0) > 1) effects.push(["ap", `行动×${player.actionPoints}`]);
    return effects.length
      ? `<div class="effect-row">${effects.map(([type, text]) => `<span class="effect-chip ${type}">${escape(text)}</span>`).join("")}</div>`
      : `<div class="effect-row empty-effect">无特效</div>`;
  }

  function renderBattle() {
    const battle = state.room?.battle;
    const board = $("battleBoard");
    if (!board) return;
    board.hidden = !battle;
    if (!battle) return;
    $("roundText").textContent = `第 ${battle.phase || 1} 回合`;
    $("turnText").textContent = battle.skillText || "等待行动";
    $("rollText").innerHTML = battle.lastRoll
      ? `<span>随机数</span><b>${battle.lastRoll.roll}</b><small>/ ${battle.lastRoll.max} · ${escape(battle.lastRoll.skill)} · ${escape(battle.lastRoll.target)}</small>`
      : `<span>随机数</span><b>--</b><small>等待行动</small>`;
    const plan = targetPlan();
    $("fighterBoard").innerHTML = (battle.players || []).map((player, index) => {
      const hp = Math.max(0, Math.min(100, Number(player.health) || 0));
      const orders = selectedOrders(index);
      const selected = orders.length > 0;
      const selectable = plan?.candidates?.includes(index);
      return `<article class="fighter-card ${battle.current === index ? "current" : ""} ${selected ? "selected" : ""} ${selectable ? "selectable" : ""} ${player.health <= 0 ? "dead" : ""}" data-target-index="${index}">
        ${selected ? `<b class="target-badge">${orders.join("/")}</b>` : ""}
        <div class="fighter-head"><strong>${escape(player.displayName)}</strong><small>${escape(seatTeamLabel(state.room.mode, player.seatIndex))}</small></div>
        <div class="hp-bar ${hpTone(hp)}"><span style="width:${hp}%"></span></div>
        <footer><span>HP ${Math.max(0, player.health)}</span><span>行动 ${player.actionPoints || 0}</span></footer>
        ${renderEffects(player)}
      </article>`;
    }).join("");
    $("battleLog").innerHTML = (battle.logs || []).map((entry) => `<p ${entry.color ? `style="color:${entry.color}"` : ""}>${escape(entry.text)}</p>`).join("");
    $("logCount").textContent = C.fmt.format((battle.logs || []).length);
    renderTargets();
  }

  function renderTargets() {
    const battle = state.room?.battle;
    const canAct = canCurrentUserAct();
    const pending = pendingAction();
    const plan = targetPlan();
    const living = (battle?.players || []).map((player, index) => ({ player, index })).filter(({ player }) => player.health > 0);
    const valid = new Set(living.map(({ index }) => index));
    state.targets.steps = state.targets.steps.filter((index) => valid.has(index));
    const activeList = state.targets.steps;
    const selectedNames = activeList.map((index) => battle.players[index]?.displayName).filter(Boolean);
    const need = plan ? Math.max(0, plan.min - activeList.length) : 0;
    if ($("targetHint")) {
      if (!canAct) $("targetHint").textContent = isAiTurn() ? "AI 思考中，稍等一下" : "等待其他玩家行动";
      else if (!pending) $("targetHint").textContent = `点击“行动”触发技能，本次思考上限 ${timeText()}`;
      else if (!plan?.max) {
        $("targetHint").textContent = `本次：${pending.name}。无需选择目标，点击按钮释放。剩余 ${timeText()}`;
      } else if (need > 0) {
        $("targetHint").textContent = `第 ${activeList.length + 1} 步：选择${groupLabel(plan.group)}。已选 ${selectedNames.length ? selectedNames.join(" / ") : "无"}，剩余 ${timeText()}`;
      } else {
        $("targetHint").textContent = `目标已就绪：${selectedNames.join(" / ")}。点击“选择目标”结算，剩余 ${timeText()}`;
      }
    }
    if ($("skillPanel")) {
      $("skillPanel").hidden = !pending;
      if (pending) {
        const guide = guideFor(pending);
        $("skillPanel").innerHTML = `<b>${escape(pending.name)}</b><span>${escape(guide.desc)}</span><em>${timeText()}</em>`;
      }
    }
    if ($("actButton")) {
      $("actButton").textContent = pending ? (plan?.max ? "选择目标" : "释放技能") : "行动";
      $("actButton").disabled = !canAct || Boolean(pending && plan?.max && activeList.length < plan.min);
    }
  }

  function collectTargets() {
    const list = state.targets.steps.filter((value) => value != null);
    const fallback = list[0] ?? 0;
    return {
      primary: list[0] ?? fallback,
      secondary: list[1] ?? fallback,
      tertiary: list[2] ?? list[1] ?? fallback,
      multi: list,
    };
  }

  function chooseTarget(index) {
    const battle = state.room?.battle;
    const current = battle?.players?.[battle.current];
    const canAct = Boolean(current && state.room.mySeats?.includes(current.seatIndex) && !battle.gameOver);
    const target = battle?.players?.[index];
    if (!canAct || !target || target.health <= 0) return;
    if (!pendingAction()) {
      C.toast("先行动触发技能，再选目标");
      return;
    }
    const plan = targetPlan();
    if (!plan?.candidates?.includes(index)) {
      C.toast(`请选择${groupLabel(plan?.group)}`);
      return;
    }
    if (state.targets.steps.length >= (plan.max || 0)) state.targets.steps = state.targets.steps.slice(0, -1);
    state.targets.steps = [...state.targets.steps, index];
    renderBattle();
  }

  function isAiTurn() {
    const battle = state.room?.battle;
    const current = battle?.players?.[battle.current];
    return Boolean(current?.username?.startsWith("AI#") && !battle.gameOver);
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
    const inBattle = Boolean(state.room.battle);
    document.body.classList.toggle("is-battling", inBattle);
    $("startBattle").hidden = !isHost || locked;
    $("addAi").hidden = !isHost || locked || state.room.count >= state.room.maxSeats;
    $("actAi").hidden = true;
    $("leaveRoom").hidden = !inRoom || state.room.status === "playing";
    $("backLobby").hidden = false;
    $("resetBattle").hidden = state.room.host !== state.user?.username || !state.room.battle;
    if ($("startBattle")) $("startBattle").closest(".room-command").hidden = state.room.status === "playing";
    renderSeats();
    if ($("seatBoard")) $("seatBoard").hidden = inBattle;
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
      const pending = pendingAction();
      if (!pending) clearTargets();
      const payload = pending
        ? await API.resolve(state.room.code, collectTargets())
        : await API.roll(state.room.code);
      state.room = payload.room;
      if (pending) clearTargets();
      renderGameRoom();
    } catch (error) {
      C.toast(error.message);
    }
  }

  async function actAi() {
    if (!state.room?.code) return;
    try {
      const payload = await API.actAi(state.room.code);
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
    }, 700);
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

  function renderMatchList(matches = []) {
    const node = $("matchList");
    if (!node) return;
    node.innerHTML = matches.length ? matches.map((match) => {
      const won = (match.winners || []).includes(state.user?.username);
      return `<article class="match-row">
        <div><strong>${escape(match.label || match.mode)}</strong><span>${escape(match.code)} · ${new Date(match.finishedAt).toLocaleString("zh-CN", { hour12: false })}</span></div>
        <em class="${won ? "win" : "lose"}">${won ? "胜利" : "落败"}</em>
        <small>${escape((match.participants || []).join(" / "))}</small>
        <button class="mini-button" type="button" data-replay-id="${escape(match.id)}">回放 ${C.fmt.format(match.replayCount || 0)}</button>
      </article>`;
    }).join("") : `<div class="empty-state">暂无作战记录。</div>`;
  }

  function renderReplayFrame() {
    const viewer = $("replayViewer");
    const match = state.replay.match;
    if (!viewer || !match) return;
    const frames = match.replay || [];
    const frame = frames[state.replay.index] || frames[0];
    if (!frame?.battle) {
      viewer.hidden = false;
      viewer.innerHTML = `<div class="empty-state">这场没有可用回放。</div>`;
      return;
    }
    const battle = frame.battle;
    viewer.hidden = false;
    viewer.innerHTML = `<div class="replay-head">
      <strong>${escape(match.label)} · ${escape(match.code)}</strong>
      <span>${state.replay.index + 1} / ${frames.length}</span>
    </div>
    <div class="replay-stage">
      ${(battle.players || []).map((player) => {
        const hp = Math.max(0, Number(player.health) || 0);
        return `<div class="replay-fighter ${player.health <= 0 ? "dead" : ""}">
          <strong>${escape(player.displayName)}</strong>
          <div class="hp-bar ${hpTone(hp)}"><span style="width:${Math.min(100, hp)}%"></span></div>
          <small>HP ${hp} · 护盾 ${player.shield || 0} · 行动 ${player.actionPoints || 0}</small>
        </div>`;
      }).join("")}
    </div>
    <p class="hint-line">${escape(frame.label || "")} · ${escape(battle.skillText || "")}</p>
    <div class="replay-controls">
      <button class="mini-button" type="button" data-replay-step="prev">上一步</button>
      <button class="mini-button" type="button" data-replay-step="next">下一步</button>
    </div>`;
  }

  async function openReplay(id) {
    try {
      const payload = await API.match(id);
      state.replay = { match: payload.match, index: 0 };
      renderReplayFrame();
    } catch (error) {
      C.toast(error.message);
    }
  }

  async function renderMe() {
    C.renderNav("me");
    const me = await loadMe();
    if (!state.user) {
      $("profileName").textContent = "未登录";
      $("statsGrid").innerHTML = `<a class="primary-cta" href="/index.html">去登录</a>`;
      renderMatchList([]);
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
      renderMatchList(me?.matches || []);
    }
    $("matchList")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-replay-id]");
      if (button) openReplay(button.dataset.replayId);
    });
    $("replayViewer")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-replay-step]");
      if (!button || !state.replay.match) return;
      const frames = state.replay.match.replay || [];
      state.replay.index = button.dataset.replayStep === "next"
        ? Math.min(frames.length - 1, state.replay.index + 1)
        : Math.max(0, state.replay.index - 1);
      renderReplayFrame();
    });
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
      } else if (button.dataset.roomAction === "watch") {
        API.roomCode = code;
        C.navigate("game.html");
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
    $("actAi")?.addEventListener("click", actAi);
    $("leaveRoom")?.addEventListener("click", leaveRoom);
    $("backLobby")?.addEventListener("click", backLobby);
    $("resetBattle")?.addEventListener("click", resetBattle);
    $("actButton")?.addEventListener("click", act);
    $("fighterBoard")?.addEventListener("click", (event) => {
      const card = event.target.closest("[data-target-index]");
      if (!card) return;
      chooseTarget(Number(card.dataset.targetIndex));
    });
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
