import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '@/types/Order';

const ORDERS_STORAGE_KEY = '@orders';

export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    try {
      const ordersJson = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      return ordersJson ? JSON.parse(ordersJson) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  },

  async addOrder(newOrder: Omit<Order, 'id' | 'orderNo' | 'status'>): Promise<Order | null> {
    try {
      const orders = await this.getAllOrders();
      
      const order: Order = {
        ...newOrder,
        id: Date.now().toString(), // Generate unique ID
        orderNo: orders.length + 1,
        status: 'Processing'
      };

      const updatedOrders = [...orders, order];
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
      
      return order;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  }
}; 