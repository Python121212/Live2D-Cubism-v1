<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  let paintCanvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let isDrawing = false;

  onMount(() => {
    ctx = paintCanvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      // 初期状態としてテクスチャのベースライン（白など）を設定
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 256, 256);
      
      // テクスチャに簡単な目印を描画
      ctx.fillStyle = '#ff0055';
      ctx.font = '24px sans-serif';
      ctx.fillText('LIVE2D PAINT', 10, 50);
    }
  });

  function startDrawing(e: MouseEvent) {
    isDrawing = true;
    draw(e);
  }

  function stopDrawing() {
    isDrawing = false;
    if (ctx) ctx.beginPath();
  }

  function draw(e: MouseEvent) {
    if (!isDrawing || !ctx) return;

    const rect = paintCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#00ffcc'; // 蛍光サイバーカラーで上書き

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // 描画が発生した領域（Dirty Region）をメインCanvas側へ通知
    dispatch('textureUpdate', { canvas: paintCanvas });
  }
</script>

<div class="paint-box">
  <h4>テクスチャダイレクトペイント</h4>
  <canvas 
    bind:this={paintCanvas} 
    width="256" 
    height="256"
    on:mousedown={startDrawing}
    on:mousemove={draw}
    on:mouseup={stopDrawing}
    on:mouseleave={stopDrawing}
  ></canvas>
  <p class="desc">モデル上のテクスチャにリアルタイムに描画が焼き付けられます。</p>
</div>

<style>
  .paint-box { padding: 15px; background: #252525; border-radius: 6px; margin: 10px; border: 1px solid #3a3a3a; }
  h4 { margin: 0 0 10px 0; font-size: 12px; color: #aaa; text-transform: uppercase; }
  canvas { background: #fff; width: 100%; aspect-ratio: 1; border-radius: 4px; cursor: crosshair; touch-action: none; }
  .desc { font-size: 11px; color: #777; margin: 5px 0 0 0; }
</style>
