<template>
  <div class="day-view">
    <div class="header">
      <h2>{{ currentDay }}. Gün Antrenmanııı</h2>
      <h3 class="program-type">{{ gunBasligi }}</h3>
    </div>
    <div class="exercises">
      <div v-for="(hareket, index) in gununHareketleri" :key="index" class="exercise-card">
        <h3>{{ hareket.ad }}</h3>
        <div class="exercise-content">
          <div class="gif-container" @click="openModal(hareket)">
            <img :src="hareket.gif" :alt="hareket.ad">
          </div>
          <div class="exercise-info">
            <p class="sets">Set x Tekrar: {{ hareket.set }}</p>
          </div>
        </div>
      </div>
    </div>
    <router-link to="/" class="back-button">Ana Sayfaya Dön</router-link>

    <!-- Modal -->
    <div v-if="selectedGif" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">
          <span class="close-icon">×</span>
        </button>
        <img :src="selectedGif.gif" :alt="selectedGif.ad">
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { antrenmanVerisi } from '../data/workouts';

const route = useRoute();
const currentDay = computed(() => route.params.id);

const gunBasligi = computed(() => {
  switch(currentDay.value) {
    case "1": return "Göğüs-Ön Kol";
    case "2": return "Sırt-Arka Kol";
    case "3": return "Omuz-Bacak";
    default: return "";
  }
});

const gununHareketleri = computed(() => {
  return antrenmanVerisi.gunler[currentDay.value] || [];
});

const selectedGif = ref(null);

const openModal = (hareket) => {
  selectedGif.value = hareket;
  document.body.style.overflow = 'hidden'; // Scroll'u engelle
};

const closeModal = () => {
  selectedGif.value = null;
  document.body.style.overflow = 'auto'; // Scroll'u geri aç
};
</script>

<style>
.day-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 1rem;
}

h2 {
  color: #2c3e50;
  font-size: 2rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.program-type {
  color: #34495e;
  font-size: 1.5rem;
  font-weight: 500;
  margin-top: 0.5rem;
  background: none;
  padding: 0;
}

.exercises {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 1rem;
  max-width: 100%;
  margin: 0 auto;
}

.exercise-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  width: 100%;
  overflow: hidden;
}

.exercise-card:hover {
  transform: translateY(-5px);
}

h3 {
  color: #2c3e50;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
}

.exercise-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gif-container {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  cursor: pointer;
}

.gif-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exercise-info {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
  text-align: center;
}

.sets {
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 600;
}

.back-button {
  display: block;
  width: fit-content;
  margin: 2rem auto;
  padding: 12px 24px;
  background-color: #2c3e50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #34495e;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .exercises {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.5rem;
  }

  .exercise-card {
    margin-bottom: 1rem;
    padding: 15px;
  }

  .header {
    padding: 0.8rem;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .program-type {
    font-size: 1rem;
    margin-top: 0.3rem;
  }

  h3 {
    font-size: 1.2rem;
  }

  .sets {
    font-size: 1.1rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .exercises {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .exercises {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Modal Stilleri */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  transform: scale(0.9);
  animation: zoomIn 0.3s ease forwards;
}

.modal-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-icon {
  color: white;
  font-size: 24px;
  line-height: 1;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Animasyonlar */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
  }

  .close-button {
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
  }

  .close-icon {
    font-size: 20px;
  }
}
</style> 