<script lang="ts">
  import { cpus, type CPU } from "./data";

  type Row = CPU & { value: number };

  const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(3) : "—");

  function tierByRank(i: number, n: number) {
    const p = (i + 1) / Math.max(1, n); // 0~1
    if (p <= 0.10) return "S";
    if (p <= 0.30) return "A";
    if (p <= 0.60) return "B";
    if (p <= 0.85) return "C";
    return "D";
  }

  const tierColor: Record<string, string> = {
    S: "rgba(124,92,255,.35)",
    A: "rgba(46,229,157,.28)",
    B: "rgba(255,209,102,.26)",
    C: "rgba(255,140,0,.22)",
    D: "rgba(255,77,109,.22)"
  };

  const rows: Row[] = cpus
    .map((c) => ({ ...c, value: c.openSpeed / c.price }))
    .sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...rows.map(r => r.value), 1);
</script>

<main class="wrap">
  <header class="top">
    <div>
      <h1>CPU 性价比天梯</h1>
      <p>排序规则：性价比 = 网页打开速度 ÷ 价格（越大越好）</p>
    </div>
    <div class="pill">{rows.length} items</div>
  </header>

  <section class="panel">
    {#each rows as r, i (r.name)}
      {@const tier = tierByRank(i, rows.length)}
      <div class="row" style="--tier:{tierColor[tier]}">
        <div class="left">
          <span class="badge">{tier}</span>
          <div class="bar">
            <span style="width:{Math.round((r.value / maxValue) * 100)}%"></span>
          </div>
          <span class="v">{fmt(r.value)}</span>
        </div>

        <div class="right">
          <span class="name">{r.name}</span>
          <span class="year">（{r.year}）</span>
        </div>
      </div>
    {/each}
  </section>

  <footer class="foot">
    <span class="k">注：</span>
    <span class="k">S/A/B/C/D 为按排名比例自动分档（可在代码里改比例）。</span>
  </footer>
</main>

<style>
  :global(body){
    margin:0;
    color: rgba(255,255,255,.92);
    font: 14px/1.45 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "PingFang SC";
    background:
      radial-gradient(1000px 700px at 20% 10%, rgba(124,92,255,.25), transparent 60%),
      radial-gradient(900px 700px at 80% 20%, rgba(0,212,255,.14), transparent 55%),
      linear-gradient(160deg, #0b1220, #0a0f1c);
    min-height:100vh;
  }
  .wrap{ max-width: 980px; margin: 0 auto; padding: 18px; }
  .top{ display:flex; justify-content:space-between; align-items:flex-end; gap:12px; }
  h1{ margin:0; letter-spacing:.2px; }
  p{ margin:.4em 0 0; opacity:.72; }
  .pill{
    padding: 8px 10px; border-radius: 999px;
    background: rgba(255,255,255,.07);
    border: 1px solid rgba(255,255,255,.12);
  }
  .panel{
    margin-top: 14px;
    padding: 12px;
    border-radius: 18px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    backdrop-filter: blur(14px);
    box-shadow: 0 18px 60px rgba(0,0,0,.28);
  }
  .row{
    display:flex; align-items:center; justify-content:space-between;
    padding: 10px 12px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,.10);
    background: rgba(0,0,0,.14);
    margin-bottom: 10px;
    position:relative;
    overflow:hidden;
  }
  .row::before{
    content:"";
    position:absolute; inset:0;
    background: var(--tier);
    opacity:.85;
    mix-blend-mode: screen;
    pointer-events:none;
  }
  .left{ display:flex; align-items:center; gap:10px; min-width: 320px; }
  .badge{
    width: 26px; height: 26px;
    display:grid; place-items:center;
    border-radius: 10px;
    background: rgba(255,255,255,.10);
    border: 1px solid rgba(255,255,255,.14);
    font-weight: 800;
  }
  .bar{
    flex:1;
    height: 10px;
    border-radius: 999px;
    background: rgba(0,0,0,.22);
    border: 1px solid rgba(255,255,255,.10);
    overflow:hidden;
  }
  .bar span{
    display:block;
    height:100%;
    background: rgba(124,92,255,.85);
    border-radius: 999px;
  }
  .v{
    width: 70px;
    text-align:right;
    font-variant-numeric: tabular-nums;
    opacity:.92;
  }
  .right{
    display:flex; align-items:baseline;
    gap:6px;
    justify-content:flex-end;
    text-align:right;
    margin-left: 12px;
  }
  .name{ font-weight: 750; }
  .year{ opacity:.72; }
  .foot{ margin-top: 10px; opacity:.65; }
  .k{ font-size: 12px; }
</style>
