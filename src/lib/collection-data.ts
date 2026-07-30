export interface CollectionItem {
  slug: string;
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  cover: string;
  images: string[];
}

export const COLLECTIONS: CollectionItem[] = [
  {
    slug: "entrance",
    titleJa: "エントランス",
    titleEn: "Entrance",
    descJa: "訪れる人を最初に迎えるエントランス空間。光と素材の調和が、建物の第一印象を決定づけます。",
    descEn: "The entrance space that first greets visitors. The harmony of light and materials defines the building's first impression.",
    cover: "/uploads/collection-entrance.jpg",
    images: ["/uploads/collection-entrance-1.jpg", "/uploads/collection-entrance-2.jpg", "/uploads/collection-entrance-3.jpg"],
  },
  {
    slug: "bedroom",
    titleJa: "寝室",
    titleEn: "Bedroom",
    descJa: "安らぎと快適さを追求した寝室空間。柔らかな照明と上質な素材が、心地よい眠りを誘います。",
    descEn: "Bedroom spaces pursuing comfort and tranquility. Soft lighting and premium materials invite restful sleep.",
    cover: "/uploads/collection-bedroom.jpg",
    images: ["/uploads/collection-bedroom-1.jpg", "/uploads/collection-bedroom-2.jpg", "/uploads/collection-bedroom-3.jpg"],
  },
  {
    slug: "bathroom",
    titleJa: "浴室",
    titleEn: "Bathroom",
    descJa: "清潔感と高級感を両立したバスルーム。水と光の演出が、日常をスパのような体験に変えます。",
    descEn: "Bathrooms balancing cleanliness and luxury. Water and light transform daily routines into spa-like experiences.",
    cover: "/uploads/collection-bathroom.jpg",
    images: ["/uploads/collection-bathroom-1.jpg", "/uploads/collection-bathroom-2.jpg", "/uploads/collection-bathroom-3.jpg"],
  },
  {
    slug: "lobby",
    titleJa: "ロビー",
    titleEn: "Lobby",
    descJa: "開放感と格調を兼ね備えたロビー空間。スケール感と素材の質感で、特別な体験を演出します。",
    descEn: "Lobby spaces combining openness and dignity. Scale and material textures create special experiences.",
    cover: "/uploads/collection-lobby.jpg",
    images: ["/uploads/collection-lobby-1.jpg", "/uploads/collection-lobby-2.jpg", "/uploads/collection-lobby-3.jpg"],
  },
  {
    slug: "terrace",
    titleJa: "テラス",
    titleEn: "Terrace",
    descJa: "内と外をつなぐテラス空間。自然光と緑が調和した、開放的なリラクゼーションエリア。",
    descEn: "Terrace spaces connecting indoors and outdoors. Open relaxation areas harmonizing natural light and greenery.",
    cover: "/uploads/collection-terrace.jpg",
    images: ["/uploads/collection-terrace-1.jpg", "/uploads/collection-terrace-2.jpg", "/uploads/collection-terrace-3.jpg"],
  },
  {
    slug: "living",
    titleJa: "リビング",
    titleEn: "Living Room",
    descJa: "家族が集うリビング空間。広がりと温もりを感じるデザインで、暮らしの中心を彩ります。",
    descEn: "Living spaces where families gather. Designs with breadth and warmth color the center of daily life.",
    cover: "/uploads/collection-living.jpg",
    images: ["/uploads/collection-living-1.jpg", "/uploads/collection-living-2.jpg", "/uploads/collection-living-3.jpg"],
  },
];

export function getCollectionBySlug(slug: string): CollectionItem | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
