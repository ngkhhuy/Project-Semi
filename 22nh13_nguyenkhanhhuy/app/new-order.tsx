import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { router } from 'expo-router';
import { orderService } from '@/services/orderService';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';

export default function NewOrderScreen() {
  const router = useRouter();
  const [addCream, setAddCream] = useState(false);
  const [addChocolate, setAddChocolate] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleCreateOrder = async () => {
    try {
      const basePrice = 2.00;
      const totalPrice = basePrice * quantity + 
        (addCream ? 1 : 0) + 
        (addChocolate ? 0.5 : 0);

      const newOrder = await orderService.addOrder({
        quantity,
        addCream,
        addChocolate,
        price: totalPrice
      });

      if (newOrder) {
        Alert.alert('Success', 'Order created successfully!', [
          {
            text: 'OK',
            onPress: () => router.back() // Chỉ navigate back sau khi user bấm OK
          }
        ]);
      } else {
        Alert.alert('Error', 'Failed to create order');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'New Coffee Order',
          headerShown: true,
        }} 
      />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Choose Toppings</ThemedText>
          <ThemedView style={styles.toppingsContainer}>
            <TouchableOpacity 
              style={[styles.toppingButton, addCream && styles.toppingButtonActive]}
              onPress={() => setAddCream(!addCream)}
            >
              <ThemedText style={[styles.toppingText, addCream && styles.toppingTextActive]}>
                Cream
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.toppingButton, addChocolate && styles.toppingButtonActive]}
              onPress={() => setAddChocolate(!addChocolate)}
            >
              <ThemedText style={[styles.toppingText, addChocolate && styles.toppingTextActive]}>
                Chocolate
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Quantity</ThemedText>
          <ThemedView style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => quantity > 1 && setQuantity(q => q - 1)}
            >
              <IconSymbol name="minus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => setQuantity(q => q + 1)}
            >
              <IconSymbol name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity 
          style={styles.orderButton}
          onPress={handleCreateOrder}
        >
          <ThemedText style={styles.orderButtonText}>Order</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  toppingsContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  toppingButton: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  toppingButtonActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  toppingText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
  },
  toppingTextActive: {
    color: '#FFFFFF',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  quantityButton: {
    backgroundColor: '#0a7ea4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  orderButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 