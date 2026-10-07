// SERC node explorer — an anywidget module for the MyST site.
// Node data is passed in from the page (reference/resources-overview.md),
// so specs and counts can be updated there without touching this file.

const CATEGORIES = [
  { id: "all", label: "All nodes" },
  { id: "general", label: "General compute" },
  { id: "performance", label: "Performance compute" },
  { id: "highcap", label: "High memory / high core count" },
  { id: "gpu", label: "GPU" },
];

const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

const STYLE = `
.ne-root {
  --ne-accent: #8c1515;
  --ne-accent-soft: rgba(140, 21, 21, 0.08);
  --ne-green: #175e54;
  --ne-green-soft: rgba(23, 94, 84, 0.10);
  --ne-text: #2e2d29;
  --ne-muted: #53565a;
  --ne-border: #dad7cb;
  --ne-bg: #ffffff;
  --ne-bg-alt: #f7f6f2;
  --ne-amber: #9d5b00;
  --ne-amber-soft: rgba(233, 131, 0, 0.12);
  font-family: inherit;
  color: var(--ne-text);
  margin: 1.5rem 0;
}
.ne-root.ne-dark {
  --ne-accent: #e07070;
  --ne-accent-soft: rgba(184, 58, 75, 0.18);
  --ne-green: #5fb3a5;
  --ne-green-soft: rgba(95, 179, 165, 0.15);
  --ne-text: #e5e5e5;
  --ne-muted: #a8a8a8;
  --ne-border: #44464a;
  --ne-bg: #1e1f22;
  --ne-bg-alt: #26282c;
  --ne-amber: #f0a742;
  --ne-amber-soft: rgba(240, 167, 66, 0.14);
}
.ne-root * { box-sizing: border-box; }
.ne-tabs { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.75rem; }
.ne-tab {
  font: inherit; font-size: 0.875rem; cursor: pointer;
  padding: 0.35rem 0.8rem; border-radius: 999px;
  border: 1px solid var(--ne-border); background: var(--ne-bg); color: var(--ne-text);
}
.ne-tab:hover { border-color: var(--ne-accent); }
.ne-tab[aria-pressed="true"] { background: var(--ne-accent); border-color: var(--ne-accent); color: #fff; }
/* Checkbox-style boxes so it's clear these are multi-select */
.ne-tab:not([data-cat="all"]), .ne-chip { display: inline-flex; align-items: center; gap: 0.4rem; }
.ne-tab:not([data-cat="all"])::before, .ne-chip::before {
  content: ""; width: 0.85rem; height: 0.85rem; flex: none; border-radius: 0.2rem;
  border: 1.5px solid currentColor; opacity: 0.55; box-sizing: border-box;
}
.ne-tab:not([data-cat="all"])[aria-pressed="true"]::before, .ne-chip[aria-pressed="true"]::before {
  content: "\u2713"; opacity: 1; font-size: 0.7rem; line-height: 1; font-weight: 800;
  display: inline-flex; align-items: center; justify-content: center;
  background: #fff; color: var(--ne-accent); border-color: #fff;
}
.ne-chip[aria-pressed="true"]::before { background: var(--ne-accent); color: #fff; border-color: var(--ne-accent); }
.ne-tabs-hint { font-size: 0.75rem; color: var(--ne-muted); margin: -0.35rem 0 0.75rem; }
.ne-chips { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.ne-chip {
  font: inherit; font-size: 0.8rem; cursor: pointer; padding: 0.2rem 0.6rem; border-radius: 999px;
  border: 1px solid var(--ne-border); background: var(--ne-bg); color: var(--ne-text);
}
.ne-chip:hover { border-color: var(--ne-accent); }
.ne-chip[aria-pressed="true"] { background: var(--ne-accent-soft); border-color: var(--ne-accent); color: var(--ne-accent); font-weight: 600; }
.ne-fgroup { display: flex; flex-direction: column; font-size: 0.75rem; color: var(--ne-muted); gap: 0.2rem; }
.ne-root.ne-dark .ne-tab[aria-pressed="true"] { color: #1e1f22; }
.ne-filters {
  display: flex; flex-wrap: wrap; gap: 0.75rem 1.25rem; align-items: end;
  padding: 0.75rem 1rem; border: 1px solid var(--ne-border); border-radius: 0.5rem;
  background: var(--ne-bg-alt); margin-bottom: 0.75rem;
}
.ne-filters label { display: flex; flex-direction: column; font-size: 0.75rem; color: var(--ne-muted); gap: 0.2rem; }
.ne-filters select {
  font: inherit; font-size: 0.875rem; padding: 0.25rem 0.4rem; border-radius: 0.3rem;
  border: 1px solid var(--ne-border); background: var(--ne-bg); color: var(--ne-text);
}
.ne-reset {
  font: inherit; font-size: 0.8rem; cursor: pointer; background: none; border: none;
  color: var(--ne-accent); text-decoration: underline; padding: 0.3rem 0;
}
.ne-stats { display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
.ne-stat {
  border: 1px solid var(--ne-border); border-radius: 0.5rem; background: var(--ne-bg);
  padding: 0.75rem 1rem; display: flex; flex-direction: column; justify-content: center;
}
.ne-stat-num { font-size: 1.75rem; font-weight: 700; line-height: 1.1; font-variant-numeric: tabular-nums; }
.ne-stat-label { font-size: 0.75rem; color: var(--ne-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.2rem; }
.ne-stat.ne-primary { background: var(--ne-accent); border-color: var(--ne-accent); color: #fff; }
.ne-stat.ne-primary .ne-stat-num { font-size: 2.5rem; }
.ne-stat.ne-primary .ne-stat-label { color: rgba(255, 255, 255, 0.85); }
.ne-root.ne-dark .ne-stat.ne-primary { color: #1e1f22; }
.ne-root.ne-dark .ne-stat.ne-primary .ne-stat-label { color: rgba(30, 31, 34, 0.8); }
@media (max-width: 520px) {
  .ne-stats { grid-template-columns: 1fr 1fr; }
  .ne-stat.ne-primary { grid-column: 1 / -1; }
}
.ne-summary { font-size: 0.875rem; color: var(--ne-muted); margin: 0 0 0.75rem; }
.ne-summary b { color: var(--ne-text); }
.ne-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 0.75rem; }
.ne-card {
  font: inherit; text-align: left; cursor: pointer; color: var(--ne-text);
  background: var(--ne-bg); border: 1px solid var(--ne-border); border-top: 3px solid var(--ne-border);
  border-radius: 0.5rem; padding: 0.75rem 0.9rem; transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.ne-card:hover { border-top-color: var(--ne-accent); }
.ne-card[aria-pressed="true"] { border-color: var(--ne-accent); box-shadow: 0 0 0 1px var(--ne-accent); }
.ne-card-head { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; }
.ne-name { font-weight: 700; font-size: 1rem; }
.ne-pool { margin: 0.5rem 0 0.6rem; padding: 0.5rem 0.6rem; border-radius: 0.4rem; background: var(--ne-bg-alt); }
.ne-pool-row { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; }
.ne-pool-num { font-size: 1.9rem; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
.ne-pool-unit { font-size: 0.8rem; color: var(--ne-muted); margin-left: 0.25rem; font-weight: 500; }
.ne-tier { font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px; white-space: nowrap; }
.ne-tier-large { background: var(--ne-green-soft); color: var(--ne-green); }
.ne-tier-medium { background: var(--ne-amber-soft); color: var(--ne-amber); }
.ne-tier-small { background: var(--ne-accent-soft); color: var(--ne-accent); }
.ne-bar { height: 6px; border-radius: 999px; background: var(--ne-border); margin-top: 0.45rem; overflow: hidden; }
.ne-bar > span { display: block; height: 100%; border-radius: 999px; }
.ne-bar-large { background: var(--ne-green); }
.ne-bar-medium { background: var(--ne-amber); }
.ne-bar-small { background: var(--ne-accent); }
.ne-pool-hint { font-size: 0.72rem; color: var(--ne-muted); margin-top: 0.3rem; }
.ne-wait {
  display: flex; gap: 0.75rem; align-items: center; margin: 0.6rem 0 0.25rem; padding: 0.65rem 0.8rem;
  border-radius: 0.4rem; background: var(--ne-bg); border: 1px solid var(--ne-border);
}
.ne-wait-num { font-size: 2.2rem; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
.ne-wait p { margin: 0; font-size: 0.875rem; }
.ne-note {
  font-size: 0.85rem; margin: 0 0 0.75rem; padding: 0.55rem 0.8rem; border-radius: 0.4rem;
  background: var(--ne-amber-soft); border-left: 3px solid var(--ne-amber);
}
.ne-note code { font-size: 0.8rem; white-space: nowrap; }
.ne-sort label { flex-direction: row; align-items: center; gap: 0.4rem; }
.ne-badges { display: flex; flex-wrap: wrap; gap: 0.3rem; margin: 0.35rem 0 0.5rem; }
.ne-badge { font-size: 0.7rem; padding: 0.1rem 0.45rem; border-radius: 999px; background: var(--ne-accent-soft); color: var(--ne-accent); }
.ne-badge.ne-rec { background: var(--ne-green-soft); color: var(--ne-green); font-weight: 600; }
.ne-specs { display: grid; grid-template-columns: auto 1fr; gap: 0.15rem 0.6rem; font-size: 0.8rem; margin: 0; }
.ne-specs dt { color: var(--ne-muted); }
.ne-specs dd { margin: 0; }
.ne-empty { padding: 1.5rem; text-align: center; color: var(--ne-muted); border: 1px dashed var(--ne-border); border-radius: 0.5rem; }
.ne-detail {
  margin-top: 1rem; padding: 1rem 1.1rem; border: 1px solid var(--ne-border);
  border-left: 4px solid var(--ne-accent); border-radius: 0.5rem; background: var(--ne-bg-alt);
}
.ne-detail h4 { margin: 0 0 0.25rem; font-size: 1.1rem; }
.ne-detail p { margin: 0.5rem 0; font-size: 0.9rem; line-height: 1.5; }
.ne-detail .ne-sub { color: var(--ne-muted); font-size: 0.8rem; margin: 0; }
.ne-detail-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 0.5rem; }
.ne-detail ul { margin: 0.25rem 0 0; padding-left: 1.1rem; font-size: 0.875rem; }
.ne-detail h5 { margin: 0.5rem 0 0.25rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ne-muted); }
.ne-code {
  display: flex; align-items: center; gap: 0.5rem; margin-top: 0.3rem;
  background: var(--ne-bg); border: 1px solid var(--ne-border); border-radius: 0.35rem; padding: 0.4rem 0.5rem;
}
.ne-code code { flex: 1; font-size: 0.8rem; overflow-x: auto; white-space: pre; }
.ne-copy {
  font: inherit; font-size: 0.75rem; cursor: pointer; padding: 0.2rem 0.55rem; border-radius: 0.3rem;
  border: 1px solid var(--ne-border); background: var(--ne-bg-alt); color: var(--ne-text); white-space: nowrap;
}
.ne-copy:hover { border-color: var(--ne-accent); color: var(--ne-accent); }
`;

function fmtMem(gb) {
  if (gb >= 1024) {
    const tb = gb / 1024;
    return `${Number.isInteger(tb) ? tb : tb.toFixed(1)} TB`;
  }
  return `${gb} GB`;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Pool-size tiers: fewer nodes of a type means a job restricted to that
// type has fewer places to run, and so will usually wait longer.
function poolTier(count) {
  if (count >= 50) return { id: "large", label: "Large pool", hint: "Usually shorter waits" };
  if (count >= 10) return { id: "medium", label: "Medium pool", hint: "Moderate waits" };
  return { id: "small", label: "Small pool", hint: "Expect longer waits" };
}

function exampleCommand(n) {
  const parts = ["sbatch", "--partition=serc"];
  if (n.gpus) parts.push("--ntasks=1", "--gpus=1");
  parts.push(`--constraint="${n.constraint}"`, "my_job.sh");
  return parts.join(" ");
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch { /* ignore */ }
    ta.remove();
  }
  const old = btn.textContent;
  btn.textContent = "Copied!";
  setTimeout(() => (btn.textContent = old), 1200);
}

function render({ model, el }) {
  const nodes = model.get("nodes") || [];
  const state = { cats: new Set(), minCpu: 0, minRam: 0, gpuMems: new Set(), sort: "category", selected: null };
  const totalNodes = nodes.reduce((s, n) => s + n.count, 0);
  const maxCount = Math.max(1, ...nodes.map((n) => n.count));
  const catNodes = (cat) => nodes.filter((n) => n.category === cat).reduce((s, n) => s + n.count, 0);

  const root = document.createElement("div");
  root.className = "ne-root";
  const style = document.createElement("style");
  style.textContent = STYLE;
  el.appendChild(style);
  el.appendChild(root);

  // Follow the site's light/dark theme toggle.
  const syncTheme = () => {
    const dark = document.documentElement.classList.contains("dark") || !!el.closest?.(".dark");
    root.classList.toggle("ne-dark", dark);
  };
  syncTheme();
  const observer = new MutationObserver(syncTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  const cpuOptions = [...new Set(nodes.map((n) => n.cpus))].sort((a, b) => a - b);
  const ramOptions = [...new Set(nodes.map((n) => n.ram_gb))].sort((a, b) => a - b);
  const gpuMemOptions = [...new Set(nodes.filter((n) => n.gpus).map((n) => n.gpu_mem_gb))].sort((a, b) => a - b);

  root.innerHTML = `
    <div class="ne-stats" aria-live="polite">
      <div class="ne-stat ne-primary"><span class="ne-stat-num" data-stat="nodes"></span><span class="ne-stat-label" data-stat="nodes-label">Total nodes</span></div>
      <div class="ne-stat"><span class="ne-stat-num" data-stat="cpus"></span><span class="ne-stat-label">CPU cores</span></div>
      <div class="ne-stat"><span class="ne-stat-num" data-stat="gpus"></span><span class="ne-stat-label">GPUs</span></div>
    </div>
    <div class="ne-tabs" role="group" aria-label="Node category">
      ${CATEGORIES.map((c) => `<button type="button" class="ne-tab" data-cat="${c.id}">${c.label}</button>`).join("")}
    </div>
    <p class="ne-tabs-hint">Select as many categories as you like. Click again to deselect.</p>
    <div class="ne-filters">
      <label>CPUs per node (at least)
        <select data-f="minCpu">
          <option value="0">Any</option>
          ${cpuOptions.map((v) => `<option value="${v}">${v}+</option>`).join("")}
        </select>
      </label>
      <label>RAM per node (at least)
        <select data-f="minRam">
          <option value="0">Any</option>
          ${ramOptions.map((v) => `<option value="${v}">${fmtMem(v)}+</option>`).join("")}
        </select>
      </label>
      <div class="ne-fgroup">GPU memory (any of)
        <div class="ne-chips" role="group" aria-label="GPU memory">
          ${gpuMemOptions.map((v) => `<button type="button" class="ne-chip" data-gpumem="${v}" aria-pressed="false">${v} GB</button>`).join("")}
        </div>
      </div>
      <label>Sort by
        <select data-sort>
          <option value="category">Category</option>
          <option value="most">Most nodes first</option>
          <option value="fewest">Fewest nodes first</option>
        </select>
      </label>
      <button type="button" class="ne-reset">Reset filters</button>
    </div>
    <p class="ne-note"><b>Node count matters.</b> If you constrain a job to a node type with only a few nodes, it can only start when one of <em>those</em> nodes is free, so it may wait much longer. If your job can run on several types, allow them all, e.g. <code>--constraint="CLASS:SH3_CBASE|CLASS:SH4_CBASE"</code>.</p>
    <p class="ne-summary"></p>
    <div class="ne-grid"></div>
    <div class="ne-detail-wrap"></div>
  `;

  const $ = (sel) => root.querySelector(sel);
  const grid = $(".ne-grid");
  const summary = $(".ne-summary");
  const detailWrap = $(".ne-detail-wrap");

  root.querySelectorAll(".ne-tab").forEach((b) =>
    b.addEventListener("click", () => {
      const c = b.dataset.cat;
      if (c === "all") state.cats.clear();
      else if (state.cats.has(c)) state.cats.delete(c);
      else state.cats.add(c);
      // Selecting every category is the same as "All nodes".
      if (state.cats.size === CATEGORIES.length - 1) state.cats.clear();
      update();
    })
  );
  root.querySelectorAll("select[data-f]").forEach((s) =>
    s.addEventListener("change", () => {
      const k = s.dataset.f;
      state[k] = Number(s.value);
      update();
    })
  );
  root.querySelectorAll(".ne-chip[data-gpumem]").forEach((b) =>
    b.addEventListener("click", () => {
      const v = Number(b.dataset.gpumem);
      if (state.gpuMems.has(v)) state.gpuMems.delete(v);
      else state.gpuMems.add(v);
      update();
    })
  );
  $("select[data-sort]").addEventListener("change", (e) => {
    state.sort = e.target.value;
    update();
  });
  $(".ne-reset").addEventListener("click", () => {
    Object.assign(state, { minCpu: 0, minRam: 0, sort: "category", selected: null });
    state.cats.clear();
    state.gpuMems.clear();
    $("select[data-sort]").value = "category";
    root.querySelectorAll("select[data-f]").forEach((s) => (s.value = "0"));
    update();
  });

  function matches(n) {
    if (state.cats.size && !state.cats.has(n.category)) return false;
    if (n.cpus < state.minCpu) return false;
    if (n.ram_gb < state.minRam) return false;
    if (state.gpuMems.size) {
      // GPU memory narrows the GPU nodes. CPU-only nodes stay visible only if
      // their category was explicitly selected.
      if (n.gpus) {
        if (!state.gpuMems.has(n.gpu_mem_gb)) return false;
      } else if (!state.cats.has(n.category)) return false;
    }
    return true;
  }

  function cardHTML(n, i) {
    const badges = [`<span class="ne-badge">${esc(CAT_LABEL[n.category] || n.category)}</span>`];
    if (n.recommended) badges.push(`<span class="ne-badge ne-rec">Recommended GPU</span>`);
    const tier = poolTier(n.count);
    const rows = [
      ["CPUs", `${n.cpus} cores`],
      ["RAM", fmtMem(n.ram_gb)],
    ];
    if (n.gpus) {
      rows.push(["GPUs", `${n.gpus} × ${esc(n.gpu_model)}`]);
      rows.push(["GPU mem", `${n.gpu_mem_gb} GB each`]);
    } else {
      rows.push(["RAM/core", `${Math.round(n.ram_gb / n.cpus)} GB`]);
    }
    return `
      <button type="button" class="ne-card" data-i="${i}" aria-pressed="${state.selected === i}">
        <div class="ne-card-head">
          <span class="ne-name">${esc(n.name)}</span>
        </div>
        <div class="ne-badges">${badges.join("")}</div>
        <div class="ne-pool">
          <div class="ne-pool-row">
            <span><span class="ne-pool-num">${n.count}</span><span class="ne-pool-unit">node${n.count === 1 ? "" : "s"}</span></span>
            <span class="ne-tier ne-tier-${tier.id}">${tier.label}</span>
          </div>
          <div class="ne-bar" aria-hidden="true"><span class="ne-bar-${tier.id}" style="width:${Math.max(3, (n.count / maxCount) * 100)}%"></span></div>
          <div class="ne-pool-hint">${tier.hint}</div>
        </div>
        <dl class="ne-specs">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
      </button>`;
  }

  function detailHTML(n) {
    const specs = [
      `${n.count} node${n.count === 1 ? "" : "s"} in the <code>serc</code> partition`,
      `${n.cpus} CPU cores per node (${esc(n.cpu_model)})`,
      `${fmtMem(n.ram_gb)} RAM per node`,
    ];
    if (n.gpus) {
      specs.push(`${n.gpus} × ${esc(n.gpu_model)} (${n.gpu_mem_gb} GB GPU memory each)`);
      specs.push(`About ${Math.round(n.ram_gb / n.gpus)} GB system RAM and ${Math.round(n.cpus / n.gpus)} CPU cores per GPU`);
    } else {
      specs.push(`About ${Math.round(n.ram_gb / n.cpus)} GB RAM per core`);
    }
    const cmd = exampleCommand(n);
    const tier = poolTier(n.count);
    const pct = ((n.count / totalNodes) * 100).toFixed(n.count / totalNodes < 0.01 ? 1 : 0);
    const inCat = catNodes(n.category);
    const catName = CAT_LABEL[n.category] || n.category;
    const waitMsg = {
      large: "This is one of the larger pools in <code>serc</code>, so jobs limited to it usually start relatively quickly.",
      medium: "This is a mid-sized pool. Jobs limited to it may wait longer than jobs that can run on more node types.",
      small: "This is a small pool. Jobs limited to it can only start when one of these few nodes is free, so expect longer waits. Allow other node types too if your job can use them.",
    }[tier.id];
    return `
      <div class="ne-detail">
        <h4>${esc(n.name)}</h4>
        <p class="ne-sub">${esc(CAT_LABEL[n.category] || n.category)}</p>
        <div class="ne-wait">
          <span class="ne-wait-num">${n.count}</span>
          <div>
            <p><b>node${n.count === 1 ? "" : "s"}</b> &middot; ${pct}% of all ${totalNodes} <code>serc</code> nodes &middot; ${n.count} of ${inCat} ${esc(catName)} nodes${n.gpus ? ` &middot; ${n.count * n.gpus} GPUs total` : ""}</p>
            <p style="margin-top:0.3rem"><span class="ne-tier ne-tier-${tier.id}">${tier.label}</span> ${waitMsg}</p>
          </div>
        </div>
        ${n.description ? `<p>${esc(n.description)}</p>` : ""}
        <div class="ne-detail-cols">
          <div>
            <h5>Specs</h5>
            <ul>${specs.map((s) => `<li>${s}</li>`).join("")}</ul>
          </div>
          <div>
            ${n.best_for?.length ? `<h5>Good for</h5><ul>${n.best_for.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
            ${n.caveats?.length ? `<h5>Keep in mind</h5><ul>${n.caveats.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
          </div>
        </div>
        <h5>SLURM constraint</h5>
        <div class="ne-code"><code>--constraint="${esc(n.constraint)}"</code><button type="button" class="ne-copy" data-copy="--constraint=&quot;${esc(n.constraint)}&quot;">Copy</button></div>
        <h5>Example</h5>
        <div class="ne-code"><code>${esc(cmd)}</code><button type="button" class="ne-copy" data-copy="${esc(cmd)}">Copy</button></div>
      </div>`;
  }

  function update() {
    root.querySelectorAll(".ne-tab").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.cat === "all" ? state.cats.size === 0 : state.cats.has(b.dataset.cat)))
    );
    root.querySelectorAll(".ne-chip[data-gpumem]").forEach((b) =>
      b.setAttribute("aria-pressed", String(state.gpuMems.has(Number(b.dataset.gpumem))))
    );

    const visible = nodes.map((n, i) => [n, i]).filter(([n]) => matches(n));
    if (state.sort === "most") visible.sort((a, b) => b[0].count - a[0].count);
    if (state.sort === "fewest") visible.sort((a, b) => a[0].count - b[0].count);
    if (state.selected !== null && !visible.some(([, i]) => i === state.selected)) state.selected = null;

    const totNodes = visible.reduce((s, [n]) => s + n.count, 0);
    const totCpus = visible.reduce((s, [n]) => s + n.count * n.cpus, 0);
    const totGpus = visible.reduce((s, [n]) => s + n.count * (n.gpus || 0), 0);
    const filtered = state.cats.size || state.minCpu || state.minRam || state.gpuMems.size;
    $('[data-stat="nodes"]').textContent = totNodes.toLocaleString();
    $('[data-stat="nodes-label"]').textContent = filtered ? "Matching nodes" : "Total nodes in serc";
    $('[data-stat="cpus"]').textContent = totCpus.toLocaleString();
    $('[data-stat="gpus"]').textContent = totGpus.toLocaleString();
    summary.innerHTML = visible.length
      ? `Showing <b>${visible.length}</b> node type${visible.length === 1 ? "" : "s"}${filtered ? ` (of ${nodes.length})` : ""}. Select a node type for details.`
      : "";

    grid.innerHTML = visible.length
      ? visible.map(([n, i]) => cardHTML(n, i)).join("")
      : `<div class="ne-empty" style="grid-column: 1 / -1">No node types match these filters.</div>`;

    grid.querySelectorAll(".ne-card").forEach((c) =>
      c.addEventListener("click", () => {
        const i = Number(c.dataset.i);
        state.selected = state.selected === i ? null : i;
        update();
        if (state.selected !== null) detailWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
      })
    );

    detailWrap.innerHTML = state.selected !== null ? detailHTML(nodes[state.selected]) : "";
    detailWrap.querySelectorAll(".ne-copy").forEach((b) => b.addEventListener("click", () => copyText(b.dataset.copy, b)));
  }

  update();
  return () => observer.disconnect();
}

export default { render };
