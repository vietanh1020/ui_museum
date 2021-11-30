
const startButton = document.getElementById('start-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')

var score = 0;
let shuffledQuestions, currentQuestionIndex

// bắt đầu chơi game khi click nút bắt đầu
startButton.addEventListener('click', startGame)

function startGame() {
  startButton.classList.add('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question

  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target

  const correct = selectedButton.dataset.correct
  
  setStatusClass(document.body, correct) 
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  
  if (shuffledQuestions.length > currentQuestionIndex + 1) {

    // cộng điểm
    if(document.body.classList.contains('correct')) score++ 
    
    // tự động câu hỏi tiếp
    setTimeout(() => {
      currentQuestionIndex++
      setNextQuestion()
    }, 3000);
  } else {
    // hết câu hỏi
    startButton.innerText = 'Score = '+score
    startButton.classList.remove('hide')
  }
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


const questions = [
  {
    question: 'What is 2 + 2?',
    image : '',
    answers: [
      { text: '4', correct: true },
      { text: 'chào mừng các bạn đến với 22', correct: false },
      { text: 'Dev Ed', correct: false },
      { text: 'Fun Fun Function', correct: false }
    ]
  },
  {
    question: 'Who is the best YouTuber?',
    image : '',
    answers: [
      { text: 'Web Dev Simplified', correct: true },
      { text: 'Traversy Media', correct: true },
      { text: 'Dev Ed', correct: true },
      { text: 'Fun Fun Function', correct: true }
    ]
  },
  {
    question: 'Is web development fun?',
    image : '',
    answers: [
      { text: 'Kinda', correct: false },
      { text: 'YES!!!', correct: true },
      { text: 'Um no', correct: false },
      { text: 'IDK', correct: false }
    ]
  }
];
