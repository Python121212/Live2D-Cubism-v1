export class StreamRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private streamDestination: MediaStreamAudioDestinationNode | null = null;

  /**
   * 録画・録音の開始
   * @param canvasElement 録画対象のPixiJS Canvas
   */
  public async startRecording(canvasElement: HTMLCanvasElement): Promise<void> {
    this.recordedChunks = [];

    // 1. Canvasから映像ストリームを取得 (60fpsターゲット)
    const videoStream = canvasElement.captureStream(60);
    const combinedStream = new MediaStream();

    // 映像トラックを統合ストリームに追加
    videoStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));

    try {
      // 2. マイク音声の取得とWeb Audio APIによるミキシングのセットアップ
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.streamDestination = this.audioContext.createMediaStreamDestination();

      const micSource = this.audioContext.createMediaStreamSource(micStream);
      micSource.connect(this.streamDestination);

      // 音声トラックを統合ストリームに追加
      this.streamDestination.stream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
      });
    } catch (err) {
      console.warn("[Recorder] マイク非許可、またはデバイスが見つからないため音声なしで録画します:", err);
    }

    // 3. MediaRecorderの初期化（透過を維持するため VP9/WebM を最優先）
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    this.mediaRecorder = new MediaRecorder(combinedStream, options);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.exportVideo();
    };

    // 1秒ごとにデータをスライスしてメモリを安定化
    this.mediaRecorder.start(1000);
    console.log("[Recorder] 録画中...");
  }

  /**
   * 録画の停止
   */
  public stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      if (this.audioContext) {
        this.audioContext.close();
      }
      console.log("[Recorder] 録画停止");
    }
  }

  /**
   * 録画されたWebMファイルをローカルへエクスポート（爆速ダウンロード）
   */
  private exportVideo(): void {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `live2d-studio-capture-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("[Recorder] エクスポート完了");
  }
}
