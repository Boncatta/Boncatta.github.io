(() => {
  const fmt = new Intl.NumberFormat("zh-CN");
  const nav = [
    ["/game.html", "暴塔", "game"],
    ["/characters.html", "人物图鉴", "characters"],
  ];

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    }[char]));
  }

  function renderNav(current) {
    const html = nav.map(([href, label, key]) => {
      const attrs = href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";
      return `<a href="${href}"${attrs} ${key === current ? 'aria-current="page"' : ""}>${label}</a>`;
    }).join("") + `<button type="button" id="refreshData">刷新</button>`;
    const node = document.getElementById("nav");
    if (node) {
      node.innerHTML = html;
      wireRefresh();
    }
    return html;
  }

  function wireRefresh() {
    document.getElementById("refreshData")?.addEventListener("click", () => {
      const url = new URL(location.href);
      url.searchParams.set("v", String(Date.now()));
      location.href = url.toString();
    });
  }

  function tickBeijing(id) {
    const node = document.getElementById(id);
    if (!node) return;
    const render = () => {
      node.textContent = new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date()).replace(/\//g, "/");
    };
    render();
    setInterval(render, 1000);
  }

  const api = { fmt, escapeHtml, renderNav, wireRefresh, tickBeijing };
  window.BONCATTA = api;
  window.SCPPER = api;
})();
