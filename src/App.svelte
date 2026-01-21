<script lang="ts">
  import { onMount } from "svelte";
  import { cpus, type CPU } from "./data";

  type Row = CPU & { value: number };

  // --- 数据：value = openSpeed / price ---
  const rows: Row[] = cpus
    .map((c) => ({ ...c, value: c.openSpeed / c.price }))
    .sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...rows.map((r) => r.value), 1);
  const pct = (v: number) => Math.max(0, Math.min(100, Math.round((v / maxValue) * 100)));
  const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(3) : "—");

  function tierByRank(i: number, n: number) {
    const p = (i + 1) / Math.max(1, n);
    if (p <= 0.10) return "S";
    if (p <= 0.30) return "A";
    if (p <= 0.60) return "B";
    if (p <= 0.85) return "C";
    return "D";
  }

  // tier 色相（配合主题做不同观感）
  const tierHue: Record<string, number> = { S: 265, A: 155, B: 45, C: 25, D: 350 };

  // --- 主题切换 ---
  type Theme = "notion" | "linear" | "apple";
  const themes: Theme[] = ["notion", "linear", "apple"];
  let theme: Theme = "linear";

  const applyTheme = (t: Theme) => {
    theme = t;
    document.body.dataset.theme = t;
    localStorage.setItem("cpuTheme", t);
  };

  onMount(() => {
    const saved = localStorage.getItem("cpuTheme") as Theme | null;
    applyTheme(saved && themes.includes(saved) ? saved : "linear");
  });
</script>

<main class="wrap">
  <header class="head">
    <div class="title">
      <div class="h1">CPU 性价比天梯</div>
      <div class="h2">value = 网页打开速度 ÷ 价格（越大越好）</div>
    </div>

    <div class="switch" role="group" aria-label="Theme switch">
      <button
        class:active={theme === "notion"}
        aria-pressed={theme === "notion"}
        on:click={() => applyTheme("notion")}
      >
        Notion
      </button>
      <button
        class:active={theme === "linear"}
        aria-pressed={theme === "linear"}
        on:click={() => applyTheme("linear")}
      >
        Linear
      </button>
      <button
        class:active={theme === "apple"}
        aria-pressed={theme === "apple"}
        on:click={() => applyTheme("apple")}
      >
        Apple
      </button>
    </div>
  </header>

  <section class="list">
    {#if rows.length === 0}
      <div class="empty">
        暂无数据：请在 <code>src/data.ts</code> 填入 cpus 数组
      </div>
    {:else}
      {#each rows as r, i (r.name)}
        {@const tier = tierByRank(i, rows.length)}
        {@const p = pct(r.value)}
        {@const hue = tierHue[tier] ?? 240}

        <div class="row" style="--p:{p}%; --hue:{hue}">
          <!-- 左：分档 + 排名 -->
          <div class="left">
            <span class="tier">{tier}</span>
            <span class="rank">{i + 1}</span>
          </div>

          <!-- 中：进度条（数值叠加） -->
          <div class="mid">
            <div class="bar" aria-label="value bar">
              <span class="fill"></span>
              <span class="label">{fmt(r.value)}</span>
            </div>
            <div class="meta">
              <span>速度 {r.openSpeed}</span>
              <span class="dot">·</span>
              <span>¥{r.price}</span>
            </div>
          </div>

          <!-- 右：名称（年份） -->
          <div class="right">
            <div class="name">{r.name}</div>
            <div class="year">({r.year})</div>
          </div>
        </div>
      {/each}
    {/if}
  </section>
</main>

<style>
  /* =========================================================
     主题系统：用 body[data-theme] 覆盖 CSS 变量
     ========================================================= */

  :global(body){
    margin: 0;
    min-height: 100vh;
    overflow-x: hidden;
    font: 12.5px/1.45 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "PingFang SC";
    color: var(--text);
    background: var(--bg);
  }

  /* --- Linear 风（默认）--- */
  :global(body[data-theme="linear"]) {
    --bg:
      radial-gradient(900px 600px at 15% 15%, rgba(124,92,255,.18), transparent 60%),
      radial-gradient(900px 600px at 85% 20%, rgba(0,212,255,.10), transparent 55%),
      linear-gradient(160deg, #0b1220, #090f1b);
    --panel: rgba(255,255,255,.05);
    --row: rgba(0,0,0,.14);
    --rowHover: rgba(0,0,0,.18);
    --border: rgba(255,255,255,.10);
    --border2: rgba(255,255,255,.14);
    --text: rgba(255,255,255,.90);
    --muted: rgba(255,255,255,.68);
    --shadow: 0 16px 50px rgba(0,0,0,.28);

    --barBg: rgba(255,255,255,.06);
    --barBorder: rgba(255,255,255,.10);

    --btnBg: rgba(255,255,255,.06);
    --btnBorder: rgba(255,255,255,.12);
    --btnActive: rgba(124,92,255,.18);
  }

  /* --- Notion 风（极简灰阶 + 更平）--- */
  :global(body[data-theme="notion"]) {
    --bg: linear-gradient(180deg, #0f1115, #0b0d11);
    --panel: rgba(255,255,255,.03);
    --row: rgba(255,255,255,.03);
    --rowHover: rgba(255,255,255,.05);
    --border: rgba(255,255,255,.08);
    --border2: rgba(255,255,255,.10);
    --text: rgba(255,255,255,.88);
    --muted: rgba(255,255,255,.62);
    --shadow: 0 10px 34px rgba(0,0,0,.30);

    --barBg: rgba(255,255,255,.05);
    --barBorder: rgba(255,255,255,.08);

    --btnBg: rgba(255,255,255,.04);
    --btnBorder: rgba(255,255,255,.10);
    --btnActive: rgba(255,255,255,.08);
  }

  /* --- Apple 风（柔和玻璃 + 更“软”的阴影）--- */
  :global(body[data-theme="apple"]) {
    --bg:
      radial-gradient(900px 700px at 20% 20%, rgba(255,255,255,.08), transparent 55%),
      radial-gradient(900px 700px at 80% 30%, rgba(124,92,255,.14), transparent 60%),
      linear-gradient(160deg, #0a0c10, #07090d);
    --panel: rgba(255,255,255,.06);
    --row: rgba(255,255,255,.06);
    --rowHover: rgba(255,255,255,.09);
    --border: rgba(255,255,255,.14);
    --border2: rgba(255,255,255,.18);
    --text: rgba(255,255,255,.92);
    --muted: rgba(255,255,255,.70);
    --shadow: 0 18px 60px rgba(0,0,0,.35);

    --barBg: rgba(0,0,0,.18);
    --barBorder: rgba(255,255,255,.12);

    --btnBg: rgba(255,255,255,.07);
    --btnBorder: rgba(255,255,255,.14);
    --btnActive: rgba(255,255,255,.12);
  }

  /* =========================================================
     布局与组件样式（共用）
     ========================================================= */

  .wrap{
    max-width: 920px;
    margin: 0 auto;
    padding: 16px;
  }

  .head{
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap: 12px;
    margin-bottom: 10px;
  }

  .h1{
    font-size: 13.5px;
    font-weight: 820;
    letter-spacing: .2px;
  }
  .h2{
    margin-top: 4px;
    font-size: 11.5px;
    color: var(--muted);
  }

  .switch{
    display:flex;
    gap: 8px;
    padding: 4px;
    border-radius: 12px;
    background: var(--panel);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .switch button{
    padding: 7px 10px;
    border-radius: 10px;
    border: 1px solid var(--btnBorder);
    background: var(--btnBg);
    color: var(--text);
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
  }
  .switch button:hover{
    border-color: var(--border2);
  }
  .switch button.active{
    background: var(--btnActive);
    border-color: var(--border2);
  }

  .list{
    padding: 10px;
    border-radius: 14px;
    background: var(--panel);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .empty{
    padding: 18px 12px;
    text-align: center;
    color: var(--muted);
  }
  code{
    padding: 2px 6px;
    border-radius: 10px;
    background: rgba(255,255,255,.06);
    border: 1px solid var(--border);
  }

  /* 行：紧凑榜单 */
  .row{
    display:grid;
    grid-template-columns: 64px 1fr 260px;
    gap: 10px;
    align-items:center;
    padding: 10px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--row);
    margin: 8px 0;
    position: relative;
    overflow:hidden;
  }
  .row:hover{
    border-color: var(--border2);
    background: var(--rowHover);
  }

  /* Notion：更平（去掉额外花哨） */
  :global(body[data-theme="notion"]) .row{
    box-shadow: none;
  }

  /* Apple：轻微内高光 */
  :global(body[data-theme="apple"]) .row::after{
    content:"";
    position:absolute; inset:0;
    background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,0));
    opacity:.35;
    pointer-events:none;
  }

  /* 左侧 */
  .left{ display:flex; align-items:center; gap: 8px; }
  .tier{
    width: 28px; height: 22px;
    display:grid; place-items:center;
    border-radius: 8px;
    font-weight: 900;
    letter-spacing:.4px;
    color: rgba(255,255,255,.92);
    background: hsla(var(--hue), 85%, 60%, .18);
    border: 1px solid hsla(var(--hue), 85%, 60%, .26);
  }
  .rank{
    width: 24px;
    text-align:left;
    font-variant-numeric: tabular-nums;
    color: var(--muted);
    font-weight: 700;
  }

  /* 中间：进度条（主视觉） */
  .mid{ min-width: 0; }
  .bar{
    position: relative;
    height: 18px;
    border-radius: 10px;
    overflow: hidden;
    background: var(--barBg);
    border: 1px solid var(--barBorder);
  }
  .fill{
    position:absolute; inset:0;
    width: var(--p);
    background: linear-gradient(
      90deg,
      hsla(var(--hue), 92%, 62%, .62),
      hsla(var(--hue), 92%, 62%, .18)
    );
  }

  /* Notion：条更“硬朗” */
  :global(body[data-theme="notion"]) .fill{
    background: linear-gradient(
      90deg,
      rgba(255,255,255,.45),
      rgba(255,255,255,.12)
    );
  }

  /* Apple：条更柔和、发光更轻 */
  :global(body[data-theme="apple"]) .fill{
    background: linear-gradient(
      90deg,
      hsla(var(--hue), 92%, 70%, .50),
      rgba(255,255,255,.10)
    );
  }

  .label{
    position:absolute; inset:0;
    display:grid;
    place-items:center;
    font-size: 11px;
    font-weight: 800;
    letter-spacing:.2px;
    font-variant-numeric: tabular-nums;
    color: rgba(255,255,255,.88);
    text-shadow: 0 1px 10px rgba(0,0,0,.35);
    pointer-events:none;
  }
  :global(body[data-theme="notion"]) .label{
    color: rgba(255,255,255,.82);
    text-shadow: none;
  }

  .meta{
    margin-top: 6px;
    display:flex;
    gap: 6px;
    align-items:center;
    font-size: 11px;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dot{ opacity:.6; }

  /* 右侧：名称（年份） */
  .right{
    text-align:right;
    display:flex;
    justify-content:flex-end;
    gap: 6px;
    align-items:baseline;
    min-width: 0;
  }
  .name{
    font-size: 12.5px;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
  }
  .year{
    font-size: 11px;
    color: var(--muted);
    font-weight: 700;
    flex: 0 0 auto;
  }

  @media (max-width: 760px){
    .head{ align-items:flex-start; flex-direction:column; }
    .switch{ width: fit-content; }
    .row{ grid-template-columns: 64px 1fr; }
    .right{ grid-column: 1 / -1; justify-content:flex-end; }
    .name{ max-width: 100%; }
  }
</style>
