<script setup>
import 'primevue/resources/themes/saga-blue/theme.css'; // Светлая тема
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import { ref } from 'vue';

import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const questions = ref([
  {
    question: 'HbA1c 10% çox olanda Diabeton MR neçə faiz HbA1c azaldacaq?',
    options: [
      { text: '4.3%', correct: true },
      { text: '1.9%', correct: false },
      { text: '1.2%', correct: false },
      { text: '2.5%', correct: false }
    ],
    gifCorrect: 'path_to_correct_gif',
    gifIncorrect: 'path_to_incorrect_gif'
  },
  // Добавьте остальные вопросы здесь
]);

const currentQuestionIndex = ref(0);
const showGif = ref(false);
const selectedGif = ref('');
const isDarkTheme = ref(false);

function selectAnswer(option) {
  // if (option.correct) {
  //   selectedGif.value = questions.value[currentQuestionIndex.value].gifCorrect;
  //   currentQuestionIndex.value++;
  // } else {
  //   selectedGif.value = questions.value[currentQuestionIndex.value].gifIncorrect;
  // }
  // showGif.value = true;
}

function nextQuestion() {
  showGif.value = false;
  if (currentQuestionIndex.value >= questions.value.length) {
    alert('Oyunu bitirdiniz! Təşəkkürlər!');
    currentQuestionIndex.value = 0; // Сбросить игру
  }
}

function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value;
  const themeLink = document.querySelector('link[href*="primevue/resources/themes/"]');
  if (themeLink) {
    themeLink.href = isDarkTheme.value ? 'primevue/resources/themes/vela-blue/theme.css' : 'primevue/resources/themes/saga-blue/theme.css';
  }
  document.body.style.backgroundColor = isDarkTheme.value ? '#2c3e50' : '#f4f4f9';
}
</script>

<template>
  <div class="app-container">
    <Button @click="toggleTheme" class="theme-toggle"
      :class="{ 'light-theme': !isDarkTheme, 'dark-theme': isDarkTheme }">
      <i :class="isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'" style="margin-right: 8px;"></i>
    </Button>
    <div :class="{ 'dark-theme': isDarkTheme, 'light-theme': !isDarkTheme }" class="game-box">
      <div class="header"></div>
      <div class="content">
        <h1 class="question">{{ questions[currentQuestionIndex]?.question }}</h1>
        <div class="options-container">
          <div v-for="option in questions[currentQuestionIndex]?.options" :key="option.text" class="option-button">
            <Button :label="option.text" variant="outlined" @click="selectAnswer(option)" />
          </div>
        </div>
      </div>
      <Dialog v-if="showGif" :visible.sync="showGif" modal>
        <img :src="selectedGif" @click="nextQuestion" class="gif-image" />
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.game-box {
  height: 60vh;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: box-shadow 0.3s ease;
}

.game-box:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.theme-toggle {
  background-color: transparent;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.theme-toggle:hover {
  background-color: transparent;
}

.content {
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn-7a7a37b1 0.5s ease-in-out;
  justify-content: center;
}

.question {
  font-size: 2em;
  margin-bottom: 20px;
}

.options-container {
  width: 100%;
  padding: 0 10%;
  margin-top: 10%; 
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.option-button {  
  margin: 10px 0;
}

.stretched-button {
  width: 100%;
  padding: 15px;
  font-size: 1.2em;
  background-color: #007bff;
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.stretched-button:hover {
  background-color: #0056b3;
}

.gif-image {
  width: 100%;
  height: auto;
  transition: transform 0.3s ease;
}

.gif-image:hover {
  transform: scale(1.05);
}

.dark-theme {
  background-color: #2c3e50;
  color: #ecf0f1;
}

.light-theme {
  background-color: #f4f4f9;
  color: #2c3e50;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
