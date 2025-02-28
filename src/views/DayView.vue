<template>
  <div class="day-view">
    <div class="header">
      <h2>{{ currentDay }}. Gün Antrenmanı</h2>
      <h3 class="program-type">{{ gunBasligi }}</h3>
      
      <!-- Yeni eklenen achievements bölümü -->
      <div class="achievements-section">
        <!-- Günlük hedef -->
        <div class="daily-goals">
          <h4>Günlük Hedef</h4>
          <div class="goal-card">
            <div class="goal-info">
              <span class="goal-name">{{ currentDayGoal.name }}</span>
              <div class="progress-bar">
                <div :style="{ width: (currentDayGoal.progress / currentDayGoal.target * 100) + '%' }" class="progress"></div>
              </div>
              <span class="goal-progress">{{ currentDayGoal.progress }}/{{ currentDayGoal.target }}</span>
            </div>
          </div>
        </div>

        <!-- Haftalık hedef -->
        <div class="weekly-goals">
          <h4>Haftalık Hedef</h4>
          <div class="goal-card">
            <div class="goal-info">
              <span class="goal-name">{{ weeklyGoal.name }}</span>
              <div class="progress-bar">
                <div :style="{ width: (weeklyGoal.progress / weeklyGoal.target * 100) + '%' }" class="progress"></div>
              </div>
              <span class="goal-progress">{{ weeklyGoal.progress }}/{{ weeklyGoal.target }}</span>
            </div>
          </div>
        </div>
        
        <!-- Rozetler -->
        <div class="badges">
          <h4>Rozetlerim</h4>
          <div class="badges-container">
            <div v-for="badge in unlockedBadges" :key="badge.id" class="badge-item">
              <span class="badge-icon">{{ badge.icon }}</span>
              <span class="badge-name">{{ badge.name }}</span>
            </div>
          </div>
        </div>
      </div>
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
    
    <!-- Tamamla butonu -->
    <button 
      @click="completeWorkout" 
      class="complete-button"
      :disabled="currentDayGoal.completed"
    >
      {{ currentDayGoal.completed ? 'Antrenman Tamamlandı ✅' : 'Antrenmanı Tamamla 🎯' }}
    </button>

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
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { antrenmanVerisi } from '../data/workouts';
import { achievements } from '../data/achievements';
import { db, auth } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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

const currentDayGoal = computed(() => achievements.goals.daily[currentDay.value]);
const weeklyGoal = computed(() => achievements.goals.weekly);
const unlockedBadges = computed(() => achievements.badges.filter(badge => badge.unlocked));

const userId = ref(null);

// Firebase'den ilerlemeyi yükle
const loadProgress = async () => {
  if (!userId.value) return;
  
  try {
    const docRef = doc(db, "progress", userId.value);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      achievements.goals.daily = data.dailyGoals;
      achievements.goals.weekly = data.weeklyGoal;
      achievements.badges = data.badges;
    }
  } catch (error) {
    console.error("Error loading progress:", error);
  }
};

// Firebase'e ilerlemeyi kaydet
const saveProgress = async () => {
  if (!userId.value) return;
  
  try {
    await setDoc(doc(db, "progress", userId.value), {
      dailyGoals: achievements.goals.daily,
      weeklyGoal: achievements.goals.weekly,
      badges: achievements.badges,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving progress:", error);
  }
};

// Kullanıcı oturum durumunu kontrol et
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid;
      loadProgress(); // Kullanıcı verilerini yükle
    } else {
      userId.value = null;
    }
  });
});

const openModal = (hareket) => {
  selectedGif.value = hareket;
  document.body.style.overflow = 'hidden'; // Scroll'u engelle
};

const closeModal = () => {
  selectedGif.value = null;
  document.body.style.overflow = 'auto'; // Scroll'u geri aç
};

// completeWorkout fonksiyonunu güncelle
const completeWorkout = async () => {
  if (!currentDayGoal.value.completed) {
    currentDayGoal.value.progress = 1;
    currentDayGoal.value.completed = true;
    
    weeklyGoal.value.progress++;
    
    if (!achievements.badges[0].unlocked) {
      achievements.badges[0].unlocked = true;
    }
    
    if (weeklyGoal.value.progress >= weeklyGoal.value.target) {
      achievements.badges[1].unlocked = true;
      weeklyGoal.value.completed = true;
      alert('Tebrikler! Tüm haftayı tamamladınız! 🎉');
    }

    await saveProgress(); // Firebase'e kaydet
    alert('Tebrikler! Antrenmanı tamamladınız! 🎉');
  }
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

.achievements-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.daily-goals, .weekly-goals, .badges {
  margin: 1.5rem 0;
}

.daily-goals h4, .weekly-goals h4, .badges h4 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.goal-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 0.8rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.goal-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
}

.goal-progress {
  font-size: 0.9rem;
  color: #666;
  text-align: right;
  margin-top: 0.3rem;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  transition: width 0.3s ease;
  border-radius: 5px;
}

.badges-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 1.2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
}

.badge-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.badge-icon {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
}

.badge-name {
  font-size: 0.9rem;
  text-align: center;
  color: #2c3e50;
  font-weight: 500;
}

@media (max-width: 768px) {
  .achievements-section {
    margin-top: 1rem;
    padding: 1rem;
  }
  
  .goal-card {
    padding: 1rem;
  }
  
  .badges-container {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.8rem;
  }
  
  .badge-item {
    padding: 1rem;
  }
  
  .badge-icon {
    font-size: 2rem;
  }
  
  .goal-name {
    font-size: 1rem;
  }
  
  .progress-bar {
    height: 8px;
  }
}

.complete-button {
  display: block;
  width: fit-content;
  margin: 2rem auto;
  padding: 12px 24px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.complete-button:hover {
  background-color: #219a52;
  transform: scale(1.05);
}

.complete-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  transform: none;
}
</style> 