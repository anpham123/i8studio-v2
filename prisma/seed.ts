import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL || "file:./prisma/data/i8studio.db" } },
} as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Admin user
  const hashedPassword = await bcrypt.hash("admin123456", 12);
  await prisma.user.upsert({
    where: { email: "admin@i8studio.vn" },
    update: {},
    create: {
      email: "admin@i8studio.vn",
      password: hashedPassword,
      name: "i8 Studio Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created");

  // 2. Services
  const services = [
    {
      name: "3D CG Visualization",
      nameJa: "3DCGビジュアライゼーション",
      slug: "3dcg-visualization",
      description:
        "High-quality 3D computer graphics rendering for architectural visualization, product design, and marketing materials. We deliver photorealistic images that bring your projects to life.",
      descriptionJa:
        "建築ビジュアライゼーション、製品デザイン、マーケティング素材のための高品質3DCGレンダリング。プロジェクトをリアルに表現します。",
      icon: "Box",
      priceHint: "From ¥50,000",
      priceHintJa: "¥50,000〜",
      order: 1,
    },
    {
      name: "3D Animation",
      nameJa: "3Dアニメーション",
      slug: "3d-animation",
      description:
        "Stunning 3D animations for architectural walkthroughs, product showcases, and promotional videos. We create compelling motion content that engages your audience.",
      descriptionJa:
        "建築ウォークスルー、製品紹介、プロモーションビデオのための迫力ある3Dアニメーション。",
      icon: "Film",
      priceHint: "From ¥150,000",
      priceHintJa: "¥150,000〜",
      order: 2,
    },
    {
      name: "VR Experience",
      nameJa: "VRエクスペリエンス",
      slug: "vr-experience",
      description:
        "Immersive virtual reality experiences for real estate, architecture, and interior design. Let your clients explore spaces before they're built.",
      descriptionJa:
        "不動産、建築、インテリアデザインのための没入型VRエクスペリエンス。建設前にスペースを体験できます。",
      icon: "Glasses",
      priceHint: "From ¥300,000",
      priceHintJa: "¥300,000〜",
      order: 3,
    },
    {
      name: "BIM Services",
      nameJa: "BIMサービス",
      slug: "bim-services",
      description:
        "Building Information Modeling services for construction projects. We create detailed BIM models that streamline your construction workflow and reduce costs.",
      descriptionJa:
        "建設プロジェクトのためのBIMサービス。建設ワークフローを合理化しコストを削減する詳細なBIMモデルを作成します。",
      icon: "Building2",
      priceHint: "From ¥100,000",
      priceHintJa: "¥100,000〜",
      order: 4,
    },
    {
      name: "Pachinko & Slot CG",
      nameJa: "パチンコ・スロットCG",
      slug: "pachinko-slot-cg",
      description:
        "Specialized CG content for pachinko and slot machine manufacturers. High-impact visuals designed for gaming environments with tight deadlines.",
      descriptionJa:
        "パチンコ・スロットメーカー向けの専門CGコンテンツ。ゲーム環境向けの高インパクトビジュアル。",
      icon: "Gamepad2",
      priceHint: "Contact for pricing",
      priceHintJa: "お問い合わせください",
      order: 5,
    },
    {
      name: "Anime & Illustration",
      nameJa: "アニメ・イラスト",
      slug: "anime-illustration",
      description:
        "Professional anime-style illustrations and animations for Japanese market. From character design to full animation sequences for games and media.",
      descriptionJa:
        "日本市場向けのプロフェッショナルなアニメスタイルのイラストとアニメーション。",
      icon: "Sparkles",
      priceHint: "From ¥30,000",
      priceHintJa: "¥30,000〜",
      order: 6,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log("✅ Services created");

  // 3. Slides
  const slides = [
    {
      title: "ELEVATE YOUR BUSINESS WITH PHOTOREAL",
      titleJa: "フォトリアルで ビジネスを 飛躍させよう",
      subtitle:
        "High-quality 3DCG, Animation, VR & BIM for Japanese architecture market",
      subtitleJa:
        "日本の建築市場向けの高品質3DCG・アニメーション・VR・BIMサービス",
      gradient: "from-blue-900 via-purple-900 to-slate-900",
      order: 1,
      active: true,
    },
    {
      title: "HIGH QUALITY LOW PRICE",
      titleJa: "高品質・低価格",
      subtitle:
        "Professional CG outsourcing from Vietnam — trusted by 50+ Japanese companies",
      subtitleJa:
        "ベトナムからのプロCGアウトソーシング — 50社以上の日本企業が信頼",
      gradient: "from-slate-900 via-blue-950 to-indigo-900",
      order: 2,
      active: true,
    },
    {
      title: "SUPPORT YOUR IDEAS",
      titleJa: "あなたのアイデアを サポートします",
      subtitle:
        "From concept to delivery — fast turnaround, NDA available, flexible workflow",
      subtitleJa:
        "コンセプトから納品まで — 迅速な対応、NDA対応、柔軟なワークフロー",
      gradient: "from-indigo-900 via-violet-900 to-purple-900",
      order: 3,
      active: true,
    },
  ];

  for (const slide of slides) {
    await prisma.slide.create({ data: slide });
  }
  console.log("✅ Slides created");

  // 4. Q&A
  const qas = [
    {
      question: "What is the minimum order for 3DCG rendering?",
      questionJa: "3DCGレンダリングの最低注文数は？",
      answer:
        "We accept orders of any size, from a single image to large-scale projects. For single images, pricing starts from ¥50,000 depending on complexity.",
      answerJa:
        "1枚の画像から大規模プロジェクトまで、あらゆる規模の注文を受け付けています。単一画像の場合、複雑さに応じて¥50,000から。",
      order: 1,
    },
    {
      question: "How long does a typical project take?",
      questionJa: "通常のプロジェクトはどれくらいかかりますか？",
      answer:
        "Turnaround time depends on the scope of work. A single 3DCG image typically takes 3-5 business days. Animation projects range from 2-4 weeks. Rush delivery is available.",
      answerJa:
        "納期は作業範囲によります。3DCG単一画像は通常3〜5営業日。アニメーションプロジェクトは2〜4週間。特急対応も可能です。",
      order: 2,
    },
    {
      question: "Do you sign NDAs?",
      questionJa: "NDAに署名していただけますか？",
      answer:
        "Yes, we sign NDAs upon request. We take confidentiality seriously and all project files and client information are handled with strict security protocols.",
      answerJa:
        "はい、ご要望に応じてNDAに署名します。守秘義務を重視し、すべてのプロジェクトファイルとクライアント情報は厳格なセキュリティプロトコルで管理されます。",
      order: 3,
    },
    {
      question: "What file formats do you accept and deliver?",
      questionJa: "対応・納品ファイル形式は？",
      answer:
        "We accept: DWG, SKP, RVT, OBJ, FBX, and most 3D formats. We deliver: PNG, JPEG, TIFF (images), MP4, MOV (video), and FBX/OBJ (3D models).",
      answerJa:
        "受付形式：DWG、SKP、RVT、OBJ、FBX他。納品形式：PNG、JPEG、TIFF（画像）、MP4、MOV（動画）、FBX/OBJ（3Dモデル）。",
      order: 4,
    },
    {
      question: "How many revision rounds are included?",
      questionJa: "修正は何回まで含まれますか？",
      answer:
        "Standard projects include 2 rounds of revisions. Additional revisions can be arranged at a reasonable cost. We recommend a detailed brief upfront to minimize revisions.",
      answerJa:
        "標準プロジェクトには2回の修正が含まれます。追加修正は合理的なコストで対応可能。修正を最小化するため、詳細なブリーフを事前にお勧めします。",
      order: 5,
    },
    {
      question: "Do you offer VR development for real estate?",
      questionJa: "不動産向けVR開発は行っていますか？",
      answer:
        "Yes, we specialize in VR experiences for real estate and architecture. We create interactive walkthroughs compatible with Oculus, HTC Vive, and web-based VR.",
      answerJa:
        "はい、不動産・建築向けVRエクスペリエンスを専門としています。Oculus、HTC Vive、Webベースに対応したインタラクティブなウォークスルーを作成します。",
      order: 6,
    },
    {
      question: "What is your payment method?",
      questionJa: "支払い方法は？",
      answer:
        "We accept bank transfers (Japanese banks supported), PayPal, and Wise. For new clients, we typically require 50% upfront with the balance on delivery.",
      answerJa:
        "銀行振込（日本の銀行対応）、PayPal、Wiseに対応。新規クライアントは通常、着手金50%・納品時残金の支払い方式です。",
      order: 7,
    },
  ];

  for (const qa of qas) {
    await prisma.qA.create({ data: qa });
  }
  console.log("✅ Q&A items created");

  // 5. Works
  const works = [
    {
      title: "HOUSE forest",
      titleJa: "森のある家",
      subtitle: "Residential 3DCG Visualization",
      category: "3DCG",
      order: 1,
      featured: true,
    },
    {
      title: "HOTEL curver",
      titleJa: "カーブホテル",
      subtitle: "Hospitality Architecture Rendering",
      category: "3DCG",
      order: 2,
      featured: true,
    },
    {
      title: "HOTEL sidewalk",
      titleJa: "サイドウォークホテル",
      subtitle: "Urban Hotel Exterior Visualization",
      category: "3DCG",
      order: 3,
      featured: false,
    },
    {
      title: "Temple Kinkakuji",
      titleJa: "金閣寺",
      subtitle: "Cultural Heritage 3D Recreation",
      category: "3DCG",
      order: 4,
      featured: true,
    },
    {
      title: "HOUSE bathroom",
      titleJa: "バスルームのある家",
      subtitle: "Interior Visualization",
      category: "3DCG",
      order: 5,
      featured: false,
    },
    {
      title: "SAUNA wooden",
      titleJa: "木のサウナ",
      subtitle: "Wellness Facility Visualization",
      category: "3DCG",
      order: 6,
      featured: false,
    },
  ];

  for (const work of works) {
    await prisma.work.create({ data: work });
  }
  console.log("✅ Works created");

  // 6. Testimonials
  const testimonials = [
    {
      clientName: "Tanaka Hiroshi",
      clientTitle: "Design Director",
      clientCompany: "Tanaka Architects Co., Ltd.",
      quote:
        "i8 Studio has been our trusted CG partner for 3 years. Their quality is consistently excellent, and they always meet tight deadlines. Highly recommended for Japanese companies looking for reliable outsourcing.",
      quoteJa:
        "i8スタジオは3年間、信頼できるCGパートナーです。品質は常に優れており、タイトな納期も必ず守ってくれます。信頼できるアウトソーシングをお探しの日本企業に強くお勧めします。",
      rating: 5,
      featured: true,
      order: 1,
    },
    {
      clientName: "Suzuki Kenji",
      clientTitle: "Project Manager",
      clientCompany: "Suzuki Development Group",
      quote:
        "The VR walkthrough they created for our luxury condominium project impressed all our clients. The level of detail and realism exceeded our expectations. We will definitely use i8 Studio again.",
      quoteJa:
        "高級マンションプロジェクト向けに作成していただいたVRウォークスルーは、すべてのクライアントを感動させました。詳細さとリアリティのレベルは期待を超えていました。",
      rating: 5,
      featured: true,
      order: 2,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log("✅ Testimonials created");

  // 7. Partners
  const partners = [
    { name: "Tanaka Architects", order: 1, active: true },
    { name: "Tokyo Design Studio", order: 2, active: true },
    { name: "Osaka Real Estate Group", order: 3, active: true },
    { name: "Kyoto Heritage Foundation", order: 4, active: true },
    { name: "Hokkaido Development Co.", order: 5, active: true },
  ];

  for (const partner of partners) {
    await prisma.partner.create({ data: partner });
  }
  console.log("✅ Partners created");

  // 8. Settings
  const settings = [
    { key: "companyName", value: "i8 STUDIO" },
    { key: "companyNameJa", value: "i8スタジオ" },
    { key: "email", value: "info@i8studio.vn" },
    { key: "phone", value: "0914 049 090" },
    { key: "address", value: "Da Nang, Vietnam" },
    { key: "addressJa", value: "ベトナム・ダナン" },
    { key: "lineUrl", value: "" },
    { key: "chatworkUrl", value: "" },
    { key: "foundedYear", value: "2019" },
    { key: "socialFacebook", value: "" },
    { key: "socialInstagram", value: "" },
    { key: "socialLinkedin", value: "" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("✅ Settings created");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
