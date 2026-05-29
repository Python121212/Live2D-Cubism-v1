<script lang="ts">
  import { onMount } from 'svelte';
  import { Application, Geometry, Shader, Mesh } from 'pixi.js';

  let canvasContainer: HTMLDivElement;
  let app: Application;
  let live2dMesh: Mesh;
  
  // Wasmモック用のダミー共有メモリデータ
  let mockWasmCore = {
    vertices: new Float32Array([-100, -100, 100, -100, -100, 100, 100, 100]),
    uvs: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
    indices: new Uint16Array([0, 1, 2, 1, 3, 2]),
    paramAngleX: 0,
    update(dt: number) {
      const shift = this.paramAngleX * 25.0;
      this.vertices[0] = -100 + shift;
      this.vertices[2] = 100 + shift;
      this.vertices[4] = -100 + shift;
      this.vertices[6] = 100 + shift;
    }
  };

  onMount(async () => {
    app = new Application();
    await app.init({
      resizeTo: canvasContainer,
      backgroundAlpha: 0,
      preference: 'webgpu' // WebGPUを最優先指定。非対応ならWebGLへ自動フォールバック
    });

    canvasContainer.appendChild(app.canvas);

    // PixiJS v8 ジオメトリの構築（Wasmの頂点バッファをマップ）
    const geometry = new Geometry({
      attributes: {
        aPosition: mockWasmCore.vertices,
        aUV: mockWasmCore.uvs,
      },
      indexBuffer: mockWasmCore.indices,
    });

    // SDKフリーの頂点マッピング・カスタムシェーダー
    const vertexSrc = `
      in vec2 aPosition;
      in vec2 aUV;
      out vec2 vUV;
      uniform mat3 uProjectionMatrix;
      uniform mat3 uWorldTransformMatrix;
      void main() {
          gl_Position = vec4((uProjectionMatrix * uWorldTransformMatrix * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
          vUV = aUV;
      }
    `;

    const fragmentSrc = `
      in vec2 vUV;
      out vec4 finalColor;
      void main() {
          // テクスチャ未ロード時用の仮グラデーションカラー表示
          finalColor = vec4(vUV.x, vUV.y, 1.0, 1.0);
      }
    `;

    const shader = Shader.from({
      gl: { vertex: vertexSrc, fragment: fragmentSrc },
      wgsl: { vertex: vertexSrc, fragment: fragmentSrc } // WGSL環境へのマッピング
    });

    live2dMesh = new Mesh({ geometry, shader });
    live2dMesh.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(live2dMesh);

    // 毎フレームのレンダリングループ
    app.ticker.add((ticker) => {
      mockWasmCore.update(ticker.deltaTime);
      // 頂点配列に加わった変更をGPUバッファにコミット
      geometry.getBuffer('aPosition').update();
    });

    return () => {
      app.destroy(true, { children: true });
    };
  });

  // 外部(ControlPanel等)からパラメータを流し込むインターフェース
  export function updateParameter(id: string, value: number) {
    if (id === 'ParamAngleX') {
      mockWasmCore.paramAngleX = value;
    }
  }
</script>

<div class="canvas-container" bind:this={canvasContainer}></div>

<style>
  .canvas-container { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
</style>
