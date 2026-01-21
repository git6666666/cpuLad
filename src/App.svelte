<script lang="ts">
  import { cpus, type CPU } from "./data";

  type Row = CPU & { value: number };

  // 你要求：性价比排序 = openSpeed / price（越大越好）
  const rows: Row[] = cpus
    .map((c) => ({ ...c, value: c.openSpeed / c.price }))
    .sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...rows.map((r) => r.value), 1);

  const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(3) : "—");

  // 分档：按排名比例（你觉得不合适，我也可以改成按阈值）
  function tierByRank(i: number, n: number) {
    const p = (i + 1) / Math.max(1, n);
    if (p <= 0.10) return "S";
    if (p <= 0.30) return "A";
    if (p <= 0.60) return "B";
    if (p <= 0.85) return "C";
    return "D";
  }

  const tierStyle: Record<string, { glow: string; solid: string }> = {
    S: { glow: "rgba(124,92,255,.55)", solid: "rgba(124,92,255,.92)" },
    A: { glow: "rgba(46,229,157,.50)", solid: "rgba(46,229,157,.92)" },
    B: { glow: "rgba(255,209,102,.48)", solid: "rgba(255,209,102,.92)" },
    C: { glow: "rgba(255,140,0,.45)", solid: "rgba(255,140,0,.92)" },
    D: { glow: "rgba(255,77,109,.45)", solid: "rgba(255,77,109,.92)" }
  };

  const pct = (v: number) => Math.max(0, Math.min(100, Math.round((v / maxValue) * 100)));
</script>

<main class="wrap">
  <header class="hero">
    <div class="title">
      <h1>CPU 性价比天梯</h1>
      <p>排序：性价比 = 网页打开速度 ÷ 价格（越大越好）</p>
    </div>
    <div class="meta">
      <span class="chip">{rows.length} items</span>
      <span class="chip dim">S/A/B/C/D：按排名比例分档</span>
    </div>
  </header>

  <section class="card">
    {#if rows.length === 0}
      <div class="empty">
        <div class="emptyTitle">暂无数据</div>
        <div class="emptyHint">请在 <code>src/data.ts</code> 填入 cpus 数组</div>
      </div>
    {:else}
      {#each rows as r, i (r.name)}
        {@const tier = tierByRank(i, rows.length)}
        {@const p = pct(r.value)}
        <div
          class="row"
          style="
            --p:{p}%;
            --tierSolid:{tierStyle[tier].solid};
            --tierGlow:{tierStyle[tier].glow};
          "
        >
          <!-- 左：分档 + 排名 -->
          <div class="left">
            <div class="tier" aria-label={"Tier " + tier}>{tier}</div>
            <div class="rank">#{i + 1}</div>
          </div>

          <!-- 中：数值（你要求中间显示） -->
          <div class="mid">
            <div class="value">{fmt(r.value)}</div>
            <div class="sub">value</div>
          </div>

          <!-- 右：CPU 名称（年份） -->
          <div class="right">
            <div class="name">
              {r.name}<span class="year">（{r.year}）</span>
            </div>
            <div class="hint">
              <span>速度 {r.openSpeed}</span>
              <span class="dot">·</span>
              <span>价格 ¥{r.price}</span>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </section>

  <footer class="foot">
    <span class="tip">提示：</span>
    <span class="tip">如果你的“网页打开速度”其实是耗时（ms，越小越快），告诉我我帮你改公式与显示。</span>
  </footer>
</main>

<style>
  :global(body){
    margin:0;
    color: rgba(255,255,255,.92);
    font: 14px/1.45 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "PingFang SC";
    background:
      radial-gradient(1200px 800px at 15% 10%, rgba(124,92,255,.22), transparent 60%),
      radial-gradient(1000px 800px at 85% 20%, rgba(0,212,255,.14), transparent 55%),
      radial-gradient(900px 700px at 60% 90%, rgba(255,77,109,.10), transparent 55%),
      linear-gradient(160deg, #0b1220, #090f1b);
    min-height:100vh;
    overflow-x:hidden;
  }

  .wrap{ max-width: 980px; margin: 0 auto; padding: 18px; }

  .hero{
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
    gap: 12px;
    margin-bottom: 14px;
  }
  .title h1{ margin:0; letter-spacing:.2px; font-size: 28px; }
  .title p{ margin:.45em 0 0; opacity:.72; }

  .meta{ display:flex; gap:10px; flex-wrap:wrap; justify-content:flex-end; }
  .chip{
    padding: 8px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.07);
    border: 1px solid rgba(255,255,255,.12);
    backdrop-filter: blur(12px);
    font-size: 12px;
    white-space: nowrap;
  }
  .chip.dim{ opacity:.75; }

  .card{
    padding: 12px;
    border-radius: 20px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    backdrop-filter: blur(14px);
    box-shadow: 0 18px 60px rgba(0,0,0,.30);
  }

  .row{
    position: relative;
    display:grid;
    grid-template-columns: 92px 140px 1fr;
    gap: 12px;
    align-items:center;
    padding: 12px 14px;
    margin: 10px 0;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,.10);
    background: rgba(0,0,0,.16);
    overflow:hidden;
    transform: translateZ(0);
  }

  /* 背景进度底纹（按 value 归一化），更“天梯” */
  .row::before{
    content:"";
    position:absolute;
    inset: 0;
    width: var(--p);
    background: linear-gradient(90deg, var(--tierGlow), rgba(255,255,255,0));
    opacity: .9;
    pointer-events:none;
  }

  /* 右上角微光点缀 */
  .row::after{
    content:"";
    position:absolute;
    top:-60px; right:-60px;
    width: 140px; height: 140px;
    background: radial-gradient(circle, var(--tierGlow), transparent 60%);
    opacity: .55;
    pointer-events:none;
  }

  .row:hover{
    border-color: rgba(255,255,255,.18);
    background: rgba(0,0,0,.20);
    box-shadow: 0 16px 45px rgba(0,0,0,.35);
  }

  .left{ display:flex; flex-direction:column; gap:8px; z-index: 1; }
  .tier{
    width: 40px; height: 40px;
    border-radius: 14px;
    display:grid; place-items:center;
    font-weight: 900;
    letter-spacing:.4px;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.14);
    box-shadow: 0 0 0 1px rgba(0,0,0,.18) inset, 0 12px 35px rgba(0,0,0,.25);
    position:relative;
  }
  .tier::before{
    content:"";
    position:absolute; inset:-1px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.08);
    background: linear-gradient(135deg, var(--tierSolid), rgba(255,255,255,0));
    opacity:.55;
    pointer-events:none;
  }
  .rank{
    font-variant-numeric: tabular-nums;
    opacity:.82;
    font-weight: 700;
  }

  .mid{
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    z-index: 1;
  }
  .value{
    font-size: 22px;
    font-weight: 900;
    letter-spacing:.3px;
    font-variant-numeric: tabular-nums;
  }
  .sub{
    margin-top: 2px;
    font-size: 12px;
    opacity:.65;
  }

  .right{
    text-align:right;
    display:flex;
    flex-direction:column;
    gap: 4px;
    z-index: 1;
  }
  .name{
    font-size: 16px;
    font-weight: 850;
    letter-spacing:.2px;
  }
  .year{ opacity:.72; font-weight: 700; margin-left: 4px; }
  .hint{
    opacity:.72;
    font-size: 12px;
    display:flex;
    justify-content:flex-end;
    gap: 8px;
    align-items:center;
  }
  .dot{ opacity:.6; }

  .empty{
    padding: 34px 18px;
    text-align:center;
    color: rgba(255,255,255,.82);
  }
  .emptyTitle{ font-weight: 900; font-size: 18px; }
  .emptyHint{ opacity:.7; margin-top: 6px; }
  code{
    padding: 2px 6px;
    border-radius: 10px;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.10);
  }

  .foot{ margin-top: 10px; opacity:.68; }
  .tip{ font-size: 12px; }

  @media (max-width: 720px){
    .row{
      grid-template-columns: 82px 120px 1fr;
      padding: 12px;
    }
    .title h1{ font-size: 24px; }
    .hint{ display:none; }
  }
</style>
