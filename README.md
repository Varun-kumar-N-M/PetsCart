PetListProject – React Native Application

A simple React Native application that allows users to add pets, view pet listings, navigate between pets, add pets to cart, and manage cart items.
The app demonstrates form handling, API integration, Redux state management, and clean architecture practices.

Platform Support
1.Android
2.iOS

Built using React Native 0.80.0

Features
Add new pets using a validated form
Fetch random pet images from an external API
View pets one-by-one with navigation controls
Add pets to cart
Remove pets and auto-remove related cart items
Global state management using Redux Toolkit
Clean reusable API service layer

Tech Stack & Libraries Used
Core
React 19.1.0
React Native 0.80.0
Navigation
@react-navigation/native
@react-navigation/native-stack
Used for screen navigation between:
Home
Add New Pet
Cart
State Management
Redux Toolkit
React Redux
Used for:
Pet list management
Cart management
Current pet navigation index
Global app state
Forms & Validation
Formik
Yup
Used for:
Form state handling
Field-level validation
Cleaner and scalable form architecture

API Handling
Fetch API (custom wrapper)
Reusable API service created:
getRequest() → GET API calls
postRequest() → POST API calls

Includes:
Timeout handling
Error handling
Centralized API logic

🌐 Third-Party API Used
API Limitation & Workaround

The provided API occasionally returns:

Network errors

Unknown fetch failures on mobile devices

Solution Implemented

A local POST-based logic was implemented:

Pet data is added to Redux store

Images are fetched using GET API

Pet creation handled locally instead of server POST

Application Architecture
src/
│
├── redux/
│ ├── ApiService/
│ │ └── ApiService.ts
│ ├── reducer/
│ │ └── cartSlice.ts
│ ├── hooks.ts
│ └── store.ts
│
├── screens/
│ ├── HomeScreen.tsx
│ ├── AddNewPet.tsx
│ └── CartScreen.tsx
│
├── navigation/
│ └── AppNavigator.tsx
│
└── App.tsx

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.
