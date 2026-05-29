export interface FaceTrackingResult {
  yaw: number;     // 首の横振り（左右）
  pitch: number;   // 首の縦振り（上下）
  roll: number;    // 首の傾き
  leftEyeOpen: number;
  rightEyeOpen: number;
  mouthOpen: number;
}

export class MocapMapper {
  /**
   * カメラの生座標からLive2Dの正規化パラメータへマッピング
   * 毎フレーム実行されるため、オブジェクトを生成せず数値を直接計算
   */
  public static mapToLive2D(raw: FaceTrackingResult, wasmCore: any): void {
    // 1. 顔の向き (ParamAngleX): 首のヨー角を -1.0 ~ 1.0 にクランプ
    const angleX = Math.max(-1.0, Math.min(1.0, raw.yaw * 2.0)); 
    wasmCore.set_parameter("ParamAngleX", angleX);

    // 2. 顔の上下 (ParamAngleY)
    const angleY = Math.max(-1.0, Math.min(1.0, raw.pitch * 2.0));
    wasmCore.set_parameter("ParamAngleY", angleY);

    // 3. 目の開閉 (ParamEyeOpenL / R)
    // カメラ側の感度を補正（少し目を開くだけでパッチリ開くようにイージング）
    const eyeOpenL = Math.max(0.0, Math.min(1.0, raw.leftEyeOpen * 1.2));
    wasmCore.set_parameter("ParamEyeOpenL", eyeOpenL);
    
    const eyeOpenR = Math.max(0.0, Math.min(1.0, raw.rightEyeOpen * 1.2));
    wasmCore.set_parameter("ParamEyeOpenR", eyeOpenR);

    // 4. 口の開閉 (ParamMouthOpenY)
    const mouthY = Math.max(0.0, Math.min(1.0, raw.mouthOpen));
    wasmCore.set_parameter("ParamMouthOpenY", mouthY);
  }
}
