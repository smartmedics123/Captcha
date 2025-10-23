// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import 'leaflet/dist/leaflet.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './app/store'
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="356167563807-dhsid729cdv0f9if483ugl7kd5g9btrn.apps.googleusercontent.com">
     <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </GoogleReCaptchaProvider>
    </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
)
