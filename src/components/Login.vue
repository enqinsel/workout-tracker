<template>
  <div class="login-container">
    <h2>Antrenman Takip Sistemine Hoş Geldiniz</h2>
    <p>Devam etmek için lütfen giriş yapın</p>
    <button @click="signInWithGoogle" class="google-login-btn">
      <svg class="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
      </svg>
      Google ile Giriş Yap
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const isLoggedIn = ref(false);
const error = ref(null);

const signInWithGoogle = async () => {
  try {
    error.value = null;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Error signing in with Google:", err);
    error.value = err.message;
  }
};
</script>

<style scoped>
.login-container {
  text-align: center;
  padding: 3rem;
  margin: 3rem auto;
  max-width: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.login-container h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.login-container p {
  color: #666;
  margin-bottom: 2rem;
}

.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #4285f4;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.google-login-btn:hover {
  background-color: #3367d6;
  transform: translateY(-2px);
}

.google-icon {
  width: 24px;
  height: 24px;
}
</style> 