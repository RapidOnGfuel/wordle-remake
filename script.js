let words = [];
let targetWord = "";
let currentGuess = "";
let currentRow = 0;
let hint = null; // Store the hint once generated

// Fetch words from words.txt
fetch('words.txt')
    .then(response => response.text())
    .then(data => {
        words = data.split('\n').map(word => word.trim()).filter(word => word.length === 5);
        newRandomWord(); // Initialize with a random word after loading
    })
    .catch(error => console.error('Error loading words:', error));

function generateCode() {
    const wordInput = document.getElementById('word-input').value.toLowerCase();
    if (wordInput.length === 5) {
        const code = btoa(wordInput);
        alert(`Share this code: ${code}`);
    } else {
        alert('Please enter a 5-letter word.');
    }
}

function startGame() {
    const codeInput = document.getElementById('code-input').value;
    targetWord = decodeCode(codeInput) || getRandomWord();
    setupBoard();
}

function newRandomWord() {
    targetWord = getRandomWord();
    hint = null; // Reset hint for a new game
    setupBoard();
}

function decodeCode(code) {
    try {
        const decoded = atob(code);
        return decoded.length === 5 ? decoded : null;
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

    // Add hint button functionality
    const hintButton = document.getElementById('hint-button');
    hintButton.addEventListener('click', showHint);
}

function handleInput(event) {
    const box = event.target;
    const index = parseInt(box.getAttribute('data-index'));
    const row = parseInt(box.getAttribute('data-row'));

    if (row !== currentRow) return;

    let char = box.innerText.trim().toLowerCase();
    
    if (char.length > 1) {
        char = char[0];
        box.innerText = char;
    }

    currentGuess = currentGuess.substring(0, index) + char + currentGuess.substring(index + 1);

    // Ensure currentGuess is always 5 characters long
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
        if (currentGuess.trim().length === 5 && words.includes(currentGuess.trim())) {
            checkGuess();
        } else {
            showInvalidMessage();
        }
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        if (box.innerText.length > 0) {
            box.innerText = ''; // Clear the current box
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
    }, 2000); // Fade out after 2 seconds
}

function showHint() {
    if (!hint) {
        const hintIndex = Math.floor(Math.random() * targetWord.length);
        hint = `The ${hintIndex + 1}${getOrdinalSuffix(hintIndex + 1)} letter is "${targetWord[hintIndex].toUpperCase()}"`;
    }
    const hintPopup = document.createElement('div');
    hintPopup.id = 'hint-popup';
    hintPopup.innerHTML = `<p>${hint}</p><button onclick="closeHint()">Close</button>`;
    document.body.appendChild(hintPopup);
    hintPopup.classList.add('show');
}

function closeHint() {
    const hintPopup = document.getElementById('hint-popup');
    if (hintPopup) {
        hintPopup.remove();
    }
}

function getOrdinalSuffix(n) {
    if (n === 1) return 'st';
    if (n === 2) return 'nd';
    if (n === 3) return 'rd';
    return 'th';
}

function checkGuess() {
    const boxes = document.querySelectorAll(`[data-row='${currentRow}']`);
    const feedback = [];
    
    for (let i = 0; i < 5; i++) {
        const char = currentGuess[i];
        const box = boxes[i];
        
        if (char === targetWord[i]) {
            box.classList.add('green');
            feedback.push('green');
        } else if (targetWord.includes(char)) {
            box.classList.add('yellow');
            feedback.push('yellow');
        } else {
            box.classList.add('gray');
            feedback.push('gray');
        }
        
        box.contentEditable = false; // Make current row uneditable
    }
    

    if (currentGuess.trim() === targetWord) {
        alert("Congratulations! You've guessed the word!");
    } else if (currentRow < 5) {
        currentRow++;
        currentGuess = ''; // Reset currentGuess for the new row
        const nextRowBoxes = document.querySelectorAll(`[data-row='${currentRow}']`);
        nextRowBoxes.forEach(box => {
            box.contentEditable = true;
            box.addEventListener('input', handleInput);
            box.addEventListener('keydown', handleKeyDown);
        });
        nextRowBoxes[0].focus(); // Focus on the first box of the next row
    } else {
        alert(`Game over! The word was: ${targetWord}`);
    }
}