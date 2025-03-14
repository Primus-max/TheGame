<script setup>
import 'primevue/resources/themes/saga-blue/theme.css'; // Светлая тема
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import {
  onMounted,
  ref,
} from 'vue';

//import emailjs from 'emailjs-com';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

import emailjs from '@emailjs/browser';

const gifCorrect = '/public/dog-puppy.gif';
const gifIncorrect = ['/public/dog-puppy.gif', '/public/dog-puppy.gif', '/public/dog-puppy.gif'];
const serviceId = 'service_fvbb5w9';
const templateId = 'template_nj0ch0b';
const userId = 'ORktbYeHoFd9bF-0b';
const questions = ref([
  {
    question: 'HbA1c 10% çox olanda Diabeton MR neçə faiz HbA1c azaldacaq?',
    options: [
      { text: '4.3%', correct: true },
      { text: '1.9%', correct: false },
      { text: '1.2%', correct: false },
      { text: '2.5%', correct: false }
    ],
    gifCorrect: gifCorrect,
    gifIncorrect: gifIncorrect
  },
  {
    question: 'HbA1c 4.3% azalması, hansı dozada nail olunur?\n2TŞD xəstəsi\nYaş = 61, HbA1c = 8.3%, Çəki = 83 kq, BÇİ = 31kq/m2.',
    options: [
      { text: '30 mq', correct: false },
      { text: '60 mq', correct: false },
      { text: '90 mq', correct: false },
      { text: '120 mq', correct: true }
    ],
    gifIncorrect: gifIncorrect
  },
  {
    question: 'Sizcə metforminlə kombinasiyada HbA1c neçə % qlimeperid və neçə % Diabeton MR endirəcək?',
    options: [
      { text: 'Glimepirid – 1.9%; Diabeton MR – 1%', correct: false },
      { text: 'Glimepirid – 0.9%; Diabeton MR – 1%', correct: true },
      { text: 'Glimepirid – 1.2%; Diabeton MR – 1.7%', correct: false },
      { text: 'Glimepirid – 2.1%; Diabeton MR – 0.9%', correct: false }
    ],
    gifCorrect: gifCorrect,
    gifIncorrect: gifIncorrect
  },
  {
    question: 'Diabeton MR böyrəklərə necə təsir edir?',
    options: [
      { text: 'A və B', correct: false },
      { text: 'D', correct: false },
      { text: 'E', correct: false },
      { text: 'A, B və C', correct: true }
    ],
    gifCorrect: gifCorrect,
    gifIncorrect: gifIncorrect
  },
  {
    question: 'Qliklazid 60mq MR və qliklazid 80mq:',
    options: [
      { text: 'A və B', correct: false },
      { text: 'B və C', correct: true },
      { text: 'C', correct: false },
      { text: 'D', correct: false }
    ],
    gifCorrect: gifCorrect,
    gifIncorrect: gifIncorrect
  },
  {
    question: 'Diabeton MR gözlərə təsiri',
    options: [
      { text: 'Gözlərin zədələnmə riskini artırır', correct: false },
      { text: 'Gözlərə qarşı neytral təsir göstərir', correct: false },
      { text: 'Proliferativ retinipatiyanın riskini azaldır', correct: true },
      { text: 'Başqa sulfanil sidik cövhəri dərmanlar kimi təsir göstərir', correct: false }
    ],
    gifCorrect: gifCorrect,
    gifIncorrect: gifIncorrect
  },
  {
    question: 'Hipoqlikemiya riski hansı dərmanda daha azdır?',
    options: [
      { text: 'Diabeton MR', correct: true },
      { text: 'Glimepirid', correct: false },
      { text: 'DDP-4 inhibitorları', correct: false },
      { text: 'Diabeton MR və DPP4 -inhibitorları', correct: false }
    ],
    gifCorrect: gifCorrect,
    gifIncorrect: gifIncorrect
  }
]);

const currentQuestionIndex = ref(0);
const showGif = ref(false);
const selectedGif = ref('');
const isDarkTheme = ref(false);
const isCorrect = ref(true);
const checkingAnswer = ref(false);
const selectedOption = ref(null);
const userName = ref(localStorage.getItem('userName') || '');
const userNameInput = ref('');
const userAnswers = ref(JSON.parse(localStorage.getItem('userAnswers')) || []);


function selectAnswer(option) {
  selectedOption.value = option;
  userAnswers.value.push({
    question: questions.value[currentQuestionIndex.value].question,
    answer: option.text,
    isCorrect: option.correct,
  })  
  localStorage.setItem('userAnswers', JSON.stringify(userAnswers.value));
  checkingAnswer.value = true;
  setTimeout(() => {
    if (currentQuestionIndex.value < questions.value.length) {
      if (option.correct) {
        selectedGif.value = questions.value[0].gifCorrect;
        isCorrect.value = true;
      } else {
        const randomIndex = Math.floor(Math.random() * questions.value[currentQuestionIndex.value].gifIncorrect.length);
        selectedGif.value = questions.value[currentQuestionIndex.value].gifIncorrect[randomIndex];
        isCorrect.value = false;
      }
      showGif.value = true;
    }
    checkingAnswer.value = false;
  }, 300);
}

function sendEmail() {
  const formattedAnswers = formatUserAnswers();
  var templateParams = {
    name: userName.value,
    message: formattedAnswers,
  };

  emailjs.send(serviceId, templateId, templateParams, { publicKey: userId }).then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
    },
    (error) => {
      console.log('FAILED...', error);
    },
  );
}

function formatUserAnswers() {
  return userAnswers.value.map((answer, index) => {
    return `Вопрос: ${answer.question}\nОтвет: ${answer.answer}\n`;
  }).join('\n');
}


function nextQuestion() {  
  showGif.value = false;
  if (isCorrect.value) {
    currentQuestionIndex.value++;
  }
  if (currentQuestionIndex.value >= questions.value.length) {
    alert('Oyunu bitirdiniz! Təşəkkürlər!');
    sendEmail();
    currentQuestionIndex.value = 0;
    userAnswers.value = [];
    localStorage.removeItem('userAnswers');
  }
  checkingAnswer.value = false;
  isCorrect.value = false;
}

function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value;
  const themeLink = document.querySelector('link[href*="primevue/resources/themes/"]');
  if (themeLink) {
    themeLink.href = isDarkTheme.value ? 'primevue/resources/themes/vela-blue/theme.css' : 'primevue/resources/themes/saga-blue/theme.css';
  }
  document.body.style.backgroundColor = isDarkTheme.value ? '#2c3e50' : '#f4f4f9';
}

function saveUserName() {
  userName.value = userNameInput.value;
  localStorage.setItem('userName', userName.value);
}

onMounted(() => {
  if (!userName.value) {
    userNameInput.value = '';
  }

  emailjs.init({
    publicKey: "ORktbYeHoFd9bF-0b",
    blockHeadless: true,
  });
});
</script>

<template>
  <div class="app-container">
    <div v-if="!userName" class="name-modal">
      <div class="modal-content">
        <h2>Добро пожаловать! Пожалуйста, введите ваше имя:</h2>
        <InputText v-model="userNameInput" placeholder="Ваше имя" class="input-text" />
        <Button @click="saveUserName" label="Сохранить" class="save-button" />
      </div>
    </div>
    <div v-else>
      <Button @click="toggleTheme" class="theme-toggle"
        :class="{ 'light-theme': !isDarkTheme, 'dark-theme': isDarkTheme }">
        <i :class="isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'" style="margin-right: 8px;"></i>
      </Button>
      <div :class="{ 'dark-theme': isDarkTheme, 'light-theme': !isDarkTheme }" class="game-box">
        <div class="header">
          <h3>Привет, {{ userName }}!</h3>
        </div>
        <div class="content">
          <h1 class="question">{{ (currentQuestionIndex + 1) + ' ' + questions[currentQuestionIndex]?.question }}</h1>
          <div v-if="checkingAnswer" class="loading-bar"></div>
          <div class="options-container">
            <div v-for="option in questions[currentQuestionIndex]?.options" :key="option.text" class="option-button">
              <Button :label="option.text" :icon="selectedOption === option && isCorrect ? 'pi pi-check-circle' : ''"
                class="p-button-outlined stretched-button" @click="selectAnswer(option)" />
            </div>
          </div>
        </div>
        <div v-if="showGif" class="custom-modal">
          <div class="modal-content">
            <img :src="selectedGif" @click="nextQuestion" class="gif-image" style="width: 100%; height: auto;" />
          </div>
        </div>
      </div>
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

.loading-bar {
  width: 100%;
  height: 5px;
  background-color: #007bff;
  margin-bottom: 10px;
  animation: loading 1.5s linear infinite;
}

@keyframes loading {
  0% {
    width: 0;
  }

  100% {
    width: 100%;
  }
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

.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.5s ease-in-out;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes slideIn {
  from {
    transform: translateY(-20%);
  }

  to {
    transform: translateY(0);
  }
}

.input-text {
  margin-bottom: 10px;
  width: 100%;
  max-width: 300px;
}

.save-button {
  margin-top: 10px;
}

.name-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.5s ease-in-out;
}
</style>
