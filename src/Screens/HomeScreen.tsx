import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import React, { useEffect } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  addToCart,
  nextPet,
  previousPet,
  removeFromCart,
  removePet,
} from '../redux/reducer/cartSlice';

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  // Get pets and cart data from Redux
  const pets = useAppSelector(state => state.cart.pets);
  const currentIndex = useAppSelector(state => state.cart.currentIndex);
  const totalItems = useAppSelector(state => state.cart.totalItems);
  const cartItems = useAppSelector(state => state.cart.items);
  const currentPet = pets[currentIndex];

  useEffect(() => {
    console.log('🔥 SCREEN MOUNTED');

    // If no pets, navigate to AddNewPet
    if (isFocused && pets.length === 0) {
      Alert.alert(
        'No Pets Found',
        'Add your first pet to get started!',
        [
          {
            text: 'Add Pet',
            onPress: () => {
              //@ts-ignore
              navigation.navigate('AddNewPet');
            },
          },
        ],
        { cancelable: false },
      );
    }
  }, [isFocused, pets?.length]);

  const handleDeletePet = () => {
    if (!currentPet) return;

    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${currentPet.petName}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Find all cart items with this pet's ID or name
            const relatedCartItems = cartItems.filter(
              item => item.petName === currentPet.petName,
            );

            // Remove all related items from cart
            relatedCartItems.forEach(item => {
              dispatch(removeFromCart(item.id));
            });

            // Remove pet from pets list
            dispatch(removePet(currentPet.id));

            // Show success message
            const cartMessage =
              relatedCartItems.length > 0
                ? ` and ${relatedCartItems.length} item(s) from cart`
                : '';

            Alert.alert(
              'Deleted',
              `${currentPet.petName} has been removed${cartMessage}.`,
            );
          },
        },
      ],
    );
  };

  const handleAddToCart = () => {
    if (currentPet) {
      const cartItem = {
        id: Date.now().toString(),
        imageUrl: currentPet.imageUrl,
        addedAt: new Date().toISOString(),
        petName: currentPet.petName,
        breed: currentPet.breed,
        age: currentPet.age,
        price: currentPet.price,
      };

      dispatch(addToCart(cartItem));

      Alert.alert('Success! 🎉', `${currentPet.petName} added to cart!`, [
        {
          text: 'Continue Shopping',
          style: 'cancel',
        },
        {
          text: 'View Cart',
          onPress: () => {
            // @ts-ignore
            navigation.navigate('Cart');
          },
        },
      ]);
    }
  };

  const handleNext = () => {
    dispatch(nextPet());
  };

  const handlePrevious = () => {
    dispatch(previousPet());
  };

  // If no pets, show add pet screen
  if (pets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🐾</Text>
        <Text style={styles.emptyTitle}>No Pets Yet</Text>
        <Text style={styles.emptySubtitle}>
          Add your first pet to get started!
        </Text>
        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            navigation.navigate('AddNewPet');
          }}
          style={styles.addFirstPetButton}
        >
          <Text style={styles.addFirstPetButtonText}>Add Your First Pet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Pet Counter */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            Pet {currentIndex + 1} of {pets.length}
          </Text>
        </View>

        {/* Pet Card */}
        {currentPet && (
          <View style={styles.petCard}>
            {/* Delete Button */}
            <TouchableOpacity
              onPress={handleDeletePet}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>

            {/* Image with Navigation Arrows */}
            <View style={styles.imageContainer}>
              {/* Left Arrow */}
              {pets.length > 1 && (
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={styles.leftArrow}
                >
                  <Text style={styles.arrowText}>‹</Text>
                </TouchableOpacity>
              )}

              {/* Pet Image */}
              <Image
                source={{ uri: currentPet.imageUrl }}
                style={styles.petImage}
                resizeMode="cover"
              />

              {/* Right Arrow */}
              {pets.length > 1 && (
                <TouchableOpacity
                  onPress={handleNext}
                  style={styles.rightArrow}
                >
                  <Text style={styles.arrowText}>›</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Pet Details */}
            <View style={styles.petDetails}>
              <Text style={styles.petName}>{currentPet.petName}</Text>
              <Text style={styles.petBreed}>{currentPet.breed}</Text>
              <View style={styles.petInfo}>
                <Text style={styles.petAge}>🎂 {currentPet.age} years</Text>
                <Text style={styles.petPrice}>💰 ${currentPet.price}</Text>
              </View>
            </View>
          </View>
        )}
        <TouchableOpacity
          onPress={handleAddToCart}
          style={styles.addToCartButton}
          disabled={!currentPet}
        >
          <Text style={styles.addToCartButtonText}>
            Add {currentPet?.petName} To Cart
          </Text>
        </TouchableOpacity>

        {/* View Cart Button */}
        {totalItems > 0 && (
          <TouchableOpacity
            onPress={() => {
              //@ts-ignore
              navigation.navigate('Cart');
            }}
            style={styles.viewCartButton}
          >
            <Text style={styles.viewCartButtonText}>
              🛍️ View Cart ({totalItems})
            </Text>
          </TouchableOpacity>
        )}

        {/* Add New Pet Button */}
        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            navigation.navigate('AddNewPet');
          }}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>➕ Add Another Pet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  counterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
    backgroundColor: '#ff4444',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButtonText: {
    fontSize: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  petImage: {
    width: 220,
    height: 220,
    borderRadius: 15,
  },
  leftArrow: {
    position: 'absolute',
    left: -10,
    zIndex: 10,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rightArrow: {
    position: 'absolute',
    right: -10,
    zIndex: 10,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arrowText: {
    fontSize: 32,
    color: '#000',
    fontWeight: 'bold',
    lineHeight: 32,
  },
  petDetails: {
    paddingHorizontal: 5,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  petBreed: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  petInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  petAge: {
    fontSize: 16,
    color: '#666',
  },
  petPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewCartButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  addFirstPetButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addFirstPetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
