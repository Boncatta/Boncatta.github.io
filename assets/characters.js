(() => {
  const C = window.BONCATTA;
  const data = window.BONCATTA_GAME_DATA;
  const $ = (id) => document.getElementById(id);

  const EFFECTS = {
    normal_attack: "对目标造成 10 点伤害；若目标有护盾，则消耗 1 层护盾并免伤。",
    critical_hit: "对目标造成 20 点伤害；若目标有护盾，则消耗 1 层护盾并免伤。",
    gain_shield: "自身获得 1 层护盾。",
    self_harm: "自身受到 10 点反噬；若自身有护盾，则消耗 1 层护盾抵消。",
    heal: "自身恢复 10 点生命，受治疗倍率影响。",
    critical_heal: "自身恢复 20 点生命，受治疗倍率影响。",
    two_more: "自身获得 2 个额外行动点。",
    blood_swap: "与目标交换当前生命值。",
    blood_swap1: "与目标交换生命值，然后对目标追加 10 点伤害；追加伤害可被护盾抵消。",
    silence: "令目标行动点减少 3。",
    undead_ultimate: "与目标交换生命值，发动一次致命暴击，并获得 1 层护盾。",
    ice_attack: "对目标造成 30 点伤害；可被护盾抵消。",
    ice_silence: "令目标行动点减少 1。",
    bomb_attack: "对目标造成 20 点伤害，并对自己造成 20 点反冲；双方各自可用护盾抵消。",
    double_attack: "对目标造成 20 点伤害，并对自己造成 10 点反噬；双方各自可用护盾抵消。",
    poison_attack: "对目标造成 20 点伤害，并对自己造成 30 点毒雾反噬；双方各自可用护盾抵消。",
    mage_ultimate: "对目标造成 30 点伤害，并让自身恢复 30 点生命。",
    medicine_both_heal: "自身与目标各恢复 10 点生命，受治疗倍率影响。",
    medicine_crit_heal: "先发动一次致命暴击，然后自身恢复 10 点生命。",
    medicine_crit_silence: "先发动一次致命暴击，然后令目标行动点减少 1。",
    medicine_boost_heal: "自身治疗倍率翻倍，影响下一次治疗。",
    medicine_mega_heal: "自身恢复 60 点生命，受治疗倍率影响。",
    double_normal_attack: "连续发动两次普通攻击。",
    attack_and_draw: "发动一次普通攻击，然后获得 1 个额外行动点。",
    attack_and_heal: "发动一次普通攻击，然后自身恢复 10 点生命。",
    attack_and_shield: "发动一次普通攻击，然后自身获得 1 层护盾。",
    half_hp_and_attack: "先令双方生命减半，再发动一次普通攻击。",
    double_next_attack: "自身下一次攻击伤害翻倍。",
    self_harm_and_triple_critical: "自身付出 40 点生命代价，然后连续发动三次致命暴击；生命代价可被护盾抵消。",
    double_deduction: "双方各受 10 点伤害；双方各自可用护盾抵消。",
    double_deduction_and_draw: "双方各受 10 点伤害，然后自身获得 1 个额外行动点。",
    half_hp_both: "双方生命值减半，最低保留 1 点；双方各自可用护盾抵消。",
    attack_critical_draw: "发动普通攻击与致命暴击，然后获得 1 个额外行动点。",
    double_deduction_30_attack_critical_draw: "双方各受 30 点伤害，再发动普通攻击与致命暴击，最后获得 1 个额外行动点。",
    both_heal_10: "双方各恢复 10 点生命。",
    critical_and_critical_heal_and_draw: "发动致命暴击、暴疗，并获得 2 个额外行动点。",
    shield_and_self_harm_10: "自身获得 1 层护盾，并受到 10 点不可格挡反噬伤害。",
    knight_ultimate: "发动致命暴击，获得 1 个额外行动点，并获得 3 层护盾。",
  };

  let query = "";
  let sort = "default";

  function skillRows(character) {
    let cursor = 0;
    return character.skills.map(([name, probability, handler]) => {
      const start = cursor + 1;
      cursor += probability;
      const meta = data.SKILL_META[handler] || ["未知", "#667085"];
      return `<li class="skill-row">
        <div class="skill-head">
          <strong>${C.escapeHtml(name)}</strong>
          <span class="tag" style="border-color:${meta[1]};color:${meta[1]}">${C.escapeHtml(meta[0])}</span>
        </div>
        <div class="skill-meta">概率 ${probability}% · 随机数区间 ${start}-${cursor}</div>
        <p>${C.escapeHtml(EFFECTS[handler] || "效果说明待补充。")}</p>
      </li>`;
    }).join("");
  }

  function render() {
    const normalized = query.trim().toLowerCase();
    let characters = data.CHARACTER_DEFS.filter((character) => {
      const haystack = [
        character.name,
        character.desc,
        ...character.skills.flatMap(([name, , handler]) => [name, handler, EFFECTS[handler] || ""]),
      ].join(" ").toLowerCase();
      return !normalized || haystack.includes(normalized);
    });
    if (sort === "skills") {
      characters = characters.slice().sort((a, b) => b.skills.length - a.skills.length);
    } else if (sort === "burst") {
      characters = characters.slice().sort((a, b) => Math.max(...b.skills.map((item) => item[1])) - Math.max(...a.skills.map((item) => item[1])));
    }

    $("characterGrid").innerHTML = characters.length
      ? characters.map((character) => {
        const total = character.skills.reduce((sum, item) => sum + item[1], 0);
        const max = Math.max(...character.skills.map((item) => item[1]));
        return `<article class="character-card">
          <div class="character-card-head">
            <div>
              <h2>${C.escapeHtml(character.name)}</h2>
              <p>${C.escapeHtml(character.desc)}</p>
            </div>
            <div class="character-stat">
              <span>技能</span>
              <strong>${character.skills.length}</strong>
            </div>
          </div>
          <div class="character-summary">
            <span>概率合计 ${total}%</span>
            <span>最高单项 ${max}%</span>
          </div>
          <ol class="skill-list">${skillRows(character)}</ol>
        </article>`;
      }).join("")
      : `<div class="empty">没有匹配的人物或技能。</div>`;
  }

  function init() {
    C.renderNav("characters");
    C.tickBeijing("nowBeijing");
    $("characterSearch").addEventListener("input", (event) => {
      query = event.target.value;
      render();
    });
    $("characterSort").addEventListener("change", (event) => {
      sort = event.target.value;
      render();
    });
    render();
  }

  init();
})();
