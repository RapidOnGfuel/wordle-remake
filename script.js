let words = [];
let targetWord = "";
let currentGuess = "";
let currentRow = 0;
let isCustomWord = false; // Flag to indicate if a custom word is being used
let hintGiven = false;
let hintMessage = '';
const keyboardLayout = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

// Fetch words from words.txt
fetch('words.txt')
    .then(response => response.text())
    .then(data => {
        words = data.split('\n').map(word => word.trim().toUpperCase()).filter(word => word.length === 5);
        newRandomWord();
    })
    .catch(error => console.error('Error loading words:', error));

document.addEventListener('DOMContentLoaded', () => {
    setupKeyboard();
    setupBoard();
    setupEventListeners();
    loadStreak();

    const menuButton = document.getElementById('menu-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    menuButton.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close the dropdown if clicked outside
    window.addEventListener('click', function(event) {
        if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = 'none';
        }
    });
});

let streak = 0;

function loadStreak() {
    const savedStreak = localStorage.getItem('wordle-streak');
    streak = savedStreak ? parseInt(savedStreak, 10) : 0;
    updateStreakDisplay();
    console.log(`Loaded streak: ${streak}`);
}

function updateStreakDisplay() {
    const feedback = document.getElementById('feedback');
    feedback.innerText = `Current Streak: ${streak}`;
}

function checkGuess() {
    const boxes = document.querySelectorAll(`[data-row='${currentRow}']`);
    const targetWordArray = targetWord.split('');
    const guessArray = currentGuess.split('');

    // First pass: check for correct positions
    for (let i = 0; i < 5; i++) {
        const char = guessArray[i];
        const box = boxes[i];

        if (char === targetWordArray[i]) {
            box.classList.add('green');
            targetWordArray[i] = null;
            guessArray[i] = null;
        }
    }

    // Second pass: check for present but misplaced letters
    for (let i = 0; i < 5; i++) {
        const char = guessArray[i];
        const box = boxes[i];

        if (char && targetWordArray.includes(char)) {
            box.classList.add('yellow');
            targetWordArray[targetWordArray.indexOf(char)] = null;
        } else if (char) {
            box.classList.add('gray');
        }
    }

    updateKeyboardColors();

    if (currentGuess.trim() === targetWord) {
        alert("Congratulations! You've guessed the word!");
        streak++;
        localStorage.setItem('wordle-streak', streak);
        updateStreakDisplay();
    } else if (currentRow < 5) {
        currentRow++;
        currentGuess = '';
        const nextRowBoxes = document.querySelectorAll(`[data-row='${currentRow}']`);
        nextRowBoxes.forEach(box => {
            box.contentEditable = true;
            box.addEventListener('input', handleInput);
            box.addEventListener('keydown', handleKeyDown);
        });
        nextRowBoxes[0].focus();
    } else {
        alert(`Game over! The word was: ${targetWord}`);
        streak = 0;
        localStorage.setItem('wordle-streak', streak);
        updateStreakDisplay();
    }
}

function setupEventListeners() {
    document.getElementById('generate-code-button').addEventListener('click', generateCode);
    document.getElementById('start-game-button').addEventListener('click', startGame);
    document.getElementById('new-random-word-button').addEventListener('click', newRandomWord);
    document.getElementById('hint-button').addEventListener('click', provideHint);
    document.getElementById('close-hint').addEventListener('click', closeHintPopup); // Close button listener
}

function provideHint() {
    if (!hintGiven) {
        const randomPosition = Math.floor(Math.random() * 5); // Random number between 0 and 4
        const letter = targetWord[randomPosition];
        const ordinalNumbers = ["1st", "2nd", "3rd", "4th", "5th"];
        hintMessage = `The ${ordinalNumbers[randomPosition]} letter is ${letter}`;
        hintGiven = true;
    }
    displayHintPopup(hintMessage);
}

function displayHintPopup(message) {
    const hintPopup = document.getElementById('hint-popup');
    const hintMessageElement = document.getElementById('hint-message');
    hintMessageElement.innerText = message;
    hintPopup.classList.add('show');
}

function closeHintPopup() {
    const hintPopup = document.getElementById('hint-popup');
    hintPopup.classList.remove('show');
}

function setupKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';

    keyboardLayout.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('keyboard-row');
        for (let char of row) {
            const key = document.createElement('div');
            key.classList.add('key');
            key.innerText = char;
            key.addEventListener('click', () => handleKeyPress(char));
            rowElement.appendChild(key);
        }
        keyboard.appendChild(rowElement);
    });
}

function generateCode() {
    const wordInput = document.getElementById('word-input').value.toUpperCase();
    if (wordInput.length === 5) {
        const code = btoa(wordInput);
        alert(`Share this code: ${code}`);
    } else {
        alert('Please enter a 5-letter word.');
    }
}

function startGame() {
    const codeInput = document.getElementById('code-input').value;
    const decodedWord = decodeCode(codeInput);
    if (decodedWord) {
        targetWord = decodedWord;
        isCustomWord = true; // Set flag for custom word
    } else {
        targetWord = getRandomWord();
        isCustomWord = false; // Reset flag if not a custom word
    }
    setupBoard();
    hintGiven = false; // Reset hint flag for new game
}

function newRandomWord() {
    targetWord = getRandomWord();
    isCustomWord = false; // Reset flag for random word
    setupBoard();
    hintGiven = false; // Reset hint flag for new game
}

function decodeCode(code) {
    try {
        const decoded = atob(code);
        return decoded.length === 5 ? decoded.toUpperCase() : null;
    } catch (e) {
        return null;
    }
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function setupBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    currentGuess = '';
    currentRow = 0;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const box = document.createElement('div');
            box.classList.add('letter-box');
            box.setAttribute('data-row', i);
            box.setAttribute('data-index', j);
            if (i === 0) {
                box.contentEditable = true;
                box.addEventListener('input', handleInput);
                box.addEventListener('keydown', handleKeyDown);
            }
            board.appendChild(box);
        }
    }
    document.querySelector(`[data-row='0'][data-index='0']`).focus();
}

function handleKeyPress(char) {
    const activeBox = document.querySelector(`[data-row='${currentRow}'] .letter-box:empty`);
    if (activeBox) {
        activeBox.innerText = char;
        handleInput({target: activeBox});
    }
}

function handleInput(event) {
    const box = event.target;
    const index = parseInt(box.getAttribute('data-index'));
    const row = parseInt(box.getAttribute('data-row'));

    if (row !== currentRow) return;

    let char = box.innerText.trim().toUpperCase();
    
    if (char.length > 1) {
        char = char[0];
        box.innerText = char;
    }

    currentGuess = currentGuess.substring(0, index) + char + currentGuess.substring(index + 1);
    currentGuess = currentGuess.padEnd(5, ' ');

    if (char && index < 4) {
        const nextBox = document.querySelector(`[data-row='${currentRow}'][data-index='${index + 1}']`);
        if (nextBox) {
            nextBox.focus();
        }
    }
}

function handleKeyDown(event) {
    const box = event.target;
    const index = parseInt(box.getAttribute('data-index'));

    if (event.key === 'Enter') {
        event.preventDefault();
        const guess = currentGuess.trim().toUpperCase();
        if (guess.length === 5 && (isCustomWord || words.includes(guess))) {
            checkGuess();
        } else {
            showInvalidMessage();
        }
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        if (box.innerText.length > 0) {
            box.innerText = '';
            currentGuess = currentGuess.substring(0, index) + ' ' + currentGuess.substring(index + 1);
        } else if (index > 0) {
            const prevBox = document.querySelector(`[data-row='${currentRow}'][data-index='${index - 1}']`);
            if (prevBox) {
                prevBox.focus();
                prevBox.innerText = '';
                currentGuess = currentGuess.substring(0, index - 1) + ' ' + currentGuess.substring(index);
            }
        }
    }
}

function showInvalidMessage() {
    const message = document.getElementById('invalid-message');
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}

let keyColorState = {};

function updateKeyboardColors() {
    const keys = document.querySelectorAll('.key');

    // Initialize keyColorState with existing colors if not set
    keys.forEach(key => {
        const char = key.innerText;
        if (!keyColorState[char]) {
            keyColorState[char] = '';
        }
    });

    const targetWordArray = targetWord.split('');
    const guessArray = currentGuess.split('');

    // First pass: check for green matches
    for (let i = 0; i < 5; i++) {
        const char = guessArray[i];
        if (char === targetWordArray[i]) {
            keyColorState[char] = 'green';
            targetWordArray[i] = null;
            guessArray[i] = null;
        }
    }

    // Second pass: check for yellow matches
    for (let i = 0; i < 5; i++) {
        const char = guessArray[i];
        if (char && targetWordArray.includes(char)) {
            if (keyColorState[char] !== 'green') {
                keyColorState[char] = 'yellow';
            }
            targetWordArray[targetWordArray.indexOf(char)] = null;
        }
    }

    // Third pass: assign gray if not already green or yellow
    for (let i = 0; i < 5; i++) {
        const char = guessArray[i];
        if (char && !targetWordArray.includes(char) && keyColorState[char] === '') {
            keyColorState[char] = 'gray';
        }
    }

    // Update the keyboard keys
    keys.forEach(key => {
        const char = key.innerText;
        key.style.backgroundColor = getColor(keyColorState[char]);
    });
}

function getColor(status) {
    switch (status) {
        case 'green':
            return '#6aaa64';
        case 'yellow':
            return '#c9b458';
        case 'gray':
            return '#787c7e';
        default:
            return '#eee'; // Default background color
    }
}