import { ref } from 'vue'

// achievements'i reactive yapalım
export const achievements = ref({
  badges: [
    {
      id: 1,
      name: "Yeni Başlayan",
      description: "İlk antrenmanını tamamladın!",
      icon: "🎯",
      unlocked: false
    },
    {
      id: 2,
      name: "Düzenli Sporcu",
      description: "Bir haftada 3 antrenman tamamladın",
      icon: "💪",
      unlocked: false
    },
    {
      id: 3,
      name: "Azimli Sporcu",
      description: "30 gün boyunca düzenli antrenman yaptın",
      icon: "🏆",
      unlocked: false
    }
  ],
  goals: {
    daily: {
      1: {
        id: 1,
        name: "1. Gün: Göğüs-Ön Kol",
        description: "1. gün antrenmanını tamamla",
        progress: 0,
        target: 1,
        completed: false
      },
      2: {
        id: 2,
        name: "2. Gün: Sırt-Arka Kol",
        description: "2. gün antrenmanını tamamla",
        progress: 0,
        target: 1,
        completed: false
      },
      3: {
        id: 3,
        name: "3. Gün: Omuz-Bacak",
        description: "3. gün antrenmanını tamamla",
        progress: 0,
        target: 1,
        completed: false
      }
    },
    weekly: {
      id: 1,
      name: "Haftalık Program",
      description: "Bu hafta tüm antrenmanları tamamla",
      progress: 0,
      target: 3,
      completed: false
    }
  }
}) 