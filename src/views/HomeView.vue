<script setup>

</script>

<template>
  <div class="home">
    <div class="day-buttons">
      <router-link 
        v-for="gun in 3" 
        :key="gun"
        :to="`/day/${gun}`"
        class="day-button"
      >
        {{ gun }}. Gün
      </router-link>
    </div>
  </div>
</template>

<style>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  /* min-height: 70vh; */
}

.day-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.day-button {
  padding: 20px 40px;
  font-size: 1.2rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s;
}

.day-button:hover {
  transform: scale(1.05);
  background-color: #34495e;
}

@media (max-width: 600px) {
  .day-buttons {
    flex-direction: column;
  }
}
</style>
