<div class="timeline-container">
  <div class="timeline-tracks">
    <div class="track">
      <span class="track-label">ParamAngleX</span>
      <div class="track-bar">
        <div class="keyframe" style="left: 10%;"></div>
        <div class="keyframe" style="left: 45%;"></div>
        <div class="keyframe" style="left: 80%;"></div>
      </div>
    </div>
    <div class="track">
      <span class="track-label">ParamEyeOpenL</span>
      <div class="track-bar">
        <div class="keyframe" style="left: 20%;"></div>
        <div class="keyframe" style="left: 60%;"></div>
      </div>
    </div>
  </div>
</div>

<style>
  .timeline-container { padding: 10px; height: 100%; display: flex; flex-direction: column; box-sizing: border-box; }
  .timeline-tracks { display: flex; flex-direction: column; gap: 8px; overflow-y: auto; flex: 1; }
  .track { display: flex; align-items: center; background: #252525; padding: 5px; border-radius: 4px; }
  .track-label { width: 100px; font-size: 11px; color: #aaa; }
  .track-bar { flex: 1; height: 20px; background: #151515; position: relative; border-radius: 2px; }
  .keyframe { position: absolute; width: 8px; height: 8px; background: #00ffcc; transform: rotate(45deg); top: 6px; cursor: pointer; }
  .keyframe:hover { background: #fff; }
</style>
