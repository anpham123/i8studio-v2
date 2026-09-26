export interface ApplicationCategoryItem {
  key: string;
  label: string;
}

export interface PartnerStatCard {
  id?: string;
  num: string;
  name: string;
  desc: string;
}

export interface PartnerBrandItem {
  id?: string;
  name: string;
  sub: string;
  img: string;
  alt?: string;
}

export interface ApplicationCard {
  id: string;
  category: "bds" | "kts" | "nha-thau" | "gia-chu" | "hospitality" | "furniture" | string;
  targetTag: string;
  num: string;
  image: string;
  title: string;
  problemLabel?: string;
  problemText: string;
  checklist: string[];
  outcomeLabel?: string;
  outcomeVal: string;
}

export interface PricingTierItem {
  id?: string;
  badge: string;
  name: string;
  sub: string;
  price: string;
  unit: string;
  commitTime: string;
  commitSupport: string;
  features: string[];
  btnText: string;
  isFeatured?: boolean;
}

export interface LandingContent {
  hero: {
    eyebrow: string;
    headlinePre: string;
    headlineHighlight1: string;
    headlineHighlight2: string;
    desc: string;
    ctaContact: string;
    ctaCollection?: string;
    ctaWorkflow?: string;
    scrollHint?: string;
    badgeEst?: string;
    badgeTitle?: string;
    badgeDesc?: string;
    badgeStatus?: string;
    badge1Val?: string;
    badge1Label?: string;
    badge2Val?: string;
    badge2Label?: string;
    badge3Val?: string;
    badge3Label?: string;
    model3d?: {
      mode?: "preset" | "custom";
      presetId?: string;
      customModelUrl?: string;
      modelName?: string;
      rotationSpeed?: number;
      showWireframe?: boolean;
      wireframeColor?: string;
      ambientParticles?: boolean;
      initialScale?: number;
    };
  };
  painPoints: {
    title: string;
    eyebrow?: string;
    sub?: string;
    cards?: Array<{
      tag: string;
      badge: string;
      quote: string;
      detail: string;
      solLabel?: string;
      solText?: string;
    }>;
    points?: Array<{
      num: string;
      title: string;
      quote: string;
      desc: string;
      impact: string;
      icon: string;
    }>;
  };
  workflow: {
    title: string;
    eyebrow?: string;
    sub?: string;
    steps: Array<{
      stepNumber?: string;
      stepTime?: string;
      stepBadge?: string;
      stepTitle?: string;
      stepDesc?: string;
      points?: string[];
      stepImage?: string;
      stepStageTag?: string;
      step?: string;
      title?: string;
      sub?: string;
      desc?: string;
      timeline?: string;
      deliverable?: string;
      img?: string;
    }>;
  };
  servicesBento: {
    title: string;
    badge?: string;
    sub?: string;
    card1?: {
      tag: string;
      title: string;
      desc: string;
      features: string[];
      image?: string;
    };
    card2?: {
      tag: string;
      title: string;
      desc: string;
      features: string[];
      image?: string;
    };
    card3?: {
      tag: string;
      title: string;
      desc: string;
      features: string[];
      image?: string;
    };
    card4?: {
      tag: string;
      title: string;
      desc: string;
      features: string[];
      image?: string;
    };
    cards?: Array<{
      tag: string;
      title: string;
      desc: string;
      image?: string;
      features: string[];
    }>;
    pillars?: Array<{
      colSpan: number;
      pill: string;
      title: string;
      sub: string;
      desc: string;
      features: string[];
      statNum: string;
      statLabel: string;
      ctaText: string;
      img?: string;
    }>;
  };
  deliverables: {
    title: string;
    badge?: string;
    sub?: string;
    cardSub1?: string;
    cardSub2?: string;
    cardSub3?: string;
    cardSub4?: string;
    laserTag?: string;
  };
  clients: {
    title: string;
    badge?: string;
    sub?: string;
    quote?: string;
    author?: string;
    stats?: Array<{ num: string; label: string }>;
    eyebrow?: string;
    trustCards?: Array<{
      badge: string;
      title: string;
      desc: string;
    }>;
  };
  applications: {
    title: string;
    badge?: string;
    sub?: string;
    subtitle?: string;
    cardTag?: string;
    categories?: ApplicationCategoryItem[];
    cards?: ApplicationCard[];
  };
  partners: {
    title: string;
    stats?: PartnerStatCard[];
    brands?: PartnerBrandItem[];
  };
  gallery: {
    title: string;
    filterTabs?: GalleryFilterTab[];
    tabs: {
      all: string;
      villa: string;
      townhouse: string;
      penthouse: string;
      resort: string;
      fnb: string;
    };
    btnZoom: string;
    btnConsult: string;
    hotlineText: string;
    btnViewDetail: string;
  };
  pricing: {
    title: string;
    sub: string;
    tiers?: PricingTierItem[];
    tier1: PricingTierItem;
    tier2: PricingTierItem;
    tier3: PricingTierItem;
    [key: string]: any;
  };
  lightbox: {
    btnConsult: string;
  };
}

export const contentJa: LandingContent = {
  hero: {
    eyebrow: "// KONTUR ATELIER · 3DCG建築ビジュアライゼーション",
    headlinePre: "理想の住まいを、",
    headlineHighlight1: "確かな空間へと",
    headlineHighlight2: "具現化する。",
    desc: "技術基準に準拠した高精度な建築設計と、100%フォトリアルな3DCG空間ビジュアライゼーション。細部まで視覚化し、コストをコントロールし、施工ミスを未然に防ぎます。",
    ctaContact: "プロジェクト相談",
    ctaCollection: "作品コレクション",
    scrollHint: "スクロールして詳細を見る",
    badgeEst: "EST. 2026 · KONTUR ATELIER",
    badgeTitle: "建築設計＆高精度3DCG空間表現",
    badgeDesc: "250件以上の施主様・企業様に選ばれ、着工前に100%のコストと仕様を可視化。",
    badgeStatus: "新規プロジェクト受付中",
    model3d: {
      mode: "preset",
      presetId: "tropical-villa",
      customModelUrl: "",
      modelName: "THE TROPICAL COURTYARD VILLA (トロピカル別荘)",
      rotationSpeed: 1,
      showWireframe: true,
      wireframeColor: "#f59e0b",
      ambientParticles: true,
      initialScale: 1,
    },
  },
  painPoints: {
    title: "建築・設計において直面する主な課題と悩み",
    cards: [
      {
        tag: "課題 01",
        badge: "完成イメージの不一致",
        quote: "「頭の中のアイデアが形として見えず、共有できない」",
        detail: "施主様の豊かなイメージを職人や施工会社に的確に伝えられず、完成後に想像と大きくかけ離れてしまうリスクを解消します。",
        solLabel: "Konturの解決策:",
        solText: "実寸大1:1スケールの高精細3Dレンダリングにより、完成後の住まいを明確に可視化。",
      },
      {
        tag: "課題 02",
        badge: "予期せぬ予算オーバー",
        quote: "「図面と現場の乖離で、後から追加費用が膨らむ」",
        detail: "部材や納まりの不透明さが原因で、着工後に想定外の追加工事や材料費が発生するトラブルを事前に防ぎます。",
        solLabel: "Konturの解決策:",
        solText: "精密なマテリアル設定と光学レンダリングで、着工前に確実な予算管理を実現。",
      },
      {
        tag: "課題 03",
        badge: "度重なる修正と工期遅延",
        quote: "「図面修正の待ち時間が長く、予定していた着工に間に合わない」",
        detail: "手戻りの多い修正フローや意思決定の遅れを解消し、スピーディーかつ正確な3D検討で工期短縮を実現します。",
        solLabel: "Konturの解決策:",
        solText: "建築基準に準拠した実施図面と3Dモデルの100%整合性を保証。",
      },
      {
        tag: "課題 04",
        badge: "素材・カラーの選定ミス",
        quote: "「マテリアルや光の調和が合わず、完成後に圧迫感を感じる」",
        detail: "小さなサンプル帳だけでは分からない、自然光の移ろいや広角での質感の調和を事前に完璧にシミュレーションします。",
        solLabel: "Konturの解決策:",
        solText: "小さなサンプル帳では分からない光の移ろいや広角の質感調和を事前に完璧にシミュレーション。",
      },
    ],
  },
  servicesBento: {
    title: "建築設計＆3DCG空間ビジュアライゼーション 総合ソリューション",
    card1: {
      tag: "総合意匠設計",
      title: "高精度な建築意匠・平面プランニング",
      desc: "敷地条件・法規制・通風採光を徹底分析し、美しさと実用性を極限まで両立させた建築プランを作成します。",
      features: [
        "敷地特性と周辺環境の徹底調査",
        "生活動線を最適化した2D/3Dゾーニング",
        "構造安全性と施工性を担保した実施図面",
        "法規・建築基準に準拠した安心設計",
      ],
    },
    card2: {
      tag: "フォトリアル3DCG",
      title: "8K 超高精細 外観 3DCG パース制作",
      desc: "光学シミュレーションに基づき、時間帯による太陽光の移ろい、外壁の質感や植栽の呼吸まで精密に描写します。",
      features: [
        "実物マテリアルの物理ベースレンダリング",
        "朝・昼・夕・夜のライティング検証",
        "周辺街並みとの調和を可視化",
        "大判印刷・プレゼンに耐えうる8K解像度",
      ],
    },
    card3: {
      tag: "インテリア＆照明",
      title: "洗練されたインテリア空間＆照明計画",
      desc: "家具のレイアウトから間接照明のルクス計算まで、居心地の良さを計算し尽くした空間ストーリーを創出します。",
      features: [
        "特注家具・マテリアル・テクスチャの再現",
        "建築化照明・間接光のムードシミュレーション",
        "視線の抜けと開放感を考慮したカメラアングル",
        "生活シーンを体感できるVR 360°展開対応",
      ],
    },
    card4: {
      tag: "施工図・積算",
      title: "実施施工図面一式＆積算・内訳明細書",
      desc: "構造・電気・給排水（MEP）から部材数量の正確な拾い出しまで、施工現場がそのまま動ける図面を提供します。",
      features: [
        "建築・構造・設備（MEP）総合図書の完備",
        "建材数量の正確な拾い出しと積算内訳",
        "着工後の設計変更と予算超過を徹底防止",
        "施工監理・現場質疑への迅速なサポート",
      ],
    },
  },
  workflow: {
    title: "5段階の確実なプロジェクト進行プロセス",
    steps: [
      {
        stepNumber: "01",
        stepTime: "1〜2日",
        stepBadge: "STEP 01 · 調査・要件定義",
        stepTitle: "要件ヒアリング＆敷地現況調査",
        stepDesc: "施主様のご要望、ご予算、ライフスタイルを丁寧にお伺いし、敷地条件・周辺環境・法規制を多角的に分析します。",
        stepImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=85",
        stepStageTag: "STAGE 01 • SURVEY",
        points: ["対面またはオンラインでの詳細ヒアリング", "敷地境界・高低差・インフラ状況の確認", "設計コンセプト・全体スケジュールの策定"],
      },
      {
        stepNumber: "02",
        stepTime: "3〜5日",
        stepBadge: "STEP 02 · 基本設計",
        stepTitle: "2D平面計画＆機能ゾーニング",
        stepDesc: "最適な動線計画と採光・通風シミュレーションに基づき、暮らしやすさと空間の美しさを追求した平面図を提案します。",
        stepImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
        stepStageTag: "STAGE 02 • WHITEBOX",
        points: ["生活動線と家族のプライバシー配慮", "家具配置を含む2Dレイアウト提案", "施主様のフィードバックを反映した修正対応"],
      },
      {
        stepNumber: "03",
        stepTime: "5〜7日",
        stepBadge: "STEP 03 · 3D可視化",
        stepTitle: "3Dモデリング＆8Kライティング表現",
        stepDesc: "平面図を立体化し、建材の質感や時間帯ごとの光の陰影を実写レベルのフォトリアルCGで描き出します。",
        stepImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
        stepStageTag: "STAGE 03 • RENDER 8K",
        points: ["物理ベースマテリアルの忠実な再現", "昼夜・季節による日照シミュレーション", "VR 360度ビューワーでの空間ウォークスルー"],
      },
      {
        stepNumber: "04",
        stepTime: "7〜10日",
        stepBadge: "STEP 04 · 実施図面",
        stepTitle: "実施設計図面・詳細図の作成",
        stepDesc: "意匠・構造・設備（MEP）の詳細図面を作成し、積算内訳書をまとめることで施工現場の確実な進行を支えます。",
        stepImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=85",
        stepStageTag: "STAGE 04 • CINEMA & VR",
        points: ["建築・構造・電気設備の総合図面化", "建材・仕上表と詳細納まり図の作成", "施工誤差を防ぐ高精度な寸法管理"],
      },
      {
        stepNumber: "05",
        stepTime: "竣工まで",
        stepBadge: "STEP 05 · 監理支援",
        stepTitle: "納品および施工監理サポート",
        stepDesc: "完成図書一式をお渡しし、着工後も設計意図が正しく施工されるよう技術サポートや現場確認を実施します。",
        stepImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85",
        stepStageTag: "STAGE 05 • BLUEPRINTS & BOQ",
        points: ["完成図書・CGパースデータの納品", "重要施工ポイントにおける技術アドバイス", "完成・お引き渡しまで伴走する安心体制"],
      },
    ],
  },
  deliverables: {
    title: "お客様へのお届け成果物コレクション",
    cardSub1: "実写レベルの超高精細ビジュアル",
    cardSub2: "現場がそのまま動ける実施図面一式",
    cardSub3: "暮らしやすさを極めた空間構成",
    cardSub4: "予算超過を防ぐ透明性の高い明細",
    laserTag: "納品成果物プレビュー",
  },
  applications: {
    title: "あらゆる建築タイプに対応する実践ソリューション",
    subtitle: "空間ビジュアライゼーションと設計シミュレーションを、企画・販売促進・コスト管理・現場施工の各段階に直接適用。",
    cardTag: "対応分野",
  },
  clients: {
    eyebrow: "500件以上の実績が証明する確かな信頼",
    title: "250社以上のパートナー＆全国のお客様",
    trustCards: [
      { badge: "施工精度", title: "100% 図面・現場一致", desc: "精密な3D検討により、着工後の手戻りや現場誤差をゼロへ。" },
      { badge: "コスト管理", title: "予算内での最適化", desc: "早期の積算明細により、想定外の追加費用発生を防止。" },
      { badge: "スピード", title: "迅速な初案提出", desc: "高度なCGパイプラインで、クオリティを落とさず短納期を実現。" },
      { badge: "品質保証", title: "8K フォトリアル表現", desc: "国内外の大手設計事務所・施主様に選ばれる最高峰の品質。" },
    ],
  },
  partners: {
    title: "全国250社以上のパートナー＆企業様",
  },
  gallery: {
    title: "建築実績＆デザインコレクション",
    tabs: {
      all: "全作品 (06)",
      villa: "別荘・高級ヴィラ",
      townhouse: "都市型住宅・タウンハウス",
      penthouse: "ペントハウス＆マンション",
      resort: "リゾート＆宿泊施設",
      fnb: "カフェ＆商業施設",
    },
    btnZoom: "拡大表示",
    btnConsult: "このプランについて相談する",
    hotlineText: "お電話窓口: 0984 384 190",
    btnViewDetail: "詳細を見る ↗",
  },
  pricing: {
    title: "明瞭な設計・3DCGビジュアライゼーション料金プラン",
    sub: "規模やご要望に応じた最適なプランをお選びいただけます。追加費用のない透明な価格設定です。",
    tier1: {
      badge: "パース制作",
      name: "プラン 01: 8K 3DCG 外観・内観パース",
      sub: "図面やスケッチをもとに、高精細フォトリアルCGパースを迅速に制作。",
      price: "180,000",
      unit: "円〜 / アングル",
      commitTime: "納期: 5〜7営業日",
      commitSupport: "修正: 2回まで無料",
      features: [
        "8K解像度納品（印刷・Web両対応）",
        "物理マテリアル＆昼夜光シミュレーション",
        "植栽・外構・環境光の精密合成",
        "マーケティング用データ提供",
      ],
      btnText: "プラン01を相談する",
    },
    tier2: {
      badge: "おすすめプラン",
      name: "プラン 02: 総合建築設計＆3Dビジュアル",
      sub: "2D平面計画、8K CGパース、VRウォークスルーまで包括する標準プラン。",
      price: "450,000",
      unit: "円〜 / プロジェクト",
      commitTime: "納期: 10〜15営業日",
      commitSupport: "サポート: 専任KTS伴走",
      features: [
        "プラン01の全内容（外観・内観）を網羅",
        "動線最適化2D平面図・ゾーニング",
        "VR 360°空間ウォークスルーデータ",
        "マテリアル選定表＆カラーパレット付属",
      ],
      btnText: "総合プランを申し込む",
    },
    tier3: {
      badge: "フルパッケージ",
      name: "プラン 03: 実施設計図面・積算内訳書一式",
      sub: "本施工に必要な意匠・構造・MEP図面一式と正確な積算内訳書を作成。",
      price: "850,000",
      unit: "円〜 / プロジェクト",
      commitTime: "納期: 15〜20営業日",
      commitSupport: "監理: 24時間技術サポート",
      features: [
        "プラン02の全内容（設計＋3D＋VR）を網羅",
        "意匠・構造・設備（MEP）実施図面一式",
        "工期と部材コストを抑える詳細積算書",
        "重要ポイントでの技術監理サポート",
      ],
      btnText: "実施設計プランを申し込む",
    },
  },
  lightbox: {
    btnConsult: "このプロジェクトについて相談する →",
  },
};

export const contentEn: LandingContent = {
  hero: {
    eyebrow: "// KONTUR ATELIER · 3D ARCHITECTURAL VISUALIZATION",
    headlinePre: "BRINGING YOUR",
    headlineHighlight1: "DREAM SPACE",
    headlineHighlight2: "TO REALITY.",
    desc: "Technically compliant architectural design and 100% photorealistic 3D rendering. Visualize every detail, control costs, and prevent construction errors before breaking ground.",
    ctaContact: "CONTACT US",
    ctaCollection: "VIEW COLLECTION",
    scrollHint: "SCROLL TO EXPLORE",
    badgeEst: "EST. 2026 · KONTUR ATELIER",
    badgeTitle: "PRECISION ARCHITECTURE & 3D RENDERING",
    badgeDesc: "Trusted by 250+ homeowners & developers to verify 100% costs and specifications before construction.",
    badgeStatus: "ACCEPTING NEW PROJECTS",
    model3d: {
      mode: "preset",
      presetId: "tropical-villa",
      customModelUrl: "",
      modelName: "THE TROPICAL COURTYARD VILLA",
      rotationSpeed: 1,
      showWireframe: true,
      wireframeColor: "#f59e0b",
      ambientParticles: true,
      initialScale: 1,
    },
  },
  painPoints: {
    title: "KEY CHALLENGES IN ARCHITECTURAL DESIGN & CONSTRUCTION",
    cards: [
      {
        tag: "PAIN POINT 01",
        badge: "REALITY MISMATCH",
        quote: "“Ideas in mind, but unable to visualize the final outcome?”",
        detail: "Homeowners often have vivid concepts but struggle to communicate them to builders, resulting in finished homes far from expectations.",
        solLabel: "KONTUR SOLUTION:",
        solText: "Photorealistic 1:1 scale 3D renders from realistic viewpoints help visualize every angle.",
      },
      {
        tag: "PAIN POINT 02",
        badge: "BUDGET OVERRUNS",
        quote: "“Drawings differ from reality, causing unexpected cost spikes?”",
        detail: "Unclear drawings and lack of precise material specifications lead to unexpected contractor changes and budget escalation.",
        solLabel: "KONTUR SOLUTION:",
        solText: "Exact material takeoffs and physically-based optical renders to control budget before breaking ground.",
      },
      {
        tag: "PAIN POINT 03",
        badge: "SCHEDULE DELAYS",
        quote: "“Endless waiting for drawing revisions, missing target start dates?”",
        detail: "Slow design iteration and unclear decision-making delay construction timelines and drive up holding expenses.",
        solLabel: "KONTUR SOLUTION:",
        solText: "Code-compliant blueprints perfectly matching 3D models with actual construction requirements.",
      },
      {
        tag: "PAIN POINT 04",
        badge: "MATERIAL ERRORS",
        quote: "“Mismatched colors and materials, resulting in cramped spaces?”",
        detail: "Choosing materials from tiny swatches without accurate lighting simulation leads to disappointing results after installation.",
        solLabel: "KONTUR SOLUTION:",
        solText: "Committed 3-7 day turnaround with a clear, systematic 3-round review process.",
      },
    ],
  },
  servicesBento: {
    title: "COMPREHENSIVE ARCHITECTURAL DESIGN & 3D VISUALIZATION",
    card1: {
      tag: "COMPREHENSIVE DESIGN",
      title: "Precision Architectural & Functional Floor Planning",
      desc: "In-depth analysis of site topography, regulations, and natural ventilation to create spaces of enduring beauty and function.",
      features: [
        "Comprehensive site condition & context analysis",
        "Optimal 2D/3D zoning for daily lifestyle flow",
        "Detailed blueprints ensuring structural safety",
        "Strict adherence to building codes & technical standards",
      ],
    },
    card2: {
      tag: "PHOTOREALISTIC 3D",
      title: "Photorealistic 8K Exterior 3D Rendering",
      desc: "Physically-based light calculations simulate sunlight across seasons, bringing exterior textures and landscaping to vivid life.",
      features: [
        "Physically-based rendering for real-world materials",
        "Multi-time-of-day natural lighting simulations",
        "Seamless integration with surrounding context",
        "Ultra-crisp 8K resolution for large-format presentations",
      ],
    },
    card3: {
      tag: "INTERIOR & LIGHTING",
      title: "Refined Interior Architecture & Ambient Lighting",
      desc: "From custom millwork to lux calculations, we craft immersive visual stories that embody modern comfort and understated luxury.",
      features: [
        "Accurate reproduction of custom joinery & textiles",
        "Calculated architectural lighting & mood scenes",
        "Cinematic camera viewpoints maximizing spatial depth",
        "VR 360° interactive walkthrough compatibility",
      ],
    },
    card4: {
      tag: "CONSTRUCTION & BOQ",
      title: "Construction Blueprint Sets & Itemized Cost Estimation",
      desc: "Complete structural, MEP, and quantity takeoffs ready for on-site execution without contractor ambiguity.",
      features: [
        "Full architectural, structural & MEP drawing packages",
        "Precise bill of quantities (BOQ) preventing hidden costs",
        "Elimination of on-site rework and scheduling delays",
        "Active technical supervision and contractor support",
      ],
    },
  },
  workflow: {
    title: "5-STEP PRECISION PROJECT WORKFLOW",
    steps: [
      {
        stepNumber: "01",
        stepTime: "1–2 Days",
        stepBadge: "STEP 01 · DISCOVERY & SURVEY",
        stepTitle: "Requirements Gathering & Site Survey",
        stepDesc: "We consult thoroughly on your vision, budget, and lifestyle while conducting comprehensive site analysis and zoning checks.",
        stepImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=85",
        stepStageTag: "STAGE 01 • SURVEY",
        points: ["In-depth brief sessions (online or in-person)", "Site boundary, orientation & infrastructure verification", "Design concept roadmap & project milestones"],
      },
      {
        stepNumber: "02",
        stepTime: "3–5 Days",
        stepBadge: "STEP 02 · SCHEMATIC PLANNING",
        stepTitle: "2D Floor Planning & Functional Zoning",
        stepDesc: "Developing optimal circulation and sun path integration to balance functional ergonomics with aesthetic proportion.",
        stepImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
        stepStageTag: "STAGE 02 • WHITEBOX",
        points: ["Circulation flow tailored to family lifestyle", "2D layout proposals with furniture footprints", "Iterative refinement based on your direct feedback"],
      },
      {
        stepNumber: "03",
        stepTime: "5–7 Days",
        stepBadge: "STEP 03 · 3D SIMULATION",
        stepTitle: "3D Modeling & 8K Lighting Simulation",
        stepDesc: "Transforming 2D layouts into photorealistic 3D visualizations with physically accurate materials and ambient illumination.",
        stepImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
        stepStageTag: "STAGE 03 • RENDER 8K",
        points: ["Faithful material and texture reproduction", "Day, twilight and night light studies", "Immersive VR 360-degree spatial walkthroughs"],
      },
      {
        stepNumber: "04",
        stepTime: "7–10 Days",
        stepBadge: "STEP 04 · DETAILED DRAWINGS",
        stepTitle: "Detailed Construction Blueprint Package",
        stepDesc: "Producing complete architectural, structural, and MEP engineering drawings backed by precise bill of materials.",
        stepImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=85",
        stepStageTag: "STAGE 04 • CINEMA & VR",
        points: ["Comprehensive architectural and MEP documentation", "Material schedules and technical joinery details", "Precise dimensioning preventing site errors"],
      },
      {
        stepNumber: "05",
        stepTime: "Through Handover",
        stepBadge: "STEP 05 · SITE SUPERVISION",
        stepTitle: "Delivery & Construction Supervision Support",
        stepDesc: "Handing over complete documentation sets while providing ongoing technical advisory to ensure design integrity.",
        stepImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85",
        stepStageTag: "STAGE 05 • BLUEPRINTS & BOQ",
        points: ["Delivery of print-ready blueprints & 8K renders", "On-site and remote technical supervision milestones", "Dedicated support through final project handover"],
      },
    ],
  },
  deliverables: {
    title: "CLIENT DELIVERABLES & PROJECT PORTFOLIO",
    cardSub1: "Photorealistic 8K Visual Perspectives",
    cardSub2: "Complete Construction Blueprint Package",
    cardSub3: "Ergonomic 2D & 3D Spatial Layouts",
    cardSub4: "Itemized Bill of Quantities & Cost Estimates",
    laserTag: "Deliverables Showcase Viewer",
  },
  applications: {
    title: "PRACTICAL APPLICATIONS FOR EVERY ARCHITECTURE TYPE",
    subtitle: "Spatial rendering and simulation solutions directly applied to sales acceleration, cost control, and precision construction.",
    cardTag: "Expertise Scope",
  },
  clients: {
    eyebrow: "PROVEN TRUST ACROSS 500+ PROJECTS",
    title: "250+ PARTNERS & CLIENTS NATIONWIDE",
    trustCards: [
      { badge: "PRECISION", title: "100% Reality Matching", desc: "Advanced 3D simulation eliminates construction errors and rework." },
      { badge: "COST CONTROL", title: "Zero Hidden Budget Surprises", desc: "Transparent bill of materials protects your investment before groundbreak." },
      { badge: "EFFICIENCY", title: "Rapid Iteration & Turnaround", desc: "Optimized CG workflow delivers top-tier assets on strict timelines." },
      { badge: "PREMIUM STANDARD", title: "8K Cinema-Grade Quality", desc: "Trusted by renowned architecture studios and discerning owners." },
    ],
  },
  partners: {
    title: "250+ PARTNERS & CLIENTS NATIONWIDE",
  },
  gallery: {
    title: "ARCHITECTURAL WORKS & DESIGN SHOWCASE",
    tabs: {
      all: "All Works (06)",
      villa: "Villas & Luxury Homes",
      townhouse: "Urban Townhouses",
      penthouse: "Penthouses & Apartments",
      resort: "Resorts & Hospitality",
      fnb: "F&B & Commercial Spaces",
    },
    btnZoom: "Zoom Full",
    btnConsult: "CONSULT THIS PLAN",
    hotlineText: "Hotline: 0984 384 190",
    btnViewDetail: "View Details ↗",
  },
  pricing: {
    title: "TRANSPARENT ARCHITECTURAL & 3D CG PRICING",
    sub: "Choose the package tailored to your project scale. Completely transparent pricing with zero surprise fees.",
    tier1: {
      badge: "CG Rendering",
      name: "Tier 01: 8K 3D Exterior & Interior Renders",
      sub: "High-end 3D visualization crafted from CAD drawings or concept sketches.",
      price: "$1,200",
      unit: "USD / View angle",
      commitTime: "Timeline: 5–7 Days",
      commitSupport: "Revisions: 2 Free Rounds",
      features: [
        "Full 8K resolution delivery (Web & Print)",
        "Physically-based materials & lighting studies",
        "Detailed exterior environment & foliage",
        "Marketing-ready assets for presentation",
      ],
      btnText: "INQUIRE FOR TIER 01",
    },
    tier2: {
      badge: "Most Popular",
      name: "Tier 02: Full Architectural Design & 3D",
      sub: "Turnkey planning: 2D layouts, 8K CGI renders, and interactive VR walkthroughs.",
      price: "$3,200",
      unit: "USD / Project",
      commitTime: "Timeline: 10–15 Days",
      commitSupport: "Support: Dedicated Lead Architect",
      features: [
        "All Tier 01 benefits (interior & exterior)",
        "2D floor plans & circulation zoning",
        "Interactive VR 360° spatial walkthrough",
        "Material specs & color palette boards",
      ],
      btnText: "CHOOSE COMPREHENSIVE TIER",
    },
    tier3: {
      badge: "Full Package",
      name: "Tier 03: Complete Blueprints & Bill of Quantities",
      sub: "Complete technical documentation, MEP drawings, and itemized material takeoff.",
      price: "$5,800",
      unit: "USD / Project",
      commitTime: "Timeline: 15–20 Days",
      commitSupport: "Supervision: 24/7 Tech Support",
      features: [
        "All Tier 02 benefits (Design + 3D + VR)",
        "Architectural, structural & MEP drawings",
        "Itemized bill of quantities (cost control)",
        "On-site & remote supervision milestones",
      ],
      btnText: "REQUEST CONSTRUCTION TIER",
    },
  },
  lightbox: {
    btnConsult: "Inquire about this project →",
  },
};

export const contentVi: LandingContent = {
  hero: {
    eyebrow: "// KONTUR ATELIER · 3D ARCHITECTURE",
    headlinePre: "HIỆN THỰC HÓA",
    headlineHighlight1: "NGÔI NHÀ",
    headlineHighlight2: "MƠ ƯỚC.",
    desc: "Giải pháp thiết kế kiến trúc chuẩn kỹ thuật và diễn họa 3D không gian sống chân thực 100%. Giúp bạn hình dung trọn vẹn từng góc nhìn, kiểm soát chi phí và tránh sai sót thi công.",
    ctaContact: "LIÊN HỆ DỰ ÁN",
    ctaCollection: "XEM BỘ SƯU TẬP",
    scrollHint: "CUỘN ĐỂ KHÁM PHÁ CHI TIẾT",
    badgeEst: "EST. 2026 · KONTUR ATELIER",
    badgeTitle: "KIẾN TRÚC & DIỄN HỌA 3D CHUẨN XÁC",
    badgeDesc: "Hơn 250+ gia chủ & chủ đầu tư tin chọn giải pháp kiểm soát 100% chi phí và thông số trước khi thi công.",
    badgeStatus: "SẴN SÀNG TIẾP NHẬN DỰ ÁN MỚI",
    model3d: {
      mode: "preset",
      presetId: "tropical-villa",
      customModelUrl: "",
      modelName: "BIỆT THỰ SÂN TRONG & HỒ BƠI",
      rotationSpeed: 1,
      showWireframe: true,
      wireframeColor: "#f59e0b",
      ambientParticles: true,
      initialScale: 1,
    },
  },
  painPoints: {
    title: "NỖI ĐAU CỦA BẠN KHI XÂY DỰNG & TÌM KIẾM ĐỐI TÁC",
    cards: [
      {
        tag: "NỖI ĐAU SỐ 01",
        badge: "KHÔNG ĐỒNG BỘ THỰC TẾ",
        quote: "“Ý tưởng trong đầu nhưng không hình dung ra sao?”",
        detail: "Gia chủ có rất nhiều ý tưởng nhưng không thể diễn đạt cho thợ xây, dẫn đến ngôi nhà hoàn thiện khác xa kỳ vọng ban đầu.",
      },
      {
        tag: "NỖI ĐAU SỐ 02",
        badge: "PHÁT SINH CHI PHÍ",
        quote: "“Bản vẽ một đằng, thợ xây một nẻo, đội chi phí?”",
        detail: "Hồ sơ kỹ thuật sơ sài, thiếu chi tiết bóc tách vật tư khiến thợ làm sai, phải đập đi xây lại làm đội vốn hàng trăm triệu đồng.",
      },
      {
        tag: "NỖI ĐAU SỐ 03",
        badge: "CHẬM TIẾN ĐỘ",
        quote: "“Chờ đợi sửa bản vẽ quá lâu, lỡ ngày lành khởi công?”",
        detail: "Quy trình làm việc thiếu chuyên nghiệp, sửa chữa nhiều lần kéo dài hàng tháng trời làm lỡ thời điểm vàng xây nhà của gia đình.",
      },
      {
        tag: "NỖI ĐAU SỐ 04",
        badge: "VẬT LIỆU SAI LỆCH",
        quote: "“Vật liệu phối màu không chuẩn, xây xong nhìn bí bách?”",
        detail: "Không được mô phỏng ánh sáng thực tế và chất liệu chân thực, dẫn đến không gian sống thiếu sáng, bí bách và mất đi tính thẩm mỹ.",
      },
    ],
  },
  servicesBento: {
    title: "HỆ THỐNG TRỤ CỘT DỊCH VỤ KIẾN TRÚC & DIỄN HỌA 3D TOÀN DIỆN",
    card1: {
      tag: "DỊCH VỤ TOÀN DIỆN",
      title: "Thiết Kế Kiến Trúc & Mặt Bằng Chuẩn Kỹ Thuật",
      desc: "Tối ưu hóa công năng sinh hoạt dựa trên thói quen của từng thành viên, đón trọn gió trời và ánh sáng tự nhiên với giải pháp vi khí hậu hoàn hảo.",
      features: [
        "Khảo sát địa hình và vi khí hậu khu đất kỹ lưỡng",
        "Quy hoạch mặt bằng 2D/3D tối ưu công năng sinh hoạt",
        "Bản vẽ xin phép xây dựng & hồ sơ pháp lý chuẩn xác",
        "Cam kết phương án độc bản, không sao chép rập khuôn",
      ],
    },
    card2: {
      tag: "DIỄN HỌA 3D 8K",
      title: "Diễn Họa 3D Ngoại Thất Siêu Thực 8K",
      desc: "Mô phỏng chân thực từng viên gạch, thớ gỗ và đường đi của ánh nắng mặt trời theo từng mùa, giúp bạn thấy trước ngôi nhà tương lai như một tác phẩm điện ảnh.",
      features: [
        "Độ phân giải 8K siêu sắc nét, zoom cận cảnh chi tiết",
        "Mô phỏng chính xác hệ vật liệu thực tế trên thị trường",
        "Hiệu ứng ánh sáng ngày, hoàng hôn và ban đêm sống động",
        "Sẵn sàng file VR 360° tương tác đa chiều",
      ],
    },
    card3: {
      tag: "NỘI THẤT TINH TẾ",
      title: "Không Gian Nội Thất & Ánh Sáng Tinh Tế",
      desc: "Kiến tạo không gian sống chuẩn nghỉ dưỡng tại gia với sự kết hợp hài hòa giữa màu sắc, ánh sáng gián tiếp và các vật liệu cao cấp an toàn cho sức khỏe.",
      features: [
        "Thiết kế nội thất may đo theo cá tính gia chủ",
        "Kịch bản chiếu sáng gián tiếp chống chói mắt",
        "Tối ưu hóa không gian lưu trữ thông minh, gọn gàng",
        "Chỉ định mã màu sơn và vật liệu chính xác 100%",
      ],
    },
    card4: {
      tag: "HỒ SƠ THI CÔNG",
      title: "Hồ Sơ Thi Công & Dự Toán Bóc Tách Chi Tiết",
      desc: "Bộ bản vẽ kỹ thuật kết cấu chịu lực, cấp thoát nước và điện thông minh (MEP) kèm bảng bóc tách khối lượng chi tiết từng bao xi măng, mét thép.",
      features: [
        "Bản vẽ kết cấu chịu lực tính toán an toàn tuyệt đối",
        "Hệ thống điện nước (MEP) thiết kế thông minh, tiết kiệm",
        "Bảng dự toán chi phí bóc tách chi tiết, chống đội vốn",
        "Giám sát tác giả từ xa đồng hành cùng gia chủ",
      ],
    },
  },
  workflow: {
    title: "QUY TRÌNH THỰC HIỆN DỰ ÁN 05 BƯỚC CHUẨN XÁC",
    steps: [
      {
        stepNumber: "01",
        stepTime: "1 – 2 Ngày",
        stepBadge: "BƯỚC 01 · TIẾP NHẬN & KHẢO SÁT",
        stepTitle: "Tiếp Nhận Yêu Cầu & Khảo Sát Hiện Trạng",
        stepDesc: "Lắng nghe tâm tư, sở thích và mức đầu tư dự kiến của gia chủ. Khảo sát tọa độ khu đất, hướng nắng, hướng gió và pháp lý xây dựng tại địa phương.",
        points: ["Phỏng vấn chuyên sâu nhu cầu sinh hoạt gia đình", "Thu thập dữ liệu trắc địa, flycam và vi khí hậu", "Lập nhiệm vụ thiết kế và cam kết tiến độ"],
      },
      {
        stepNumber: "02",
        stepTime: "3 – 5 Ngày",
        stepBadge: "BƯỚC 02 · PHƯƠNG ÁN 2D",
        stepTitle: "Lên Ý Tưởng Mặt Bằng & Công Năng 2D",
        stepDesc: "Kiến trúc sư trưởng trực tiếp lên sơ đồ phân chia phòng ốc, luồng di chuyển và vị trí đón gió, lấy sáng tối ưu nhất cho từng thế đất.",
        points: ["Mặt bằng bố trí nội thất chi tiết từng tầng", "Phân tích giao thông sinh hoạt thuận tiện", "Điều chỉnh không giới hạn đến khi gia chủ ưng ý"],
      },
      {
        stepNumber: "03",
        stepTime: "5 – 7 Ngày",
        stepBadge: "BƯỚC 03 · DIỄN HỌA 3D",
        stepTitle: "Dựng Hình 3D & Diễn Họa Ánh Sáng 8K",
        stepDesc: "Hiện thực hóa ý tưởng thành mô hình không gian 3D sống động với đầy đủ màu sắc, vật liệu thực tế và hiệu ứng ánh sáng ngày - đêm.",
        points: ["Bộ ảnh phối cảnh ngoại thất 8K đa góc nhìn", "Phối cảnh không gian nội thất trọng tâm", "Trải nghiệm không gian ảo VR 360° tương tác"],
      },
      {
        stepNumber: "04",
        stepTime: "7 – 10 Ngày",
        stepBadge: "BƯỚC 04 · KỸ THUẬT THI CÔNG",
        stepTitle: "Triển Khai Hồ Sơ Bản Vẽ Kỹ Thuật Thi Công",
        stepDesc: "Đội ngũ kỹ sư triển khai trọn bộ hồ sơ kiến trúc, kết cấu, điện nước (MEP) và bảng dự toán bóc tách vật tư chính xác 100%.",
        points: ["Bản vẽ kết cấu móng, cột, dầm, sàn chịu lực", "Sơ đồ nguyên lý điện, cấp thoát nước thông minh", "Bảng dự toán kinh phí bóc tách khối lượng chi tiết"],
      },
      {
        stepNumber: "05",
        stepTime: "Suốt Quá Trình Thi Công",
        stepBadge: "BƯỚC 05 · ĐỒNG HÀNH & BÀN GIAO",
        stepTitle: "Bàn Giao Hồ Sơ & Đồng Hành Thi Công Thực Tế",
        stepDesc: "Bàn giao bộ hồ sơ đóng tập ký dấu pháp lý. KTS đồng hành giải đáp thắc mắc của thợ xây và hỗ trợ nghiệm thu các mốc quan trọng.",
        points: ["Bàn giao 02 bộ hồ sơ in màu A3 chuẩn thi công", "Hỗ trợ kỹ thuật 24/7 qua nhóm Zalo chuyên trách", "Kiểm tra trực tiếp các mốc đổ móng, đổ sàn quan trọng"],
      },
    ],
  },
  deliverables: {
    title: "BỘ SƯU TẬP HỒ SƠ GIAO CHO KHÁCH HÀNG",
    cardSub1: "Góc nhìn siêu thực trước khi xây",
    cardSub2: "Chuẩn kỹ thuật từng mm cho thợ thi công",
    cardSub3: "Tối ưu hóa vi khí hậu & luồng gió tự nhiên",
    cardSub4: "Kiểm soát chi phí, chống đội vốn 100%",
    laserTag: "Xem chi tiết bộ hồ sơ",
  },
  applications: {
    title: "ỨNG DỤNG THỰC TẾ CHO MỌI LOẠI HÌNH CÔNG TRÌNH",
    subtitle: "Giải pháp diễn họa & mô phỏng không gian được ứng dụng trực tiếp vào từng giai đoạn thực thi, xúc tiến bán hàng, kiểm soát chi phí và thi công thực tiễn.",
    cardTag: "Lĩnh vực chuyên sâu",
  },
  clients: {
    eyebrow: "UY TÍN ĐƯỢC CHỨNG MINH QUA 500+ DỰ ÁN",
    title: "250+ ĐỐI TÁC & KHÁCH HÀNG TRÊN TOÀN QUỐC",
    trustCards: [
      { badge: "CHÍNH XÁC", title: "100% Khớp Kỹ Thuật", desc: "Mô phỏng 3D chuẩn xác từng chi tiết giúp thợ thi công chính xác tuyệt đối." },
      { badge: "TIẾT KIỆM", title: "Chống Đội Vốn", desc: "Dự toán vật tư bóc tách chuẩn xác giúp gia chủ kiểm soát ngân sách an tâm." },
      { badge: "TIẾN ĐỘ", title: "Bàn Giao Đúng Hạn", desc: "Quy trình thiết kế chuẩn chỉ, cam kết bàn giao hồ sơ đúng tiến độ khởi công." },
      { badge: "ĐẲNG CẤP", title: "Phối Cảnh 8K", desc: "Chất lượng diễn họa hàng đầu được các chủ đầu tư danh tiếng tin chọn." },
    ],
  },
  partners: {
    title: "250+ ĐỐI TÁC & KHÁCH HÀNG TRÊN TOÀN QUỐC",
  },
  gallery: {
    title: "BỘ SƯU TẬP CÔNG TRÌNH & MẪU THIẾT KẾ THỰC TẾ",
    tabs: {
      all: "Tất Cả Mẫu (06)",
      villa: "Biệt Thự & Villa",
      townhouse: "Nhà Phố Kiến Trúc",
      penthouse: "Penthouse & Căn Hộ",
      resort: "Resort & Nghỉ Dưỡng",
      fnb: "Không Gian F&B & Cafe",
    },
    btnZoom: "Phóng to",
    btnConsult: "TƯ VẤN PHƯƠNG ÁN NÀY",
    hotlineText: "Hotline: 0984 384 190",
    btnViewDetail: "Xem chi tiết ↗",
  },
  pricing: {
    title: "BẢNG GIÁ DỊCH VỤ THIẾT KẾ & DIỄN HỌA 3D MINH BẠCH",
    sub: "Lựa chọn gói dịch vụ phù hợp với nhu cầu và quy mô công trình của bạn. Cam kết minh bạch, không phát sinh chi phí ẩn.",
    tier1: {
      badge: "DIỄN HỌA 3D",
      name: "Gói 01: Diễn Họa 3D 8K Ngoại & Nội Thất",
      sub: "Hình dung ngôi nhà tương lai bằng hình ảnh 3D chân thực từ bản vẽ sẵn có.",
      price: "150,000",
      unit: "VNĐ / m² sàn",
      commitTime: "Bàn giao: 5 – 7 ngày",
      commitSupport: "Chỉnh sửa: 2 vòng miễn phí",
      features: [
        "Phối cảnh ngoại & nội thất 8K sắc nét",
        "Mô phỏng vật liệu & ánh sáng tự nhiên",
        "Ảnh góc rộng và toàn cảnh Panorama",
        "Tối ưu góc nhìn mặt tiền đắt giá",
      ],
      btnText: "ĐĂNG KÝ GÓI 01",
    },
    tier2: {
      badge: "GÓI PHỔ BIẾN",
      name: "Gói 02: Thiết Kế Kiến Trúc Toàn Diện",
      sub: "Giải pháp trọn vẹn từ mặt bằng công năng, 3D ngoại thất đến nội thất chi tiết.",
      price: "250,000",
      unit: "VNĐ / m² sàn",
      commitTime: "Bàn giao: 10 – 15 ngày",
      commitSupport: "Giám sát: KTS hỗ trợ 24/7",
      features: [
        "Bao gồm toàn bộ quyền lợi Gói 01",
        "Mặt bằng 2D/3D chuẩn phong thủy & vi khí hậu",
        "Thiết kế chi tiết không gian từng phòng",
        "Bảng chỉ định vật liệu & màu sơn chuẩn xác",
      ],
      btnText: "ĐĂNG KÝ GÓI TOÀN DIỆN",
    },
    tier3: {
      badge: "TRỌN GÓI THI CÔNG",
      name: "Gói 03: Hồ Sơ Thi Công & Bóc Tách Dự Toán",
      sub: "Hồ sơ kỹ thuật hoàn chỉnh cho nhà thầu thi công chuẩn xác 100%, chống đội vốn.",
      price: "350,000",
      unit: "VNĐ / m² sàn",
      commitTime: "Bàn giao: 15 – 20 ngày",
      commitSupport: "Giám sát: KTS đồng hành trực tiếp",
      features: [
        "Bao gồm toàn bộ quyền lợi Gói 02",
        "Hồ sơ kết cấu & điện nước MEP hoàn chỉnh",
        "Bảng bóc tách vật tư chống phát sinh chi phí",
        "KTS giám sát tác giả các mốc đổ móng & sàn",
      ],
      btnText: "ĐĂNG KÝ HỒ SƠ THI CÔNG",
    },
  },
  lightbox: {
    btnConsult: "Tư vấn dự án này →",
  },
};

export function getLandingContent(locale: string): LandingContent {
  if (locale === "ja") return contentJa;
  if (locale === "en") return contentEn;
  return contentVi;
}


export interface GalleryProject {
  id: string;
  category: string;
  catTag: string;
  title: string;
  loc: string;
  narrative: string;
  img: string;
  specs: Array<{ k: string; v: string; highlight?: boolean }>;
  solution: string;
  materials: string;
  deliverables: string[];
  keyHighlights: Array<{ label: string; value: string }>;
}

export function getGalleryProjectsData(locale: string): Record<string, GalleryProject> {
  const isJa = locale === "ja";
  const isEn = locale === "en";

  return {
    "p-lakeside": {
      id: "p-lakeside",
      category: "villa",
      catTag: isJa ? "高級リゾートヴィラ" : isEn ? "LUXURY RETREAT VILLA" : "BIỆT THỰ NGHỈ DƯỠNG CAO CẤP",
      title: "THE LAKESIDE HORIZON VILLA",
      loc: isJa ? "ホーチャム · 850 m²" : isEn ? "Ho Tram • 850 m²" : "Hồ Tràm, Bà Rịa — Vũng Tàu",
      narrative: isJa
        ? "打ち放しコンクリートの質感と天然木ルーバーが調和する湖畔の別荘。太陽光シミュレーションにより、年間の微気候と通風を最適化。"
        : isEn
        ? "Lakeside villa balancing raw board-formed concrete and natural timber louvers, optimized for daylight and microclimatic airflow."
        : "Biệt thự ven hồ kết hợp tinh tế giữa bê tông trần mộc mạc và hệ lam gỗ thông gió tự nhiên. Toàn bộ phương án diễn họa 3D được mô phỏng đường đi ánh sáng mặt trời theo từng mùa trong năm để tối ưu vi khí hậu.",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90",
      solution: isJa
        ? "西日遮蔽のチーク材ルーバーとLow-E複層ガラス。湖からの卓越風を取り込む自然通風シミュレーション。"
        : isEn
        ? "Teak timber thermal louvers paired with Low-E glass, catching lake breezes for optimal natural ventilation."
        : "Hệ lam gỗ Teak biến tính cách nhiệt hướng Tây kết hợp kính Low-E cản nhiệt, đón gió hồ đối lưu tự nhiên quanh năm.",
      materials: isJa
        ? "杉板型枠打ち放しコンクリート、天然スレート石、耐候性屋外チークデッキ"
        : isEn
        ? "Board-formed architectural concrete, split-face natural slate, weather-treated outdoor teak"
        : "Bê tông trần áp khuôn vân gỗ, đá xám Slate chẻ tay tự nhiên, sàn gỗ Teak ngoài trời chống ẩm mốc.",
      deliverables: isJa
        ? ["8K CGパース一式", "意匠・構造・MEP図面", "詳細積算見積書(BOQ)", "VR 360°空間ウォークスルー"]
        : isEn
        ? ["8K Full CGI Perspectives", "Architecture, Structural & MEP", "Precise Itemized BOQ", "VR 360° Interactive Tour"]
        : ["Phối cảnh 8K CGI ngoại & nội thất", "Hồ sơ kỹ thuật Kiến trúc + Kết cấu + MEP", "Bảng bóc tách khối lượng BOQ 100%", "VR 360° thực tế ảo"],
      keyHighlights: [
        { label: isJa ? "設計期間" : isEn ? "Timeline" : "Thời Gian TK", value: "25–35 Ngày" },
        { label: isJa ? "特徴" : isEn ? "Highlight" : "Điểm Nhấn", value: isJa ? "インフィニティプール18m" : isEn ? "18m Horizon Pool" : "Hồ bơi tràn viền 18m" },
        { label: isJa ? "仕上げ" : isEn ? "Spec Grade" : "Hoàn Thiện", value: "Bespoke Luxury" },
        { label: isJa ? "施工整合性" : isEn ? "Accuracy" : "Sai Lệch", value: "0% Không sai lệch" },
      ],
      specs: [
        { k: isJa ? "延床面積" : isEn ? "Floor Area" : "Diện tích sàn", v: "850 m²" },
        { k: isJa ? "規模" : isEn ? "Scale" : "Quy mô", v: isJa ? "3階建 • 5寝室" : isEn ? "3 Levels • 5 Suites" : "3 Tầng • 5 PN" },
        { k: isJa ? "スタイル" : isEn ? "Style" : "Phong cách", v: isJa ? "モダン・トロピカル・ゼン" : isEn ? "Modern Tropical Zen" : "Modern Tropical Zen" },
        { k: isJa ? "施工整合性" : isEn ? "Accuracy" : "Mức độ khớp thực tế", v: isJa ? "100% 図面一致" : isEn ? "100% As-Built Match" : "100% Không sai lệch", highlight: true },
      ],
    },
    "p-stone": {
      id: "p-stone",
      category: "townhouse",
      catTag: isJa ? "都市型デザイン住宅" : isEn ? "URBAN RESIDENCE" : "NHÀ PHỐ KIẾN TRÚC",
      title: "MINIMALIST STONE HOUSE",
      loc: isJa ? "ダラット · 420 m²" : isEn ? "Da Lat • 420 m²" : "Đà Lạt • 420 m²",
      narrative: isJa
        ? "中央の吹き抜けライトウェルと天然石ブロックを融合させた4階建て住宅。静寂と自然光に包まれる上質な居住空間。"
        : isEn
        ? "4-story urban sanctuary centered around a skylit lightwell and monolithic stone elements, evoking enduring serenity."
        : "Nhà phố 4 tầng kết hợp giếng trời trung tâm và đá tự nhiên nguyên khối mang lại không gian sống tĩnh tại. Thiết kế đón sáng tự nhiên qua các khe lấy sáng nghệ thuật và giải pháp cách âm hoàn hảo.",
      img: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1800&q=80",
      solution: isJa
        ? "4層を貫通するスカイライトウェルによる光の拡散。都市部の騒音を遮断する多層防音・断熱構造。"
        : isEn
        ? "4-tier central skylit atrium distributing diffused daylight with multi-layer acoustic dampening."
        : "Giếng trời trung tâm 4 tầng khuếch tán ánh sáng tự nhiên với giải pháp cách âm & tiêu âm đa lớp.",
      materials: isJa
        ? "ダラット産天然玄武岩ブロック、燻蒸パイン材、特注防音複層ガラス"
        : isEn
        ? "Local basalt stone masonry, thermo-treated Da Lat pine, acoustic laminated glazing"
        : "Đá ong xám bazan nguyên khối, gỗ thông biến tính Đà Lạt, kính hộp cách âm chuyên dụng.",
      deliverables: isJa
        ? ["8K 室内外CGパース", "都市住宅実施設計図", "構造計算書＆積算内訳", "昼夜ライティング検証"]
        : isEn
        ? ["8K Exterior/Interior Renders", "Complete Working Drawings", "Structural Specs & BOQ", "Day/Night Lighting Analysis"]
        : ["Phối cảnh 8K chi tiết", "Hồ sơ thi công nhà phố hoàn chỉnh", "Bảng BOQ & tính toán kết cấu", "Mô phỏng chiếu sáng ngày/đêm"],
      keyHighlights: [
        { label: isJa ? "設計期間" : isEn ? "Timeline" : "Thời Gian TK", value: "20–30 Ngày" },
        { label: isJa ? "特徴" : isEn ? "Highlight" : "Điểm Nhấn", value: isJa ? "屋上禅ガーデン" : isEn ? "Rooftop Zen Garden" : "Vườn thiền Zen trên mái" },
        { label: isJa ? "仕上げ" : isEn ? "Spec Grade" : "Hoàn Thiện", value: "Minimalist High-end" },
        { label: isJa ? "施工整合性" : isEn ? "Accuracy" : "Sai Lệch", value: "0% Chuẩn kỹ thuật" },
      ],
      specs: [
        { k: isJa ? "延床面積" : isEn ? "Floor Area" : "Diện tích sàn", v: "420 m²" },
        { k: isJa ? "規模" : isEn ? "Scale" : "Quy mô", v: isJa ? "4階建 • 中庭ライトウェル" : isEn ? "4 Levels • Lightwell" : "4 Tầng • Giếng Trời" },
        { k: isJa ? "スタイル" : isEn ? "Style" : "Phong cách", v: isJa ? "ミニマリズム・ゼン" : isEn ? "Minimalist Zen" : "Minimalist Zen" },
        { k: isJa ? "施工整合性" : isEn ? "Accuracy" : "Mức độ khớp thực tế", v: isJa ? "100% 技術基準準拠" : isEn ? "100% Code Compliant" : "100% Chuẩn kỹ thuật", highlight: true },
      ],
    },
    "p-skyline": {
      id: "p-skyline",
      category: "penthouse",
      catTag: isJa ? "ペントハウス＆コンドミニアム" : isEn ? "PENTHOUSE & APARTMENT" : "PENTHOUSE & CĂN HỘ",
      title: "DUPLEX SKYLINE PENTHOUSE",
      loc: isJa ? "ハノイ · 350 m²" : isEn ? "Hanoi • 350 m²" : "Hà Nội • 350 m²",
      narrative: isJa
        ? "都市を一望するパノラマビューと6.5mの吹抜けを有する高級デュープレックス。ウォールナット材と繊細な間接照明の極み。"
        : isEn
        ? "Double-height luxury penthouse with panoramic city vistas, rich American walnut millwork, and nuanced indirect illumination."
        : "Căn hộ thông tầng cao cấp với tầm nhìn Panorama toàn thành phố, nội thất gỗ óc chó và hệ chiếu sáng gián tiếp tinh tế. Tối ưu hóa không gian sinh hoạt mở đẳng cấp thượng lưu.",
      img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80",
      solution: isJa
        ? "6.5mの吹抜け空間を活かした270度パノラマ採光。時間帯に応じたスマート間接照明サーカディアン設計。"
        : isEn
        ? "6.5m double-height volume with 270° daylight capture and circadian smart indirect lighting."
        : "Khoảng thông tầng kép cao 6.5m khai thác trọn vẹn tầm nhìn 270° với hệ chiếu sáng gián tiếp Circadian.",
      materials: isJa
        ? "北米産アメリカンウォールナットオイル仕上、カラカッタ大理石、イタリアンレザー"
        : isEn
        ? "American black walnut millwork, Calacatta marble slabs, imported Italian aniline leather"
        : "Gỗ óc chó Bắc Mỹ (American Walnut), đá cẩm thạch Calacatta nguyên tấm, da bò Ý cao cấp.",
      deliverables: isJa
        ? ["8K CGフォトリアリスティック", "家具特注詳細図面", "設備＆照明配線詳細図", "VR 360°リアルタイム鑑賞"]
        : isEn
        ? ["8K Photorealistic CG Package", "Custom Millwork Drawings", "MEP & Lighting Schedules", "Realtime VR 360° Exploration"]
        : ["Phối cảnh 8K nội thất siêu thực", "Bản vẽ chi tiết đồ gỗ & fixture", "Hồ sơ MEP & kịch bản ánh sáng", "Tour VR 360° tương tác"],
      keyHighlights: [
        { label: isJa ? "設計期間" : isEn ? "Timeline" : "Thời Gian TK", value: "20–25 Ngày" },
        { label: isJa ? "特徴" : isEn ? "Highlight" : "Điểm Nhấn", value: isJa ? "吹抜けパノラマ窓" : isEn ? "6.5m Panorama Wall" : "Vách kính thông tầng 6.5m" },
        { label: isJa ? "仕上げ" : isEn ? "Spec Grade" : "Hoàn Thiện", value: "Contemporary Luxury" },
        { label: isJa ? "施工整合性" : isEn ? "Accuracy" : "Sai Lệch", value: "0% Không sai lệch" },
      ],
      specs: [
        { k: isJa ? "延床面積" : isEn ? "Floor Area" : "Diện tích sàn", v: "350 m²" },
        { k: isJa ? "規模" : isEn ? "Scale" : "Quy mô", v: isJa ? "吹き抜け6.5m • 3寝室" : isEn ? "6.5m Atrium • 3 Bed" : "Thông Tầng 6.5m • 3 PN" },
        { k: isJa ? "スタイル" : isEn ? "Style" : "Phong cách", v: isJa ? "コンテンポラリー・ラグジュアリー" : isEn ? "Contemporary Luxury" : "Contemporary Luxury" },
        { k: isJa ? "施工整合性" : isEn ? "Accuracy" : "Mức độ khớp thực tế", v: isJa ? "100% 完全図面一致" : isEn ? "100% Zero Discrepancy" : "100% Không sai lệch", highlight: true },
      ],
    },
    "p-forest": {
      id: "p-forest",
      category: "resort",
      catTag: isJa ? "リゾート＆宿泊施設" : isEn ? "RESORT & HOSPITALITY" : "RESORT & NGHỈ DƯỠNG",
      title: "BOUTIQUE FOREST RETREAT",
      loc: isJa ? "バビ · 1,200 m²" : isEn ? "Ba Vi • 1,200 m²" : "Ba Vì • 1,200 m²",
      narrative: isJa
        ? "松林に抱かれたエコラグジュアリーリゾート。版築と自然木材を用い、地形と景観に溶け込む勾配屋根デザイン。"
        : isEn
        ? "Eco-hospitality retreat nestled under mature pine canopies, utilizing rammed earth and timber roofs contoured to natural slopes."
        : "Khu nghỉ dưỡng sinh thái nép mình dưới tán thông già, cấu trúc mái dốc mộc mạc hòa quyện hoàn hảo vào địa hình tự nhiên. Sử dụng vật liệu thân thiện môi trường đất nện và gỗ tái sinh.",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80",
      solution: isJa
        ? "傾斜地形を活かした杭基礎構造。既存松林の伐採をゼロに抑え、自然勾配に調和する低層配置。"
        : isEn
        ? "Stilt foundations honoring natural terrain slopes with zero pine tree clearing."
        : "Móng cọc nương theo triền dốc tự nhiên, bảo tồn 100% cây thông nguyên sinh, kết cấu hòa hợp địa hình.",
      materials: isJa
        ? "高密度版築壁、持続可能再生木材、苔むす自然石スレート瓦"
        : isEn
        ? "Compacted rammed earth walls, certified salvaged timber, natural stone moss tile"
        : "Tường đất nện đầm chặt cách nhiệt, gỗ tái sinh tự nhiên, mái ngói đá tự nhiên phủ rêu phong.",
      deliverables: isJa
        ? ["マスタープラン＆8K CG", "エコリゾート実施設計一式", "環境負荷評価＆BOQ", "屋外ランドスケープ詳細図"]
        : isEn
        ? ["Masterplan & 8K Perspectives", "Complete Resort Working Drawings", "Eco Impact Matrix & BOQ", "Landscape Master Detailing"]
        : ["Quy hoạch tổng thể & Render 8K", "Hồ sơ kỹ thuật thi công resort", "Bảng BOQ bóc tách toàn diện", "Bản vẽ cảnh quan rừng tự nhiên"],
      keyHighlights: [
        { label: isJa ? "設計期間" : isEn ? "Timeline" : "Thời Gian TK", value: "30–45 Ngày" },
        { label: isJa ? "特徴" : isEn ? "Highlight" : "Điểm Nhấn", value: isJa ? "樹冠キャノピーブリッジ" : isEn ? "Canopy Sky Walkway" : "Cầu gỗ xuyên tán rừng" },
        { label: isJa ? "仕上げ" : isEn ? "Spec Grade" : "Hoàn Thiện", value: "Eco Luxury Retreat" },
        { label: isJa ? "施工整合性" : isEn ? "Accuracy" : "Sai Lệch", value: "0% Chuẩn thi công" },
      ],
      specs: [
        { k: isJa ? "延床面積" : isEn ? "Floor Area" : "Diện tích sàn", v: "1,200 m²" },
        { k: isJa ? "規模" : isEn ? "Scale" : "Quy mô", v: isJa ? "8棟バンガロー" : isEn ? "8 Bungalows" : "8 Bungalow" },
        { k: isJa ? "スタイル" : isEn ? "Style" : "Phong cách", v: isJa ? "エコ・ラグジュアリー・リトリート" : isEn ? "Eco Luxury Retreat" : "Eco Luxury Retreat" },
        { k: isJa ? "施工整合性" : isEn ? "Accuracy" : "Mức độ khớp thực tế", v: isJa ? "100% 施工検証済み" : isEn ? "100% Build-Ready" : "100% Chuẩn thi công", highlight: true },
      ],
    },
    "p-komorebi": {
      id: "p-komorebi",
      category: "fnb",
      catTag: isJa ? "カフェ＆商業空間" : isEn ? "F&B & COMMERCIAL" : "KHÔNG GIAN F&B & CAFE",
      title: "KOMOREBI TEA HOUSE",
      loc: isJa ? "ホーチミン市 · 280 m²" : isEn ? "Ho Chi Minh City • 280 m²" : "TP. Hồ Chí Minh • 280 m²",
      narrative: isJa
        ? "木漏れ日と土壁、錦鯉の泳ぐ水盤が織りなす侘び寂びカフェ。スムーズな客席動線と話題性を両立した空間設計。"
        : isEn
        ? "Wabi-Sabi tea house concept celebrating dappled sunlight, earthen plaster, and reflection koi ponds for high guest engagement."
        : "Concept quán trà phong cách Wabi-Sabi với ánh sáng xuyên kẽ lá, vách đất mộc và hồ nước cá Koi tạo điểm check-in hút khách. Bố trí không gian lưu thông linh hoạt tối ưu hóa doanh thu.",
      img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1800&q=80",
      solution: isJa
        ? "木漏れ日を再現する格子天井と水盤による涼感演出。65席の回転率とスタッフ動線を徹底合理化。"
        : isEn
        ? "Dappled light ceiling screens with central koi reflection pool, streamlining circulation for 65 seats."
        : "Trần nan khuếch tán ánh sáng kẽ lá kết hợp hồ cá Koi tĩnh tâm, tối ưu hóa lối đi cho 65 chỗ ngồi.",
      materials: isJa
        ? "手仕事による藁入り土壁、古材チーク、黒那智砂利、黒皮鉄"
        : isEn
        ? "Handcrafted straw-lime plaster, reclaimed teak, polished black pebble, blackened steel"
        : "Vách đất trát rơm thủ công, gỗ mộc mạc tái sinh, sỏi cuội đen tự nhiên, thép đen mờ.",
      deliverables: isJa
        ? ["商空間8Kパース一式", "店舗内装＆カウンター詳細図", "集客動線計画＆設備図", "オープン前VRウォークスルー"]
        : isEn
        ? ["Commercial 8K Renders", "Bar & Seating Shop Drawings", "Operational Layout & MEP", "Pre-Opening Interactive VR"]
        : ["Bộ phối cảnh 8K thương mại", "Bản vẽ chi tiết quầy bar & nội thất", "Bản vẽ cấp thoát nước & thông gió", "VR 360° duyệt concept"],
      keyHighlights: [
        { label: isJa ? "設計期間" : isEn ? "Timeline" : "Thời Gian TK", value: "15–20 Ngày" },
        { label: isJa ? "特徴" : isEn ? "Highlight" : "Điểm Nhấn", value: isJa ? "錦鯉ウォーターガーデン" : isEn ? "Koi Zen Sanctuary" : "Hồ cá Koi check-in độc bản" },
        { label: isJa ? "仕上げ" : isEn ? "Spec Grade" : "Hoàn Thiện", value: "Authentic Wabi-Sabi" },
        { label: isJa ? "施工整合性" : isEn ? "Accuracy" : "Sai Lệch", value: "0% Đã khai trương" },
      ],
      specs: [
        { k: isJa ? "延床面積" : isEn ? "Floor Area" : "Diện tích sàn", v: "280 m²" },
        { k: isJa ? "規模" : isEn ? "Scale" : "Quy mô", v: isJa ? "客席65席 • 枯山水庭園" : isEn ? "65 Seats • Zen Garden" : "Sức Chứa 65 Chỗ • Vườn Zen" },
        { k: isJa ? "スタイル" : isEn ? "Style" : "Phong cách", v: isJa ? "侘び寂び × ジャパンディ" : isEn ? "Wabi-Sabi Japandi" : "Wabi-Sabi Japandi" },
        { k: isJa ? "施工整合性" : isEn ? "Accuracy" : "Mức độ khớp thực tế", v: isJa ? "実稼働オープン済み" : isEn ? "Operational & Built" : "Đã khai trương thực tế", highlight: true },
      ],
    },
    "p-tropical": {
      id: "p-tropical",
      category: "villa",
      catTag: isJa ? "トロピカル・モダン別荘" : isEn ? "TROPICAL VILLA" : "BIỆT THỰ NHIỆT ĐỚI",
      title: "THE TROPICAL COURTYARD VILLA",
      loc: isJa ? "ダナン · 620 m²" : isEn ? "Da Nang • 620 m²" : "Đà Nẵng • 620 m²",
      narrative: isJa
        ? "インフィニティプールがリビングを囲む中庭型ヴィラ。自然通風を最大化し、沿岸部特有の気候に美しく適応。"
        : isEn
        ? "Courtyard villa enveloped by an azure swimming pool, maximizing cross-ventilation adapted to the coastal tropical climate."
        : "Biệt thự sân trong với hồ bơi xanh ngắt bao quanh phòng khách, tối ưu hóa thông gió tự nhiên thích ứng hoàn hảo khí hậu miền Trung. Không gian sống đẳng cấp nghỉ dưỡng tại gia.",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80",
      solution: isJa
        ? "パティオを囲む開放回廊による沿岸海風の通風。熱帯性豪雨に対応する深庇と雨水集水デザイン。"
        : isEn
        ? "Deep shaded verandahs around central courtyard, driving sea breeze cooling and monsoon rainwater routing."
        : "Hành lang mở quanh sân trong đón gió biển đối lưu, mái hiên vươn xa chống nắng gắt và mưa bão miền Trung.",
      materials: isJa
        ? "クアンナム産砂岩、熱処理竹材パネル、撥水コンクリート"
        : isEn
        ? "Quang Nam sandstone masonry, carbonized bamboo slatting, hydrophobic polished concrete"
        : "Đá sa thạch Quảng Nam, nan tre carbon hóa chống mối, bê tông xoa mờ kháng muối biển.",
      deliverables: isJa
        ? ["8Kリゾートヴィラパース", "耐塩害構造＆設備図面一式", "詳細積算＆材料スペック表", "中庭植栽ランドスケープ計画"]
        : isEn
        ? ["8K Coastal Villa Perspectives", "Anti-Corrosion Structural/MEP", "Detailed Itemized BOQ", "Multi-Tier Tropical Landscape"]
        : ["Phối cảnh 8K biệt thự ven biển", "Hồ sơ kỹ thuật kết cấu kháng mặn", "Bảng BOQ bóc tách vật tư 100%", "Bản vẽ cảnh quan cây xanh"],
      keyHighlights: [
        { label: isJa ? "設計期間" : isEn ? "Timeline" : "Thời Gian TK", value: "25–35 Ngày" },
        { label: isJa ? "特徴" : isEn ? "Highlight" : "Điểm Nhấn", value: isJa ? "熱帯中庭＆プール" : isEn ? "Courtyard Lagoon" : "Sân trong nhiệt đới & hồ bơi" },
        { label: isJa ? "仕上げ" : isEn ? "Spec Grade" : "Hoàn Thiện", value: "Tropical Bespoke" },
        { label: isJa ? "施工整合性" : isEn ? "Accuracy" : "Sai Lệch", value: "0% Chuẩn kỹ thuật" },
      ],
      specs: [
        { k: isJa ? "延床面積" : isEn ? "Floor Area" : "Diện tích sàn", v: "620 m²" },
        { k: isJa ? "規模" : isEn ? "Scale" : "Quy mô", v: isJa ? "3階建 • 4寝室 • 中庭プール" : isEn ? "3 Levels • 4 Bed • Courtyard" : "3 Tầng • 4 PN • Sân Trong" },
        { k: isJa ? "スタイル" : isEn ? "Style" : "Phong cách", v: isJa ? "トロピカル・モダニズム" : isEn ? "Tropical Modernism" : "Tropical Modernism" },
        { k: isJa ? "施工整合性" : isEn ? "Accuracy" : "Mức độ khớp thực tế", v: isJa ? "100% 技術基準準拠" : isEn ? "100% Code Compliant" : "100% Chuẩn kỹ thuật", highlight: true },
      ],
    },
  };
}

export function getDeliverableCollections(locale: string) {
  const isJa = locale === "ja";
  const isEn = locale === "en";

  return [
    {
      id: 0,
      name: isJa ? "コレクション 01: 実施設計図面一式" : isEn ? "COLLECTION 01: TECHNICAL BLUEPRINTS" : "BỘ SƯU TẬP 01: HỒ SƠ BẢN VẼ KỸ THUẬT",
      photos: [
        {
          tag: isJa ? "A3総合平面図" : isEn ? "A3 MASTER FLOOR PLAN" : "BẢN VẼ MẶT BẰNG A3",
          title: isJa ? "01. 建築意匠平面図＆全体機能レイアウト" : isEn ? "01. Architectural floor plan & master circulation" : "01. Mặt bằng kiến trúc & bố trí công năng tổng thể",
          url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "構造設計標準" : isEn ? "STRUCTURAL STANDARDS" : "KẾT CẤU TIÊU CHUẨN",
          title: isJa ? "02. 基礎・梁・柱配筋詳細構造図" : isEn ? "02. Foundation & structural framing detail drawings" : "02. Bản vẽ chi tiết kết cấu thép móng & dầm sàn TCVN",
          url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "設備系統図（MEP）" : isEn ? "MEP ENGINEERING" : "SƠ ĐỒ HỆ THỐNG MEP",
          title: isJa ? "03. 給排水・強電弱電スマート設備系統図" : isEn ? "03. MEP plumbing, power & smart lighting schematics" : "03. Sơ đồ hệ thống MEP cấp thoát nước & điện thông minh",
          url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "マテリアル詳細納まり" : isEn ? "MATERIAL JOINERY" : "CHI TIẾT VẬT LIỆU",
          title: isJa ? "04. 外壁タイル・サッシ・建具詳細納まり図" : isEn ? "04. Cladding, glazing & interior finish detail sheets" : "04. Chi tiết cấu tạo ốp lát, trần thạch cao & cửa nhôm kính",
          url: "https://images.unsplash.com/photo-1504307651554-6691fc977b0c?auto=format&fit=crop&w=1200&q=85",
        },
      ],
    },
    {
      id: 1,
      name: isJa ? "コレクション 02: 8Kフォトリアル3Dパース" : isEn ? "COLLECTION 02: 8K PHOTOREALISTIC RENDERS" : "BỘ SƯU TẬP 02: PHỐI CẢNH 3D 8K SIÊU THỰC",
      photos: [
        {
          tag: isJa ? "外観パノラマ 8K" : isEn ? "8K EXTERIOR PANORAMA" : "NGOẠI THẤT 8K TOÀN CẢNH",
          title: isJa ? "01. 朝の自然光による外観メインファサードパース" : isEn ? "01. Morning sunlight facade perspective simulation" : "01. Phối cảnh mặt tiền biệt thự ánh sáng ban mai siêu thực",
          url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "トワイライト照明" : isEn ? "TWILIGHT LIGHTING" : "HOÀNG HÔN & ĐÊM",
          title: isJa ? "02. 夕景・夜景における建築化照明ムード演出" : isEn ? "02. Twilight & night architectural lighting mood scene" : "02. Phối cảnh ban đêm với kịch bản chiếu sáng gián tiếp tinh tế",
          url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "インテリア空間" : isEn ? "INTERIOR ARCHITECTURE" : "NỘI THẤT SANG TRỌNG",
          title: isJa ? "03. 吹き抜けリビング＆高級特注家具レイアウト" : isEn ? "03. Double-height living room & custom joinery visual" : "03. Không gian phòng khách thông tầng ngập tràn ánh sáng",
          url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "マテリアル近接描写" : isEn ? "MACRO TEXTURES" : "CHI TIẾT VẬT LIỆU CẬN CẢNH",
          title: isJa ? "04. 天然木・大理石・メタルの質感クローズアップ" : isEn ? "04. Close-up rendering of natural stone & walnut textures" : "04. Cận cảnh vân đá tự nhiên, gỗ óc chó và kính phản quang cao cấp",
          url: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85",
        },
      ],
    },
    {
      id: 2,
      name: isJa ? "コレクション 03: 2D・3D機能配置平面図" : isEn ? "COLLECTION 03: 2D & 3D FUNCTIONAL LAYOUTS" : "BỘ SƯU TẬP 03: MẶT BẰNG BỐ TRÍ CÔNG NĂNG",
      photos: [
        {
          tag: isJa ? "カラー機能平面図" : isEn ? "COLOR ZONING PLAN" : "MẶT BẰNG 2D MÀU",
          title: isJa ? "01. カラーゾーニング平面図・家具レイアウト" : isEn ? "01. Full-color functional layout & furniture footprint plan" : "01. Mặt bằng phối màu phân chia công năng khoa học",
          url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "等角投影3Dアイソメ" : isEn ? "3D ISOMETRIC VIEW" : "3D MẶT CẮT TẦNG",
          title: isJa ? "02. 階層別3Dアイソメトリック空間図" : isEn ? "02. 3D isometric cutaway view showing floor flow" : "02. Bản vẽ 3D bóc mái trực quan từng tầng",
          url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "通風・採光シミュレーション" : isEn ? "AIRFLOW & LIGHT" : "VI KHÍ HẬU & THÔNG GIÓ",
          title: isJa ? "03. 自然光の軌跡と風の抜け道解析図" : isEn ? "03. Microclimatic sun path and cross-ventilation diagram" : "03. Mô phỏng hướng nắng, hướng gió tự nhiên đón tài lộc",
          url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "動線最適化解析" : isEn ? "CIRCULATION FLOW" : "GIAO THÔNG SINH HOẠT",
          title: isJa ? "04. 家族の暮らしやすさを極めた動線設計図" : isEn ? "04. Ergonomic circulation analysis tailored to family lifestyle" : "04. Tối ưu khoảng cách di chuyển giữa các không gian chức năng",
          url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
        },
      ],
    },
    {
      id: 3,
      name: isJa ? "コレクション 04: 積算内訳書・マテリアル選定表" : isEn ? "COLLECTION 04: BILL OF QUANTITIES & ESTIMATES" : "BỘ SƯU TẬP 04: BẢNG BÓC TÁCH VẬT TƯ & DỰ TOÁN",
      photos: [
        {
          tag: isJa ? "積算内訳明細" : isEn ? "QUANTITY TAKEOFF" : "BẢNG BÓC TÁCH KHỐI LƯỢNG",
          title: isJa ? "01. 建築部材・構造材料の詳細数量積算明細書" : isEn ? "01. Itemized quantity takeoff for structural & raw materials" : "01. Bảng bóc tách khối lượng bê tông, cốt thép chuẩn xác 100%",
          url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "仕上仕様・品番指定" : isEn ? "FINISH SCHEDULE" : "ĐỊNH MỨC VẬT TƯ",
          title: isJa ? "02. 仕上建材のメーカー・品番・数量一覧表" : isEn ? "02. Material schedule with genuine manufacturer codes" : "02. Bảng định mức vật tư hoàn thiện & mã hiệu thương hiệu chính hãng",
          url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "大判タイル納まり規準" : isEn ? "FINISHING SPEC" : "QUY CHUẨN HOÀN THIỆN",
          title: isJa ? "03. 大判スラブタイル施工規準＆内装仕上詳細" : isEn ? "03. Large-format slab tile installation & interior joinery specs" : "03. Chi tiết quy cách ốp lát gạch khổ lớn & hoàn thiện nội thất",
          url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=85",
        },
        {
          tag: isJa ? "施工監理・検査基準" : isEn ? "SITE INSPECTION" : "NGHIỆM THU CÔNG TRÌNH",
          title: isJa ? "04. 各工程における設計監理および受入検査基準" : isEn ? "04. Quality assurance milestones and handover inspection criteria" : "04. Quy chuẩn giám sát tác giả và nghiệm thu các giai đoạn thi công",
          url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85",
        },
      ],
    },
  ];
}

export function getApplicationCards(locale: string): ApplicationCard[] {
  const isJa = locale === "ja";
  const isEn = locale === "en";

  return [
    {
      id: "app-bds",
      category: "bds",
      targetTag: isJa ? "不動産＆都市計画" : isEn ? "REAL ESTATE & PLANNING" : "BẤT ĐỘNG SẢN & QUY HOẠCH",
      num: "01",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      title: isJa
        ? "プレセール販売・広告・大規模不動産開発への応用"
        : isEn
        ? "Application in Presale Marketing & Real Estate Projects"
        : "Ứng Dụng Trong Mở Bán, Marketing & Dự Án BĐS",
      problemLabel: isJa ? "解決する課題＆ニーズ:" : isEn ? "CHALLENGE & NEEDS:" : "BÀI TOÁN & NHU CẦU THỰC TẾ:",
      problemText: isJa
        ? "着工前のプレセール販売や投資家へのプレゼンテーションに必要な大規模3DCGおよび映像素材を整備。"
        : isEn
        ? "Need high-resolution 3D renders and cinematic films for early presales and convincing investor decks."
        : "Cần tư liệu hình ảnh & phim 3D quy mô lớn để mở bán sớm (Presale), làm tài liệu truyền thông, thuyết phục nhà đầu tư và khách hàng trước khi xây.",
      checklist: [
        isJa ? "全体マスタープラン＆共用施設の8Kパース" : isEn ? "8K master plan & amenity perspective renders" : "Phối cảnh tổng thể quy hoạch & hệ tiện ích độ nét 8K",
        isJa ? "3Dアニメーション動画＆VR 360°バーチャルツアー" : isEn ? "3D cinematic animation & VR 360° interactive tours" : "Phim 3D Animation & Tour trải nghiệm thực tế ảo VR 360°",
        isJa ? "モデルルーム・住戸タイプ別CGパース一式" : isEn ? "Complete model suite & villa layout render packages" : "Bộ ảnh phối cảnh căn hộ mẫu, villa theo từng phân khu",
      ],
      outcomeLabel: isJa ? "もたらす成果:" : isEn ? "PROVEN IMPACT:" : "GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:",
      outcomeVal: isJa
        ? "プレセール成約スピード45%向上＆プロジェクト価値の最大化"
        : isEn
        ? "+45% faster presale conversions & enhanced project prestige"
        : "Tăng 45% tốc độ chốt cọc presale & nâng tầm định vị dự án",
    },
    {
      id: "app-kts",
      category: "kts",
      targetTag: isJa ? "建築・インテリア設計" : isEn ? "ARCHITECTURE & INTERIOR" : "THIẾT KẾ KIẾN TRÚC & NỘI THẤT",
      num: "02",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
      title: isJa
        ? "意匠プレゼン・建築コンペ・提案資料への応用"
        : isEn
        ? "Application in Architectural Proposals & Design Competitions"
        : "Ứng Dụng Trong Trình Bày Ý Tưởng & Đồ Án Kiến Trúc",
      problemLabel: isJa ? "解決する課題＆ニーズ:" : isEn ? "CHALLENGE & NEEDS:" : "BÀI TOÁN & NHU CẦU THỰC TẾ:",
      problemText: isJa
        ? "クライアントの即決承認や建築デザイン賞受賞のため、ハイエンドな編集基準のCG表現を必要とする場面に。"
        : isEn
        ? "Need editorial-standard visualization for fast client approvals or international architectural awards."
        : "Cần diễn họa chuẩn gu thẩm mỹ cao cấp (Editorial Standard) để khách hàng chốt duyệt nhanh phương án ý tưởng hoặc tham gia các giải thưởng kiến trúc.",
      checklist: [
        isJa ? "自然光の陰影とマテリアルの質感を実写レベルで描写" : isEn ? "Natural lighting simulation & photorealistic materials" : "Mô phỏng ánh sáng tự nhiên & chất cảm vật liệu siêu thực",
        isJa ? "CAD/BIM/Skpデータに基づく高精度モデリング" : isEn ? "Precision 3D modeling from CAD/BIM/SketchUp files" : "Dựng phối cảnh chuẩn xác theo file CAD/BIM/Skp",
        isJa ? "48〜72時間の厳格なマイルストーン納品体制" : isEn ? "Strict 48-72h milestone delivery guarantees" : "Đảm bảo tiến độ bàn giao nghiêm ngặt từng mốc 48h - 72h",
      ],
      outcomeLabel: isJa ? "もたらす成果:" : isEn ? "PROVEN IMPACT:" : "GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:",
      outcomeVal: isJa
        ? "CG制作時間を60%短縮＆クライアント承認率の大幅向上"
        : isEn
        ? "Save 60% rendering time & dramatically boost client approval rates"
        : "Tiết kiệm 60% thời gian render & nâng cao tỷ lệ duyệt phương án",
    },
    {
      id: "app-nha-thau",
      category: "nha-thau",
      targetTag: isJa ? "施工管理＆エンジニアリング" : isEn ? "CONSTRUCTION & ENGINEERING" : "THI CÔNG & QUẢN LÝ XÂY DỰNG",
      num: "03",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      title: isJa
        ? "施工手順・ディテール納まり・現場指示への応用"
        : isEn
        ? "Application in Technical Joint Detailing & Construction Phasing"
        : "Ứng Dụng Trong Khớp Nối Kỹ Thuật & Biện Pháp Thi Công",
      problemLabel: isJa ? "解決する課題＆ニーズ:" : isEn ? "CHALLENGE & NEEDS:" : "BÀI TOÁN & NHU CẦU THỰC TẾ:",
      problemText: isJa
        ? "2D図面の干渉や解釈ミスをなくし、施工現場の職人が一目で構造を把握できる3D図面を提供。"
        : isEn
        ? "Require 1:1 scale 3D blueprints matching technical dossiers so site teams immediately grasp joinery."
        : "Cần bản vẽ 3D chuẩn xác 1:1 với hồ sơ kỹ thuật để đội ngũ thợ hiểu ngay cấu tạo, giải quyết xung đột bản vẽ 2D và không bị đập sửa khi đang xây.",
      checklist: [
        isJa ? "構造接合部・納まりディテールの3D断面可視化" : isEn ? "3D structural joint simulations & detail cutaways" : "Mô phỏng 3D cấu tạo khớp nối & chi tiết kết cấu kỹ thuật",
        isJa ? "施工手順・仮設計画の直感的なパース解説" : isEn ? "Visual construction staging & logistics perspectives" : "Phối cảnh trực quan giải trình biện pháp thi công",
        isJa ? "設計図書と100%連動した建材積算数量の集計" : isEn ? "Material quantity takeoffs 100% matched to visuals" : "Bóc tách khối lượng vật tư khớp 100% với hình ảnh thực",
      ],
      outcomeLabel: isJa ? "もたらす成果:" : isEn ? "PROVEN IMPACT:" : "GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:",
      outcomeVal: isJa
        ? "現場手戻り・施工ミスを95%削減し予定通りの工期を遵守"
        : isEn
        ? "Eliminate 95% of on-site errors & guarantee on-time completion"
        : "Triệt tiêu 95% sai sót thi công & bàn giao công trình đúng tiến độ",
    },
    {
      id: "app-gia-chu",
      category: "gia-chu",
      targetTag: isJa ? "個人邸＆高級住宅" : isEn ? "PRIVATE RESIDENCE & VILLA" : "NHÀ Ở & BIỆT THỰ TƯ NHÂN",
      num: "04",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      title: isJa
        ? "住まいづくりの具現化・施主様の意思決定への応用"
        : isEn
        ? "Application in Shaping & Building Your Dream Home"
        : "Ứng Dụng Trong Định Hình & Xây Dựng Không Gian Sống",
      problemLabel: isJa ? "解決する課題＆ニーズ:" : isEn ? "CHALLENGE & NEEDS:" : "BÀI TOÁN & NHU CẦU THỰC TẾ:",
      problemText: isJa
        ? "高額な工事契約を結ぶ前に、日当たりや素材の質感を忠実に再現した未来の家を体験したいという願いに応えます。"
        : isEn
        ? "Wish to clearly experience future home lighting, textures, and dimensions before signing multi-million contracts."
        : "Muốn \"nhìn thấy trước ngôi nhà tương lai\" với ánh sáng, màu sắc và vật liệu thực tế trước khi đặt bút ký hợp đồng thi công tiền tỷ.",
      checklist: [
        isJa ? "外観から全居室まで住まい全体を忠実に可視化" : isEn ? "Visualize entire home from exterior facades to private suites" : "Trực quan hóa toàn bộ ngôi nhà từ ngoại thất đến từng góc phòng",
        isJa ? "複数マテリアル比較＆生活動線の最適シミュレーション" : isEn ? "Explore finishes & verify ergonomic zoning before construction" : "Thử nghiệm nhiều giải pháp vật liệu & tối ưu công năng phong thủy",
        isJa ? "完成イメージに忠実な詳細予算見積書の提示" : isEn ? "Transparent cost schedules strictly aligned with 3D models" : "Bảng dự toán chi phí chi tiết theo đúng thiết kế",
      ],
      outcomeLabel: isJa ? "もたらす成果:" : isEn ? "PROVEN IMPACT:" : "GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:",
      outcomeVal: isJa
        ? "100%納得のいく投資判断と、想定外の追加費用の完全排除"
        : isEn
        ? "100% peace of mind on investment & complete elimination of budget overruns"
        : "An tâm 100% khi chi tiền & loại bỏ hoàn toàn chi phí phát sinh",
    },
    {
      id: "app-hospitality",
      category: "hospitality",
      targetTag: isJa ? "リゾート＆ホテル＆飲食" : isEn ? "RESORT, HOTEL & F&B" : "RESORT, HOTEL & F&B",
      num: "05",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      title: isJa
        ? "ホテル・リゾート・飲食ブランド空間の演出への応用"
        : isEn
        ? "Application in Brand Identity for Resorts, Hotels & F&B"
        : "Ứng Dụng Trong Nhận Diện Không Gian Resort, Khách Sạn & F&B",
      problemLabel: isJa ? "解決する課題＆ニーズ:" : isEn ? "CHALLENGE & NEEDS:" : "BÀI TOÁN & NHU CẦU THỰC TẾ:",
      problemText: isJa
        ? "開業前に予約やメディア掲載を獲得するための、話題性のある象徴的空間コンセプトと高品質ビジュアルを構築。"
        : isEn
        ? "Need iconic architectural concepts that create viral appeal and premium assets for pre-launch bookings."
        : "Cần concept kiến trúc độc bản tạo điểm nhấn \"viral check-in\" và tư liệu hình ảnh cao cấp để làm truyền thông sớm, nhận booking trước khai trương.",
      checklist: [
        isJa ? "映画的アングルによる感動的な空間体験パース" : isEn ? "Cinematic perspectives capturing guest experiential journeys" : "Phối cảnh trải nghiệm không gian theo góc máy Cinematic",
        isJa ? "昼間の自然光と夜間のラグジュアリーな照明演出" : isEn ? "Daylight ambiance and evocative night gala lighting scenes" : "Mô phỏng ánh sáng ban ngày & không khí dạ tiệc ban đêm",
        isJa ? "WebやOTA予約サイトに直結する高解像度データ納品" : isEn ? "High-resolution media ready for websites & booking engines" : "Xuất file hình ảnh độ phân giải cao dùng ngay cho Website/OTA",
      ],
      outcomeLabel: isJa ? "もたらす成果:" : isEn ? "PROVEN IMPACT:" : "GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:",
      outcomeVal: isJa
        ? "オープン2ヶ月前からの先行PR展開＆開業時の満室達成"
        : isEn
        ? "Launch campaigns 2 months early & secure full occupancy on opening"
        : "Khai thác truyền thông sớm 2 tháng & lấp đầy phòng khi khai trương",
    },
    {
      id: "app-furniture",
      category: "furniture",
      targetTag: isJa ? "家具＆マテリアルカタログ" : isEn ? "FURNITURE & PRODUCT 3D" : "CATALOGUE & SẢN PHẨM NỘI THẤT",
      num: "06",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      title: isJa
        ? "家具・建材・インテリア製品カタログCGへの応用"
        : isEn
        ? "Application in 3D Product Catalogues & Material Specification"
        : "Ứng Dụng Trong Diễn Họa Catalogue & Sản Phẩm Nội Thất",
      problemLabel: isJa ? "解決する課題＆ニーズ:" : isEn ? "CHALLENGE & NEEDS:" : "BÀI TOÁN & NHU CẦU THỰC TẾ:",
      problemText: isJa
        ? "スタジオ撮影コストを削減し、新素材やカラーバリエーションの展開をCGで迅速にカタログ化。"
        : isEn
        ? "Need photorealistic 3D product visualization without expensive physical showroom photography."
        : "Cần hình ảnh sản phẩm nội thất sắc nét từng vân gỗ, đường may mà không phải tốn hàng trăm triệu thuê studio chụp ảnh thực tế.",
      checklist: [
        isJa ? "布地・レザー・金属の物理的質感を100%再現" : isEn ? "100% physical material PBR replication" : "Tái hiện 100% chất cảm vải nỉ, da bò, vân gỗ & kim loại",
        isJa ? "白バック単体カット＆洗練された空間コーディネート" : isEn ? "White-background studio shots and in-situ room scenes" : "Ảnh chụp phông trắng Isolated & Phối cảnh không gian thực tế",
        isJa ? "カラー・形状バリエーションの瞬時切り替え対応" : isEn ? "Instant colorways & material swatch configurations" : "Dễ dàng đổi màu sắc, mẫu mã chỉ với vài click chuột",
      ],
      outcomeLabel: isJa ? "もたらす成果:" : isEn ? "PROVEN IMPACT:" : "GIÁ TRỊ THỰC TẾ ĐẠT ĐƯỢC:",
      outcomeVal: isJa
        ? "カタログ制作費を70%圧縮し新製品投入サイクルを倍速化"
        : isEn
        ? "Cut catalog photography costs by 70% and expand product variations instantly"
        : "Tiết kiệm 70% chi phí chụp ảnh catalogue & ra mắt bộ sưu tập mới thần tốc",
    },
  ];
}

export function getDefaultApplicationCategories(locale: string): ApplicationCategoryItem[] {
  const isJa = locale === "ja";
  const isEn = locale === "en";
  return [
    { key: "bds", label: isJa ? "不動産＆マスタープラン" : isEn ? "Real Estate & Master Planning" : "Bất Động Sản & Quy Hoạch" },
    { key: "kts", label: isJa ? "建築＆インテリア設計" : isEn ? "Architecture & Interior Design" : "Thiết Kế Kiến Trúc & Nội Thất" },
    { key: "nha-thau", label: isJa ? "施工＆現場管理" : isEn ? "Construction & Engineering" : "Thi Công & Xây Dựng" },
    { key: "gia-chu", label: isJa ? "住宅＆高級ヴィラ" : isEn ? "Private Residential & Villas" : "Nhà Ở & Biệt Thự Tư Nhân" },
    { key: "hospitality", label: isJa ? "ホテル＆商業施設" : isEn ? "Hospitality, Hotel & F&B" : "Resort, Hotel & F&B" },
    { key: "furniture", label: isJa ? "家具＆建材カタログ" : isEn ? "Furniture & Material Catalogue" : "Catalogue & Sản Phẩm Nội Thất" },
  ];
}

export function getDefaultPartnerStats(locale: string): PartnerStatCard[] {
  const isJa = locale === "ja";
  const isEn = locale === "en";
  return [
    {
      id: "stat-1",
      num: "120+",
      name: isJa ? "ヴィラ＆高級レジデンス" : isEn ? "Luxury Villas & Residences" : "Biệt Thự & Villa Nghỉ Dưỡng",
      desc: isJa ? "国内外の個人施主様・富裕層住宅" : isEn ? "High-end private homeowners across prime locations" : "Gia chủ cao cấp tại TP.HCM, Hà Nội, Đà Lạt, Hồ Tràm, Phú Quốc",
    },
    {
      id: "stat-2",
      num: "45+",
      name: isJa ? "不動産開発・都市計画" : isEn ? "Real Estate & Urban Projects" : "Dự Án BĐS & Đô Thị",
      desc: isJa ? "プレセール販売促進およびマーケティング" : isEn ? "Developers, F1 agencies for presale & marketing" : "Chủ đầu tư, sàn phân phối F1 mở bán presale & marketing",
    },
    {
      id: "stat-3",
      num: "60+",
      name: isJa ? "建築設計事務所＆デザインスタジオ" : isEn ? "Architecture Studios & Firms" : "Studio & Văn Phòng KTS",
      desc: isJa ? "国際デザイン誌基準のCGパース委託パートナー" : isEn ? "Design partners outsourcing editorial-standard 3D renders" : "Đối tác thiết kế ủy thác diễn họa 3D chuẩn tạp chí quốc tế",
    },
    {
      id: "stat-4",
      num: "35+",
      name: isJa ? "リゾートホテル＆商業施設" : isEn ? "Resorts, Hotels & F&B Chains" : "Resort, Hotel & Chuỗi F&B",
      desc: isJa ? "独自の世界観を持つ空間コンセプトと高級飲食チェーン" : isEn ? "Iconic viral experiential concepts & luxury dining chains" : "Concept không gian check-in độc bản & chuỗi nhà hàng sang trọng",
    },
  ];
}

export function getDefaultPartnerBrands(locale: string): PartnerBrandItem[] {
  const isJa = locale === "ja";
  const isEn = locale === "en";
  return [
    {
      id: "brand-1",
      name: "MASTERISE HOMES",
      sub: isJa ? "高級不動産開発" : isEn ? "Luxury Real Estate" : "Bất động sản hạng sang",
      img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
      alt: "Masterise Homes",
    },
    {
      id: "brand-2",
      name: "NOVALAND GROUP",
      sub: isJa ? "都市＆リゾート" : isEn ? "Urban & Hospitality" : "Đô thị & Nghỉ dưỡng",
      img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
      alt: "Novaland Group",
    },
    {
      id: "brand-3",
      name: "COTECCONS",
      sub: isJa ? "総合建設" : isEn ? "General Contractor" : "Tổng thầu xây dựng",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      alt: "Coteccons",
    },
    {
      id: "brand-4",
      name: "HÒA BÌNH CORP",
      sub: isJa ? "建設コングロマリット" : isEn ? "Construction Group" : "Tập đoàn xây dựng",
      img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80",
      alt: "Hòa Bình Corp",
    },
    {
      id: "brand-5",
      name: "MIA DESIGN",
      sub: isJa ? "建築設計事務所" : isEn ? "Architectural Studio" : "Văn phòng kiến trúc",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
      alt: "MIA Design",
    },
    {
      id: "brand-6",
      name: "AN CƯỜNG WOOD",
      sub: isJa ? "インテリア建材" : isEn ? "Interior Materials" : "Vật liệu nội thất",
      img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80",
      alt: "An Cường Wood",
    },
  ];
}

export interface GalleryFilterTab {
  key: string;
  label: string;
}

export function getDefaultGalleryTabs(locale: string): GalleryFilterTab[] {
  const isJa = locale === "ja";
  const isEn = locale === "en";
  return [
    { key: "all", label: isJa ? "全作品 (06)" : isEn ? "All Works (06)" : "Tất cả công trình (06)" },
    { key: "villa", label: isJa ? "別荘・高級ヴィラ" : isEn ? "Villas & Estates" : "Biệt Thự (Villa)" },
    { key: "townhouse", label: isJa ? "都市型住宅・タウンハウス" : isEn ? "Townhouses" : "Nhà phố (Townhouse)" },
    { key: "penthouse", label: isJa ? "ペントハウス＆マンション" : isEn ? "Penthouses" : "Penthouse" },
    { key: "resort", label: isJa ? "リゾート＆宿泊施設" : isEn ? "Resorts & Hotels" : "Resort & Nghỉ dưỡng" },
    { key: "fnb", label: isJa ? "カフェ＆商業施設" : isEn ? "Commercial & F&B" : "F&B / Thương mại" },
  ];
}

export function getDefaultPricingTiers(locale: string): PricingTierItem[] {
  const isJa = locale === "ja";
  const isEn = locale === "en";

  return [
    {
      id: "tier1",
      badge: isJa ? "パース制作" : isEn ? "3D RENDERING" : "DIỄN HỌA 3D",
      name: isJa ? "プラン 01: 8K 3DCG 外観・内観パース" : isEn ? "Package 01: 8K 3D Exterior & Interior Renders" : "Gói 01: Diễn họa 3D Ngoại & Nội thất 8K",
      sub: isJa
        ? "図面やスケッチをもとに、高精細フォトリアルCGパースを迅速に制作。"
        : isEn
        ? "Ultra-photorealistic CGI rendering from your 2D plans, sketches, or 3D models."
        : "Diễn họa 3D không gian sống photorealistic từ bản vẽ 2D hoặc sketch ý tưởng của bạn.",
      price: isJa ? "180,000" : isEn ? "$1,200" : "1.800.000",
      unit: isJa ? "円〜 / アングル" : isEn ? "USD / View" : "VNĐ / Góc Cam",
      commitTime: isJa ? "納期: 5〜7営業日" : isEn ? "Timeline: 5-7 Business Days" : "Tiến độ: 5 - 7 ngày làm việc",
      commitSupport: isJa ? "修正: 2回まで無料" : isEn ? "Revisions: 2 Free Rounds" : "Chỉnh sửa: Miễn phí 2 lượt",
      features: isJa
        ? [
            "8K解像度納品（印刷・Web両対応）",
            "物理マテリアル＆昼夜光シミュレーション",
            "植栽・外構・環境光の精密合成",
            "マーケティング用データ提供",
          ]
        : isEn
        ? [
            "8K Print & Web Resolution Deliverables",
            "Physically Based Materials & Day/Night Lighting Simulation",
            "Precise Foliage, Hardscape & Ambient Photomontage",
            "Marketing-Ready High-Res Asset Files",
          ]
        : [
            "Bàn giao hình ảnh độ phân giải 8K siêu nét (chuẩn in ấn & web)",
            "Mô phỏng vật liệu PBR và ánh sáng ngày / đêm chuẩn vật lý",
            "Dựng chi tiết cây xanh, cảnh quan sân vườn & ánh sáng môi trường",
            "Cung cấp trọn bộ file chất lượng cao phục vụ truyền thông",
          ],
      btnText: isJa ? "プラン01を相談する" : isEn ? "Inquire Package 01" : "Tư vấn Gói 01",
      isFeatured: false,
    },
    {
      id: "tier2",
      badge: isJa ? "おすすめプラン" : isEn ? "RECOMMENDED" : "ĐƯỢC CHỌN NHIỀU NHẤT",
      name: isJa ? "プラン 02: 総合建築設計＆3Dビジュアル" : isEn ? "Package 02: Full Architectural Design & 3D Visual" : "Gói 02: Thiết kế Kiến trúc Toàn diện & 3D",
      sub: isJa
        ? "2D平面計画、8K CGパース、VRウォークスルーまで包括する標準プラン。"
        : isEn
        ? "Comprehensive standard package covering schematic 2D layout, 8K CGI, and interactive VR walkthrough."
        : "Quy hoạch mặt bằng 2D, phối cảnh 3D 8K toàn diện và tour thực tế ảo VR 360° tương tác.",
      price: isJa ? "450,000" : isEn ? "$3,800" : "250.000",
      unit: isJa ? "円〜 / プロジェクト" : isEn ? "USD / Project" : "VNĐ / m² Sàn",
      commitTime: isJa ? "納期: 10〜15営業日" : isEn ? "Timeline: 10-15 Business Days" : "Tiến độ: 10 - 15 ngày làm việc",
      commitSupport: isJa ? "サポート: 専任KTS伴走" : isEn ? "Support: Dedicated Principal Architect" : "Giám sát: KTS chủ trì đồng hành 1:1",
      features: isJa
        ? [
            "プラン01の全内容（外観・内観）を網羅",
            "動線最適化2D平面図・ゾーニング",
            "VR 360°空間ウォークスルーデータ",
            "マテリアル選定表＆カラーパレット付属",
          ]
        : isEn
        ? [
            "Includes all features of Package 01 (Exterior & Interior)",
            "Circulation-Optimized 2D Floor Plans & Functional Zoning",
            "Interactive VR 360° Walkthrough Data Access",
            "Comprehensive Material Specification Matrix & Color Palettes",
          ]
        : [
            "Bao gồm toàn bộ quyền lợi của Gói 01 (Cả ngoại thất & nội thất)",
            "Mặt bằng công năng 2D tối ưu vi khí hậu & giao thông",
            "Tour thực tế ảo VR 360° trải nghiệm không gian đa chiều",
            "Bảng chỉ định vật liệu hoàn thiện & moodboard màu sắc chi tiết",
          ],
      btnText: isJa ? "総合プランを申し込む" : isEn ? "Select Standard Plan" : "Đăng ký Gói Toàn Diện",
      isFeatured: true,
    },
    {
      id: "tier3",
      badge: isJa ? "フルパッケージ" : isEn ? "COMPLETE WORKING DOCS" : "HỒ SƠ THI CÔNG KỸ THUẬT",
      name: isJa ? "プラン 03: 実施設計図面・積算内訳書一式" : isEn ? "Package 03: Complete Construction Drawings & BOQ" : "Gói 03: Hồ sơ Thi công Kỹ thuật & Bóc tách BOQ",
      sub: isJa
        ? "本施工に必要な意匠・構造・MEP図面一式と正確な積算内訳書を作成。"
        : isEn
        ? "Full technical blueprint package including Architecture, Structure, MEP, and comprehensive itemized BOQ."
        : "Trọn bộ hồ sơ thiết kế kỹ thuật thi công hoàn chỉnh kèm bảng tiên lượng dự toán vật tư bóc tách 100%.",
      price: isJa ? "850,000" : isEn ? "$6,500" : "380.000",
      unit: isJa ? "円〜 / プロジェクト" : isEn ? "USD / Project" : "VNĐ / m² Sàn",
      commitTime: isJa ? "納期: 15〜20営業日" : isEn ? "Timeline: 15-20 Business Days" : "Tiến độ: 15 - 20 ngày làm việc",
      commitSupport: isJa ? "監理: 24時間技術サポート" : isEn ? "Supervision: Ongoing Site Technical Advisory" : "Tác quyền: Hỗ trợ giải đáp kỹ thuật thi công 24/7",
      features: isJa
        ? [
            "プラン02の全内容（設計＋3D＋VR）を網羅",
            "意匠・構造・設備（MEP）実施図面一式",
            "工期と部材コストを抑える詳細積算書",
            "重要ポイントでの技術監理サポート",
          ]
        : isEn
        ? [
            "Includes all features of Package 02 (Design + 3D + VR Tour)",
            "Complete Architectural, Structural & MEP Construction Blueprints",
            "Itemized Quantity Takeoff (BOQ) with Construction Cost Estimation",
            "On-Demand Site Technical Supervision & Milestone Quality Checks",
          ]
        : [
            "Bao gồm toàn bộ quyền lợi của Gói 02 (Thiết kế + 3D 8K + VR 360°)",
            "Hồ sơ bản vẽ kỹ thuật Kiến trúc + Kết cấu + Cơ điện (MEP) đầy đủ",
            "Bảng dự toán bóc tách khối lượng (BOQ) chi tiết tránh phát sinh chi phí",
            "Hỗ trợ giám sát tác giả và kiểm tra nghiệm thu các mốc kết cấu trọng yếu",
          ],
      btnText: isJa ? "実施設計プランを申し込む" : isEn ? "Get Construction Package" : "Đăng ký Gói Kỹ Thuật",
      isFeatured: false,
    },
  ];
}



