import { unzipSync } from 'fflate';

export class VirtualFileSystem {
  // メモリ上の仮想ファイルストレージ (パス -> バイナリデータ)
  private storage: Map<string, Uint8Array> = new Map();

  /**
   * インポートされたZIPファイルをブラウザ内で爆速解凍してVFSに格納
   */
  public async importZip(arrayBuffer: ArrayBuffer): Promise<void> {
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // fflateを用いて高速に同期解凍（WebWorker化も容易）
    const unzipped = unzipSync(uint8Array);

    for (const [path, data] of Object.entries(unzipped)) {
      if (data.length > 0) { // ディレクトリではなくファイルのみを格納
        this.storage.set(path, data);
        console.log(`[VFS] インポート完了: ${path} (${data.length} bytes)`);
      }
    }
  }

  /**
   * VFSから指定したファイルを取得
   */
  public getFile(path: string): Uint8Array | undefined {
    return this.storage.get(path);
  }

  /**
   * .model3.json などのテキスト設定ファイルをパースして取得
   */
  public getJson(path: string): any {
    const data = this.getFile(path);
    if (!data) return null;
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(data));
  }

  /**
   * 特定の拡張子のファイルを検索（例: .moc3 を探す）
   */
  public findFileByExtension(ext: string): string | undefined {
    for (const path of this.storage.keys()) {
      if (path.endsWith(ext)) return path;
    }
    return undefined;
  }
}

export const vfs = new VirtualFileSystem();
