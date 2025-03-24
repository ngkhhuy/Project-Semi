export type OrderStatus = 'Processing' | 'Paid' | 'Has Served';

export interface Order {
  id: string;
  orderNo: number;
  addCream: boolean;
  addChocolate: boolean;
  quantity: number;
  price: number;
  status: OrderStatus;
}

// Du lieu mau
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNo: 1,
    addCream: true,
    addChocolate: false,
    quantity: 2,
    price: 5.99,
    status: 'Processing'
  },
  {
    id: '2',
    orderNo: 2,
    addCream: false,
    addChocolate: true,
    quantity: 1,
    price: 4.50,
    status: 'Paid'
  },
  {
    id: '3',
    orderNo: 3,
    addCream: false,
    addChocolate: true,
    quantity: 1,
    price: 2,
    status: 'Has Served'
  },
  {
    id: '4',
    orderNo: 4,
    addCream: false,
    addChocolate: true,
    quantity: 1,
    price: 2,
    status: 'Has Served'
  },
  {
    id: '5',
    orderNo: 5,
    addCream: false,
    addChocolate: true,
    quantity: 1,
    price: 2,
    status: 'Has Served'
  },


  

 
]; 