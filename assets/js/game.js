const startButton = document.getElementById('start-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const imgQuestion = document.getElementById('question_img_id')
const progress = document.querySelector('.progress')

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 15;
const ALERT_THRESHOLD = 5;


// set tiến độ thời gian
//progress.value =

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 30;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("count_down").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

var score = 0;
let shuffledQuestions, currentQuestionIndex
var interval;
var timeoutTime;
// bắt đầu chơi game khi click nút bắt đầu
startButton.addEventListener('click', startGame)

function startGame() {
  startButton.classList.add('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0;
  score = 0;
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

async function  setNextQuestion() {
  resetState()
  await restoreRemainingPathColor(timeLeft)
  timeLeft = TIME_LIMIT

  document.getElementById("base-timer-label").innerHTML = formatTime(
    timeLeft
  );
  await setCircleDasharray()
  showQuestion(shuffledQuestions[currentQuestionIndex])
  setTimeout(e => {
    startTimer();
  }, 500)
}

function showQuestion(question) {
  timeoutTime = 3
  questionElement.innerText = question.question
  imgQuestion.src = question.image

  question.answers.forEach((answer, index) => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    button.classList.add(`btn_answer_${index}`)
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
    // het tg trả lời
  }) 
}
function resetState() {
  clearStatusClass(document.body)
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  clearInterval(timerInterval);
  const selectedButton = e.target

  const correct = selectedButton.dataset.correct
  
  // setStatusClass(document.body, correct) 
  if(correct) {
    // trả lời đúng
    score++ 
  } 
  Array.from(answerButtonsElement.children).forEach(button => {
    if(button == selectedButton || button.dataset.correct){
      setStatusClass(button, button.dataset.correct)
    }
    button.removeEventListener("click", selectAnswer)
  })
  nextQuestion()
}
function nextQuestion(){
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    // tự động câu hỏi tiếp
    setTimeout(() => {
      currentQuestionIndex++
      setNextQuestion()
    }, 3000);
  } else {
    // hết câu hỏi
    endGame();
  }
}
function endGame(){
  startButton.innerText = 'Chơi lại'
  startButton.classList.remove('hide')
  clearInterval(interval);
}

// set đúng sai khi chọn đáp án
function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

// xóa đáp án đúng sai của câu hỏi trc
function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}
function onTimesUp() {
  clearInterval(timerInterval);
  Array.from(answerButtonsElement.children).forEach(button => {
    if(button.dataset.correct){
      setStatusClass(button, button.dataset.correct)
    }
    button.removeEventListener("click", selectAnswer)
  })
  nextQuestion();
}

function startTimer() {
  timePassed = 0;
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}
function restoreRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(alert.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(info.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

const questions = [
  {
    question: 'What is 2 + 2?',
    image : './assets/img/la.jpg',
    answers: [
      { text: '4', correct: true },
      { text: 'chào mừng các bạn đến với 22', correct: false },
      { text: 'Dev Ed', correct: false },
      { text: 'Fun Fun Function', correct: false }
    ]
  },
  {
    question: 'Who is the best YouTuber?',
    image : './assets/img/chicago.jpg',
    answers: [
      { text: 'Web Dev Simplified', correct: true },
      { text: 'Traversy Media', correct: true },
      { text: 'Dev Ed', correct: true },
      { text: 'Fun Fun Function', correct: true }
    ]
  },
  {
    question: 'Is web development fun?',
    image : './assets/img/baotang.jpg',
    answers: [
      { text: 'Kinda', correct: false },
      { text: 'YES!!!', correct: true },
      { text: 'Um no', correct: false },
      { text: 'IDK', correct: false }
    ]
  }
];