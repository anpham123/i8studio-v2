import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sample blog post...");

  const sections = [
    {
      type: "checkcam",
      num: "01",
      eyebrow: "Check Cam",
      eyebrowBadge: "アングル確認",
      title: "Camera Angle Exploration<br>最適なアングルの選定",
      body: [
        "プロジェクト開始時、私たちはまず<strong>複数のカメラアングル</strong>を検討します。建物の最も魅力的な角度を見つけるため、5〜10のアングルバリエーションを作成します。",
        "クライアントとの協議を経て、最終的な視点を決定。<strong>光の入射角</strong>と<strong>建物のプロポーション</strong>を最大限に活かすアングルを選びます。",
      ],
      image: "",
      grid: [
        { label: "CAM A — 正面", image: "" },
        { label: "CAM B — 斜め45°", image: "" },
        { label: "CAM C — ローアングル", image: "" },
        { label: "CAM D — 俯瞰", image: "" },
        { label: "CAM E — 採用", image: "" },
      ],
      tags: {
        label: "確認できること",
        ok: ["構図バランス", "光の方向", "遠近感", "スケール感"],
        ng: ["マテリアル未設定", "植栽なし", "人物未配置"],
      },
    },
    {
      type: "stage",
      num: "02",
      eyebrow: "Render v1",
      eyebrowBadge: "レンダリング v1",
      title: "First Render Pass<br>初回レンダリング",
      body: [
        "選定されたアングルから、最初のレンダリングを行います。この段階では<strong>基本的なマテリアルとライティング</strong>を設定し、全体の雰囲気を確認します。",
        "クライアントからのフィードバックを基に、色味、明るさ、素材感の調整方向を決定します。",
      ],
      image: "",
      reverse: false,
      caption: "初回レンダリング — 基本マテリアル + 自然光シミュレーション",
      tags: {
        ok: ["ライティング設定完了", "基本マテリアル適用", "構図確定"],
        ng: ["ディテール不足", "植栽配置前", "ポストプロセス未適用"],
      },
    },
    {
      type: "stage",
      num: "03",
      eyebrow: "Render v2",
      eyebrowBadge: "レンダリング v2",
      title: "Refined Render<br>精密レンダリング",
      body: [
        "v1のフィードバックを反映し、<strong>ディテールの追加</strong>と<strong>マテリアルの精緻化</strong>を行います。植栽、人物、車両などの環境要素を配置します。",
        "ポストプロダクションでは、色調補正とアトモスフェリック効果を適用し、<strong>フォトリアリスティックな品質</strong>を目指します。",
      ],
      image: "",
      reverse: true,
      caption: "v2レンダリング — 全要素配置 + ポストプロダクション適用",
      tags: {
        ok: ["フルディテール", "環境配置完了", "ポストプロセス適用", "色調最終調整"],
        ng: ["微調整必要箇所あり"],
      },
    },
    {
      type: "insight",
      num: "04",
      eyebrow: "",
      title: "品質へのこだわり —<br>What Defines Quality",
      body: [
        "建築CGの品質は、単なる技術力だけでなく、<strong>クライアントのビジョンを正確に理解し、それを視覚的に表現する能力</strong>にかかっています。",
        "私たちは各プロジェクトにおいて、3〜5回の修正サイクルを設け、クライアントが100%満足するまで品質を追求します。このプロセスこそが、<strong>50社以上の日本企業から継続的に信頼される理由</strong>です。",
      ],
    },
  ];

  await prisma.blogPost.upsert({
    where: { slug: "mastering-architectural-cg-process" },
    update: {},
    create: {
      slug: "mastering-architectural-cg-process",
      category: "制作プロセス / ArchViz",
      eyebrow: "Process Case Study · 2026",
      title: "Mastering the Art of<br>Architectural CG",
      titleJp: "建築CGの制作プロセス",
      subtitle: "一枚のCGパースが完成するまでの制作工程を、カメラアングルの選定からファイナルレンダリングまで詳しくご紹介します。",
      heroImage: "",
      introDropcap: "A建築CGの制作は、単なるレンダリング作業ではありません。<strong>クライアントのビジョン</strong>を視覚的に具現化する、創造的なプロセスです。私たちi8 STUDIOでは、日本の建築市場向けに特化した高品質なCGを制作しています。",
      introPullquote: "完成は、引き算からはじまる。余計なものを削ぎ落とし、本質だけを残すことで、建築の美しさが際立つ。",
      sections: JSON.stringify(sections),
      insightHeading: "なぜ日本企業が<br>i8 STUDIOを選ぶのか",
      insightBody: "日本品質の基準を理解し、ベトナムのコスト競争力を活かす — この二つの強みの組み合わせこそが、私たちが<strong>50社以上の日本企業</strong>から選ばれ続ける理由です。NDA対応、日本語コミュニケーション、そして妥協のない品質追求。",
      excerpt: "一枚のCGパースが完成するまでの制作工程を、カメラアングルの選定からファイナルレンダリングまで詳しくご紹介します。",
      coverImage: "",
      author: "i8 STUDIO",
      authorRole: "Creative Team",
      readTime: 8,
      isPublished: true,
      isFeatured: true,
      locale: "ja",
    },
  });

  // Also create an English version
  await prisma.blogPost.upsert({
    where: { slug: "mastering-architectural-cg-process-en" },
    update: {},
    create: {
      slug: "mastering-architectural-cg-process-en",
      category: "Production Process / ArchViz",
      eyebrow: "Process Case Study · 2026",
      title: "Mastering the Art of<br>Architectural CG",
      titleJp: "",
      subtitle: "A detailed look at our CG production process, from camera angle exploration to final rendering.",
      heroImage: "",
      introDropcap: "AArchitectural CG production is more than just rendering. It's a <strong>creative process</strong> that brings a client's vision to visual reality. At i8 STUDIO, we specialize in high-quality CG tailored for the Japanese architecture market.",
      introPullquote: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
      sections: JSON.stringify(sections),
      insightHeading: "Why Japanese Companies<br>Choose i8 STUDIO",
      insightBody: "Understanding Japanese quality standards while leveraging Vietnam's cost competitiveness — this combination is why <strong>50+ Japanese companies</strong> continue to choose us. NDA compliance, Japanese communication, and uncompromising quality.",
      excerpt: "A detailed look at our CG production process, from camera angle exploration to final rendering.",
      coverImage: "",
      author: "i8 STUDIO",
      authorRole: "Creative Team",
      readTime: 8,
      isPublished: true,
      isFeatured: true,
      locale: "en",
    },
  });

  console.log("✅ Blog posts seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
