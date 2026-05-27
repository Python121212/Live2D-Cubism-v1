// 多言語テキストリソース
const i18n = {
    ja: { rec: "録画開始", stop: "停止", load: "モデル読み込み" },
    en: { rec: "Start Rec", stop: "Stop", load: "Load Model" },
    ko: { rec: "녹화 시작", stop: "정지", load: "모델 불러오기" },
    zh: { rec: "开始录制", stop: "停止", load: "载入模型" }
};

let currentLang = 'ja';

// 言語切り替え
document.getElementById('lang-selector').addEventListener('change', (e) => {
    currentLang = e.target.value;
    updateLanguage();
});

function updateLanguage() {
    document.getElementById('btn-record').innerText = i18n[currentLang].rec;
    // 他のUIも同様に更新
}

// テーマ切り替え (黒 / 白)
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    document.body.classList.toggle('theme-light');
});

// ファイル・ZIPの読み込みハンドラ
document.getElementById('file-loader').addEventListener('change', async (e) => {
    const files = e.target.files;
    let modelJsonFile = null;
    let fileMap = {};

    for (let file of files) {
        if (file.name.endsWith('.zip')) {
            // ZIPファイルを解凍して処理
            const zip = await JSZip.loadAsync(file);
            for (let relativePath in zip.files) {
                const zipEntry = zip.files[relativePath];
                if (!zipEntry.dir) {
                    const blob = await zipEntry.async('blob');
                    fileMap[relativePath] = blob;
                    if (relativePath.endsWith('.model3.json')) {
                        modelJsonFile = relativePath;
                    }
                }
            }
        } else {
            // 通常ファイル（.moc3, .json, .physics3.json, .exp3.json など一括）
            fileMap[file.name] = file;
            if (file.name.endsWith('.model3.json')) {
                modelJsonFile = file.name;
            }
        }
    }

    if (modelJsonFile) {
        loadLive2DModel(modelJsonFile, fileMap);
    } else {
        alert("モデル設定ファイル(.model3.json)が見つかりません。");
    }
});

// 途中書き出し / エクスポート機能
document.getElementById('btn-export').addEventListener('click', () => {
    const appState = {
        version: "1.0",
        timestamp: Date.now(),
        // 現在のLive2Dパラメータやペイントデータをここにシリアライズ
        paintData: document.getElementById('paint-canvas').toDataURL()
    };
    
    const blob = new Blob([JSON.stringify(appState)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `live2d-session-${Date.now()}.ctmp3`; // 独自途中保存拡張子
    a.click();
});
