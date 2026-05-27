let mediaRecorder;
let recordedChunks = [];

document.getElementById('btn-record').addEventListener('click', async () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        document.getElementById('btn-record').innerText = i18n[currentLang].rec;
        return;
    }

    recordedChunks = [];
    const live2dCanvas = document.getElementById('live2d-canvas');
    
    // 1. Live2Dアニメーションのストリーム（描画データ）をキャプチャ (60fps)
    const live2dStream = live2dCanvas.captureStream(60);

    // 2. [バックグラウンド裏録画のキモ] 
    // PWAシステムが裏でPC/スマホのシステム音声や別ウインドウ(ゲーム画面)のストリームを統合する場合
    // getDisplayMedia を使用して、ユーザーが指定したゲーム画面を裏側で取得可能
    try {
        // ※必要に応じてゲーム画面のストリームを統合、またはLive2D単体を完全に別ファイルとして裏で書き出す
        // 今回はLive2Dモーションを「邪魔にならないように」透明背景付き、または単体で超軽量録画します。
        mediaRecorder = new MediaRecorder(live2dStream, {
            mimeType: 'video/webm; codecs=vp9',
            videoBitsPerSecond: 2500000 // 軽量かつ高画質
        });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            
            // 自動ダウンロード（編集ソフトでゲーム画面と後から合体させる用）
            const a = document.createElement('a');
            a.href = url;
            a.download = `live2d-alpha-layer-${Date.now()}.webm`;
            a.click();
        };

        mediaRecorder.start();
        document.getElementById('btn-record').innerText = "STOP & DOWNLOAD";
    } catch (err) {
        console.error("録画に失敗しました: ", err);
    }
});
