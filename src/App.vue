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

const gifCorrect = '/TheGame/true.gif';
const gifIncorrect = [
  '/TheGame/false-1.gif',
  '/TheGame/false-2.gif',
  '/TheGame/false-3.gif',
];
const serviceId = 'service_fvbb5w9';
const templateId = 'template_nj0ch0b';
const userId = 'ORktbYeHoFd9bF-0b';
const questions = ref([
  {
    id: 1,
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
    id: 2,
    question: 'HbA1c 4.3% azalması, hansı dozada nail olunur?',
    options: [
      { text: '30 mq', correct: false },
      { text: '60 mq', correct: false },
      { text: '90 mq', correct: false },
      { text: '120 mq', correct: true }
    ],
    gifIncorrect: gifIncorrect
  },
  {
    id: 3,
    question: 'Sizcə metforminlə kombinasiyada HbA1c neçə % qlimeperid və neçə % Diabeton MR endirəcək?',
    description: '2TŞD xəstəsi\nYaş = 61, \nHbA1c = 8.3%, \nÇəki = 83 kq, \nBÇİ = 31kq/m2.',
    options: [
      { text: 'Glimepirid – 1.9%; Diabeton MR – 1%', correct: false },
      { text: 'Glimepirid – 0.9%; Diabeton MR – 1%', correct: true },
      { text: 'Glimepirid – 1.2%; Diabeton MR – 1.7%', correct: false },
      { text: 'Glimepirid – 2.1%; Diabeton MR – 0.9%', correct: false }
    ],
    image: '/TheGame/chel.png',
    gifCorrect: gifCorrect,
    gifIncorrect: gifIncorrect
  },
  {
    id: 4,
    question: 'Diabeton MR böyrəklərə necə təsir edir?',
    description: 'A. Makroalbuminuriya riskini azaldır\nB. Nefropatiyanın yaranma ya da proqresləşmə riskini azaldır\nC. BÇTM riskini azaldır\nD. Böyrəklərə qarşı təsiri neytraldır\nE. Böyrəklərin zədələnmə riskini artırır',
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
    id: 5,
    question: 'Qliklazid 60mq MR və qliklazid 80mq:',
    description: 'A. Fərqlənmir\nB. 60mq MR gündə 1 dəfə 80mq isə gündə 2 dəfə\nC. 60mq MR daha effektivdir\nD. 80 mq daha effektivdir',
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
    id: 6,
    question: 'Diabeton MR gözlərə təsiri',
    description: 'A. Gözlərin zədələnmə riskini artırır\nB. Gözlərə qarşı neytral təsir göstərir\nC. Proliferativ retinipatiyanın riskini azaldır\nD. Başqa sulfanil sidik cövhəri dərmanlar kimi təsir göstərir',
    options: [
      { text: 'A', correct: false },
      { text: 'B', correct: false },
      { text: 'C', correct: true },
      { text: 'D', correct: false }
    ],
    gifCorrect: gifCorrect,
    gifIncorrect: gifIncorrect
  },
  {
    id: 7,
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
        <h2>Salam! Sizi oyuna dəvət edirik. Zəhmət olmasa Adınızı və Soyadınızı qeyd edin.</h2>
        <InputText v-model="userNameInput" placeholder="Ad Soyadı" class="input-text" />
        <Button @click="saveUserName" label="Saxla" class="save-button" />
      </div>
    </div>
    <div v-else>
      <!-- <Button @click="toggleTheme" class="theme-toggle"
        :class="{ 'light-theme': !isDarkTheme, 'dark-theme': isDarkTheme }">
        <i :class="isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'" style="margin-right: 8px;"></i>
      </Button> -->
      <div :class="{ 'dark-theme': isDarkTheme, 'light-theme': !isDarkTheme }" class="game-box">
        <div class="header">
          <!-- <h3>Привет, {{ userName }}!</h3> -->
        </div>
        <div class="content">
          <div class="question-container">
            <div v-if="questions[currentQuestionIndex]?.image || questions[currentQuestionIndex]?.description"
              class="patient-info-wrapper">
              <img v-if="questions[currentQuestionIndex]?.image" :src="questions[currentQuestionIndex].image"
                class="question-image" />
              <div v-if="questions[currentQuestionIndex]?.description && questions[currentQuestionIndex]?.id === 3"
                class="patient-info">
                {{ questions[currentQuestionIndex].description }}
              </div>
            </div>
            <h1 class="question">{{ questions[currentQuestionIndex]?.question }}</h1>
            <div v-if="questions[currentQuestionIndex]?.description && questions[currentQuestionIndex]?.id !== 3"
              style="display: flex; width: 100%; justify-content: flex-start; align-items:flex-start;">
              <div class="patient-info">
                {{ questions[currentQuestionIndex].description }}
              </div>
            </div>
          </div>
          <div v-if="checkingAnswer" class="loading-bar"></div>
          <div class="options-container">
            <div v-for="option in questions[currentQuestionIndex]?.options" :key="option.text" class="option-button">
              <Button :label="option.text" :icon="selectedOption === option && isCorrect ? 'pi pi-check-circle' : ''"
                class="stretched-button" @click="selectAnswer(option)" />
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
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #db4501;
  box-sizing: border-box;
}

.game-box {
  width: 100%;
  max-width: 800px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: box-shadow 0.3s ease;
  box-sizing: border-box;
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

.question-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.question-image {
  width: 20%;
  height: auto;
  margin-right: 20px;
}

.question {
  font-size: 3em;
  color: white;
  font-weight: bold;
  flex: 1 1 100%;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.option-button {
  flex: 1 1 calc(50% - 20px);
  margin: 10px 0;
}

.stretched-button {
  width: 100%;
  padding: 15px;
  font-size: 1.2em;
  transition: background-color 0.3s ease;
  white-space: normal;
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

/* .dark-theme {
  background-color: #2c3e50;
  color: #ecf0f1;
} */

/* .light-theme {
  background-color: #f4f4f9;
  color: #2c3e50;
} */

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

.patient-info-wrapper {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  /* margin-bottom: 20px; */
}

.patient-info {
  color: white;
  text-align: left;
  white-space: pre-line;
  font-size: 1.1em;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .patient-info-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .patient-info {
    text-align: center;
  }

  .question-image {
    width: 80px;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .question {
    font-size: 1.5em;
  }

  .option-button {
    flex: 1 1 100%;
  }
}
</style>
