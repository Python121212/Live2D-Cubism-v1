<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let angleX = 0;
  let eyeOpen = 1.0;

  function onSliderChange() {
    // SvelteのカスタムイベントでリアルタイムにCanvasへ座標伝達
    dispatch('paramChange', { id: 'ParamAngleX', value: angleX });
  }

  // 非同期（Lazy Loading）モジュールインポートのトリガー
  async function loadMotionCapture() {
    const { initTracking } = await import('../utils/mocapTracker');
    initTracking();
  }
</script>

<div class="control-panel">
  <h3>パラメータコントロール</h3>
  
  <div class="control-group">
    <label for="angleX">ParamAngleX (顔の向き)</label>
    <input type="range" id="angleX" min="-1" max="1" step="0.01" bind:value={angleX} on:input={onSliderChange} />
    <span>{angleX.toFixed(2)}</span>
  </div>

  <div class="control-group">
    <label for="eyeOpen">ParamEyeOpenL (左目開閉)</label>
    <input type="range" id="eyeOpen" min="0" max="1" step="0.01" bind:value={eyeOpen} />
    <span>{eyeOpen.toFixed(2)}</span>
  </div>

  <div class="feature-buttons">
    <button class="btn-lazy" on:click={loadMotionCapture}>モーキャプ起動 (Lazy Load)</button>
    <button class="btn-lazy">テクスチャペイント (Lazy Load)</button>
  </div>
</div>

<style>
  .control-panel { padding: 15px; color: #ccc; }
  h3 { font-size: 14px; margin-top: 0; border-bottom: 1px solid #444; padding-bottom: 5px; color: #fff; }
  .control-group { margin-bottom: 15px; display: flex; flex-direction: column; }
  .control-group label { font-size: 12px; margin-bottom: 5px; color: #aaa; }
  .control-group span { font-size: 11px; text-align: right; color: #00ffcc; margin-top: 2px; }
  .feature-buttons { margin-top: 25px; display: flex; flex-direction: column; gap: 10px; }
  .btn-lazy { background: #333; border: 1px solid #00ffcc; color: #00ffcc; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 12px; transition: all 0.2s; }
  .btn-lazy:hover { background: #00ffcc; color: #111; }
</style>
