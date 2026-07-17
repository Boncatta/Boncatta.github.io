export const COLORS = {
  attack: "#ef4444",
  survive: "#22c55e",
  utility: "#38bdf8",
  hybrid: "#a78bfa",
  ultimate: "#f59e0b",
};

export const SKILL_META = {
  normal_attack: ["普通攻击", COLORS.attack],
  critical_hit: ["致命暴击", COLORS.attack],
  gain_shield: ["护盾", COLORS.survive],
  self_harm: ["反噬", COLORS.attack],
  heal: ["治疗", COLORS.survive],
  red_recovery: ["赤色复苏", COLORS.survive],
  critical_heal: ["暴疗", COLORS.survive],
  two_more: ["再抽", COLORS.utility],
  blood_swap: ["换血", COLORS.utility],
  blood_swap1: ["换血追击", COLORS.attack],
  silence: ["沉默", COLORS.utility],
  undead_ultimate: ["终焉之剑", COLORS.ultimate],
  ice_attack: ["寒冰攻击", COLORS.attack],
  ice_shield: ["冰晶护盾", COLORS.survive],
  ice_silence: ["寂灭冰封", COLORS.utility],
  bomb_attack: ["爆炸瓶", COLORS.attack],
  double_attack: ["燃血轰击", COLORS.attack],
  poison_attack: ["毒瓶", COLORS.attack],
  mage_ultimate: ["绝对零度", COLORS.ultimate],
  medicine_both_heal: ["群体治疗", COLORS.survive],
  medicine_crit_heal: ["嗜血之疗", COLORS.hybrid],
  medicine_crit_silence: ["沉默重击", COLORS.attack],
  medicine_boost_heal: ["治愈整备", COLORS.utility],
  medicine_mega_heal: ["愈合秘法", COLORS.ultimate],
  double_normal_attack: ["双重打击", COLORS.attack],
  attack_and_draw: ["快速袭击", COLORS.attack],
  attack_and_heal: ["嗜血一击", COLORS.hybrid],
  attack_and_shield: ["持盾袭击", COLORS.hybrid],
  half_hp_and_attack: ["裂空一击", COLORS.attack],
  double_next_attack: ["力量凝聚", COLORS.utility],
  self_harm_and_triple_critical: ["毁灭三连", COLORS.ultimate],
  double_deduction: ["无畏冲击", COLORS.attack],
  double_deduction_and_draw: ["无畏连打", COLORS.attack],
  half_hp_both: ["生命削减", COLORS.attack],
  attack_critical_draw: ["暴力连打", COLORS.attack],
  double_deduction_30_attack_critical_draw: ["终极连招", COLORS.ultimate],
  both_heal_10: ["双加10", COLORS.survive],
  critical_and_critical_heal_and_draw: ["未来之击", COLORS.ultimate],
  shield_and_self_harm_10: ["荆棘之盾", COLORS.survive],
  knight_ultimate: ["骑士奥义", COLORS.ultimate],
};

export const CHARACTER_DEFS = [
  { id: "undead", name: "亡灵战神", desc: "掌控黑暗之力的不死战士", skills: [["普通攻击", 30, "normal_attack"], ["致命暴击", 10, "critical_hit"], ["骸骨护盾", 15, "gain_shield"], ["黑暗反噬", 5, "self_harm"], ["生灵禁术", 15, "blood_swap1"], ["死亡尖啸", 5, "silence"], ["深渊治愈", 4, "heal"], ["燃血轰击", 15, "double_attack"], ["终焉之剑", 1, "undead_ultimate"]] },
  { id: "frost", name: "冰霜法师", desc: "操纵寒冰之力的法术大师", skills: [["普通攻击", 30, "normal_attack"], ["治疗之术", 10, "heal"], ["冰晶护盾", 15, "ice_shield"], ["寂灭冰封", 15, "ice_silence"], ["爆裂黎明", 5, "bomb_attack"], ["致命毒药", 4, "poison_attack"], ["冰蓝末日", 10, "ice_attack"], ["赤色复苏", 10, "red_recovery"], ["绝对零度", 1, "mage_ultimate"]] },
  { id: "loser", name: "流浪之人", desc: "搜寻垃圾之力的超级战士", skills: [["捡起棍子", 55, "normal_attack"], ["捡起药瓶", 25, "heal"], ["高效捡拾", 20, "two_more"]] },
  { id: "medicine", name: "药药超人", desc: "精通治疗之术的医疗专家", skills: [["普通攻击", 30, "normal_attack"], ["治疗之术", 30, "heal"], ["群体治疗", 10, "medicine_both_heal"], ["嗜血之疗", 10, "medicine_crit_heal"], ["沉默重击", 10, "medicine_crit_silence"], ["治愈整备", 9, "medicine_boost_heal"], ["愈合秘法", 1, "medicine_mega_heal"]] },
  { id: "legend", name: "传奇大剑", desc: "手持剑阁巨剑的战场主宰", skills: [["普通攻击", 40, "normal_attack"], ["治疗之术", 20, "heal"], ["双重打击", 10, "double_normal_attack"], ["快速袭击", 5, "attack_and_draw"], ["嗜血一击", 5, "attack_and_heal"], ["持盾袭击", 5, "attack_and_shield"], ["裂空一击", 5, "half_hp_and_attack"], ["力量凝聚", 9, "double_next_attack"], ["毁灭三连", 1, "self_harm_and_triple_critical"]] },
  { id: "car", name: "车王祥子", desc: "速度激情魔力的至高化身", skills: [["普通攻击", 10, "normal_attack"], ["致命暴击", 30, "critical_hit"], ["治疗之术", 10, "heal"], ["狂暴治疗", 15, "critical_heal"], ["无畏冲击", 15, "double_deduction"], ["无畏连打", 10, "double_deduction_and_draw"], ["生命削减", 4, "half_hp_both"], ["暴力连打", 5, "attack_critical_draw"], ["终极连招", 1, "double_deduction_30_attack_critical_draw"]] },
  { id: "tata", name: "塔塔塔塔", desc: "喜欢用火把的塔希斯小姐", skills: [["普通攻击", 35, "normal_attack"], ["治疗之术", 15, "heal"], ["致命暴击", 10, "critical_hit"], ["狂暴治疗", 5, "critical_heal"], ["不凡护盾", 5, "gain_shield"], ["无畏冲击", 4, "double_deduction"], ["群体治疗", 4, "both_heal_10"], ["无中生有", 7, "two_more"], ["沉默猫咪", 5, "silence"], ["生命转换", 3, "blood_swap"], ["生命削减", 6, "half_hp_both"], ["未来之击", 1, "critical_and_critical_heal_and_draw"]] },
  { id: "knight", name: "剑盾骑士", desc: "顶级攻守兼备的战场守护", skills: [["普通攻击", 25, "normal_attack"], ["治疗之术", 5, "heal"], ["连续打击", 20, "attack_and_draw"], ["守护之盾", 25, "gain_shield"], ["荆棘之盾", 5, "shield_and_self_harm_10"], ["重压晕眩", 6, "silence"], ["生命削减", 13, "half_hp_both"], ["骑士奥义", 1, "knight_ultimate"]] },
];

export const CHARACTER_BY_ID = Object.fromEntries(CHARACTER_DEFS.map((item) => [item.id, item]));
export const DEFAULT_CHARS = ["undead", "frost", "medicine", "knight"];

export const MODES = {
  duel: {
    label: "1v1 经典",
    short: "1v1",
    maxSeats: 2,
    minStart: 2,
    setup: "single",
    teamOf: (index) => index,
    note: "两名玩家各控制一名角色，最后存活者获胜。",
  },
  commander: {
    label: "2v2 指挥官",
    short: "指挥官",
    maxSeats: 4,
    minStart: 4,
    setup: "team",
    teamOf: (index) => (index < 2 ? 0 : 1),
    note: "两名真实玩家各控制两名角色；房主队对访客队。",
  },
  team4: {
    label: "2v2 四玩家",
    short: "四玩家",
    maxSeats: 4,
    minStart: 4,
    setup: "single",
    teamOf: (index) => (index === 0 || index === 2 ? 0 : 1),
    note: "四名真实玩家各控制一名角色；1、3 号为一队，2、4 号为一队。",
  },
  ffa: {
    label: "多人混战",
    short: "混战",
    maxSeats: 4,
    minStart: 2,
    setup: "single",
    teamOf: (index) => index,
    note: "最多四名玩家各自为战，最后存活者获胜。",
  },
};

export function cleanUsername(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 18);
}

export function cleanSelection(selection, fallbackName = "玩家", fallbackCharacter = "undead") {
  const def = CHARACTER_BY_ID[selection?.characterId] || CHARACTER_BY_ID[fallbackCharacter] || CHARACTER_DEFS[0];
  const name = String(selection?.name || fallbackName).trim().replace(/\s+/g, " ").slice(0, 18) || fallbackName;
  return { name, characterId: def.id };
}

export function makeSeats(mode) {
  const config = MODES[mode] || MODES.duel;
  return Array.from({ length: config.maxSeats }, (_, index) => ({
    index,
    occupied: false,
    username: "",
    team: config.teamOf(index),
    selection: cleanSelection({}, `空位${index + 1}`, DEFAULT_CHARS[index] || "undead"),
  }));
}

export function seatTeamLabel(mode, index) {
  if (mode === "ffa") return `独立阵营 ${index + 1}`;
  if (mode === "team4") return index === 0 || index === 2 ? "一队" : "二队";
  if (mode === "commander") return index < 2 ? "一队" : "二队";
  return index === 0 ? "房主" : "访客";
}

export function seatsForUser(room, username) {
  return (room.seats || []).filter((seat) => seat.username === username).map((seat) => seat.index);
}

export function applySelectionsToRoom(room, username, selections) {
  const picked = Array.isArray(selections) ? selections : [selections];
  const mine = seatsForUser(room, username);
  for (let i = 0; i < mine.length; i += 1) {
    const seatIndex = mine[i];
    const fallback = DEFAULT_CHARS[seatIndex] || "undead";
    room.seats[seatIndex].selection = cleanSelection(picked[i] || picked[0], username, fallback);
  }
  room.updatedAt = new Date().toISOString();
  return room;
}

export function createFighter(seat, mode) {
  const def = CHARACTER_BY_ID[seat.selection.characterId] || CHARACTER_DEFS[0];
  return {
    seatIndex: seat.index,
    username: seat.username,
    team: (MODES[mode] || MODES.duel).teamOf(seat.index),
    displayName: `${seat.selection.name}(${def.name})`,
    playerName: seat.selection.name,
    characterId: def.id,
    characterName: def.name,
    health: 100,
    shield: 0,
    shields: [],
    actionPoints: 0,
    healMultiplier: 1,
    attackMultiplier: 1,
  };
}

export class BattleEngine {
  constructor(mode, seats) {
    this.mode = mode in MODES ? mode : "duel";
    this.config = MODES[this.mode];
    this.players = seats.map((seat) => createFighter(seat, this.mode));
    this.turnOrder = this.players.map((_, index) => index);
    this.current = this.firstAliveIndex();
    this.phase = 1;
    this.gameOver = false;
    this.skillText = "等待行动";
    this.skillColor = "#93a4b8";
    this.lastRoll = null;
    this.pendingAction = null;
    this.winnerTeam = null;
    this.logs = [];
    if (this.current != null) this.players[this.current].actionPoints = 1;
    this.log(`${this.config.label} 战斗开始。`);
    this.log(`${this.currentFighter()?.displayName || "未知角色"} 先手行动。`);
  }

  static fromSnapshot(snapshot, fallbackMode = "duel") {
    const engine = Object.create(BattleEngine.prototype);
    engine.mode = snapshot?.mode || fallbackMode;
    engine.config = MODES[engine.mode] || MODES.duel;
    engine.players = (snapshot?.players || []).map((player) => ({
      ...player,
      shields: (player.shields || []).map((shield) => ({ ...shield })),
    }));
    engine.turnOrder = snapshot?.turnOrder || engine.players.map((_, index) => index);
    engine.current = snapshot?.current ?? null;
    engine.phase = snapshot?.phase || 1;
    engine.gameOver = Boolean(snapshot?.gameOver);
    engine.skillText = snapshot?.skillText || "等待行动";
    engine.skillColor = snapshot?.skillColor || "#93a4b8";
    engine.lastRoll = snapshot?.lastRoll || null;
    engine.pendingAction = snapshot?.pendingAction ? { ...snapshot.pendingAction } : null;
    engine.winnerTeam = snapshot?.winnerTeam ?? null;
    engine.logs = snapshot?.logs || [];
    return engine;
  }

  clone() {
    return {
      mode: this.mode,
      players: this.players.map((player) => ({ ...player, shields: (player.shields || []).map((shield) => ({ ...shield })) })),
      turnOrder: this.turnOrder.slice(),
      current: this.current,
      phase: this.phase,
      gameOver: this.gameOver,
      skillText: this.skillText,
      skillColor: this.skillColor,
      lastRoll: this.lastRoll,
      pendingAction: this.pendingAction ? { ...this.pendingAction } : null,
      winnerTeam: this.winnerTeam,
      logs: this.logs.slice(-260),
    };
  }

  log(text, color = "") {
    this.logs.push({ text, color });
  }

  currentFighter() {
    return this.current == null ? null : this.players[this.current];
  }

  teamOfSeat(seatIndex) {
    return this.config.teamOf(seatIndex);
  }

  firstAliveIndex() {
    return this.turnOrder.find((index) => this.players[index]?.health > 0) ?? null;
  }

  aliveIndexes(group = "any") {
    const attacker = this.currentFighter();
    return this.players
      .map((player, index) => ({ player, index }))
      .filter(({ player, index }) => {
        if (!player || player.health <= 0) return false;
        if (!attacker) return true;
        if (group === "self") return index === this.current;
        if (group === "any") return true;
        if (group === "anyOther") return index !== this.current;
        if (group === "enemy") return this.teamOfSeat(player.seatIndex) !== this.teamOfSeat(attacker.seatIndex);
        if (group === "allySelf") return this.teamOfSeat(player.seatIndex) === this.teamOfSeat(attacker.seatIndex);
        if (group === "ally") return index !== this.current && this.teamOfSeat(player.seatIndex) === this.teamOfSeat(attacker.seatIndex);
        return true;
      })
      .map(({ index }) => index);
  }

  normalizeTargets(raw = {}) {
    const clean = (value) => {
      const parsed = Number(value);
      return Number.isInteger(parsed) ? parsed : null;
    };
    return {
      primary: clean(raw.primary),
      secondary: clean(raw.secondary),
      tertiary: clean(raw.tertiary),
      multi: Array.isArray(raw.multi) ? raw.multi.map(clean).filter((value) => value != null) : [],
    };
  }

  context(raw) {
    return { targets: this.normalizeTargets(raw), used: new Set() };
  }

  mark(ctx, target) {
    if (ctx && target) ctx.used.add(target.displayName);
  }

  target(ctx, slot, group, fallbackGroup = group) {
    const valid = this.aliveIndexes(group);
    const requested = ctx.targets[slot];
    if (valid.includes(requested)) return this.players[requested];
    const fallback = fallbackGroup === group ? valid : this.aliveIndexes(fallbackGroup);
    return this.players[fallback[0]] || null;
  }

  targets(ctx, group, fallback = "one") {
    const valid = this.aliveIndexes(group);
    const picked = ctx.targets.multi.filter((index) => valid.includes(index));
    if (picked.length) return picked.map((index) => this.players[index]);
    for (const slot of ["primary", "secondary", "tertiary"]) {
      if (valid.includes(ctx.targets[slot])) return [this.players[ctx.targets[slot]]];
    }
    if (fallback === "all") return valid.map((index) => this.players[index]);
    return valid.slice(0, 1).map((index) => this.players[index]);
  }

  combo(ctx, group, count) {
    const valid = this.aliveIndexes(group);
    const slots = ["primary", "secondary", "tertiary"];
    const picked = slots.map((slot) => ctx.targets[slot]).filter((index) => valid.includes(index));
    if (!picked.length && valid.length) picked.push(valid[0]);
    while (picked.length < count && picked.length) picked.push(picked[picked.length - 1]);
    return picked.slice(0, count).map((index) => this.players[index]);
  }

  addShield(target, type = "normal", count = 1, source = null, ctx = null) {
    if (!target) return;
    target.shields = target.shields || [];
    for (let index = 0; index < count; index += 1) target.shields.push({ type });
    target.shield = target.shields.length;
    this.log(`${source?.displayName || target.displayName} 为 ${target.displayName} 添加${type === "ice" ? "冰晶" : ""}护盾。`);
    this.mark(ctx, target);
  }

  breakShield(target, reason) {
    target.shields = target.shields || [];
    const shield = target.shields.shift() || { type: "normal" };
    target.shield = target.shields.length;
    this.log(`${target.displayName} 的${shield.type === "ice" ? "冰晶" : ""}护盾抵挡了${reason}。`);
    if (shield.type === "ice") {
      target.health -= 10;
      this.log(`${target.displayName} 的冰晶护盾破碎，损失10点生命值。`);
    }
  }

  damage(target, amount, source, label, ctx, blockable = true) {
    if (!target || target.health <= 0) return;
    if (blockable && target.shield > 0) {
      this.breakShield(target, label);
      this.mark(ctx, target);
      return;
    }
    target.health -= amount;
    this.log(`${source.displayName} 对 ${target.displayName} 造成${amount}点${label}。`);
    this.mark(ctx, target);
  }

  heal(target, amount, source, ctx) {
    if (!target || target.health <= 0) return;
    target.health += amount;
    this.log(`${source.displayName} 使 ${target.displayName} 恢复${amount}点生命值。`);
    this.mark(ctx, target);
  }

  swapHealth(attacker, target, ctx) {
    if (!target || target.health <= 0) return;
    [attacker.health, target.health] = [target.health, attacker.health];
    this.log(`${attacker.displayName} 与 ${target.displayName} 交换生命值。`);
    this.mark(ctx, target);
  }

  silence(target, amount, source, ctx) {
    if (!target || target.health <= 0) return;
    target.actionPoints -= amount;
    this.log(`${source.displayName} 沉默 ${target.displayName}，行动点减少${amount}。`);
    this.mark(ctx, target);
  }

  allDamage(attacker, amount, label, ctx) {
    for (const target of this.aliveIndexes("any").map((index) => this.players[index])) this.damage(target, amount, attacker, label, ctx);
  }

  allHalf(attacker, ctx) {
    this.log(`${attacker.displayName} 发动全场生命削减。`);
    for (const target of this.aliveIndexes("any").map((index) => this.players[index])) {
      if (target.shield > 0) {
        this.breakShield(target, "生命削减");
      } else {
        const next = Math.max(1, Math.floor(target.health / 2));
        const lost = target.health - next;
        target.health = next;
        this.log(`${target.displayName} 生命减半，失去${lost}点生命值。`);
      }
      this.mark(ctx, target);
    }
  }

  teamsAlive() {
    const teams = new Set();
    for (const player of this.players) {
      if (player.health > 0) teams.add(this.teamOfSeat(player.seatIndex));
    }
    return teams;
  }

  checkGameOver() {
    const teams = this.teamsAlive();
    if (teams.size > 1) return false;
    this.gameOver = true;
    this.current = null;
    this.pendingAction = null;
    this.winnerTeam = teams.size ? [...teams][0] : null;
    if (!teams.size) this.skillText = "平局。";
    else {
      const team = [...teams][0];
      this.skillText = this.mode === "ffa" || this.mode === "duel"
        ? `${this.players.find((player) => player.health > 0 && this.teamOfSeat(player.seatIndex) === team)?.displayName || "幸存者"} 获胜。`
        : `${team === 0 ? "一队" : "二队"} 获胜。`;
    }
    this.skillColor = COLORS.ultimate;
    this.log(this.skillText);
    return true;
  }

  advanceTurn() {
    if (this.checkGameOver()) return;
    this.pendingAction = null;
    const old = this.turnOrder.indexOf(this.current);
    let pointer = old >= 0 ? old : 0;
    for (let guard = 0; guard < this.turnOrder.length * 6; guard += 1) {
      pointer = (pointer + 1) % this.turnOrder.length;
      if (pointer === 0) {
        this.phase += 1;
        this.log(`第 ${this.phase} 回合开始。`);
      }
      const next = this.turnOrder[pointer];
      const player = this.players[next];
      if (!player || player.health <= 0) continue;
      player.actionPoints += 1;
      if (player.actionPoints <= 0) {
        this.log(`${player.displayName} 被沉默压制，跳过本次行动。`);
        continue;
      }
      this.current = next;
      this.log(`${player.displayName} 开始行动。`);
      return;
    }
  }

  takeAction(rawTargets) {
    if (this.gameOver || this.current == null) return;
    this.rollPendingAction();
    this.resolvePendingAction(rawTargets);
  }

  rollPendingAction() {
    if (this.gameOver || this.current == null) return null;
    const attacker = this.currentFighter();
    if (!attacker) return null;
    if (this.pendingAction?.attackerIndex === this.current) return this.pendingAction;
    const result = this.rollSkill(attacker);
    const meta = result.handler ? SKILL_META[result.handler] : null;
    this.skillColor = meta?.[1] || "#e2e8f0";
    this.pendingAction = {
      name: result.name,
      handler: result.handler,
      roll: result.roll,
      range: result.range,
      attackerIndex: this.current,
      attackerName: attacker.displayName,
    };
    this.lastRoll = result.roll ? { roll: result.roll, max: 100, skill: result.name, target: "等待选择目标", range: result.range } : null;
    this.skillText = `${attacker.displayName} 掷出了 [${result.name}] · 随机数 ${result.roll}/100`;
    return this.pendingAction;
  }

  resolvePendingAction(rawTargets) {
    if (this.gameOver || this.current == null) return;
    const attacker = this.currentFighter();
    if (!attacker) return;
    if (!this.pendingAction || this.pendingAction.attackerIndex !== this.current) this.rollPendingAction();
    const action = this.pendingAction;
    if (!action) return;
    const ctx = this.context(rawTargets);
    if (action.handler) this.apply(action.handler, attacker, ctx);
    const meta = action.handler ? SKILL_META[action.handler] : null;
    this.skillColor = meta?.[1] || "#e2e8f0";
    const targetLabel = ctx.used.size ? [...ctx.used].join("、") : "未命中目标";
    this.lastRoll = action.roll ? { roll: action.roll, max: 100, skill: action.name, target: targetLabel, range: action.range } : null;
    this.skillText = `${attacker.displayName} 使用了 [${action.name}] · 随机数 ${action.roll}/100 · 目标 ${targetLabel}`;
    this.pendingAction = null;
    attacker.actionPoints -= 1;
    if (this.checkGameOver()) return;
    if (attacker.actionPoints <= 0) this.advanceTurn();
  }

  rollSkill(attacker) {
    const def = CHARACTER_BY_ID[attacker.characterId] || CHARACTER_DEFS[0];
    const roll = Math.floor(Math.random() * 100) + 1;
    this.log(`${attacker.displayName} 行动随机数：${roll}/100。`, "#93c5fd");
    let cumulative = 0;
    for (const [name, probability, handler] of def.skills) {
      const start = cumulative + 1;
      cumulative += probability;
      if (roll <= cumulative) {
        this.log(`命中区间：${start}-${cumulative}，技能：[${name}]`, "#93c5fd");
        return { name, handler, roll, range: [start, cumulative] };
      }
    }
    return { name: "犹豫不决", handler: "", roll, range: null };
  }

  apply(handler, attacker, ctx) {
    const enemy = () => this.target(ctx, "primary", "enemy");
    const ally = () => this.target(ctx, "primary", "allySelf", "self") || attacker;
    const selfHeal = (amount) => this.heal(attacker, amount * attacker.healMultiplier, attacker, ctx);
    const groupHeal = (amount) => this.targets(ctx, "allySelf", "one").forEach((target) => this.heal(target, amount * attacker.healMultiplier, attacker, ctx));
    const normal = (target, mult = attacker.attackMultiplier) => this.damage(target, 10 * mult, attacker, "攻击伤害", ctx);
    const crit = (target, mult = attacker.attackMultiplier) => this.damage(target, 20 * mult, attacker, "暴击伤害", ctx);
    const resetAttack = () => { attacker.attackMultiplier = 1; };
    const handlers = {
      normal_attack: () => { normal(enemy()); resetAttack(); },
      critical_hit: () => { crit(enemy()); resetAttack(); },
      gain_shield: () => this.addShield(ally(), "normal", 1, attacker, ctx),
      ice_shield: () => this.targets(ctx, "allySelf", "one").forEach((target) => this.addShield(target, "ice", 1, attacker, ctx)),
      self_harm: () => this.damage(attacker, 10, attacker, "反噬伤害", ctx),
      heal: () => { selfHeal(10); attacker.healMultiplier = 1; },
      red_recovery: () => { selfHeal(30); attacker.healMultiplier = 1; },
      critical_heal: () => { selfHeal(20); attacker.healMultiplier = 1; },
      two_more: () => { attacker.actionPoints += 2; this.log(`${attacker.displayName} 获得2个额外行动点。`); this.mark(ctx, attacker); },
      blood_swap: () => this.swapHealth(attacker, this.target(ctx, "primary", "anyOther"), ctx),
      blood_swap1: () => { const target = this.target(ctx, "primary", "anyOther"); this.swapHealth(attacker, target, ctx); this.damage(target, 10, attacker, "换血追击", ctx); },
      silence: () => this.silence(enemy(), 3, attacker, ctx),
      undead_ultimate: () => { const target = this.target(ctx, "primary", "anyOther"); this.swapHealth(attacker, target, ctx); crit(target); this.addShield(attacker, "normal", 1, attacker, ctx); resetAttack(); },
      ice_attack: () => this.damage(enemy(), 30, attacker, "寒冰伤害", ctx),
      ice_silence: () => this.targets(ctx, "anyOther", "all").forEach((target) => this.silence(target, 1, attacker, ctx)),
      bomb_attack: () => { this.targets(ctx, "enemy", "all").forEach((target) => this.damage(target, 20, attacker, "爆裂伤害", ctx)); this.damage(attacker, 20, attacker, "爆裂反冲", ctx); },
      double_attack: () => { this.damage(enemy(), 20 * attacker.attackMultiplier, attacker, "燃血轰击", ctx); resetAttack(); this.damage(attacker, 10, attacker, "反噬伤害", ctx); },
      poison_attack: () => { this.targets(ctx, "enemy", "all").forEach((target) => this.damage(target, 10, attacker, "毒药伤害", ctx)); this.damage(attacker, 30, attacker, "毒雾反噬", ctx); },
      mage_ultimate: () => { this.damage(enemy(), 30, attacker, "绝对零度", ctx); this.heal(attacker, 30, attacker, ctx); },
      medicine_both_heal: () => { groupHeal(10); attacker.healMultiplier = 1; },
      medicine_crit_heal: () => { crit(enemy()); selfHeal(10); attacker.healMultiplier = 1; resetAttack(); },
      medicine_crit_silence: () => { const target = enemy(); crit(target); this.silence(target, 1, attacker, ctx); resetAttack(); },
      medicine_boost_heal: () => { attacker.healMultiplier *= 2; this.log(`${attacker.displayName} 强化治疗效果。`); this.mark(ctx, attacker); },
      medicine_mega_heal: () => { selfHeal(60); attacker.healMultiplier = 1; },
      double_normal_attack: () => { const mult = attacker.attackMultiplier; this.combo(ctx, "enemy", 2).forEach((target) => normal(target, mult)); resetAttack(); },
      attack_and_draw: () => { normal(enemy()); resetAttack(); attacker.actionPoints += 1; this.log(`${attacker.displayName} 获得1个额外行动点。`); },
      attack_and_heal: () => { normal(enemy()); resetAttack(); selfHeal(10); attacker.healMultiplier = 1; },
      attack_and_shield: () => { normal(enemy()); resetAttack(); this.addShield(this.target(ctx, "secondary", "allySelf", "self") || attacker, "normal", 1, attacker, ctx); },
      half_hp_and_attack: () => { this.allHalf(attacker, ctx); normal(enemy()); resetAttack(); },
      double_next_attack: () => { attacker.attackMultiplier *= 2; this.log(`${attacker.displayName} 下次攻击威力翻倍。`); this.mark(ctx, attacker); },
      self_harm_and_triple_critical: () => { const mult = attacker.attackMultiplier; this.combo(ctx, "enemy", 3).forEach((target) => crit(target, mult)); resetAttack(); if (!this.checkGameOver()) this.damage(attacker, 40, attacker, "毁灭代价", ctx, false); },
      double_deduction: () => this.allDamage(attacker, 10, "全场冲击", ctx),
      double_deduction_and_draw: () => { this.allDamage(attacker, 10, "全场连打", ctx); attacker.actionPoints += 1; },
      half_hp_both: () => this.allHalf(attacker, ctx),
      attack_critical_draw: () => { const [a, b] = this.combo(ctx, "enemy", 2); normal(a); crit(b); resetAttack(); attacker.actionPoints += 1; },
      double_deduction_30_attack_critical_draw: () => { this.allDamage(attacker, 30, "终极全场冲击", ctx); const [a, b] = this.combo(ctx, "enemy", 2); normal(a); crit(b); resetAttack(); attacker.actionPoints += 1; },
      both_heal_10: () => { groupHeal(10); attacker.healMultiplier = 1; },
      critical_and_critical_heal_and_draw: () => { crit(enemy()); resetAttack(); selfHeal(20); attacker.healMultiplier = 1; attacker.actionPoints += 2; },
      shield_and_self_harm_10: () => { this.addShield(ally(), "normal", 1, attacker, ctx); this.damage(attacker, 10, attacker, "不可格挡反噬", ctx, false); },
      knight_ultimate: () => { crit(enemy()); resetAttack(); attacker.actionPoints += 1; this.addShield(attacker, "normal", 3, attacker, ctx); },
    };
    (handlers[handler] || (() => this.log(`技能 ${handler} 暂未实现。`)))();
  }
}
