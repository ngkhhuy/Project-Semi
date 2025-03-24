import { StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Order, OrderStatus, mockOrders } from '@/types/Order';
import { orderService } from '@/services/orderService';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchOrderNo, setSearchOrderNo] = useState('');

 
  useFocusEffect(
    useCallback(() => {
      const loadOrders = async () => {
        const storedOrders = await orderService.getAllOrders();
        setOrders(storedOrders); 
      };
      
      loadOrders();
    }, [])
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Processing':
        return '#FFC107';
      case 'Paid':
        return '#4CAF50';
      case 'Has Served':
        return '#2196F3';
      case 'Has Served':
        return '#F44336';
      default:
        return '#000000';
    }
  };
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((currentOrders: Order[]) => 
      currentOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setOrders(currentOrders => 
              currentOrders.filter(order => order.id !== orderId)
            );
          }
        },
      ]
    );
  };

  const showStatusOptions = (order: Order) => {
    Alert.alert(
      'Change Order Status',
      `Select new status for Order #${order.orderNo}`,
      [
        { text: 'Processing', onPress: () => handleStatusChange(order.id, 'Processing') },
        { text: 'Paid', onPress: () => handleStatusChange(order.id, 'Paid') },
        { text: 'Has Served', onPress: () => handleStatusChange(order.id, 'Has Served') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  const handleSearch = () => {
    const foundOrder = orders.find(order => order.orderNo === Number(searchOrderNo));
    if (foundOrder) {
      setIsSearchVisible(false);
      setSearchOrderNo('');
    
    } else {
      Alert.alert( `Not Found ${searchOrderNo}`);
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <ThemedView style={styles.orderCard}>
      <ThemedView style={styles.orderHeader}>
        <ThemedText type="defaultSemiBold">Order #{item.orderNo}</ThemedText>
        <ThemedText style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.orderDetails}>
        <ThemedText>Add Cream: {item.addCream ? 'Yes' : 'No'}</ThemedText>
        <ThemedText>Add Chocolate: {item.addChocolate ? 'Yes' : 'No'}</ThemedText>
        <ThemedText>Quantity: {item.quantity}</ThemedText>
        <ThemedText>Price: ${item.price.toFixed(2)}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={() => showStatusOptions(item)}
        >
          <IconSymbol name="pencil" size={20} color="#FFFFFF" />
          <ThemedText style={styles.buttonText}>Edit Status</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteOrder(item.id)}
        >
          <IconSymbol name="trash" size={20} color="#FFFFFF" />
          <ThemedText style={styles.buttonText}>Delete</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Orders</ThemedText>
      
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      <Modal
        visible={isSearchVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSearchVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSearchVisible(false)}
        >
          <ThemedView style={styles.searchModal}>
            <ThemedText type="defaultSemiBold" style={styles.searchTitle}>
              Search Order
            </ThemedText>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter order number..."
              value={searchOrderNo}
              onChangeText={setSearchOrderNo}
              keyboardType="numeric"
              autoFocus
            />
            <ThemedView style={styles.searchButtons}>
              <TouchableOpacity 
                style={[styles.searchModalButton, styles.cancelButton]}
                onPress={() => setIsSearchVisible(false)}
              >
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.searchModalButton, styles.confirmButton]}
                onPress={handleSearch}
              >
                <ThemedText style={styles.buttonText}>Search</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>
      </Modal>

      <ThemedView style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={[styles.floatingButton, styles.searchButton]}
          onPress={() => setIsSearchVisible(true)}>
          <IconSymbol name="magnifyingglass" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.floatingButton, styles.addButton]}
          onPress={() => router.push('/new-order')}>
          <IconSymbol name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    gap: 16,
  },
  orderCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDetails: {
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#0a7ea4',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  status: {
    fontWeight: '600',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    gap: 16,
  },
  floatingButton: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    backgroundColor: '#4CAF50',
  },
  addButton: {
    backgroundColor: '#0a7ea4',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  searchTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  searchButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  searchModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
});
