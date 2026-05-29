use wasm_bindgen::prelude::*;
use std::collections::HashMap;

#[wasm_bindgen]
pub struct Live2DCore {
    parameters: HashMap<String, f32>,
    vertex_count: usize,
    // 共有メモリ（Linear Memory）としてTS側にポインタを露出するベクターバッファ
    vertices: Vec<f32>,
    uvs: Vec<f32>,
}

#[wasm_bindgen]
impl Live2DCore {
    #[wasm_bindgen(constructor)]
    pub fn new(_moc3_buffer: &[u8]) -> Live2DCore {
        // ※ 本来はここでnom等を用いてバイナリを高速デコードします
        // 以下は概念実証（MVP）用のモック4頂点
        let vertex_count = 4;
        let vertices = vec![
            -100.0, -100.0,
             100.0, -100.0,
            -100.0,  100.0,
             100.0,  100.0,
        ];
        let uvs = vec![
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
        ];

        let mut parameters = HashMap::new();
        parameters.insert("ParamAngleX".to_string(), 0.0);
        parameters.insert("ParamEyeOpenL".to_string(), 1.0);

        Live2DCore {
            parameters,
            vertex_count,
            vertices,
            uvs,
        }
    }

    pub fn set_parameter(&mut self, id: &str, value: f32) {
        if let Some(param) = self.parameters.get_mut(id) {
            *param = value;
        }
    }

    pub fn update_physics(&mut self, _delta_time: f32) {
        // パラメータに基づいた頂点変形や物理演算シミュレーション
        let angle_x = self.parameters.get("ParamAngleX").unwrap_or(&0.0);
        let shift = angle_x * 15.0; // 角度に応じた横揺れ変形

        // 直接頂点配列のメモリを書き換え
        self.vertices[0] = -100.0 + shift;
        self.vertices[2] = 100.0 + shift;
        self.vertices[4] = -100.0 + shift;
        self.vertices[6] = 100.0 + shift;
    }

    pub fn get_vertices_ptr(&self) -> *const f32 {
        self.vertices.as_ptr()
    }

    pub fn get_uvs_ptr(&self) -> *const f32 {
        self.uvs.as_ptr()
    }

    pub fn get_vertex_count(&self) -> usize {
        self.vertex_count
    }
}
