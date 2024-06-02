document.addEventListener('DOMContentLoaded', () => {
  const questionSection = document.getElementById('questionSection');
  const progressBar = document.getElementById('progressBar');
  const statsDiv = document.getElementById('stats');
  let currentQuestionIndex = 0;
  let score = 0;
  let questions = [];
  let selectedCategory = '';
  const categories = {
    'mathBtn': 'mathematik',
    'itBtn': 'internettechnologien',
    'genKnowledgeBtn': 'allgemeinwissen'
  };

  // Fisher-Yates Shuffle Algorithmus zum Mischen eines Arrays
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Fragen aus der JSON-Datei laden
  function loadQuestions(category) {
    fetch('questions.json')
      .then(response => response.json())
      .then(data => {
        questions = data[category].map(q => {
          q.shuffledAnswers = shuffle([...q.answers]);
          return q;
        });
        currentQuestionIndex = 0;
        score = 0;
        progressBar.value = 0;
        displayQuestion();  // Erste Frage anzeigen nach dem Laden
      })
      .catch(error => console.error('Fehler beim Laden der Fragen:', error));
  }

  function displayQuestion() {
    const question = questions[currentQuestionIndex];
    questionSection.innerHTML = `<h2>${question.question}</h2>`;
    question.shuffledAnswers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.textContent = answer;
      button.addEventListener('click', () => checkAnswer(index, button));
      questionSection.appendChild(button);
    });

    // Wenn die Kategorie Mathematik ist, rendern der mathematischen Ausdrücke
    if (selectedCategory === 'mathematik') {
      renderMathInElement(questionSection, {
        delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "\\(", right: "\\)", display: false}
        ]
      });
    }
  }

  function checkAnswer(index, button) {
    const question = questions[currentQuestionIndex];
    const correctAnswer = question.answers[question.correct];
    const correctIndex = question.shuffledAnswers.indexOf(correctAnswer);
    if (index === correctIndex) {
      button.style.backgroundColor = 'green';
      score++;
    } else {
      button.style.backgroundColor = 'red';
      const correctButton = Array.from(questionSection.getElementsByTagName('button'))[correctIndex];
      correctButton.style.backgroundColor = 'green';
    }
    // Kurz warten, bevor es zur nächsten Frage geht
    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        progressBar.value = (currentQuestionIndex / questions.length) * 100;
        displayQuestion();
      } else {
        showResults();
      }
    }, 1000); // 1 Sekunde warten
  }

  function showResults() {
    questionSection.innerHTML = `<h2>Ende des Quiz. Deine Punktzahl: ${score} von ${questions.length}</h2>`;
    progressBar.value = 100;
  }

  // Event-Handler für Kategorie-Buttons
  Object.keys(categories).forEach(buttonId => {
    document.getElementById(buttonId).addEventListener('click', () => {
      selectedCategory = categories[buttonId];
      loadQuestions(selectedCategory);
    });
  });

  // Initiale Ansicht
  questionSection.innerHTML = '<h2>Bitte wähle eine Kategorie</h2>';
});
