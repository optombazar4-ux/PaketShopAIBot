import { GoogleGenerativeAI } from '@google/generative-ai';
import { WooCommerceProduct } from './woocommerce';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not set. AI recommendations will not work.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface AIRecommendation {
  productIds: number[];
  message: string;
  notFound?: boolean;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async getRecommendations(
    userQuery: string,
    products: WooCommerceProduct[]
  ): Promise<AIRecommendation> {
    if (!GEMINI_API_KEY) {
      return {
        productIds: [],
        message: 'AI xizmati hozirda ishlamayapti. Iltimos, katalogdan qo\'lda tanlang.',
        notFound: true,
      };
    }

    try {
      const systemPrompt = this.buildSystemPrompt(products);
      const fullPrompt = `${systemPrompt}\n\nMijoz so'rovi: "${userQuery}"\n\nJavob:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      console.log('Gemini AI Response:', text);

      return this.parseAIResponse(text, products);
    } catch (error: any) {
      console.error('Gemini API Error:', error.message);
      return {
        productIds: [],
        message: 'AI hozircha javob bera olmadi. Iltimos, standart katalogdan foydalaning.',
        notFound: true,
      };
    }
  }

  private buildSystemPrompt(products: WooCommerceProduct[]): string {
    const productsJSON = products
      .filter(p => p.stock_status === 'instock')
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.short_description || p.description,
        categories: p.categories.map(c => c.name).join(', '),
      }));

    return `Sen PaketShop.uz do'konining professional savdo maslahatchisisisan. Mijozlarga mahsulot tanlashda yordam berasan.

QOIDALAR:
1. FAQAT quyidagi JSON ro'yxatidagi mahsulotlarni tavsiya qil
2. Agar mijoz so'rovi bo'yicha mos mahsulot yo'q bo'lsa, "TOPILMADI" deb javob ber
3. Javobingni quyidagi formatda ber:

MAHSULOT ID LARI: [123, 456, 789]
XABAR: [Mijozga do'stona xabar]

MAVJUD MAHSULOTLAR:
${JSON.stringify(productsJSON, null, 2)}

MISOLLAR:

Mijoz so'rovi: "Menga yaxshi telefon kerak, 5 milliongacha"
Javob:
MAHSULOT ID LARI: [101, 205]
XABAR: Sizga 5 million so'm gacha bo'lgan eng yaxshi telefonlarni tavsiya qilaman. Samsung va Xiaomi modellarini ko'rib chiqishingizni maslahat beraman.

Mijoz so'rovi: "Menga olma kerak"
Javob:
MAHSULOT ID LARI: []
XABAR: Kechirasiz, bizda oziq-ovqat mahsulotlari yo'q. Biz elektronika do'konimiz. Sizga telefon, noutbuk yoki boshqa texnika kerakmi?`;
  }

  private parseAIResponse(text: string, products: WooCommerceProduct[]): AIRecommendation {
    const lines = text.split('\n');
    let productIds: number[] = [];
    let message = '';

    for (const line of lines) {
      if (line.includes('MAHSULOT ID LARI:') || line.includes('PRODUCT IDS:')) {
        const idsMatch = line.match(/\[([\d,\s]+)\]/);
        if (idsMatch) {
          productIds = idsMatch[1]
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id) && products.some(p => p.id === id));
        }
      } else if (line.includes('XABAR:') || line.includes('MESSAGE:')) {
        message = line.split(/XABAR:|MESSAGE:/)[1]?.trim() || '';
      } else if (line.includes('TOPILMADI') || line.includes('NOT FOUND')) {
        return {
          productIds: [],
          message: message || 'Kechirasiz, sizning so\'rovingiz bo\'yicha mahsulot topilmadi. Iltimos, katalogdan ko\'rib chiqing.',
          notFound: true,
        };
      }
    }

    // If we couldn't parse, extract message from response
    if (!message && text.length > 0) {
      message = text.replace(/MAHSULOT ID LARI:.*?\n?/gi, '').replace(/\[.*?\]/g, '').trim();
    }

    // Default message if empty
    if (!message && productIds.length > 0) {
      message = `Sizga ${productIds.length} ta mahsulot tavsiya qilaman. Pastdagi tugmalarni bosib batafsil ko'ring.`;
    }

    return {
      productIds,
      message: message || 'Mahsulotlar topildi.',
      notFound: productIds.length === 0,
    };
  }
}

export const geminiService = new GeminiService();
