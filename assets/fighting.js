(() => {
  const C = window.BONCATTA || window.SCPPER;
  const $ = (id) => document.getElementById(id);

  const COLORS = {
    attack: "#c62828",
    survive: "#2e7d32",
    utility: "#1565c0",
    hybrid: "#6a1b9a",
    ultimate: "#ff8f00",
  };

  const SKILL_META = {
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
    empty_needle: ["空针", COLORS.utility],
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

  const CHARACTER_DEFS = [
    {
      id: "undead",
      name: "亡灵战神",
      desc: "掌控黑暗之力的不死战士",
      skills: [
        ["普通攻击", 20, "normal_attack"],
        ["致命暴击", 10, "critical_hit"],
        ["骸骨护盾", 15, "gain_shield"],
        ["黑暗反噬", 9, "self_harm"],
        ["生灵禁术", 15, "blood_swap1"],
        ["死亡尖啸", 5, "silence"],
        ["燃血斩击", 25, "double_attack"],
        ["终焉之剑", 1, "undead_ultimate"],
      ],
    },
    {
      id: "frost",
      name: "冰霜法师",
      desc: "操纵寒冰之力的法术大师",
      skills: [
        ["普通攻击", 25, "normal_attack"],
        ["治疗之术", 10, "heal"],
        ["冰晶护盾", 10, "ice_shield"],
        ["寂灭冰封", 10, "ice_silence"],
        ["爆裂瓶", 14, "bomb_attack"],
        ["冰蓝末日", 15, "ice_attack"],
        ["赤色复苏", 15, "red_recovery"],
        ["绝对零度", 1, "mage_ultimate"],
      ],
    },
    {
      id: "loser",
      name: "流浪之人",
      desc: "搜寻垃圾之力的超级战士",
      skills: [
        ["捡起棍子", 55, "normal_attack"],
        ["捡起药瓶", 25, "heal"],
        ["高效捡拾", 20, "two_more"],
      ],
    },
    {
      id: "medicine",
      name: "药药超人",
      desc: "精通治疗之术的医疗专家",
      skills: [
        ["普通攻击", 30, "normal_attack"],
        ["空针", 25, "empty_needle"],
        ["群体治疗", 10, "medicine_both_heal"],
        ["嗜血之疗", 15, "medicine_crit_heal"],
        ["沉默重击", 10, "medicine_crit_silence"],
        ["治愈整备", 9, "medicine_boost_heal"],
        ["愈合秘法", 1, "medicine_mega_heal"],
      ],
    },
    {
      id: "legend",
      name: "传奇大剑",
      desc: "手持剑阁巨剑的战场主宰",
      skills: [
        ["普通攻击", 40, "normal_attack"],
        ["治疗之术", 5, "heal"],
        ["护盾", 15, "gain_shield"],
        ["双重打击", 10, "double_normal_attack"],
        ["快速袭击", 5, "attack_and_draw"],
        ["嗜血一击", 5, "attack_and_heal"],
        ["持盾袭击", 5, "attack_and_shield"],
        ["裂空一击", 5, "half_hp_and_attack"],
        ["力量凝聚", 9, "double_next_attack"],
        ["毁灭三连", 1, "self_harm_and_triple_critical"],
      ],
    },
    {
      id: "car",
      name: "车王祥子",
      desc: "速度激情魔力的至高化身",
      skills: [
        ["普通攻击", 15, "normal_attack"],
        ["致命暴击", 25, "critical_hit"],
        ["治疗之术", 10, "heal"],
        ["狂暴治疗", 15, "critical_heal"],
        ["无畏冲击", 15, "double_deduction"],
        ["无畏连打", 10, "double_deduction_and_draw"],
        ["生命削减", 4, "half_hp_both"],
        ["暴力连打", 5, "attack_critical_draw"],
        ["终极连招", 1, "double_deduction_30_attack_critical_draw"],
      ],
    },
    {
      id: "tata",
      name: "塔塔塔塔",
      desc: "喜欢用火把的塔希斯小姐",
      skills: [
        ["普通攻击", 35, "normal_attack"],
        ["治疗之术", 15, "heal"],
        ["致命暴击", 10, "critical_hit"],
        ["狂暴治疗", 5, "critical_heal"],
        ["不凡护盾", 5, "gain_shield"],
        ["无畏冲击", 4, "double_deduction"],
        ["群体治疗", 4, "both_heal_10"],
        ["无中生有", 8, "two_more"],
        ["沉默猫咪", 5, "silence"],
        ["生命转换", 3, "blood_swap"],
        ["生命削减", 5, "half_hp_both"],
        ["未来之击", 1, "critical_and_critical_heal_and_draw"],
      ],
    },
    {
      id: "knight",
      name: "剑盾骑士",
      desc: "顶级攻守兼备的战场守护",
      skills: [
        ["普通攻击", 25, "normal_attack"],
        ["治疗之术", 5, "heal"],
        ["连续打击", 20, "attack_and_draw"],
        ["守护之盾", 25, "gain_shield"],
        ["荆棘之盾", 5, "shield_and_self_harm_10"],
        ["重压晕眩", 4, "silence"],
        ["生命削减", 15, "half_hp_both"],
        ["骑士奥义", 1, "knight_ultimate"],
      ],
    },
  ];

  const CHARACTER_BY_ID = Object.fromEntries(CHARACTER_DEFS.map((item) => [item.id, item]));
  window.BONCATTA_GAME_DATA = { COLORS, SKILL_META, CHARACTER_DEFS, CHARACTER_BY_ID };
  if (!$("hostRoom")) return;
  initTwoVsTwo();
  return;

  function initTwoVsTwo() {
    const ROOM_TTL_MS = 35000;
    const ROOM_HEARTBEAT_MS = 7000;
    const MQTT_BROKER = "wss://broker.emqx.io:8084/mqtt";
    const MQTT_TOPIC = "boncatta/baota/v2/rooms";
    const TURN_ORDER = [0, 2, 1, 3];
    const TEAM_LABELS = ["房主队", "访客队"];

    const DEFAULT_SELECTIONS = {
      host: [
        { name: "房主一号", characterId: "undead" },
        { name: "房主二号", characterId: "frost" },
      ],
      guest: [
        { name: "访客一号", characterId: "medicine" },
        { name: "访客二号", characterId: "knight" },
      ],
    };
    const DEFAULT_MY_TEAM = [
      { name: "玩家一号", characterId: "undead" },
      { name: "玩家二号", characterId: "frost" },
    ];

    const cloneTeam = (team) => team.map((item) => ({ ...item }));
    const cloneSelections = (selections) => ({
      host: cloneTeam(selections.host || DEFAULT_SELECTIONS.host),
      guest: cloneTeam(selections.guest || DEFAULT_SELECTIONS.guest),
    });

    function cleanSelection(selection, fallbackName, fallbackCharacter = "undead") {
      const def = CHARACTER_BY_ID[selection?.characterId] || CHARACTER_BY_ID[fallbackCharacter] || CHARACTER_DEFS[0];
      return {
        name: clampName2(selection?.name, fallbackName),
        characterId: def.id,
      };
    }

    function cleanTeam(team, prefix, defaults) {
      const source = Array.isArray(team) ? team : [];
      return [0, 1].map((index) => cleanSelection(
        source[index] || defaults[index],
        `${prefix}${index + 1}`,
        defaults[index].characterId
      ));
    }

    function cleanSelections(selections) {
      return {
        host: cleanTeam(selections?.host, "房主", DEFAULT_SELECTIONS.host),
        guest: cleanTeam(selections?.guest, "访客", DEFAULT_SELECTIONS.guest),
      };
    }

    function clampName2(value, fallback) {
      const clean = String(value || "").trim().replace(/\s+/g, " ").slice(0, 18);
      return clean || fallback;
    }

    function currentDef2(id) {
      return CHARACTER_BY_ID[id] || CHARACTER_DEFS[0];
    }

    function createFighter2(selection, fallbackName, team, teamSlot, owner) {
      const clean = cleanSelection(selection, fallbackName);
      const def = currentDef2(clean.characterId);
      return {
        id: `${owner}-${teamSlot}`,
        owner,
        team,
        teamSlot,
        label: `${TEAM_LABELS[team]} ${teamSlot + 1}`,
        displayName: `${clean.name}(${def.name})`,
        playerName: clean.name,
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

    class TeamBattleEngine {
      constructor(selections) {
        const clean = cleanSelections(selections);
        this.players = [
          createFighter2(clean.host[0], "房主一号", 0, 0, "host"),
          createFighter2(clean.host[1], "房主二号", 0, 1, "host"),
          createFighter2(clean.guest[0], "访客一号", 1, 0, "guest"),
          createFighter2(clean.guest[1], "访客二号", 1, 1, "guest"),
        ];
        this.turnOrder = TURN_ORDER.slice();
        this.current = this.firstAliveIndex();
        this.phase = 1;
        this.gameOver = false;
        this.roundEnd = false;
        this.skillText = "等待行动";
        this.skillColor = "#667085";
        this.lastRoll = null;
        this.logs = [];
        if (this.current != null) this.players[this.current].actionPoints = 1;
        this.log(`\n╔${"=".repeat(45)}`);
        this.log(`║ ${"2v2 战斗开始!".padStart(25).padEnd(44)} `);
        this.log(`║   ${TEAM_LABELS[0]} VS ${TEAM_LABELS[1]}`);
        this.log(`╚${"=".repeat(45)}`);
        this.log(`\n${this.currentPlayer()?.displayName || "未知角色"} 先手行动！`);
      }

      clone() {
        return {
          players: this.players.map((player) => ({ ...player, shields: (player.shields || []).map((shield) => ({ ...shield })) })),
          turnOrder: this.turnOrder.slice(),
          current: this.current,
          phase: this.phase,
          gameOver: this.gameOver,
          roundEnd: this.roundEnd,
          skillText: this.skillText,
          skillColor: this.skillColor,
          lastRoll: this.lastRoll,
          logs: this.logs.slice(-260),
        };
      }

      static fromSnapshot(snapshot) {
        const engine = Object.create(TeamBattleEngine.prototype);
        engine.players = (snapshot.players || []).map((player) => {
          const shields = (player.shields || []).map((shield) => ({ ...shield }));
          if (!shields.length && player.shield > 0) {
            for (let index = 0; index < player.shield; index += 1) shields.push({ type: "normal" });
          }
          return { ...player, shields, shield: shields.length };
        });
        engine.turnOrder = snapshot.turnOrder || TURN_ORDER.slice();
        engine.current = snapshot.current;
        engine.phase = snapshot.phase || 1;
        engine.gameOver = Boolean(snapshot.gameOver);
        engine.roundEnd = Boolean(snapshot.roundEnd);
        engine.skillText = snapshot.skillText || "等待行动";
        engine.skillColor = snapshot.skillColor || "#667085";
        engine.lastRoll = snapshot.lastRoll || null;
        engine.logs = snapshot.logs || [];
        return engine;
      }

      log(text, color = "") {
        this.logs.push({ text, color });
      }

      currentPlayer() {
        return this.current == null ? null : this.players[this.current];
      }

      firstAliveIndex() {
        return this.turnOrder.find((index) => this.isAlive(index)) ?? null;
      }

      isAlive(index) {
        return Boolean(this.players[index] && this.players[index].health > 0);
      }

      aliveIndexes(group = "any", attackerIndex = this.current) {
        const attacker = this.players[attackerIndex];
        return this.players
          .map((player, index) => ({ player, index }))
          .filter(({ player, index }) => {
            if (!player || player.health <= 0) return false;
            if (group === "self") return index === attackerIndex;
            if (group === "any") return true;
            if (group === "anyOther") return index !== attackerIndex;
            if (!attacker) return false;
            if (group === "enemy") return player.team !== attacker.team;
            if (group === "ally") return player.team === attacker.team && index !== attackerIndex;
            if (group === "allySelf") return player.team === attacker.team;
            return true;
          })
          .map(({ index }) => index);
      }

      targetOptions() {
        if (this.current == null) return [];
        return this.aliveIndexes("any", this.current);
      }

      normalizeActionTargets(raw = {}) {
        const numberOrNull = (value) => {
          const parsed = Number(value);
          return Number.isInteger(parsed) ? parsed : null;
        };
        return {
          primary: numberOrNull(raw.primary),
          secondary: numberOrNull(raw.secondary),
          tertiary: numberOrNull(raw.tertiary),
          multi: Array.isArray(raw.multi) ? raw.multi.map(numberOrNull).filter((value) => value != null) : [],
        };
      }

      createContext(rawTargets) {
        const targets = this.normalizeActionTargets(rawTargets);
        const used = new Set();
        const mark = (target) => {
          if (target) used.add(target.displayName);
        };
        return { targets, used, mark };
      }

      targetFrom(ctx, slot, group, fallbackGroup = group) {
        const valid = this.aliveIndexes(group, this.current);
        const requested = ctx.targets[slot];
        if (valid.includes(requested)) return this.players[requested];
        const fallbackValid = fallbackGroup === group ? valid : this.aliveIndexes(fallbackGroup, this.current);
        return this.players[fallbackValid[0]] || null;
      }

      targetsFrom(ctx, group, options = {}) {
        const valid = this.aliveIndexes(group, this.current);
        const chosen = ctx.targets.multi.filter((index) => valid.includes(index));
        if (chosen.length) return chosen.map((index) => this.players[index]);
        for (const slot of ["primary", "secondary", "tertiary"]) {
          if (valid.includes(ctx.targets[slot])) return [this.players[ctx.targets[slot]]];
        }
        if (options.fallback === "all") return valid.map((index) => this.players[index]);
        if (options.fallback === "self") return this.aliveIndexes("self", this.current).map((index) => this.players[index]);
        return valid.slice(0, options.limit || 1).map((index) => this.players[index]);
      }

      comboTargets(ctx, group, count) {
        const valid = this.aliveIndexes(group, this.current);
        const slots = ["primary", "secondary", "tertiary"];
        const picked = slots.map((slot) => ctx.targets[slot]).filter((index) => valid.includes(index));
        if (!picked.length && valid.length) picked.push(valid[0]);
        while (picked.length < count && picked.length) picked.push(picked[picked.length - 1]);
        return picked.slice(0, count).map((index) => this.players[index]);
      }

      shieldText(target) {
        return target.shields?.some((shield) => shield.type === "ice") ? `${target.shield}（含冰晶）` : String(target.shield || 0);
      }

      addShield(target, type = "normal", count = 1, source = null) {
        target.shields = target.shields || [];
        for (let index = 0; index < count; index += 1) target.shields.push({ type });
        target.shield = target.shields.length;
        this.log(`${source?.displayName || target.displayName} 为 ${target.displayName} 添加${type === "ice" ? "冰晶" : ""}护盾，当前护盾 ${this.shieldText(target)}。`);
      }

      breakShield(target, reason = "攻击") {
        target.shields = target.shields || [];
        const shield = target.shields.shift() || { type: "normal" };
        target.shield = target.shields.length;
        this.log(`${target.displayName} 的${shield.type === "ice" ? "冰晶" : ""}护盾抵挡了${reason}。`);
        if (shield.type === "ice") {
          target.health -= 10;
          this.log(`${target.displayName} 的冰晶护盾破碎，损失10点生命值！`);
        }
        return true;
      }

      damage(target, amount, source, label = "伤害", options = {}) {
        if (!target || target.health <= 0) return 0;
        const blockable = options.blockable !== false;
        const value = Math.max(0, Number(amount) || 0);
        if (blockable && target.shield > 0) {
          this.breakShield(target, label);
          options.ctx?.mark(target);
          return 0;
        }
        target.health -= value;
        this.log(`${source?.displayName || "效果"} 对 ${target.displayName} 造成${value}点${label}。`);
        options.ctx?.mark(target);
        return value;
      }

      heal(target, amount, source, options = {}) {
        if (!target || target.health <= 0) return 0;
        const value = Math.max(0, Number(amount) || 0);
        target.health += value;
        this.log(`${source?.displayName || "效果"} 使 ${target.displayName} 恢复${value}点生命值。`);
        options.ctx?.mark(target);
        return value;
      }

      swapHealth(a, b, ctx) {
        if (!a || !b || b.health <= 0) return;
        [a.health, b.health] = [b.health, a.health];
        this.log(`${a.displayName} 与 ${b.displayName} 交换生命值。`);
        ctx?.mark(b);
      }

      silence(target, amount, source, ctx) {
        if (!target || target.health <= 0) return;
        target.actionPoints -= amount;
        this.log(`${source.displayName} 沉默 ${target.displayName}，行动点减少${amount}。`);
        ctx?.mark(target);
      }

      attack(attacker, target, base, label, ctx, multiplier = attacker.attackMultiplier) {
        this.damage(target, base * multiplier, attacker, label, { ctx });
      }

      normalAttack(attacker, target, ctx, multiplier = attacker.attackMultiplier) {
        this.attack(attacker, target, 10, "攻击伤害", ctx, multiplier);
      }

      criticalHit(attacker, target, ctx, multiplier = attacker.attackMultiplier) {
        this.attack(attacker, target, 20, "暴击伤害", ctx, multiplier);
      }

      allFieldDamage(attacker, amount, label, ctx) {
        for (const target of this.aliveIndexes("any", this.current).map((index) => this.players[index])) {
          this.damage(target, amount, attacker, label, { ctx });
        }
      }

      allFieldHalf(attacker, ctx) {
        this.log(`${attacker.displayName} 发动全场生命削减！`);
        for (const target of this.aliveIndexes("any", this.current).map((index) => this.players[index])) {
          if (target.shield > 0) {
            this.breakShield(target, "生命削减");
            ctx?.mark(target);
          } else {
            const newHealth = Math.max(1, Math.floor(target.health / 2));
            const damage = target.health - newHealth;
            target.health = newHealth;
            this.log(`${target.displayName} 生命减半，失去${damage}点生命值。`);
            ctx?.mark(target);
          }
        }
      }

      teamAlive(team) {
        return this.players.some((player) => player.team === team && player.health > 0);
      }

      checkGameState() {
        const hostAlive = this.teamAlive(0);
        const guestAlive = this.teamAlive(1);
        if (hostAlive && guestAlive) return false;
        if (!hostAlive && !guestAlive) {
          this.skillText = "平局！双方同归于尽";
          this.skillColor = COLORS.ultimate;
          this.gameOver = true;
          this.current = null;
          this.log("平局！双方同归于尽。");
          return true;
        }
        const winner = hostAlive ? TEAM_LABELS[0] : TEAM_LABELS[1];
        this.skillText = `${winner} 获胜！`;
        this.skillColor = COLORS.ultimate;
        this.gameOver = true;
        this.current = null;
        this.log(`${winner} 获胜！`);
        return true;
      }

      advanceTurn() {
        if (this.checkGameState()) return;
        const oldOrderIndex = this.turnOrder.indexOf(this.current);
        let pointer = oldOrderIndex >= 0 ? oldOrderIndex : 0;
        let guarded = 0;
        while (guarded < this.turnOrder.length * 6) {
          pointer = (pointer + 1) % this.turnOrder.length;
          if (pointer === 0) {
            this.phase += 1;
            this.log(`\n===== 第 ${this.phase} 回合开始 =====`);
          }
          const nextIndex = this.turnOrder[pointer];
          const next = this.players[nextIndex];
          guarded += 1;
          if (!next || next.health <= 0) continue;
          next.actionPoints += 1;
          if (next.actionPoints <= 0) {
            this.log(`${next.displayName} 被沉默压制，跳过本次行动。`);
            continue;
          }
          this.current = nextIndex;
          this.roundEnd = false;
          this.log(`${next.displayName} 开始行动！`);
          return;
        }
        this.current = null;
        this.checkGameState();
      }

      takeAction(rawTargets = {}) {
        if (this.gameOver || this.current == null) return;
        const attacker = this.currentPlayer();
        if (!attacker || attacker.health <= 0) {
          this.advanceTurn();
          return;
        }
        if (attacker.actionPoints <= 0) {
          this.log(`${attacker.displayName} 没有行动点，无法行动。`);
          this.advanceTurn();
          return;
        }
        const ctx = this.createContext(rawTargets);
        const result = this.rollSkill(attacker, ctx);
        const meta = result.handler ? SKILL_META[result.handler] : null;
        this.skillColor = meta?.[1] || "#151b23";
        const targetLabel = ctx.used.size ? [...ctx.used].join("、") : "未命中目标";
        this.lastRoll = result.roll
          ? { roll: result.roll, max: 100, skill: result.name, target: targetLabel, range: result.range }
          : null;
        this.skillText = result.valid
          ? `${attacker.displayName} 使用了 [${result.name}] · 随机数 ${result.roll}/100 · 目标 ${targetLabel}`
          : `${attacker.displayName} ${result.name}`;
        if (result.valid) attacker.actionPoints -= 1;
        if (this.checkGameState()) return;
        if (attacker.actionPoints <= 0) this.advanceTurn();
      }

      rollSkill(attacker, ctx) {
        const def = CHARACTER_BY_ID[attacker.characterId] || CHARACTER_DEFS[0];
        const roll = Math.floor(Math.random() * 100) + 1;
        this.log(`${attacker.displayName} 行动随机数：${roll}/100。`, "#93c5fd");
        let cumulative = 0;
        for (const [name, probability, handler] of def.skills) {
          const rangeStart = cumulative + 1;
          cumulative += probability;
          if (roll <= cumulative) {
            this.log(`命中区间：${rangeStart}-${cumulative}，技能：[${name}]`, "#93c5fd");
            const fn = HANDLERS_2V2[handler];
            if (fn) fn(attacker, ctx, this);
            else this.log(`技能 ${name} 暂无处理器。`);
            return { name, handler, valid: true, roll, range: [rangeStart, cumulative] };
          }
        }
        this.log(`${attacker.displayName} 犹豫不决，没有行动。`);
        return { name: "犹豫不决", valid: true, roll, range: null };
      }
    }

    const HANDLERS_2V2 = {
      normal_attack(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.normalAttack(attacker, target, ctx);
        attacker.attackMultiplier = 1;
      },
      critical_hit(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.criticalHit(attacker, target, ctx);
        attacker.attackMultiplier = 1;
      },
      gain_shield(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "allySelf", "self") || attacker;
        engine.addShield(target, "normal", 1, attacker);
        ctx.mark(target);
      },
      ice_shield(attacker, ctx, engine) {
        const targets = engine.targetsFrom(ctx, "allySelf", { fallback: "self" });
        for (const target of targets) {
          engine.addShield(target, "ice", 1, attacker);
          ctx.mark(target);
        }
      },
      self_harm(attacker, ctx, engine) {
        engine.damage(attacker, 10, attacker, "反噬伤害", { ctx });
      },
      heal(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "allySelf", "self") || attacker;
        engine.heal(target, 10 * attacker.healMultiplier, attacker, { ctx });
        attacker.healMultiplier = 1;
      },
      red_recovery(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "allySelf", "self") || attacker;
        engine.heal(target, 30 * attacker.healMultiplier, attacker, { ctx });
        attacker.healMultiplier = 1;
      },
      critical_heal(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "allySelf", "self") || attacker;
        engine.heal(target, 20 * attacker.healMultiplier, attacker, { ctx });
        attacker.healMultiplier = 1;
      },
      two_more(attacker, ctx, engine) {
        attacker.actionPoints += 2;
        ctx.mark(attacker);
        engine.log(`${attacker.displayName} 获得2个额外行动点。`);
      },
      blood_swap(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "anyOther");
        engine.swapHealth(attacker, target, ctx);
      },
      blood_swap1(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "anyOther");
        engine.swapHealth(attacker, target, ctx);
        engine.damage(target, 10, attacker, "换血追击", { ctx });
      },
      silence(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.silence(target, 3, attacker, ctx);
      },
      undead_ultimate(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "anyOther");
        engine.swapHealth(attacker, target, ctx);
        engine.criticalHit(attacker, target, ctx);
        attacker.attackMultiplier = 1;
        engine.addShield(attacker, "normal", 1, attacker);
        ctx.mark(attacker);
      },
      ice_attack(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.damage(target, 30, attacker, "寒冰伤害", { ctx });
      },
      ice_silence(attacker, ctx, engine) {
        const targets = engine.targetsFrom(ctx, "anyOther", { fallback: "all" });
        for (const target of targets) engine.silence(target, 1, attacker, ctx);
      },
      bomb_attack(attacker, ctx, engine) {
        for (const target of engine.targetsFrom(ctx, "enemy", { fallback: "all" })) {
          engine.damage(target, 20, attacker, "爆裂伤害", { ctx });
        }
        engine.damage(attacker, 20, attacker, "爆裂反冲", { ctx });
      },
      double_attack(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.damage(target, 20 * attacker.attackMultiplier, attacker, "燃血轰击", { ctx });
        attacker.attackMultiplier = 1;
        engine.damage(attacker, 10, attacker, "反噬伤害", { ctx });
      },
      poison_attack(attacker, ctx, engine) {
        for (const target of engine.targetsFrom(ctx, "enemy", { fallback: "all" })) {
          engine.damage(target, 10, attacker, "毒药伤害", { ctx });
        }
        engine.damage(attacker, 30, attacker, "毒雾反噬", { ctx });
      },
      mage_ultimate(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.damage(target, 30, attacker, "绝对零度", { ctx });
        engine.heal(attacker, 30, attacker, { ctx });
      },
      medicine_both_heal(attacker, ctx, engine) {
        for (const target of engine.targetsFrom(ctx, "allySelf")) {
          engine.heal(target, 10 * attacker.healMultiplier, attacker, { ctx });
        }
        attacker.healMultiplier = 1;
      },
      medicine_crit_heal(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.criticalHit(attacker, target, ctx);
        const healTarget = engine.targetFrom(ctx, "secondary", "allySelf", "self") || attacker;
        engine.heal(healTarget, 10 * attacker.healMultiplier, attacker, { ctx });
        attacker.healMultiplier = 1;
        attacker.attackMultiplier = 1;
      },
      medicine_crit_silence(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.criticalHit(attacker, target, ctx);
        engine.silence(target, 1, attacker, ctx);
        attacker.attackMultiplier = 1;
      },
      medicine_boost_heal(attacker, ctx, engine) {
        attacker.healMultiplier *= 2;
        ctx.mark(attacker);
        engine.log(`${attacker.displayName} 强化治疗效果，下次治疗量翻倍。`);
      },
      medicine_mega_heal(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "allySelf", "self") || attacker;
        engine.heal(target, 60 * attacker.healMultiplier, attacker, { ctx });
        attacker.healMultiplier = 1;
      },
      double_normal_attack(attacker, ctx, engine) {
        const multiplier = attacker.attackMultiplier;
        for (const target of engine.comboTargets(ctx, "enemy", 2)) engine.normalAttack(attacker, target, ctx, multiplier);
        attacker.attackMultiplier = 1;
      },
      attack_and_draw(attacker, ctx, engine) {
        HANDLERS_2V2.normal_attack(attacker, ctx, engine);
        attacker.actionPoints += 1;
        engine.log(`${attacker.displayName} 获得1个额外行动点。`);
      },
      attack_and_heal(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.normalAttack(attacker, target, ctx);
        attacker.attackMultiplier = 1;
        const healTarget = engine.targetFrom(ctx, "secondary", "allySelf", "self") || attacker;
        engine.heal(healTarget, 10 * attacker.healMultiplier, attacker, { ctx });
        attacker.healMultiplier = 1;
      },
      attack_and_shield(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.normalAttack(attacker, target, ctx);
        attacker.attackMultiplier = 1;
        const shieldTarget = engine.targetFrom(ctx, "secondary", "allySelf", "self") || attacker;
        engine.addShield(shieldTarget, "normal", 1, attacker);
        ctx.mark(shieldTarget);
      },
      half_hp_and_attack(attacker, ctx, engine) {
        engine.allFieldHalf(attacker, ctx);
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.normalAttack(attacker, target, ctx);
        attacker.attackMultiplier = 1;
      },
      double_next_attack(attacker, ctx, engine) {
        attacker.attackMultiplier *= 2;
        ctx.mark(attacker);
        engine.log(`${attacker.displayName} 凝聚力量，下次攻击威力翻倍。`);
      },
      self_harm_and_triple_critical(attacker, ctx, engine) {
        const multiplier = attacker.attackMultiplier;
        for (const target of engine.comboTargets(ctx, "enemy", 3)) engine.criticalHit(attacker, target, ctx, multiplier);
        attacker.attackMultiplier = 1;
        if (!engine.checkGameState()) engine.damage(attacker, 40, attacker, "毁灭代价", { blockable: false, ctx });
      },
      double_deduction(attacker, ctx, engine) {
        engine.allFieldDamage(attacker, 10, "全场冲击", ctx);
      },
      double_deduction_and_draw(attacker, ctx, engine) {
        engine.allFieldDamage(attacker, 10, "全场连打", ctx);
        attacker.actionPoints += 1;
        engine.log(`${attacker.displayName} 获得1个额外行动点。`);
      },
      half_hp_both(attacker, ctx, engine) {
        engine.allFieldHalf(attacker, ctx);
      },
      attack_critical_draw(attacker, ctx, engine) {
        const [first, second] = engine.comboTargets(ctx, "enemy", 2);
        engine.normalAttack(attacker, first, ctx);
        engine.criticalHit(attacker, second, ctx);
        attacker.attackMultiplier = 1;
        attacker.actionPoints += 1;
        engine.log(`${attacker.displayName} 获得1个额外行动点。`);
      },
      double_deduction_30_attack_critical_draw(attacker, ctx, engine) {
        engine.allFieldDamage(attacker, 30, "终极全场冲击", ctx);
        const [first, second] = engine.comboTargets(ctx, "enemy", 2);
        engine.normalAttack(attacker, first, ctx);
        engine.criticalHit(attacker, second, ctx);
        attacker.attackMultiplier = 1;
        attacker.actionPoints += 1;
        engine.log(`${attacker.displayName} 获得1个额外行动点。`);
      },
      both_heal_10(attacker, ctx, engine) {
        for (const target of engine.aliveIndexes("any", engine.current).map((index) => engine.players[index])) {
          engine.heal(target, 10, attacker, { ctx });
        }
      },
      critical_and_critical_heal_and_draw(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.criticalHit(attacker, target, ctx);
        attacker.attackMultiplier = 1;
        const healTarget = engine.targetFrom(ctx, "secondary", "allySelf", "self") || attacker;
        engine.heal(healTarget, 20 * attacker.healMultiplier, attacker, { ctx });
        attacker.healMultiplier = 1;
        attacker.actionPoints += 2;
        engine.log(`${attacker.displayName} 获得2个额外行动点。`);
      },
      shield_and_self_harm_10(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "allySelf", "self") || attacker;
        engine.addShield(target, "normal", 1, attacker);
        ctx.mark(target);
        engine.damage(attacker, 10, attacker, "不可格挡反噬", { blockable: false, ctx });
      },
      knight_ultimate(attacker, ctx, engine) {
        const target = engine.targetFrom(ctx, "primary", "enemy");
        engine.criticalHit(attacker, target, ctx);
        attacker.attackMultiplier = 1;
        attacker.actionPoints += 1;
        engine.addShield(attacker, "normal", 3, attacker);
        ctx.mark(attacker);
        engine.log(`${attacker.displayName} 获得1个额外行动点。`);
      },
    };

    const app = {
      mode: "lobby",
      side: null,
      peer: null,
      conn: null,
      lobbySocket: null,
      lobbyClient: null,
      lobbyKind: "",
      lobbyTimer: null,
      roomCode: "",
      connected: false,
      rooms: new Map(),
      selections: cloneSelections(DEFAULT_SELECTIONS),
      myTeam: cloneTeam(DEFAULT_MY_TEAM),
      engine: null,
    };

    function teamKeyForSide() {
      return app.side === "guest" ? "guest" : "host";
    }

    function readMyTeam() {
      app.myTeam = [0, 1].map((index) => cleanSelection({
        name: $(`myName${index}`)?.value,
        characterId: $(`myCharacter${index}`)?.value,
      }, `玩家${index + 1}`));
      if (app.side) app.selections[teamKeyForSide()] = cloneTeam(app.myTeam);
    }

    function applyMyTeamToInputs() {
      const team = app.side ? app.selections[teamKeyForSide()] : app.myTeam;
      [0, 1].forEach((index) => {
        if ($(`myName${index}`)) $(`myName${index}`).value = team[index]?.name || `玩家${index + 1}`;
        if ($(`myCharacter${index}`)) $(`myCharacter${index}`).value = team[index]?.characterId || CHARACTER_DEFS[index]?.id || "undead";
      });
      updateCharacterNotes2();
      updateSummaries2();
    }

    function teamSummary(teamKey) {
      const team = app.selections[teamKey] || [];
      return `<div class="game-team-summary">${[0, 1].map((index) => {
        const selected = team[index];
        const def = currentDef2(selected?.characterId);
        return `<article>
          <strong>${C.escapeHtml(selected?.name || (teamKey === "host" ? "房主" : "访客"))}</strong>
          <span>${C.escapeHtml(def.name)} · ${C.escapeHtml(def.desc)}</span>
        </article>`;
      }).join("")}</div>`;
    }

    function updateSummaries2() {
      $("hostSummary").innerHTML = teamSummary("host");
      $("guestSummary").innerHTML = teamSummary("guest");
      $("hostReady").textContent = app.selections.host?.length === 2 ? "已选择 2 人" : "等待选择";
      $("guestReady").textContent = app.connected ? "已加入 2 人" : "等待加入";
    }

    function renderOptions2() {
      const options = CHARACTER_DEFS.map((def) => `<option value="${def.id}">${C.escapeHtml(def.name)} - ${C.escapeHtml(def.desc)}</option>`).join("");
      [0, 1].forEach((index) => {
        $(`myCharacter${index}`).innerHTML = options;
        $(`myCharacter${index}`).value = app.myTeam[index]?.characterId || CHARACTER_DEFS[index].id;
      });
    }

    function updateCharacterNotes2() {
      [0, 1].forEach((index) => {
        const def = currentDef2($(`myCharacter${index}`)?.value);
        const total = def.skills.reduce((sum, item) => sum + item[1], 0);
        const node = $(`myNote${index}`);
        if (!node) return;
        node.innerHTML = `<strong>${C.escapeHtml(def.name)}</strong>：${C.escapeHtml(def.desc)}<div class="tags">${def.skills.map(([name, prob, handler]) => `<span class="tag" style="border-color:${SKILL_META[handler]?.[1] || "#d8dee8"}">${C.escapeHtml(name)} ${prob}%</span>`).join("")}</div><div class="small">概率合计 ${total}%</div>`;
      });
    }

    function updateInputLocks2() {
      const inBattle = Boolean(app.engine);
      [0, 1].forEach((index) => {
        $(`myName${index}`).disabled = inBattle;
        $(`myCharacter${index}`).disabled = inBattle;
      });
      $("hostRoom").disabled = inBattle || app.mode !== "lobby";
      $("joinRoom").disabled = inBattle || app.mode !== "lobby";
      $("startGame").disabled = app.mode !== "host" || !app.connected || inBattle;
      $("copyRoom").disabled = !app.roomCode;
      $("disconnectRoom").disabled = app.mode === "lobby";
      $("sideHint").textContent = app.mode === "host"
        ? "你是房主，控制房主队两名角色。"
        : app.mode === "guest"
          ? "你是访客，控制访客队两名角色。"
          : "创建房间后控制房主队；加入房间后控制访客队。";
      updateSummaries2();
    }

    function updateNetworkStatus2(text) {
      $("networkStatus").textContent = text;
      $("roomInfo").textContent = text;
    }

    function renderRoster2() {
      $("roster").innerHTML = CHARACTER_DEFS.map((def) => {
        const skills = def.skills.map(([name, prob, handler]) => {
          const color = SKILL_META[handler]?.[1] || "#667085";
          return `<span class="tag" style="border-color:${color};color:${color}">${C.escapeHtml(name)} ${prob}%</span>`;
        }).join("");
        return `<article class="game-roster-card"><h3>${C.escapeHtml(def.name)}</h3><p class="small">${C.escapeHtml(def.desc)}</p><div class="tags">${skills}</div></article>`;
      }).join("");
    }

    function renderBattle2() {
      const engine = app.engine;
      $("battlePanel").hidden = !engine;
      if (!engine) {
        updateInputLocks2();
        return;
      }
      const snapshot = engine.clone();
      $("roundTitle").textContent = `第 ${snapshot.phase} 回合`;
      $("skillBanner").textContent = snapshot.skillText || "等待行动";
      $("skillBanner").style.color = snapshot.skillColor || "#667085";
      $("rollInfo").textContent = snapshot.lastRoll
        ? `上次随机数 ${snapshot.lastRoll.roll}/${snapshot.lastRoll.max} · ${snapshot.lastRoll.skill} · 目标 ${snapshot.lastRoll.target}${snapshot.lastRoll.range ? ` · 区间 ${snapshot.lastRoll.range[0]}-${snapshot.lastRoll.range[1]}` : ""}`
        : "上次随机数：等待首次行动";
      $("gameArena").innerHTML = snapshot.players.map((player, index) => {
        const healthPercent = Math.max(0, Math.min(100, player.health));
        const current = snapshot.current === index;
        const dead = player.health <= 0;
        const shieldText = player.shields?.some((shield) => shield.type === "ice") ? `${player.shield} 冰晶` : player.shield;
        return `<article class="game-fighter ${current ? "is-current" : ""} ${dead ? "is-dead" : ""}">
          <div class="game-fighter-head">
            <h3>${C.escapeHtml(player.displayName)}</h3>
            <span class="game-side">${player.owner === "host" ? "房主" : "访客"} ${player.teamSlot + 1}</span>
          </div>
          <div class="game-health"><span style="width:${healthPercent}%"></span></div>
          <dl class="game-stats">
            <div><dt>生命</dt><dd>${Math.max(0, player.health)}</dd></div>
            <div><dt>护盾</dt><dd>${C.escapeHtml(shieldText)}</dd></div>
            <div><dt>行动点</dt><dd>${player.actionPoints}</dd></div>
          </dl>
        </article>`;
      }).join("");
      const current = snapshot.current == null ? null : snapshot.players[snapshot.current];
      $("turnHint").textContent = snapshot.gameOver
        ? "战斗结束"
        : current
          ? `${current.displayName} 行动中 · ${current.owner === "host" ? "房主操作" : "访客操作"}`
          : "等待行动";
      $("battleRoomCode").textContent = app.roomCode ? `房间 ${app.roomCode}` : "房间 --";
      $("battleLog").innerHTML = snapshot.logs.map((entry) => `<p ${entry.color ? `style="color:${entry.color}"` : ""}>${C.escapeHtml(entry.text)}</p>`).join("");
      $("logCount").textContent = C.fmt.format(snapshot.logs.length);
      $("battleLog").scrollTop = $("battleLog").scrollHeight;
      updateControls2();
      updateInputLocks2();
    }

    function localSideCanAct2() {
      if (!app.engine || app.engine.gameOver || app.engine.current == null) return false;
      const current = app.engine.players[app.engine.current];
      return (app.mode === "host" && current.owner === "host") || (app.mode === "guest" && current.owner === "guest");
    }

    function optionHtmlForTargets(selected = {}) {
      if (!app.engine || app.engine.current == null) return `<option value="">暂无目标</option>`;
      const current = app.engine.current;
      const options = app.engine.targetOptions().map((index) => {
        const player = app.engine.players[index];
        const relation = index === current ? "自己" : player.team === app.engine.players[current].team ? "友方" : "敌方";
        return `<option value="${index}">${C.escapeHtml(player.displayName)} · ${relation} · 生命 ${Math.max(0, player.health)} · 护盾 ${player.shield}</option>`;
      }).join("");
      return options || `<option value="">暂无目标</option>`;
    }

    function renderTargetOptions2() {
      const ids = ["targetPrimary", "targetSecondary", "targetTertiary", "targetMulti"];
      const old = Object.fromEntries(ids.map((id) => [id, $(id)?.value]));
      const oldMulti = Array.from($("targetMulti")?.selectedOptions || []).map((option) => option.value);
      const html = optionHtmlForTargets();
      for (const id of ids) {
        const node = $(id);
        if (!node) continue;
        node.innerHTML = html;
      }
      const enemyIndexes = app.engine?.aliveIndexes("enemy", app.engine.current) || [];
      const allyIndexes = app.engine?.aliveIndexes("allySelf", app.engine.current) || [];
      const setSelectValue = (id, preferred, fallback) => {
        const node = $(id);
        if (!node) return;
        const values = Array.from(node.options).map((option) => option.value);
        const next = values.includes(preferred) ? preferred : values.includes(fallback) ? fallback : values[0] || "";
        node.value = next;
      };
      setSelectValue("targetPrimary", old.targetPrimary, String(enemyIndexes[0] ?? app.engine?.current ?? ""));
      setSelectValue("targetSecondary", old.targetSecondary, String(enemyIndexes[1] ?? allyIndexes[0] ?? enemyIndexes[0] ?? ""));
      setSelectValue("targetTertiary", old.targetTertiary, String(enemyIndexes[0] ?? ""));
      Array.from($("targetMulti")?.options || []).forEach((option) => {
        option.selected = oldMulti.includes(option.value) || (!oldMulti.length && enemyIndexes.includes(Number(option.value)));
      });
      const disabled = !localSideCanAct2();
      ids.forEach((id) => {
        if ($(id)) $(id).disabled = disabled || !app.engine || app.engine.gameOver || app.engine.current == null;
      });
    }

    function updateControls2() {
      const engine = app.engine;
      const canAct = localSideCanAct2();
      $("actionButton").disabled = !engine || engine.gameOver || !canAct;
      $("restartButton").disabled = !engine || app.mode === "guest";
      renderTargetOptions2();
    }

    function collectTargets2() {
      return {
        primary: Number($("targetPrimary")?.value),
        secondary: Number($("targetSecondary")?.value),
        tertiary: Number($("targetTertiary")?.value),
        multi: Array.from($("targetMulti")?.selectedOptions || []).map((option) => Number(option.value)),
      };
    }

    function startBattle2() {
      readMyTeam();
      if (app.mode !== "host" || !app.connected) {
        updateNetworkStatus2(`房间 ${app.roomCode} 等待访客加入后才能开始。`);
        return;
      }
      app.engine = new TeamBattleEngine(app.selections);
      renderBattle2();
      publishRoom2("playing");
      broadcast2({ type: "start", selections: app.selections, snapshot: app.engine.clone() });
    }

    function resetBattle2() {
      app.engine = null;
      $("battlePanel").hidden = true;
      updateInputLocks2();
      publishRoom2(app.connected ? "ready" : "waiting");
      broadcast2({ type: "reset", selections: app.selections });
    }

    function performAction2() {
      if (!app.engine) return;
      const targets = collectTargets2();
      if (app.mode === "guest") {
        send2({ type: "intent", action: "takeAction", targets });
        return;
      }
      app.engine.takeAction(targets);
      renderBattle2();
      broadcastSnapshot2();
    }

    function send2(message) {
      if (app.conn?.open) app.conn.send(message);
    }

    function broadcast2(message) {
      if (app.mode === "host") send2(message);
    }

    function broadcastSnapshot2() {
      broadcast2({ type: "snapshot", snapshot: app.engine?.clone() });
    }

    function lobbySend2(message) {
      if (app.lobbySocket?.readyState === WebSocket.OPEN) app.lobbySocket.send(JSON.stringify(message));
    }

    function teamLabel(team) {
      return (team || []).map((selection) => currentDef2(selection.characterId).name).join(" + ");
    }

    function publishRoom2(status = null) {
      if (app.mode !== "host" || !app.roomCode) return;
      const payload = {
        type: "room",
        code: app.roomCode,
        peerId: peerIdFromRoom2(app.roomCode),
        status: status || (app.engine ? "playing" : app.connected ? "ready" : "waiting"),
        hostName: app.selections.host.map((item) => item.name).join(" / "),
        hostCharacter: teamLabel(app.selections.host),
        guestName: app.connected ? app.selections.guest.map((item) => item.name).join(" / ") : "",
        guestCharacter: app.connected ? teamLabel(app.selections.guest) : "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      app.rooms.set(app.roomCode, { ...payload, seenAt: Date.now() });
      renderRooms2();
      lobbySend2(payload);
      if (app.lobbyClient?.connected) {
        app.lobbyClient.publish(mqttRoomTopic2(app.roomCode), JSON.stringify(payload), { qos: 0, retain: false });
      }
    }

    function publishClosedRoom2() {
      if (!app.roomCode) return;
      const payload = { type: "room", code: app.roomCode, status: "closed", updatedAt: Date.now() };
      app.rooms.delete(app.roomCode);
      renderRooms2();
      lobbySend2({ type: "close", code: app.roomCode });
      if (app.lobbyClient?.connected) {
        app.lobbyClient.publish(mqttRoomTopic2(app.roomCode), JSON.stringify(payload), { qos: 0, retain: false });
      }
    }

    function lobbyUrl2() {
      const params = new URLSearchParams(location.search);
      const explicit = params.get("lobby") || localStorage.getItem("baotaLobbyUrl") || window.BAOTA_LOBBY_URL || "";
      if (explicit === "mqtt" || explicit === "public") return "";
      if (explicit) return explicit;
      if (location.hostname === "127.0.0.1" || location.hostname === "localhost") return "ws://127.0.0.1:8792";
      return "";
    }

    function mqttRoomTopic2(code = "+") {
      return `${MQTT_TOPIC}/${code}`;
    }

    function connectLobby2(force = false) {
      const url = lobbyUrl2();
      if (!url) {
        connectMqttLobby2(force);
        return;
      }
      if (!force && app.lobbySocket && [WebSocket.OPEN, WebSocket.CONNECTING].includes(app.lobbySocket.readyState)) return;
      try { app.lobbySocket?.close(); } catch {}
      $("lobbyStatus").textContent = `连接大厅 ${url}...`;
      app.lobbySocket = new WebSocket(url);
      app.lobbySocket.addEventListener("open", () => {
        updateNetworkStatus2("自有大厅已连接。");
        $("lobbyStatus").textContent = "大厅已连接，房间列表实时更新。";
        lobbySend2({ type: "hello" });
        publishRoom2();
      });
      app.lobbySocket.addEventListener("message", (event) => {
        let message;
        try { message = JSON.parse(event.data); } catch { return; }
        if (message.type === "rooms") {
          app.rooms.clear();
          const stamp = Date.now();
          for (const room of message.rooms || []) app.rooms.set(room.code, { ...room, seenAt: stamp });
          renderRooms2();
        }
      });
      app.lobbySocket.addEventListener("close", () => {
        updateNetworkStatus2("大厅连接已断开，正在重连。");
        $("lobbyStatus").textContent = "大厅连接已断开，5 秒后重连。";
        window.setTimeout(() => connectLobby2(true), 5000);
      });
      app.lobbySocket.addEventListener("error", () => {
        updateNetworkStatus2("大厅连接失败，可以手动输入房间码。");
        $("lobbyStatus").textContent = "大厅连接失败，可手动输入房间码。";
      });
    }

    function connectMqttLobby2(force = false) {
      if (!window.mqtt) {
        updateNetworkStatus2("公共大厅库加载失败，可以手动输入房间码。");
        $("lobbyStatus").textContent = "公共大厅库加载失败；可以手动输入房间码。";
        renderRooms2();
        return;
      }
      if (!force && app.lobbyClient?.connected) return;
      try { app.lobbyClient?.end(true); } catch {}
      $("lobbyStatus").textContent = "连接公共大厅中...";
      app.lobbyClient = mqtt.connect(MQTT_BROKER, {
        clientId: `boncatta_2v2_${Math.random().toString(36).slice(2)}`,
        clean: true,
        connectTimeout: 8000,
        reconnectPeriod: 5000,
      });
      app.lobbyClient.on("connect", () => {
        updateNetworkStatus2("公共大厅已连接。");
        $("lobbyStatus").textContent = "公共大厅已连接，房间列表实时更新。";
        app.lobbyClient.subscribe(mqttRoomTopic2("+"));
        publishRoom2();
      });
      app.lobbyClient.on("message", (topic, buffer) => {
        let room;
        try { room = JSON.parse(buffer.toString()); } catch { return; }
        if (!room?.code) return;
        if (room.status === "closed") app.rooms.delete(room.code);
        else app.rooms.set(room.code, { ...room, seenAt: Date.now() });
        renderRooms2();
      });
      app.lobbyClient.on("close", () => {
        updateNetworkStatus2("公共大厅连接断开，正在重连。");
        $("lobbyStatus").textContent = "公共大厅连接断开，正在重连。";
      });
      app.lobbyClient.on("error", () => {
        updateNetworkStatus2("公共大厅连接失败，可以手动输入房间码。");
        $("lobbyStatus").textContent = "公共大厅连接失败，可以手动输入房间码。";
      });
    }

    function renderRooms2() {
      const rooms = [...app.rooms.values()]
        .filter((room) => Date.now() - (room.updatedAt || 0) < ROOM_TTL_MS)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      $("roomList").innerHTML = rooms.length
        ? rooms.map((room) => {
          const statusText = room.status === "playing" ? "对战中" : room.status === "ready" ? "已满员" : "等待中";
          const disabled = room.status !== "waiting" || app.mode !== "lobby";
          return `<article class="game-room-card">
            <div>
              <strong>${C.escapeHtml(room.code)}</strong>
              <span class="game-room-status status-${C.escapeHtml(room.status || "waiting")}">${statusText}</span>
            </div>
            <p>${C.escapeHtml(room.hostName || "房主队")} / ${C.escapeHtml(room.hostCharacter || "未知阵容")}</p>
            ${room.guestName ? `<p class="small">访客队 ${C.escapeHtml(room.guestName)} / ${C.escapeHtml(room.guestCharacter || "未知阵容")}</p>` : `<p class="small">等待访客队加入 2v2</p>`}
            <button type="button" data-join-room="${C.escapeHtml(room.code)}" ${disabled ? "disabled" : ""}>加入</button>
          </article>`;
        }).join("")
        : `<div class="empty">暂无公开房间。你可以创建一个 2v2 房间，或手动输入房间码。</div>`;
    }

    function createRoomCode2() {
      return Math.random().toString(36).slice(2, 7).toUpperCase();
    }

    function peerIdFromRoom2(code) {
      return `boncatta-2v2-${String(code || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "")}`;
    }

    function closeNetwork2() {
      if (app.mode === "host" && app.roomCode) publishClosedRoom2();
      if (app.lobbyTimer) window.clearInterval(app.lobbyTimer);
      app.lobbyTimer = null;
      try { app.conn?.close(); } catch {}
      try { app.peer?.destroy(); } catch {}
      app.peer = null;
      app.conn = null;
      app.connected = false;
      app.roomCode = "";
      app.mode = "lobby";
      app.side = null;
      app.engine = null;
      app.selections = cloneSelections(DEFAULT_SELECTIONS);
      app.myTeam = cloneTeam(DEFAULT_MY_TEAM);
      $("battlePanel").hidden = true;
      applyMyTeamToInputs();
      updateNetworkStatus2("已回到联机大厅。");
      updateInputLocks2();
      renderRooms2();
    }

    function ensurePeerJs2() {
      if (!window.Peer) {
        updateNetworkStatus2("联机库暂时没有加载成功，请稍后重试。");
        return false;
      }
      return true;
    }

    function hostRoom2() {
      if (!ensurePeerJs2()) return;
      readMyTeam();
      if (app.mode !== "lobby") closeNetwork2();
      app.mode = "host";
      app.side = "host";
      app.selections.host = cloneTeam(app.myTeam);
      app.selections.guest = cloneTeam(DEFAULT_SELECTIONS.guest);
      app.roomCode = createRoomCode2();
      app.peer = new Peer(peerIdFromRoom2(app.roomCode), { debug: 1 });
      app.peer.on("open", () => {
        updateNetworkStatus2(`2v2 房间已创建：${app.roomCode}。等待访客队加入。`);
        publishRoom2("waiting");
        app.lobbyTimer = window.setInterval(() => publishRoom2(), ROOM_HEARTBEAT_MS);
        updateInputLocks2();
      });
      app.peer.on("connection", (conn) => {
        if (app.conn?.open) {
          conn.on("open", () => conn.send({ type: "error", message: "房间已满" }));
          setTimeout(() => conn.close(), 300);
          return;
        }
        setupConnection2(conn);
        app.connected = true;
        updateNetworkStatus2(`房间 ${app.roomCode} 已连接，访客队正在选择阵容。`);
        publishRoom2("ready");
        syncSelections2();
      });
      app.peer.on("error", (err) => {
        updateNetworkStatus2(`创建房间失败：${err.message || err.type || err}`);
        updateInputLocks2();
      });
      updateInputLocks2();
    }

    function joinRoom2() {
      if (!ensurePeerJs2()) return;
      const code = $("roomInput").value.trim();
      if (!code) {
        updateNetworkStatus2("请输入房间码。");
        return;
      }
      readMyTeam();
      if (app.mode !== "lobby") closeNetwork2();
      app.mode = "guest";
      app.side = "guest";
      app.selections.guest = cloneTeam(app.myTeam);
      app.roomCode = code.toUpperCase();
      app.peer = new Peer(undefined, { debug: 1 });
      app.peer.on("open", () => {
        updateNetworkStatus2(`正在加入 2v2 房间 ${app.roomCode}...`);
        const conn = app.peer.connect(peerIdFromRoom2(app.roomCode), { reliable: true });
        setupConnection2(conn);
      });
      app.peer.on("error", (err) => {
        updateNetworkStatus2(`加入房间失败：${err.message || err.type || err}`);
        updateInputLocks2();
      });
      updateInputLocks2();
    }

    function setupConnection2(conn) {
      app.conn = conn;
      conn.on("open", () => {
        app.connected = true;
        updateNetworkStatus2(app.mode === "host" ? `房间 ${app.roomCode} 已连接。` : `已加入房间 ${app.roomCode}，等待房主开始。`);
        updateInputLocks2();
        if (app.mode === "guest") send2({ type: "selection", team: app.selections.guest });
        if (app.mode === "host") syncSelections2();
      });
      conn.on("data", handleMessage2);
      conn.on("close", () => {
        app.connected = false;
        updateNetworkStatus2("联机已断开，可以重新创建或加入房间。");
        updateInputLocks2();
      });
      conn.on("error", (err) => {
        updateNetworkStatus2(`联机错误：${err.message || err.type || err}`);
        updateInputLocks2();
      });
    }

    function handleMessage2(message) {
      if (!message || typeof message !== "object") return;
      if (message.type === "selection" && app.mode === "host") {
        app.selections.guest = cleanTeam(message.team, "访客", DEFAULT_SELECTIONS.guest);
        updateSummaries2();
        publishRoom2("ready");
        syncSelections2();
        return;
      }
      if (message.type === "selectionState" && app.mode === "guest") {
        app.selections = cleanSelections(message.selections);
        applyMyTeamToInputs();
        updateNetworkStatus2(`已加入房间 ${app.roomCode}，等待房主开始。`);
        updateInputLocks2();
        return;
      }
      if (message.type === "start" && app.mode === "guest") {
        app.selections = cleanSelections(message.selections);
        app.engine = TeamBattleEngine.fromSnapshot(message.snapshot);
        applyMyTeamToInputs();
        renderBattle2();
        return;
      }
      if (message.type === "snapshot" && app.mode === "guest") {
        app.engine = TeamBattleEngine.fromSnapshot(message.snapshot);
        renderBattle2();
        return;
      }
      if (message.type === "reset" && app.mode === "guest") {
        app.selections = cleanSelections(message.selections || app.selections);
        app.engine = null;
        applyMyTeamToInputs();
        $("battlePanel").hidden = true;
        updateInputLocks2();
        return;
      }
      if (message.type === "intent" && app.mode === "host") {
        if (!app.engine) return;
        const current = app.engine.currentPlayer();
        if (message.action === "takeAction" && current?.owner === "guest") app.engine.takeAction(message.targets);
        renderBattle2();
        broadcastSnapshot2();
        return;
      }
      if (message.type === "error") updateNetworkStatus2(message.message || "联机错误");
    }

    function syncSelections2() {
      if (app.mode !== "host") return;
      readMyTeam();
      send2({ type: "selectionState", selections: app.selections });
      publishRoom2();
    }

    function pushOwnSelection2() {
      readMyTeam();
      updateCharacterNotes2();
      updateSummaries2();
      if (app.mode === "guest") send2({ type: "selection", team: app.selections.guest });
      else if (app.mode === "host") syncSelections2();
    }

    async function copyRoom2() {
      if (!app.roomCode) return;
      try {
        await navigator.clipboard.writeText(app.roomCode);
        updateNetworkStatus2(`房间码 ${app.roomCode} 已复制。`);
      } catch {
        updateNetworkStatus2(`房间码：${app.roomCode}`);
      }
    }

    function bindEvents2() {
      $("hostRoom").addEventListener("click", hostRoom2);
      $("joinRoom").addEventListener("click", joinRoom2);
      $("refreshRooms").addEventListener("click", () => {
        app.rooms.clear();
        renderRooms2();
        connectLobby2(true);
      });
      $("roomList").addEventListener("click", (event) => {
        const button = event.target.closest("button[data-join-room]");
        if (!button || button.disabled) return;
        $("roomInput").value = button.dataset.joinRoom;
        joinRoom2();
      });
      $("copyRoom").addEventListener("click", copyRoom2);
      $("disconnectRoom").addEventListener("click", closeNetwork2);
      $("startGame").addEventListener("click", startBattle2);
      $("actionButton").addEventListener("click", performAction2);
      $("restartButton").addEventListener("click", resetBattle2);
      for (const id of ["myName0", "myName1", "myCharacter0", "myCharacter1"]) {
        $(id).addEventListener("input", pushOwnSelection2);
        $(id).addEventListener("change", pushOwnSelection2);
      }
      window.addEventListener("beforeunload", () => {
        if (app.mode === "host" && app.roomCode) publishClosedRoom2();
      });
    }

    function init2() {
      $("nav").innerHTML = C.renderNav("game");
      C.wireRefresh();
      C.tickBeijing("nowBeijing");
      renderOptions2();
      renderRoster2();
      bindEvents2();
      applyMyTeamToInputs();
      updateInputLocks2();
      renderBattle2();
      renderRooms2();
      connectLobby2();
    }

    init2();
  }

  function clampName(value, fallback) {
    const clean = String(value || "").trim().replace(/\s+/g, " ").slice(0, 18);
    return clean || fallback;
  }

  function createFighter(selection, fallbackName) {
    const def = CHARACTER_BY_ID[selection.characterId] || CHARACTER_DEFS[0];
    const playerName = clampName(selection.name, fallbackName);
    return {
      displayName: `${playerName}(${def.name})`,
      playerName,
      characterId: def.id,
      characterName: def.name,
      health: 100,
      shield: 0,
      actionPoints: 0,
      healMultiplier: 1,
      attackMultiplier: 1,
    };
  }

  class BattleEngine {
    constructor(selections) {
      this.players = [
        createFighter(selections.p1, "玩家1"),
        createFighter(selections.p2, "玩家2"),
      ];
      this.players[0].actionPoints = 1;
      this.players[1].actionPoints = 0;
      this.current = 0;
      this.phase = 1;
      this.gameOver = false;
      this.roundEnd = false;
      this.skillText = "等待行动";
      this.skillColor = "#667085";
      this.lastRoll = null;
      this.logs = [];
      this.log(`\n╔${"=".repeat(45)}`);
      this.log(`║ ${"战斗开始!".padStart(25).padEnd(44)} `);
      this.log(`║   ${this.players[0].displayName} VS ${this.players[1].displayName}`);
      this.log(`╚${"=".repeat(45)}`);
      this.log(`\n${this.players[0].displayName} 先手行动！`);
    }

    clone() {
      return {
        players: this.players.map((player) => ({ ...player })),
        current: this.current,
        phase: this.phase,
        gameOver: this.gameOver,
        roundEnd: this.roundEnd,
        skillText: this.skillText,
        skillColor: this.skillColor,
        lastRoll: this.lastRoll,
        logs: this.logs.slice(-240),
      };
    }

    static fromSnapshot(snapshot) {
      const engine = Object.create(BattleEngine.prototype);
      engine.players = snapshot.players.map((player) => ({ ...player }));
      engine.current = snapshot.current;
      engine.phase = snapshot.phase;
      engine.gameOver = snapshot.gameOver;
      engine.roundEnd = snapshot.roundEnd;
      engine.skillText = snapshot.skillText;
      engine.skillColor = snapshot.skillColor;
      engine.lastRoll = snapshot.lastRoll || null;
      engine.logs = snapshot.logs || [];
      return engine;
    }

    log(text, color = "") {
      this.logs.push({ text, color });
    }

    currentPlayer() {
      return this.current == null ? null : this.players[this.current];
    }

    targetIndexes() {
      if (this.current == null) return [];
      return this.players
        .map((player, index) => ({ player, index }))
        .filter(({ player, index }) => index !== this.current && player.health > 0)
        .map(({ index }) => index);
    }

    targetPlayer(targetIndex = null) {
      if (this.current == null) return null;
      const indexes = this.targetIndexes();
      const requested = Number(targetIndex);
      const selected = indexes.includes(requested) ? requested : indexes[0];
      return selected == null ? null : this.players[selected];
    }

    takeAction(targetIndex = null) {
      if (this.gameOver || this.current == null) return;
      const attacker = this.currentPlayer();
      const target = this.targetPlayer(targetIndex);
      if (!target) {
        this.log(`${attacker.displayName} 没有可选目标，行动取消。`);
        return;
      }
      const result = this.rollSkill(attacker, target);
      const meta = result.handler ? SKILL_META[result.handler] : null;
      this.skillColor = meta?.[1] || "#151b23";
      this.lastRoll = result.roll
        ? { roll: result.roll, max: 100, skill: result.name, target: target.displayName, range: result.range }
        : null;
      this.skillText = result.valid
        ? `${attacker.displayName} 使用了 [${result.name}] · 随机数 ${result.roll}/100 · 目标 ${target.displayName}`
        : `${attacker.displayName} ${result.name}`;
      if (result.valid) attacker.actionPoints -= 1;
      if (this.checkGameState()) return;
      if (attacker.actionPoints <= 0) {
        if (this.current === 0) {
          this.players[1].actionPoints += 1;
          this.current = 1;
          this.log(`\n${this.players[1].displayName} 开始行动！`);
        } else {
          this.current = 0;
          this.log("\n回合结束!");
        }
      }
      if (this.players[1].actionPoints <= 0 && this.current === 0 && this.players[0].actionPoints <= 0) {
        this.endRound();
        if (!this.gameOver) this.nextRound();
        return;
      }
      this.checkGameState();
    }

    rollSkill(attacker, target) {
      if (attacker.health <= 0) return { name: "无法行动（死亡）", valid: false };
      if (attacker.actionPoints <= 0) {
        this.log(`${attacker.displayName} 没有行动点，无法行动！`);
        return { name: "无法行动", valid: false };
      }
      const def = CHARACTER_BY_ID[attacker.characterId] || CHARACTER_DEFS[0];
      const roll = Math.floor(Math.random() * 100) + 1;
      this.log(`${attacker.displayName} 行动随机数：${roll}/100；目标：${target.displayName}`, "#93c5fd");
      let cumulative = 0;
      for (const [name, probability, handler] of def.skills) {
        const rangeStart = cumulative + 1;
        cumulative += probability;
        if (roll <= cumulative) {
          this.log(`命中区间：${rangeStart}-${cumulative}，技能：[${name}]`, "#93c5fd");
          HANDLERS[handler](attacker, target, this);
          return { name, handler, valid: true, roll, range: [rangeStart, cumulative] };
        }
      }
      this.log(`${attacker.displayName} 犹豫不决，没有行动！`);
      return { name: "犹豫不决", valid: true, roll, range: null };
    }

    endRound() {
      this.log(`\n===== 第 ${this.phase} 回合结束 =====`);
      this.roundEnd = true;
      this.current = null;
    }

    nextRound() {
      if (this.gameOver || !this.roundEnd) return;
      this.phase += 1;
      this.current = 0;
      this.roundEnd = false;
      this.players[0].actionPoints += 1;
      this.log(`\n===== 第 ${this.phase} 回合开始 =====`);
      this.log(`${this.players[0].displayName} 开始行动！`);
      this.skillText = "新回合开始";
      this.skillColor = "#1565c0";
    }

    checkGameState() {
      const [p1, p2] = this.players;
      if (p1.health <= 0 && p2.health <= 0) {
        this.log("\n╔══════════════════════════════════════════════════");
        this.log("║                  平局！双方同归于尽                ");
        this.log("╚══════════════════════════════════════════════════");
        this.skillText = "平局！双方同归于尽";
        this.skillColor = COLORS.ultimate;
        this.gameOver = true;
        return true;
      }
      if (p1.health <= 0) {
        this.log("\n╔══════════════════════════════════════════════════");
        this.log(`║ ${p2.displayName} 获胜！`);
        this.log("╚══════════════════════════════════════════════════");
        this.skillText = `${p2.displayName} 获胜！`;
        this.skillColor = COLORS.ultimate;
        this.gameOver = true;
        return true;
      }
      if (p2.health <= 0) {
        this.log("\n╔══════════════════════════════════════════════════");
        this.log(`║ ${p1.displayName} 获胜！`);
        this.log("╚══════════════════════════════════════════════════");
        this.skillText = `${p1.displayName} 获胜！`;
        this.skillColor = COLORS.ultimate;
        this.gameOver = true;
        return true;
      }
      return false;
    }
  }

  const HANDLERS = {
    normal_attack(attacker, target, engine) {
      if (target.shield > 0) {
        target.shield -= 1;
        engine.log(`${attacker.displayName}的攻击被${target.displayName}格挡！`);
      } else {
        const damage = 10 * attacker.attackMultiplier;
        target.health -= damage;
        engine.log(`${attacker.displayName}攻击！${target.displayName}受到${damage}点伤害`);
      }
      attacker.attackMultiplier = 1;
    },
    critical_hit(attacker, target, engine) {
      if (target.shield > 0) {
        target.shield -= 1;
        engine.log(`${attacker.displayName}的暴击被${target.displayName}格挡！`);
      } else {
        const damage = 20 * attacker.attackMultiplier;
        target.health -= damage;
        engine.log(`${attacker.displayName}发动暴击！${target.displayName}受到${damage}点重创`);
      }
      attacker.attackMultiplier = 1;
    },
    gain_shield(attacker, target, engine) {
      attacker.shield += 1;
      engine.log(`${attacker.displayName}获得护盾！`);
    },
    self_harm(attacker, target, engine) {
      if (attacker.shield > 0) {
        attacker.shield -= 1;
        engine.log(`${attacker.displayName}的反噬被护盾吸收！`);
      } else {
        attacker.health -= 10;
        engine.log(`${attacker.displayName}受到反噬伤害！失去10点生命值`);
      }
    },
    heal(attacker, target, engine) {
      const healAmount = 10 * attacker.healMultiplier;
      attacker.health += healAmount;
      engine.log(`${attacker.displayName}恢复${healAmount}点生命值`);
      attacker.healMultiplier = 1;
    },
    critical_heal(attacker, target, engine) {
      const healAmount = 20 * attacker.healMultiplier;
      attacker.health += healAmount;
      engine.log(`${attacker.displayName}发动暴疗！恢复${healAmount}点生命值`);
      attacker.healMultiplier = 1;
    },
    two_more(attacker, target, engine) {
      attacker.actionPoints += 2;
      engine.log(`${attacker.displayName}再抽两次！`);
    },
    blood_swap(attacker, target, engine) {
      [attacker.health, target.health] = [target.health, attacker.health];
      engine.log(`${attacker.displayName}发动换血！双方生命值交换`);
    },
    blood_swap1(attacker, target, engine) {
      HANDLERS.blood_swap(attacker, target, engine);
      if (target.shield > 0) {
        target.shield -= 1;
        engine.log(`${attacker.displayName}的追击被${target.displayName}格挡！`);
      } else {
        target.health -= 10;
        engine.log(`${attacker.displayName}追击！${target.displayName}受到10点伤害`);
      }
    },
    silence(attacker, target, engine) {
      if (target.actionPoints >= 0) {
        target.actionPoints -= 3;
        engine.log(`${attacker.displayName}沉默${target.displayName}！行动点减少3点`);
      } else {
        engine.log("无效抽取！请重抽！");
        attacker.actionPoints += 1;
      }
    },
    undead_ultimate(attacker, target, engine) {
      engine.log(`${attacker.displayName}发动终焉之剑！`);
      [attacker.health, target.health] = [target.health, attacker.health];
      engine.log(`${attacker.displayName}发动换血！双方生命值交换`);
      HANDLERS.critical_hit(attacker, target, engine);
      attacker.shield += 1;
      engine.log(`${attacker.displayName}获得护盾！`);
    },
    ice_attack(attacker, target, engine) {
      if (target.shield > 0) {
        target.shield -= 1;
        engine.log(`${attacker.displayName}的寒冰攻击被${target.displayName}格挡！`);
      } else {
        target.health -= 30;
        engine.log(`${attacker.displayName}的寒冰攻击造成30点伤害`);
      }
    },
    ice_silence(attacker, target, engine) {
      target.actionPoints -= 1;
      engine.log(`${attacker.displayName}冰冻${target.displayName}！行动点减少1点`);
    },
    bomb_attack(attacker, target, engine) {
      if (target.shield > 0) {
        target.shield -= 1;
        engine.log(`${target.displayName}格挡爆炸伤害！`);
      } else {
        target.health -= 20;
        engine.log(`${attacker.displayName}的爆炸瓶造成20点伤害`);
      }
      if (attacker.shield > 0) {
        attacker.shield -= 1;
        engine.log(`${attacker.displayName}的护盾吸收自爆伤害！`);
      } else {
        attacker.health -= 20;
        engine.log(`${attacker.displayName}受到20点反冲伤害`);
      }
    },
    double_attack(attacker, target, engine) {
      if (target.shield > 0) {
        target.shield -= 1;
        engine.log(`${attacker.displayName}的燃血轰击被${target.displayName}格挡！`);
      } else {
        target.health -= 20;
        engine.log(`${attacker.displayName}发动燃血轰击！${target.displayName}受到20点重创`);
      }
      if (attacker.shield > 0) {
        attacker.shield -= 1;
        engine.log(`${attacker.displayName}的反噬被护盾吸收！`);
      } else {
        attacker.health -= 10;
        engine.log(`${attacker.displayName}受到反噬伤害！失去10点生命值`);
      }
    },
    poison_attack(attacker, target, engine) {
      if (target.shield > 0) {
        target.shield -= 1;
        engine.log(`${target.displayName}格挡毒液伤害！`);
      } else {
        target.health -= 20;
        engine.log(`${attacker.displayName}的毒瓶造成20点伤害`);
      }
      if (attacker.shield > 0) {
        attacker.shield -= 1;
        engine.log(`${attacker.displayName}的护盾中和毒素！`);
      } else {
        attacker.health -= 30;
        engine.log(`${attacker.displayName}受到30点毒雾反噬`);
      }
    },
    mage_ultimate(attacker, target, engine) {
      if (target.shield > 0) {
        target.shield -= 1;
        engine.log(`${target.displayName}格挡大招伤害！`);
      } else {
        target.health -= 30;
        engine.log(`${attacker.displayName}发动终极魔法！${target.displayName}受到30点伤害`);
      }
      attacker.health += 30;
      engine.log(`${attacker.displayName}恢复30点生命值`);
    },
    medicine_both_heal(attacker, target, engine) {
      const healAmount = 10 * attacker.healMultiplier;
      attacker.health += healAmount;
      target.health += healAmount;
      engine.log(`${attacker.displayName}发动群体治疗！双方各恢复${healAmount}点生命值`);
      attacker.healMultiplier = 1;
    },
    medicine_crit_heal(attacker, target, engine) {
      HANDLERS.critical_hit(attacker, target, engine);
      const healAmount = 10 * attacker.healMultiplier;
      attacker.health += healAmount;
      engine.log(`${attacker.displayName}自我治疗${healAmount}点生命值`);
      attacker.healMultiplier = 1;
    },
    medicine_crit_silence(attacker, target, engine) {
      HANDLERS.critical_hit(attacker, target, engine);
      target.actionPoints -= 1;
      engine.log(`${attacker.displayName}使${target.displayName}下回合无法行动！`);
    },
    medicine_boost_heal(attacker, target, engine) {
      attacker.healMultiplier *= 2;
      engine.log(`${attacker.displayName}强化治疗效果！下次治疗量翻倍！`);
    },
    medicine_mega_heal(attacker, target, engine) {
      const healAmount = 60 * attacker.healMultiplier;
      attacker.health += healAmount;
      engine.log(`${attacker.displayName}发动超级治疗！恢复${healAmount}点生命值`);
      attacker.healMultiplier = 1;
    },
    double_normal_attack(attacker, target, engine) {
      engine.log(`${attacker.displayName}发动双重打击！`);
      const originalMultiplier = attacker.attackMultiplier;
      for (const label of ["第一次", "第二次"]) {
        if (target.shield > 0) {
          target.shield -= 1;
          engine.log(`${attacker.displayName}的${label}攻击被${target.displayName}格挡！`);
        } else {
          const damage = 10 * originalMultiplier;
          target.health -= damage;
          engine.log(`${attacker.displayName}的${label}攻击！${target.displayName}受到${damage}点伤害`);
        }
      }
      attacker.attackMultiplier = 1;
    },
    attack_and_draw(attacker, target, engine) {
      HANDLERS.normal_attack(attacker, target, engine);
      attacker.actionPoints += 1;
      engine.log(`${attacker.displayName}获得额外行动点！`);
    },
    attack_and_heal(attacker, target, engine) {
      HANDLERS.normal_attack(attacker, target, engine);
      HANDLERS.heal(attacker, target, engine);
    },
    attack_and_shield(attacker, target, engine) {
      HANDLERS.normal_attack(attacker, target, engine);
      HANDLERS.gain_shield(attacker, target, engine);
    },
    half_hp_and_attack(attacker, target, engine) {
      HANDLERS.half_hp_both(attacker, target, engine);
      HANDLERS.normal_attack(attacker, target, engine);
    },
    double_next_attack(attacker, target, engine) {
      attacker.attackMultiplier *= 2;
      engine.log(`${attacker.displayName}凝聚力量，下次攻击威力翻倍！`);
    },
    self_harm_and_triple_critical(attacker, target, engine) {
      if (attacker.shield > 0) {
        attacker.shield -= 1;
        engine.log(`${attacker.displayName}的护盾抵挡了生命代价！`);
      } else {
        attacker.health -= 40;
        engine.log(`${attacker.displayName}以自身生命为代价，失去40点生命值！`);
      }
      const originalMultiplier = attacker.attackMultiplier;
      engine.log(`${attacker.displayName}发动毁灭三连击！`);
      for (let index = 1; index <= 3; index += 1) {
        if (target.shield > 0) {
          target.shield -= 1;
          engine.log(`${attacker.displayName}的第${index}次暴击被${target.displayName}格挡！`);
        } else {
          const damage = 20 * originalMultiplier;
          target.health -= damage;
          engine.log(`${attacker.displayName}的第${index}次暴击！${target.displayName}受到${damage}点重创`);
        }
      }
      attacker.attackMultiplier = 1;
    },
    double_deduction(attacker, target, engine) {
      engine.log(`${attacker.displayName}发动双扣10！双方各受10点伤害`);
      if (target.shield > 0) {
        target.shield -= 1;
        engine.log(`${target.displayName}格挡了伤害！`);
      } else {
        target.health -= 10;
        engine.log(`${target.displayName}受到10点伤害`);
      }
      if (attacker.shield > 0) {
        attacker.shield -= 1;
        engine.log(`${attacker.displayName}格挡了自身伤害！`);
      } else {
        attacker.health -= 10;
        engine.log(`${attacker.displayName}受到10点反噬伤害`);
      }
    },
    double_deduction_and_draw(attacker, target, engine) {
      HANDLERS.double_deduction(attacker, target, engine);
      attacker.actionPoints += 1;
      engine.log(`${attacker.displayName}获得额外行动点！`);
    },
    half_hp_both(attacker, target, engine) {
      engine.log(`${attacker.displayName}发动生命削减！双方生命值减半`);
      for (const fighter of [target, attacker]) {
        if (fighter.shield > 0) {
          fighter.shield -= 1;
          engine.log(`${fighter.displayName}的护盾抵挡了生命削减！`);
        } else {
          const newHealth = Math.max(1, Math.floor(fighter.health / 2));
          const damage = fighter.health - newHealth;
          fighter.health = newHealth;
          engine.log(`${fighter.displayName}的生命值被削减一半！失去${damage}点生命值`);
        }
      }
    },
    attack_critical_draw(attacker, target, engine) {
      engine.log(`${attacker.displayName}发动小连招！`);
      HANDLERS.normal_attack(attacker, target, engine);
      HANDLERS.critical_hit(attacker, target, engine);
      attacker.actionPoints += 1;
      engine.log(`${attacker.displayName}获得额外行动点！`);
    },
    double_deduction_30_attack_critical_draw(attacker, target, engine) {
      engine.log(`${attacker.displayName}发动终极连招！`);
      engine.log(`${attacker.displayName}发动双扣30！双方各受30点伤害`);
      if (target.shield > 0) {
        target.shield -= 1;
        engine.log(`${target.displayName}格挡了伤害！`);
      } else {
        target.health -= 30;
        engine.log(`${target.displayName}受到30点伤害`);
      }
      if (attacker.shield > 0) {
        attacker.shield -= 1;
        engine.log(`${attacker.displayName}格挡了自身伤害！`);
      } else {
        attacker.health -= 30;
        engine.log(`${attacker.displayName}受到30点反噬伤害`);
      }
      HANDLERS.normal_attack(attacker, target, engine);
      HANDLERS.critical_hit(attacker, target, engine);
      attacker.actionPoints += 1;
      engine.log(`${attacker.displayName}获得额外行动点！`);
    },
    both_heal_10(attacker, target, engine) {
      engine.log(`${attacker.displayName}发动双加10！双方各恢复10点生命值`);
      attacker.health += 10;
      engine.log(`${attacker.displayName}恢复10点生命值`);
      target.health += 10;
      engine.log(`${target.displayName}恢复10点生命值`);
    },
    critical_and_critical_heal_and_draw(attacker, target, engine) {
      engine.log(`${attacker.displayName}发动终极连招！`);
      HANDLERS.critical_hit(attacker, target, engine);
      HANDLERS.critical_heal(attacker, target, engine);
      HANDLERS.two_more(attacker, target, engine);
    },
    shield_and_self_harm_10(attacker, target, engine) {
      attacker.shield += 1;
      attacker.health -= 10;
      engine.log(`${attacker.displayName}获得护盾，但受到10点不可格挡的反噬伤害！`);
    },
    knight_ultimate(attacker, target, engine) {
      HANDLERS.critical_hit(attacker, target, engine);
      attacker.actionPoints += 1;
      attacker.shield += 3;
      engine.log(`${attacker.displayName}发动终极连招！`);
    },
  };

  const ROOM_TTL_MS = 35000;
  const ROOM_HEARTBEAT_MS = 7000;
  const MQTT_BROKER = "wss://broker.emqx.io:8084/mqtt";
  const MQTT_TOPIC = "boncatta/baota/v1/rooms";
  const app = {
    mode: "lobby",
    side: null,
    peer: null,
    conn: null,
    lobbySocket: null,
    lobbyClient: null,
    lobbyKind: "",
    lobbyTimer: null,
    roomCode: "",
    connected: false,
    rooms: new Map(),
    mySelection: { name: "玩家", characterId: "undead" },
    selections: {
      p1: { name: "房主", characterId: "undead" },
      p2: { name: "访客", characterId: "frost" },
    },
    engine: null,
  };

  function lobbyUrl() {
    const params = new URLSearchParams(location.search);
    const explicit = params.get("lobby") || localStorage.getItem("baotaLobbyUrl") || window.BAOTA_LOBBY_URL || "";
    if (explicit === "mqtt" || explicit === "public") return "";
    if (explicit) return explicit;
    if (location.hostname === "127.0.0.1" || location.hostname === "localhost") return "ws://127.0.0.1:8792";
    return "";
  }

  function mqttRoomTopic(code = "+") {
    return `${MQTT_TOPIC}/${String(code || "+").replace(/[^A-Z0-9+]/gi, "").toUpperCase()}`;
  }

  function currentDef(id) {
    return CHARACTER_BY_ID[id] || CHARACTER_DEFS[0];
  }

  function readMySelection() {
    app.mySelection = {
      name: clampName($("myName").value, "玩家"),
      characterId: $("myCharacter").value || "undead",
    };
    if (app.mode === "host") app.selections.p1 = { ...app.mySelection };
    if (app.mode === "guest") app.selections.p2 = { ...app.mySelection };
  }

  function applyMySelectionToInputs() {
    const selected = app.side === "p2" ? app.selections.p2 : app.side === "p1" ? app.selections.p1 : app.mySelection;
    $("myName").value = selected.name || "玩家";
    $("myCharacter").value = selected.characterId || "undead";
    app.mySelection = { name: $("myName").value, characterId: $("myCharacter").value };
    updateCharacterNotes();
  }

  function playerSummary(slot) {
    const selected = app.selections[slot];
    const def = currentDef(selected.characterId);
    if (!selected?.name) {
      return `<div class="empty">等待${slot === "p1" ? "房主" : "访客"}选择角色</div>`;
    }
    return `<strong>${C.escapeHtml(selected.name)} / ${C.escapeHtml(def.name)}</strong><p class="small">${C.escapeHtml(def.desc)}</p><div class="tags">${def.skills.slice(0, 6).map(([name, prob, handler]) => `<span class="tag" style="border-color:${SKILL_META[handler]?.[1] || "#d8dee8"}">${C.escapeHtml(name)} ${prob}%</span>`).join("")}</div>`;
  }

  function updateSummaries() {
    $("p1Summary").innerHTML = playerSummary("p1");
    $("p2Summary").innerHTML = playerSummary("p2");
    $("p1Ready").textContent = app.selections.p1.name ? "已选择" : "等待选择";
    $("p2Ready").textContent = app.connected ? "已加入" : "等待加入";
  }

  function updateInputLocks() {
    const inBattle = !!app.engine;
    $("myName").disabled = inBattle;
    $("myCharacter").disabled = inBattle;
    $("hostRoom").disabled = inBattle || app.mode === "host" || app.mode === "guest";
    $("joinRoom").disabled = inBattle || app.mode === "host" || app.mode === "guest";
    $("roomInput").disabled = inBattle || app.mode === "host" || app.mode === "guest";
    $("startGame").disabled = app.mode !== "host" || !app.connected || inBattle;
    $("copyRoom").disabled = !app.roomCode;
    $("disconnectRoom").disabled = app.mode === "lobby";
    $("sideHint").textContent = app.mode === "host"
      ? "你是房主，等待访客加入后可以开始。"
      : app.mode === "guest"
        ? "你是访客，等待房主开始。"
        : "创建房间后你是房主；加入房间后你是访客。";
    updateSummaries();
  }

  function updateNetworkStatus(text) {
    $("networkStatus").textContent = text;
    $("roomInfo").textContent = text;
  }

  function renderOptions() {
    const options = CHARACTER_DEFS.map((def) => `<option value="${def.id}">${def.name} - ${def.desc}</option>`).join("");
    $("myCharacter").innerHTML = options;
    $("myCharacter").value = app.mySelection.characterId;
  }

  function updateCharacterNotes() {
    const def = currentDef($("myCharacter").value);
    const total = def.skills.reduce((sum, item) => sum + item[1], 0);
    $("myNote").innerHTML = `<strong>${C.escapeHtml(def.name)}</strong>：${C.escapeHtml(def.desc)}<div class="tags">${def.skills.map(([name, prob, handler]) => `<span class="tag" style="border-color:${SKILL_META[handler]?.[1] || "#d8dee8"}">${C.escapeHtml(name)} ${prob}%</span>`).join("")}</div><div class="small">概率合计 ${total}%</div>`;
  }

  function renderRoster() {
    $("roster").innerHTML = CHARACTER_DEFS.map((def) => {
      const skills = def.skills.map(([name, prob, handler]) => {
        const color = SKILL_META[handler]?.[1] || "#667085";
        return `<span class="tag" style="border-color:${color};color:${color}">${C.escapeHtml(name)} ${prob}%</span>`;
      }).join("");
      return `<article class="game-roster-card"><h3>${C.escapeHtml(def.name)}</h3><p class="small">${C.escapeHtml(def.desc)}</p><div class="tags">${skills}</div></article>`;
    }).join("");
  }

  function renderBattle() {
    const engine = app.engine;
    $("battlePanel").hidden = !engine;
    if (!engine) {
      updateInputLocks();
      return;
    }
    const snapshot = engine.clone();
    $("roundTitle").textContent = `第 ${snapshot.phase} 回合`;
    $("skillBanner").textContent = snapshot.skillText || "等待行动";
    $("skillBanner").style.color = snapshot.skillColor || "#667085";
    $("rollInfo").textContent = snapshot.lastRoll
      ? `上次随机数 ${snapshot.lastRoll.roll}/${snapshot.lastRoll.max} · ${snapshot.lastRoll.skill} · 目标 ${snapshot.lastRoll.target}${snapshot.lastRoll.range ? ` · 区间 ${snapshot.lastRoll.range[0]}-${snapshot.lastRoll.range[1]}` : ""}`
      : "上次随机数：等待首次行动";
    snapshot.players.forEach((player, index) => {
      const prefix = index === 0 ? "p1" : "p2";
      $(`${prefix}BattleName`).textContent = player.displayName;
      $(`${prefix}Health`).textContent = Math.max(0, player.health);
      $(`${prefix}Shield`).textContent = player.shield;
      $(`${prefix}Actions`).textContent = player.actionPoints;
      const healthPercent = Math.max(0, Math.min(100, player.health));
      $(`${prefix}HealthBar`).style.width = `${healthPercent}%`;
      $(`fighterP${index + 1}`).classList.toggle("is-current", snapshot.current === index);
      $(`fighterP${index + 1}`).classList.toggle("is-dead", player.health <= 0);
    });
    const current = snapshot.current == null ? null : snapshot.players[snapshot.current];
    $("turnHint").textContent = snapshot.gameOver
      ? "战斗结束"
      : snapshot.roundEnd
        ? "系统正在进入下一回合"
        : current
          ? `${current.displayName} 行动中`
          : "等待行动";
    $("battleRoomCode").textContent = app.roomCode ? `房间 ${app.roomCode}` : "房间 --";
    $("battleLog").innerHTML = snapshot.logs.map((entry) => `<p ${entry.color ? `style="color:${entry.color}"` : ""}>${C.escapeHtml(entry.text)}</p>`).join("");
    $("logCount").textContent = C.fmt.format(snapshot.logs.length);
    $("battleLog").scrollTop = $("battleLog").scrollHeight;
    updateControls();
    renderTargetOptions();
    updateInputLocks();
  }

  function renderTargetOptions() {
    const select = $("targetSelect");
    if (!select) return;
    if (!app.engine || app.engine.current == null) {
      select.innerHTML = `<option value="">暂无目标</option>`;
      select.disabled = true;
      return;
    }
    const indexes = app.engine.targetIndexes();
    select.innerHTML = indexes.length
      ? indexes.map((index) => {
        const player = app.engine.players[index];
        return `<option value="${index}">${C.escapeHtml(player.displayName)} · 生命 ${Math.max(0, player.health)} · 护盾 ${player.shield}</option>`;
      }).join("")
      : `<option value="">暂无目标</option>`;
    select.disabled = !localSideCanAct() || !indexes.length;
  }

  function localSideCanAct() {
    if (!app.engine || app.engine.gameOver) return false;
    if (app.engine.current == null) return false;
    return (app.mode === "host" && app.engine.current === 0) || (app.mode === "guest" && app.engine.current === 1);
  }

  function updateControls() {
    const engine = app.engine;
    const canAct = localSideCanAct();
    $("actionButton").disabled = !engine || engine.roundEnd || engine.gameOver || !canAct;
    $("restartButton").disabled = !engine || app.mode === "guest";
    renderTargetOptions();
  }

  function startBattle() {
    readMySelection();
    if (app.mode !== "host" || !app.connected) {
      updateNetworkStatus(`房间 ${app.roomCode} 等待访客加入后才能开始。`);
      return;
    }
    app.engine = new BattleEngine(app.selections);
    renderBattle();
    publishRoom("playing");
    broadcast({ type: "start", selections: app.selections, snapshot: app.engine.clone() });
  }

  function resetBattle() {
    app.engine = null;
    $("battlePanel").hidden = true;
    updateInputLocks();
    publishRoom(app.connected ? "ready" : "waiting");
    broadcast({ type: "reset", selections: app.selections });
  }

  function performAction() {
    if (!app.engine) return;
    const targetIndex = Number($("targetSelect")?.value);
    if (app.mode === "guest") {
      send({ type: "intent", action: "takeAction", targetIndex });
      return;
    }
    app.engine.takeAction(targetIndex);
    renderBattle();
    broadcastSnapshot();
  }

  function send(message) {
    if (app.conn?.open) app.conn.send(message);
  }

  function broadcast(message) {
    if (app.mode === "host") send(message);
  }

  function broadcastSnapshot() {
    broadcast({ type: "snapshot", snapshot: app.engine?.clone() });
  }

  function lobbySend(message) {
    if (app.lobbySocket?.readyState === WebSocket.OPEN) app.lobbySocket.send(JSON.stringify(message));
  }

  function publishRoom(status = null) {
    if (app.mode !== "host" || !app.roomCode) return;
    const hostDef = currentDef(app.selections.p1.characterId);
    const guestDef = currentDef(app.selections.p2.characterId);
    const payload = {
      type: "room",
      code: app.roomCode,
      peerId: peerIdFromRoom(app.roomCode),
      status: status || (app.engine ? "playing" : app.connected ? "ready" : "waiting"),
      hostName: app.selections.p1.name,
      hostCharacter: hostDef.name,
      guestName: app.connected ? app.selections.p2.name : "",
      guestCharacter: app.connected ? guestDef.name : "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    app.rooms.set(app.roomCode, { ...payload, seenAt: Date.now() });
    renderRooms();
    lobbySend(payload);
    if (app.lobbyClient?.connected) {
      app.lobbyClient.publish(mqttRoomTopic(app.roomCode), JSON.stringify(payload), { qos: 0, retain: false });
    }
  }

  function publishClosedRoom() {
    if (!app.roomCode) return;
    const payload = { type: "room", code: app.roomCode, status: "closed", updatedAt: Date.now() };
    app.rooms.delete(app.roomCode);
    renderRooms();
    lobbySend({ type: "close", code: app.roomCode });
    if (app.lobbyClient?.connected) {
      app.lobbyClient.publish(mqttRoomTopic(app.roomCode), JSON.stringify(payload), { qos: 0, retain: false });
    }
  }

  function connectLobby(force = false) {
    const url = lobbyUrl();
    if (!url) {
      connectMqttLobby(force);
      return;
    }
    app.lobbyKind = "ws";
    if (!force && app.lobbySocket && [WebSocket.OPEN, WebSocket.CONNECTING].includes(app.lobbySocket.readyState)) return;
    try { app.lobbySocket?.close(); } catch {}
    $("lobbyStatus").textContent = `连接大厅 ${url}...`;
    app.lobbySocket = new WebSocket(url);
    app.lobbySocket.addEventListener("open", () => {
      updateNetworkStatus("自有大厅已连接。");
      $("lobbyStatus").textContent = "大厅已连接，房间列表实时更新。";
      lobbySend({ type: "hello" });
      publishRoom();
    });
    app.lobbySocket.addEventListener("message", (event) => {
      let message;
      try { message = JSON.parse(event.data); } catch { return; }
      if (message.type === "rooms") {
        app.rooms.clear();
        const stamp = Date.now();
        for (const room of message.rooms || []) {
          app.rooms.set(room.code, { ...room, seenAt: stamp });
        }
        renderRooms();
      }
    });
    app.lobbySocket.addEventListener("close", () => {
      updateNetworkStatus("大厅连接已断开，正在重连。");
      $("lobbyStatus").textContent = "大厅连接已断开，5 秒后重连。";
      window.setTimeout(() => connectLobby(true), 5000);
    });
    app.lobbySocket.addEventListener("error", () => {
      updateNetworkStatus("大厅连接失败，可以手动输入房间码。");
      $("lobbyStatus").textContent = "大厅连接失败，可手动输入房间码。";
    });
  }

  function connectMqttLobby(force = false) {
    if (!window.mqtt) {
      updateNetworkStatus("公共大厅库加载失败，可以手动输入房间码。");
      $("lobbyStatus").textContent = "未配置大厅后端，且公共大厅库加载失败；可以手动输入房间码。";
      renderRooms();
      return;
    }
    app.lobbyKind = "mqtt";
    if (!force && app.lobbyClient?.connected) return;
    try { app.lobbyClient?.end(true); } catch {}
    $("lobbyStatus").textContent = "连接公共大厅中...";
    app.lobbyClient = mqtt.connect(MQTT_BROKER, {
      clientId: `boncatta_${Math.random().toString(36).slice(2)}`,
      clean: true,
      connectTimeout: 8000,
      reconnectPeriod: 5000,
    });
    app.lobbyClient.on("connect", () => {
      updateNetworkStatus("公共大厅已连接。");
      $("lobbyStatus").textContent = "公共大厅已连接，房间列表实时更新。";
      app.lobbyClient.subscribe(mqttRoomTopic("+"));
      publishRoom();
    });
    app.lobbyClient.on("message", (topic, buffer) => {
      let room;
      try { room = JSON.parse(buffer.toString()); } catch { return; }
      if (!room?.code) return;
      if (room.status === "closed") {
        app.rooms.delete(room.code);
      } else {
        app.rooms.set(room.code, { ...room, seenAt: Date.now() });
      }
      renderRooms();
    });
    app.lobbyClient.on("close", () => {
      updateNetworkStatus("公共大厅连接断开，正在重连。");
      $("lobbyStatus").textContent = "公共大厅连接断开，正在重连。";
    });
    app.lobbyClient.on("error", () => {
      updateNetworkStatus("公共大厅连接失败，可以手动输入房间码。");
      $("lobbyStatus").textContent = "公共大厅连接失败，可以手动输入房间码。";
    });
  }

  function renderRooms() {
    const rooms = [...app.rooms.values()]
      .filter((room) => Date.now() - (room.updatedAt || 0) < ROOM_TTL_MS)
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    $("roomList").innerHTML = rooms.length
      ? rooms.map((room) => {
        const statusText = room.status === "playing" ? "对战中" : room.status === "ready" ? "已满员" : "等待中";
        const disabled = room.status !== "waiting" || app.mode !== "lobby";
        return `<article class="game-room-card">
          <div>
            <strong>${C.escapeHtml(room.code)}</strong>
            <span class="game-room-status status-${C.escapeHtml(room.status || "waiting")}">${statusText}</span>
          </div>
          <p>${C.escapeHtml(room.hostName || "房主")} / ${C.escapeHtml(room.hostCharacter || "未知角色")}</p>
          ${room.guestName ? `<p class="small">访客 ${C.escapeHtml(room.guestName)} / ${C.escapeHtml(room.guestCharacter || "未知角色")}</p>` : `<p class="small">等待访客加入</p>`}
          <button type="button" data-join-room="${C.escapeHtml(room.code)}" ${disabled ? "disabled" : ""}>加入</button>
        </article>`;
      }).join("")
      : `<div class="empty">暂无公开房间。你可以创建一个，或手动输入房间码。</div>`;
  }

  function createRoomCode() {
    return Math.random().toString(36).slice(2, 7).toUpperCase();
  }

  function peerIdFromRoom(code) {
    return `boncatta-${String(code || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "")}`;
  }

  function closeNetwork() {
    if (app.mode === "host" && app.roomCode) publishClosedRoom();
    if (app.lobbyTimer) window.clearInterval(app.lobbyTimer);
    app.lobbyTimer = null;
    try { app.conn?.close(); } catch {}
    try { app.peer?.destroy(); } catch {}
    app.peer = null;
    app.conn = null;
    app.connected = false;
    app.roomCode = "";
    app.mode = "lobby";
    app.side = null;
    app.engine = null;
    app.selections.p1 = { name: "房主", characterId: "undead" };
    app.selections.p2 = { name: "访客", characterId: "frost" };
    $("battlePanel").hidden = true;
    updateNetworkStatus("已回到联机大厅。");
    updateInputLocks();
    renderRooms();
  }

  function ensurePeerJs() {
    if (!window.Peer) {
      updateNetworkStatus("联机库暂时没有加载成功，请稍后重试。");
      return false;
    }
    return true;
  }

  function hostRoom() {
    if (!ensurePeerJs()) return;
    readMySelection();
    if (app.mode !== "lobby") closeNetwork();
    app.mode = "host";
    app.side = "p1";
    app.selections.p1 = { ...app.mySelection };
    app.selections.p2 = { name: "访客", characterId: "frost" };
    app.roomCode = createRoomCode();
    const peerId = peerIdFromRoom(app.roomCode);
    app.peer = new Peer(peerId, { debug: 1 });
    app.peer.on("open", () => {
      updateNetworkStatus(`房间已创建：${app.roomCode}。等待访客加入。`);
      publishRoom("waiting");
      app.lobbyTimer = window.setInterval(() => publishRoom(), ROOM_HEARTBEAT_MS);
      updateInputLocks();
    });
    app.peer.on("connection", (conn) => {
      if (app.conn?.open) {
        conn.on("open", () => conn.send({ type: "error", message: "房间已满" }));
        setTimeout(() => conn.close(), 300);
        return;
      }
      setupConnection(conn);
      app.connected = true;
      updateNetworkStatus(`房间 ${app.roomCode} 已连接，对手正在选择角色。`);
      publishRoom("ready");
      syncSelections();
    });
    app.peer.on("error", (err) => {
      updateNetworkStatus(`创建房间失败：${err.message || err.type || err}`);
      updateInputLocks();
    });
    updateInputLocks();
  }

  function joinRoom() {
    if (!ensurePeerJs()) return;
    const code = $("roomInput").value.trim();
    if (!code) {
      updateNetworkStatus("请输入房间码。");
      return;
    }
    readMySelection();
    if (app.mode !== "lobby") closeNetwork();
    app.mode = "guest";
    app.side = "p2";
    app.selections.p2 = { ...app.mySelection };
    app.roomCode = code.toUpperCase();
    app.peer = new Peer(undefined, { debug: 1 });
    app.peer.on("open", () => {
      updateNetworkStatus(`正在加入房间 ${app.roomCode}...`);
      const conn = app.peer.connect(peerIdFromRoom(app.roomCode), { reliable: true });
      setupConnection(conn);
    });
    app.peer.on("error", (err) => {
      updateNetworkStatus(`加入房间失败：${err.message || err.type || err}`);
      updateInputLocks();
    });
    updateInputLocks();
  }

  function setupConnection(conn) {
    app.conn = conn;
    conn.on("open", () => {
      app.connected = true;
      updateNetworkStatus(app.mode === "host" ? `房间 ${app.roomCode} 已连接。` : `已加入房间 ${app.roomCode}，等待房主开始。`);
      updateInputLocks();
      if (app.mode === "guest") send({ type: "selection", selection: app.selections.p2 });
      if (app.mode === "host") syncSelections();
    });
    conn.on("data", handleMessage);
    conn.on("close", () => {
      app.connected = false;
      updateNetworkStatus("联机已断开，可以重新创建或加入房间。");
      updateInputLocks();
    });
    conn.on("error", (err) => {
      updateNetworkStatus(`联机错误：${err.message || err.type || err}`);
      updateInputLocks();
    });
  }

  function handleMessage(message) {
    if (!message || typeof message !== "object") return;
    if (message.type === "selection" && app.mode === "host") {
      app.selections.p2 = {
        name: clampName(message.selection?.name, "玩家2"),
        characterId: message.selection?.characterId || "frost",
      };
      updateSummaries();
      publishRoom("ready");
      syncSelections();
      return;
    }
    if (message.type === "selectionState" && app.mode === "guest") {
      app.selections = message.selections;
      applyMySelectionToInputs();
      updateNetworkStatus(`已加入房间 ${app.roomCode}，等待房主开始。`);
      updateInputLocks();
      return;
    }
    if (message.type === "start" && app.mode === "guest") {
      app.selections = message.selections;
      app.engine = BattleEngine.fromSnapshot(message.snapshot);
      applyMySelectionToInputs();
      renderBattle();
      return;
    }
    if (message.type === "snapshot" && app.mode === "guest") {
      app.engine = BattleEngine.fromSnapshot(message.snapshot);
      renderBattle();
      return;
    }
    if (message.type === "reset" && app.mode === "guest") {
      app.selections = message.selections || app.selections;
      app.engine = null;
      applyMySelectionToInputs();
      $("battlePanel").hidden = true;
      updateInputLocks();
      return;
    }
    if (message.type === "intent" && app.mode === "host") {
      if (!app.engine) return;
      if (message.action === "takeAction" && app.engine.current === 1) {
        app.engine.takeAction(message.targetIndex);
      }
      renderBattle();
      broadcastSnapshot();
      return;
    }
    if (message.type === "error") {
      updateNetworkStatus(message.message || "联机错误");
    }
  }

  function syncSelections() {
    if (app.mode !== "host") return;
    readMySelection();
    send({ type: "selectionState", selections: app.selections });
    publishRoom();
  }

  function pushOwnSelection() {
    readMySelection();
    updateCharacterNotes();
    updateSummaries();
    if (app.mode === "guest") {
      send({ type: "selection", selection: app.selections.p2 });
    } else if (app.mode === "host") {
      syncSelections();
    }
  }

  async function copyRoom() {
    if (!app.roomCode) return;
    try {
      await navigator.clipboard.writeText(app.roomCode);
      updateNetworkStatus(`房间码 ${app.roomCode} 已复制。`);
    } catch {
      updateNetworkStatus(`房间码：${app.roomCode}`);
    }
  }

  function bindEvents() {
    $("hostRoom").addEventListener("click", hostRoom);
    $("joinRoom").addEventListener("click", joinRoom);
    $("refreshRooms").addEventListener("click", () => {
      app.rooms.clear();
      renderRooms();
      connectLobby(true);
    });
    $("roomList").addEventListener("click", (event) => {
      const button = event.target.closest("button[data-join-room]");
      if (!button || button.disabled) return;
      $("roomInput").value = button.dataset.joinRoom;
      joinRoom();
    });
    $("copyRoom").addEventListener("click", copyRoom);
    $("disconnectRoom").addEventListener("click", closeNetwork);
    $("startGame").addEventListener("click", startBattle);
    $("actionButton").addEventListener("click", performAction);
    $("restartButton").addEventListener("click", resetBattle);
    for (const id of ["myName", "myCharacter"]) {
      $(id).addEventListener("input", pushOwnSelection);
      $(id).addEventListener("change", pushOwnSelection);
    }
    window.addEventListener("beforeunload", () => {
      if (app.mode === "host" && app.roomCode) publishClosedRoom();
    });
  }

  function init() {
    $("nav").innerHTML = C.renderNav("game");
    C.wireRefresh();
    C.tickBeijing("nowBeijing");
    renderOptions();
    renderRoster();
    bindEvents();
    applyMySelectionToInputs();
    updateInputLocks();
    renderBattle();
    renderRooms();
    connectLobby();
  }

  init();
})();
