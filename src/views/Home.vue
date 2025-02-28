<template>
  <div class="home">
    <template v-if="!isLoggedIn">
      <Login />
    </template>
    <template v-else>
      <h1>Antrenman Programı</h1>
      <div class="days-container">
        <router-link 
          v-for="day in 3" 
          :key="day"
          :to="`/day/${day}`" 
          class="day-button"
        >
          {{ day }}. Gün
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '../firebase/config';
import Login from '../components/Login.vue';

const isLoggedIn = ref(false);

onMounted(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    isLoggedIn.value = !!user;
  });

  return () => unsubscribe();
});
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.days-container {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.day-button {
  display: block;
  padding: 2rem;
  background-color: #2c3e50;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.day-button:hover {
  background-color: #34495e;
  transform: translateY(-5px);
}
</style> 