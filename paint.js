const paintCanvas = document.getElementById('paint-canvas');
const ctx = paintCanvas.getContext('2d');
let drawing = false;

// キャンバスサイズの初期化 (高解像度Retinaディスプレイ対応)
function resizePaintCanvas() {
    paintCanvas.width = paintCanvas.parentElement.clientWidth;
    paintCanvas.height = paintCanvas.parentElement.clientHeight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}
window.addEventListener('resize', resizePaintCanvas);
resizePaintCanvas();

// 描画ロジック
function startDraw(e) {
    drawing = true;
    draw(e);
}

function endDraw() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;
    
    const rect = paintCanvas.getBoundingClientRect();
    // スマホ(Touch)とPC(Mouse)の両方の座標を統合取得
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    ctx.lineWidth = document.getElementById('brush-size').value;
    ctx.strokeStyle = document.getElementById('brush-color').value;
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
}

// イベントリスナー登録 (PC & スマホ対応)
paintCanvas.addEventListener('mousedown', startDraw);
paintCanvas.addEventListener('mouseup', endDraw);
paintCanvas.addEventListener('mousemove', draw);

paintCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); });
paintCanvas.addEventListener('touchend', endDraw);
paintCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });

document.getElementById('clear-canvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
});
