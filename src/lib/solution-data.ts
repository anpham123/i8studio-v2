export interface SolutionService {
  slug: string;
  titleJa: string;
  titleEn: string;
  heroTaglineJa: string;
  heroTaglineEn: string;
  heroDescJa: string;
  heroDescEn: string;
  features: {
    titleJa: string;
    titleEn: string;
    descJa: string;
    descEn: string;
    image: string;
  }[];
  process: {
    titleJa: string;
    titleEn: string;
    descJa: string;
    descEn: string;
  }[];
  plans: {
    name: string;
    features: string[];
    price: string;
    highlighted?: boolean;
  }[];
}

export const SOLUTIONS: SolutionService[] = [
  {
    slug: "cg-perspective",
    titleJa: "CGパース",
    titleEn: "CG Perspective",
    heroTaglineJa: "精緻さが生む芸術",
    heroTaglineEn: "Art Born from Precision",
    heroDescJa: "建築の美しさを、フォトリアリスティックな3DCGパースで表現。自然光の再現から素材の質感まで、細部にこだわった高品質レンダリング。",
    heroDescEn: "Express architectural beauty through photorealistic 3DCG perspectives. From natural lighting to material textures, high-quality rendering with attention to every detail.",
    features: [
      { titleJa: "自然なライティング", titleEn: "Natural Lighting", descJa: "太陽光・人工照明のリアルなシミュレーションで、空間の雰囲気を忠実に再現します。", descEn: "Faithful reproduction of spatial ambiance through realistic simulation of sunlight and artificial lighting.", image: "/uploads/solution-cg-perspective-1.jpg" },
      { titleJa: "精密なマテリアル再現", titleEn: "Material Fidelity", descJa: "木目、石材、金属、ガラスなど、素材の質感と反射を高精度で表現します。", descEn: "High-precision representation of material textures and reflections including wood grain, stone, metal, and glass.", image: "/uploads/solution-cg-perspective-2.jpg" },
    ],
    process: [
      { titleJa: "ヒアリング", titleEn: "Briefing", descJa: "要件・図面・参考資料の確認", descEn: "Requirements, drawings & reference review" },
      { titleJa: "モデリング", titleEn: "Modeling", descJa: "3Dモデル構築・家具配置", descEn: "3D model construction & furniture placement" },
      { titleJa: "ライティング", titleEn: "Lighting", descJa: "光源設定・環境マップ適用", descEn: "Light source setup & environment mapping" },
      { titleJa: "レンダリング", titleEn: "Rendering", descJa: "高解像度出力・レタッチ", descEn: "High-resolution output & retouching" },
    ],
    plans: [
      { name: "Standard", features: ["1カット", "2Kレンダリング", "2回修正"], price: "¥35,000〜" },
      { name: "High Quality", features: ["1カット", "4Kレンダリング", "3回修正", "家具コーディネート"], price: "¥65,000〜", highlighted: true },
      { name: "Full Custom", features: ["複数カット", "8Kレンダリング", "無制限修正", "アニメーション対応"], price: "ASK" },
    ],
  },
  {
    slug: "cg-video",
    titleJa: "CG動画",
    titleEn: "CG Video",
    heroTaglineJa: "動く建築、感動の体験",
    heroTaglineEn: "Architecture in Motion",
    heroDescJa: "ウォークスルーアニメーションやフライスルー映像で、建築空間をダイナミックに体験。プレゼンテーションに最適。",
    heroDescEn: "Dynamic architectural experiences through walkthrough and flythrough animations. Perfect for presentations.",
    features: [
      { titleJa: "シネマティックカメラワーク", titleEn: "Cinematic Camera Work", descJa: "映画のような滑らかなカメラ移動で、空間の魅力を最大限に引き出します。", descEn: "Smooth cinematic camera movements that maximize the appeal of spaces.", image: "/uploads/solution-cg-video-1.jpg" },
      { titleJa: "リアルタイムエフェクト", titleEn: "Real-time Effects", descJa: "水面の反射、樹木の揺れ、照明の変化など、動的要素でリアリティを向上。", descEn: "Enhanced realism with dynamic elements: water reflections, swaying trees, lighting changes.", image: "/uploads/solution-cg-video-2.jpg" },
    ],
    process: [
      { titleJa: "絵コンテ", titleEn: "Storyboard", descJa: "カメラパス・演出の設計", descEn: "Camera path & direction design" },
      { titleJa: "モデリング", titleEn: "Modeling", descJa: "シーン構築・テクスチャ設定", descEn: "Scene construction & texture setup" },
      { titleJa: "アニメーション", titleEn: "Animation", descJa: "カメラ・ライト・オブジェクト動作", descEn: "Camera, light & object animation" },
      { titleJa: "編集・出力", titleEn: "Edit & Export", descJa: "カラーグレーディング・BGM・出力", descEn: "Color grading, BGM & final export" },
    ],
    plans: [
      { name: "Standard", features: ["30秒", "Full HD", "BGMなし"], price: "¥150,000〜" },
      { name: "High Quality", features: ["60秒", "4K", "BGM付き", "カラーグレーディング"], price: "¥350,000〜", highlighted: true },
      { name: "Full Custom", features: ["自由尺", "4K+", "ナレーション対応"], price: "ASK" },
    ],
  },
  {
    slug: "photo-composite",
    titleJa: "写真合成",
    titleEn: "Photo Compositing",
    heroTaglineJa: "現実と仮想の融合",
    heroTaglineEn: "Merging Reality and Virtual",
    heroDescJa: "実写写真にCGの建築物やインテリアをシームレスに合成。コストを抑えながらフォトリアルな完成予想図を実現。",
    heroDescEn: "Seamlessly composite CG architecture and interiors onto real photos. Achieve photorealistic renderings at reduced cost.",
    features: [
      { titleJa: "シームレスな合成技術", titleEn: "Seamless Compositing", descJa: "光源・パースペクティブ・色温度を正確にマッチングさせ、自然な合成を実現。", descEn: "Natural compositing through precise matching of light sources, perspectives, and color temperature.", image: "/uploads/solution-photo-composite-1.jpg" },
      { titleJa: "Before/After 比較", titleEn: "Before/After Comparison", descJa: "既存写真と合成後の比較で、リノベーション・新築の変化を直感的に伝達。", descEn: "Intuitively communicate renovation and new construction changes through before/after comparisons.", image: "/uploads/solution-photo-composite-2.jpg" },
    ],
    process: [
      { titleJa: "写真分析", titleEn: "Photo Analysis", descJa: "撮影条件・パース解析", descEn: "Shooting conditions & perspective analysis" },
      { titleJa: "3Dマッチング", titleEn: "3D Matching", descJa: "カメラアングル・光源合わせ", descEn: "Camera angle & light source matching" },
      { titleJa: "合成", titleEn: "Compositing", descJa: "レンダリング＋写真合成", descEn: "Rendering + photo compositing" },
      { titleJa: "レタッチ", titleEn: "Retouching", descJa: "色調整・仕上げ", descEn: "Color adjustment & finishing" },
    ],
    plans: [
      { name: "Standard", features: ["1カット", "基本合成", "2回修正"], price: "¥25,000〜" },
      { name: "High Quality", features: ["1カット", "高精度合成", "3回修正"], price: "¥50,000〜", highlighted: true },
      { name: "Full Custom", features: ["複数カット", "完全カスタム"], price: "ASK" },
    ],
  },
  {
    slug: "virtual-staging",
    titleJa: "バーチャルステージング",
    titleEn: "Virtual Staging",
    heroTaglineJa: "空室を魅力的な空間へ",
    heroTaglineEn: "Transform Empty Rooms",
    heroDescJa: "空室の写真にバーチャル家具・インテリアを配置。不動産販売やモデルルーム提案に最適なコスト効率の高いソリューション。",
    heroDescEn: "Place virtual furniture and interiors in empty room photos. A cost-effective solution ideal for real estate sales and model room proposals.",
    features: [
      { titleJa: "リアルな家具配置", titleEn: "Realistic Furniture Placement", descJa: "空間のスケールに合わせた家具・小物の自然な配置で、生活感のある空間を演出。", descEn: "Natural arrangement of furniture and accessories scaled to the space, creating a lived-in atmosphere.", image: "/uploads/solution-virtual-staging-1.jpg" },
      { titleJa: "多彩なスタイル提案", titleEn: "Diverse Style Proposals", descJa: "モダン、ナチュラル、和風など、ターゲットに合わせた複数のインテリアスタイルを提案。", descEn: "Multiple interior style proposals including modern, natural, and Japanese styles tailored to target audiences.", image: "/uploads/solution-virtual-staging-2.jpg" },
    ],
    process: [
      { titleJa: "写真受領", titleEn: "Photo Receipt", descJa: "空室写真・要望確認", descEn: "Empty room photos & requirements" },
      { titleJa: "スタイル選定", titleEn: "Style Selection", descJa: "インテリアスタイル決定", descEn: "Interior style determination" },
      { titleJa: "家具配置", titleEn: "Staging", descJa: "3D家具モデル配置・合成", descEn: "3D furniture model placement" },
      { titleJa: "納品", titleEn: "Delivery", descJa: "最終調整・納品", descEn: "Final adjustments & delivery" },
    ],
    plans: [
      { name: "Standard", features: ["1部屋", "基本家具セット", "1回修正"], price: "¥15,000〜" },
      { name: "High Quality", features: ["1部屋", "プレミアム家具", "2回修正"], price: "¥30,000〜", highlighted: true },
      { name: "Full Custom", features: ["複数部屋", "フルカスタム"], price: "ASK" },
    ],
  },
  {
    slug: "vr360",
    titleJa: "VR360",
    titleEn: "VR360",
    heroTaglineJa: "360°で体感する空間",
    heroTaglineEn: "Experience Space in 360°",
    heroDescJa: "パノラマVRで建築空間を360度体験。ブラウザやVRゴーグルで、まるでその場にいるかのような没入感を提供。",
    heroDescEn: "Experience architectural spaces in 360-degree panoramic VR. Immersive presence through browsers or VR headsets.",
    features: [
      { titleJa: "没入型パノラマ体験", titleEn: "Immersive Panorama Experience", descJa: "高解像度360°パノラマで、空間の奥行きとスケール感をリアルに体感できます。", descEn: "Experience realistic depth and scale of spaces through high-resolution 360° panoramas.", image: "/uploads/solution-vr360-1.jpg" },
      { titleJa: "インタラクティブ操作", titleEn: "Interactive Controls", descJa: "ホットスポットで部屋間移動やインフォメーション表示。物件案内にも最適。", descEn: "Navigate between rooms and display information through hotspots. Perfect for property tours.", image: "/uploads/solution-vr360-2.jpg" },
    ],
    process: [
      { titleJa: "シーン設計", titleEn: "Scene Design", descJa: "視点ポイント・動線計画", descEn: "Viewpoint & flow planning" },
      { titleJa: "360°レンダリング", titleEn: "360° Render", descJa: "パノラマ画像レンダリング", descEn: "Panoramic image rendering" },
      { titleJa: "インタラクション", titleEn: "Interaction", descJa: "ホットスポット・UI実装", descEn: "Hotspot & UI implementation" },
      { titleJa: "公開", titleEn: "Publish", descJa: "ウェブ/VR配信設定", descEn: "Web/VR distribution setup" },
    ],
    plans: [
      { name: "Standard", features: ["3シーン", "基本ホットスポット"], price: "¥80,000〜" },
      { name: "High Quality", features: ["6シーン", "カスタムUI", "BGM"], price: "¥180,000〜", highlighted: true },
      { name: "Full Custom", features: ["無制限シーン", "フルカスタム"], price: "ASK" },
    ],
  },
  {
    slug: "vr-walkthrough",
    titleJa: "VR Walkthrough",
    titleEn: "VR Walkthrough",
    heroTaglineJa: "自由に歩ける建築空間",
    heroTaglineEn: "Walk Freely Through Architecture",
    heroDescJa: "リアルタイム3D技術で建築空間を自由に歩き回れるインタラクティブ体験。設計段階でのプレゼンや顧客体験に革新を。",
    heroDescEn: "Interactive experiences allowing free exploration of architectural spaces using real-time 3D technology.",
    features: [
      { titleJa: "リアルタイム探索", titleEn: "Real-time Exploration", descJa: "自由な視点移動と歩行で、空間を直感的に理解できるインタラクティブ体験。", descEn: "Interactive experience for intuitive spatial understanding through free viewpoint movement.", image: "/uploads/solution-vr-walkthrough-1.jpg" },
      { titleJa: "マルチデバイス対応", titleEn: "Multi-device Support", descJa: "PC・タブレット・VRゴーグルなど、様々なデバイスで快適に動作。", descEn: "Comfortable operation across PC, tablet, VR headsets and more.", image: "/uploads/solution-vr-walkthrough-2.jpg" },
    ],
    process: [
      { titleJa: "モデル最適化", titleEn: "Optimization", descJa: "リアルタイム用モデル調整", descEn: "Real-time model optimization" },
      { titleJa: "インタラクション", titleEn: "Interaction", descJa: "操作・ナビ実装", descEn: "Controls & navigation setup" },
      { titleJa: "テスト", titleEn: "Testing", descJa: "パフォーマンス確認・調整", descEn: "Performance verification" },
      { titleJa: "デプロイ", titleEn: "Deploy", descJa: "配信・パッケージング", descEn: "Distribution & packaging" },
    ],
    plans: [
      { name: "Standard", features: ["1フロア", "基本ナビ"], price: "¥200,000〜" },
      { name: "High Quality", features: ["複数フロア", "カスタムUI", "インタラクション"], price: "¥450,000〜", highlighted: true },
      { name: "Full Custom", features: ["建物全体", "フルカスタム"], price: "ASK" },
    ],
  },
  {
    slug: "digital-model",
    titleJa: "デジタル模型",
    titleEn: "Digital Model",
    heroTaglineJa: "デジタルで甦る建築模型",
    heroTaglineEn: "Architecture Models Reborn Digitally",
    heroDescJa: "従来の物理模型に代わるデジタル建築模型。360°回転、ズーム、断面表示など、インタラクティブな機能で設計を立体的に検証。",
    heroDescEn: "Digital architecture models replacing traditional physical models. Verify designs three-dimensionally with interactive features.",
    features: [
      { titleJa: "インタラクティブ3D表示", titleEn: "Interactive 3D Display", descJa: "ブラウザ上で自由に回転・ズーム・断面表示。物理模型では不可能な視点で確認。", descEn: "Free rotation, zoom and cross-section views in browser. Verify from perspectives impossible with physical models.", image: "/uploads/solution-digital-model-1.jpg" },
      { titleJa: "コスト削減・即時共有", titleEn: "Cost Reduction & Instant Sharing", descJa: "制作コストと時間を大幅削減。URLひとつで世界中のステークホルダーと共有。", descEn: "Dramatically reduce production costs and time. Share with stakeholders worldwide via a single URL.", image: "/uploads/solution-digital-model-2.jpg" },
    ],
    process: [
      { titleJa: "データ変換", titleEn: "Data Conversion", descJa: "BIM/CADデータ取り込み", descEn: "BIM/CAD data import" },
      { titleJa: "最適化", titleEn: "Optimization", descJa: "ウェブ用モデル最適化", descEn: "Web model optimization" },
      { titleJa: "UI実装", titleEn: "UI Setup", descJa: "操作パネル・表示設定", descEn: "Control panel & display settings" },
      { titleJa: "公開", titleEn: "Publish", descJa: "ウェブ埋め込み・配信", descEn: "Web embedding & distribution" },
    ],
    plans: [
      { name: "Standard", features: ["1棟", "基本表示"], price: "¥120,000〜" },
      { name: "High Quality", features: ["1棟", "断面表示", "アノテーション"], price: "¥250,000〜", highlighted: true },
      { name: "Full Custom", features: ["複数棟", "BIM連携"], price: "ASK" },
    ],
  },
  {
    slug: "ar",
    titleJa: "AR",
    titleEn: "AR",
    heroTaglineJa: "拡張現実で建築を体験",
    heroTaglineEn: "Experience Architecture in AR",
    heroDescJa: "スマートフォンやタブレットを通じて、実際の空間に建築物やインテリアを重ね合わせ。現実と仮想を融合した新しい体験。",
    heroDescEn: "Overlay architecture and interiors onto real spaces through smartphones and tablets. A new experience merging reality and virtual.",
    features: [
      { titleJa: "現地でのスケール確認", titleEn: "On-site Scale Verification", descJa: "建設予定地でスマホをかざすだけで、完成予想をAR表示。スケール感を直感的に確認。", descEn: "Simply point your smartphone at the construction site to view the completed AR visualization.", image: "/uploads/solution-ar-1.jpg" },
      { titleJa: "インテリアプレビュー", titleEn: "Interior Preview", descJa: "部屋の中にARで家具を配置。購入前にサイズ感とコーディネートを確認できます。", descEn: "Place AR furniture in rooms. Verify size and coordination before purchase.", image: "/uploads/solution-ar-2.jpg" },
    ],
    process: [
      { titleJa: "3Dモデル準備", titleEn: "3D Model Prep", descJa: "AR用モデル最適化", descEn: "AR model optimization" },
      { titleJa: "AR実装", titleEn: "AR Setup", descJa: "トラッキング・表示設定", descEn: "Tracking & display setup" },
      { titleJa: "テスト", titleEn: "Testing", descJa: "デバイステスト・調整", descEn: "Device testing & adjustment" },
      { titleJa: "リリース", titleEn: "Release", descJa: "配信・ドキュメント", descEn: "Distribution & documentation" },
    ],
    plans: [
      { name: "Standard", features: ["1モデル", "WebAR"], price: "¥100,000〜" },
      { name: "High Quality", features: ["3モデル", "カスタムUI", "アニメーション"], price: "¥250,000〜", highlighted: true },
      { name: "Full Custom", features: ["アプリ開発", "フルカスタム"], price: "ASK" },
    ],
  },
  {
    slug: "exe-content",
    titleJa: "EXEコンテンツ",
    titleEn: "EXE Content",
    heroTaglineJa: "インタラクティブ実行型コンテンツ",
    heroTaglineEn: "Interactive Executable Content",
    heroDescJa: "オフライン動作するインタラクティブ3Dアプリケーション。展示会・ショールーム・プレゼンで、ネットワーク不要の安定した体験を提供。",
    heroDescEn: "Interactive 3D applications that run offline. Provide stable experiences at exhibitions, showrooms, and presentations without network dependency.",
    features: [
      { titleJa: "オフライン動作", titleEn: "Offline Operation", descJa: "ネットワーク環境に依存せず、どこでも安定したプレゼンテーションが可能。", descEn: "Stable presentations anywhere without network dependency.", image: "/uploads/solution-exe-content-1.jpg" },
      { titleJa: "高品質リアルタイムCG", titleEn: "High-quality Real-time CG", descJa: "Unreal Engine等のゲームエンジンを活用した、映像品質のリアルタイムCG体験。", descEn: "Cinematic-quality real-time CG powered by game engines like Unreal Engine.", image: "/uploads/solution-exe-content-2.jpg" },
    ],
    process: [
      { titleJa: "要件定義", titleEn: "Requirements", descJa: "機能・操作仕様策定", descEn: "Feature & operation spec" },
      { titleJa: "開発", titleEn: "Development", descJa: "アプリ開発・UI実装", descEn: "App development & UI" },
      { titleJa: "テスト", titleEn: "Testing", descJa: "動作検証・最適化", descEn: "Verification & optimization" },
      { titleJa: "パッケージング", titleEn: "Packaging", descJa: "インストーラ作成・納品", descEn: "Installer creation & delivery" },
    ],
    plans: [
      { name: "Standard", features: ["基本インタラクション", "1シーン"], price: "¥300,000〜" },
      { name: "High Quality", features: ["複数シーン", "カスタムUI", "データ連携"], price: "¥600,000〜", highlighted: true },
      { name: "Full Custom", features: ["フルアプリ開発"], price: "ASK" },
    ],
  },
];

export function getSolutionBySlug(slug: string): SolutionService | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
