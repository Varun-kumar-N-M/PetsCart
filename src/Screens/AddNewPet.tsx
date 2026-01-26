import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getRequest, postRequest } from '../redux/ApiService/ApiService';
import { useAppDispatch } from '../redux/hooks';
import { addPet } from '../redux/reducer/cartSlice';

const petValidationSchema = Yup.object().shape({
  petName: Yup.string()
    .min(2, 'Pet name must be at least 2 characters')
    .max(50, 'Pet name must be less than 50 characters')
    .required('Pet name is required'),
  breed: Yup.string()
    .min(2, 'Breed must be at least 2 characters')
    .max(50, 'Breed must be less than 50 characters')
    .required('Breed is required'),
  age: Yup.number()
    .positive('Age must be a positive number')
    .integer('Age must be a whole number')
    .min(0, 'Age must be at least 0')
    .max(30, 'Age must be less than 30 years')
    .required('Age is required'),
  price: Yup.number()
    .positive('Price must be a positive number')
    .min(1, 'Price must be at least 1')
    .max(1000000, 'Price must be less than 1,000,000')
    .required('Price is required'),
});

interface PetFormValues {
  petName: string;
  breed: string;
  age: string;
  price: string;
}

const AddNewPet = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: PetFormValues = {
    petName: '',
    breed: '',
    age: '',
    price: '',
  };

  const fetchRandomDogImage = async () => {
    try {
      const res = await getRequest('https://dog.ceo/api/breeds/image/random');
      return res?.message || '';
    } catch (error) {
      console.error('Error fetching dog image:', error);
      return '';
    }
  };

  const handleSubmit = async (values: PetFormValues, { resetForm }: any) => {
    try {
      setIsSubmitting(true);
      const imageUrl = await fetchRandomDogImage();
      const newPet = {
        id: Date.now().toString(),
        petName: values.petName,
        breed: values.breed,
        age: parseInt(values.age),
        price: parseFloat(values.price),
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      };

      console.log('Adding new pet:', newPet);

      // Add to Redux store
      dispatch(addPet(newPet));
      const response = await postRequest(
        'https://jsonplaceholder.typicode.com/posts',
        newPet,
      );

      console.log('API Response:', response);
      Alert.alert(
        'Success!',
        `${values.petName} has been added successfully!`,
        [
          {
            text: 'Add Another',
            onPress: () => resetForm(),
          },
          {
            text: 'View Pets',
            onPress: () => navigation.goBack(),
          },
        ],
      );

      setTimeout(() => {
        resetForm();
      }, 100);
    } catch (error: any) {
      console.error('Error adding pet:', error);
      Alert.alert('Error', 'Failed to add pet. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add New Pet</Text>
          <Text style={styles.subtitle}>Fill in the details below</Text>
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={petValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            resetForm,
          }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Pet Name *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.petName && errors.petName && styles.inputError,
                  ]}
                  placeholder="e.g., Buddy"
                  value={values.petName}
                  onChangeText={handleChange('petName')}
                  onBlur={handleBlur('petName')}
                  editable={!isSubmitting}
                />
                {touched.petName && errors.petName && (
                  <Text style={styles.errorText}>{errors.petName}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Breed *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.breed && errors.breed && styles.inputError,
                  ]}
                  placeholder="e.g., Golden Retriever"
                  value={values.breed}
                  onChangeText={handleChange('breed')}
                  onBlur={handleBlur('breed')}
                  editable={!isSubmitting}
                />
                {touched.breed && errors.breed && (
                  <Text style={styles.errorText}>{errors.breed}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age (years) *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.age && errors.age && styles.inputError,
                  ]}
                  placeholder="e.g., 3"
                  value={values.age}
                  onChangeText={handleChange('age')}
                  onBlur={handleBlur('age')}
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
                {touched.age && errors.age && (
                  <Text style={styles.errorText}>{errors.age}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Price ($) *</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.price && errors.price && styles.inputError,
                  ]}
                  placeholder="e.g., 500"
                  value={values.price}
                  onChangeText={handleChange('price')}
                  onBlur={handleBlur('price')}
                  keyboardType="decimal-pad"
                  editable={!isSubmitting}
                />
                {touched.price && errors.price && (
                  <Text style={styles.errorText}>{errors.price}</Text>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  style={[
                    styles.submitButton,
                    isSubmitting && styles.submitButtonDisabled,
                  ]}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#fff" />
                      <Text style={styles.loadingText}>Adding Pet...</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>Add Pet 🐾</Text>
                  )}
                </TouchableOpacity>

                {!isSubmitting && (
                  <TouchableOpacity
                    onPress={() => resetForm()}
                    style={styles.resetButton}
                  >
                    <Text style={styles.resetButtonText}>Clear Form</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 40,
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 10,
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
  submitButtonDisabled: {
    backgroundColor: '#90CAF9',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  resetButton: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddNewPet;
