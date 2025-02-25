<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <div class="app">
    <header>
      <h1>Antrenman Takip</h1>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  background-color: #f4f4f4;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: #333;
  font-size: 2.5rem;
}
</style>
