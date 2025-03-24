import { StyleSheet, TouchableOpacity, View, Alert, Image } from 'react-native';
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
            onPress: () => router.back() 
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
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ marginLeft: 16, padding: 8 }}
            >
              <IconSymbol name="chevron.left" size={28} color="#0a7ea4" />
            </TouchableOpacity>
          ),
        }} 
      />
      <ThemedView style={styles.container}>
        <Image 
          source={require('../assets/images/cafe.jpg')}
          style={styles.coffeeImage}
          resizeMode="contain"
        />

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

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Order Summary</ThemedText>
          <ThemedView style={styles.summaryContainer}>
            <ThemedView style={styles.summaryRow}>
              <ThemedText>Add Cream:</ThemedText>
              <ThemedText>{addCream ? 'Yes' : 'No'}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText>Add Chocolate:</ThemedText>
              <ThemedText>{addChocolate ? 'Yes' : 'No'}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText>Quantity:</ThemedText>
              <ThemedText>{quantity}</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.summaryRow, styles.totalRow]}>
              <ThemedText style={styles.totalText}>Price:</ThemedText>
              <ThemedText style={styles.totalText}>
                ${((2.00 * quantity) + (addCream ? 1 : 0) + (addChocolate ? 0.5 : 0)).toFixed(2)}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.thankYouContainer}>
              <ThemedText style={styles.thankYouText}>THANK YOU</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.backButton]}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttonText}>Back</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.orderButton]}
            onPress={handleCreateOrder}
          >
            <ThemedText style={styles.buttonText}>Order</ThemedText>
          </TouchableOpacity>
        </ThemedView>
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    backgroundColor: '#6c757d',
  },
  orderButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  thankYouContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  thankYouText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  coffeeImage: {
    width: '100%',
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
  },
}); 