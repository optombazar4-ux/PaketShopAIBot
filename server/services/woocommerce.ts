import axios from 'axios';

const WC_URL = process.env.WOOCOMMERCE_URL || 'https://paketshop.uz';
const WC_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

const wcApi = axios.create({
  baseURL: `${WC_URL}/wp-json/wc/v3`,
  auth: {
    username: WC_CONSUMER_KEY,
    password: WC_CONSUMER_SECRET,
  },
  timeout: 10000,
});

export interface WooCommerceProduct {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  images: Array<{ src: string; alt: string }>;
  categories: Array<{ id: number; name: string }>;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  stock_quantity: number | null;
}

export interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  lineItems: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export class WooCommerceService {
  async getProducts(params?: {
    search?: string;
    category?: string;
    per_page?: number;
    page?: number;
  }): Promise<WooCommerceProduct[]> {
    try {
      const response = await wcApi.get('/products', {
        params: {
          per_page: params?.per_page || 100,
          page: params?.page || 1,
          search: params?.search,
          category: params?.category,
          status: 'publish',
          _fields: 'id,name,price,regular_price,sale_price,description,short_description,images,categories,stock_status,stock_quantity',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('WooCommerce API Error (getProducts):', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw new Error('Katalog bilan texnik nosozlik. Tez orada tuzatamiz.');
    }
  }

  async getProductById(id: number): Promise<WooCommerceProduct | null> {
    try {
      const response = await wcApi.get(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`WooCommerce API Error (getProductById ${id}):`, error.message);
      return null;
    }
  }

  async createOrder(orderData: CreateOrderData): Promise<any> {
    try {
      // Re-validate stock before creating order
      for (const item of orderData.lineItems) {
        const product = await this.getProductById(item.product_id);
        if (!product || product.stock_status === 'outofstock') {
          throw new Error(`Mahsulot (ID: ${item.product_id}) tugagan yoki topilmadi.`);
        }
        if (product.stock_quantity !== null && product.stock_quantity < item.quantity) {
          throw new Error(`Mahsulot (${product.name}) uchun yetarli miqdor yo'q. Mavjud: ${product.stock_quantity}`);
        }
      }

      const orderPayload = {
        status: 'on-hold',
        payment_method: 'cod',
        payment_method_title: 'Yetkazib berganda to\'lash',
        set_paid: false,
        billing: {
          first_name: orderData.customerName,
          phone: orderData.customerPhone,
          address_1: orderData.customerAddress,
        },
        shipping: {
          first_name: orderData.customerName,
          phone: orderData.customerPhone,
          address_1: orderData.customerAddress,
        },
        line_items: orderData.lineItems,
        meta_data: [
          {
            key: '_order_source',
            value: 'Telegram Bot - AI Assistant',
          },
        ],
      };

      const response = await wcApi.post('/orders', orderPayload);
      console.log('Order created successfully:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('WooCommerce API Error (createOrder):', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }
}

export const wooCommerceService = new WooCommerceService();
