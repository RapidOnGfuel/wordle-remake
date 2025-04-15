
# Wordle Remake

A simple Wordle clone created using HTML, CSS, and JavaScript. This project allows you to guess a five-letter word with feedback on each guess, similar to the popular Wordle game.

## Features

- Guess a five-letter word with feedback on correct letters and positions.
- Randomized hints to help you if you're stuck.
- Code generation for sharing custom words with friends.
- Responsive design and smooth user interface.


#### (Nerd Features)
- Hashing for custom codes so that no one can know what word you gave them. (Base64 lol)
- Only allow one hint per page, making sure no one gets more than one at one given time.
- Invalid Word detection (ensuring users cant just spam letters)
- Color coding based on guess (Green = Right Spot , Yellow = Wrong Spot , Grey = Wrong Letter)

## Getting Started

### Prerequisites

To run this project locally, you need to have [Python](<https://www.python.org/downloads/>) installed to start a simple HTTP server.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RapidOnGfuel/wordle-remake
   cd wordle-remake
   ```

2. **Start a local server** (same place where you did cd Wordle-Remake):

   - **Using Python 3**:
     ```bash
     python -m http.server 8000
     ```

   - **Using Python 2**:
     ```bash
     python -m SimpleHTTPServer 8000
     ```

3. **Open the game**:
   - Open your web browser and go to `http://localhost:8000` to start playing the game.

## Usage

- Enter your guesses and receive feedback on each attempt.
- Click the "Stuck?" button for a hint if you're having trouble.
- Share custom words with friends using the code generation feature.

## Check it out

Check out the live version of this project here: [Wordle Remake](<http://rapidongfuel.github.io/wordle-remake/>)


## Errors:
- Know of an Error and Want to report it? Please open a Issue, describe your issue, along side the steps to recreate it and then I will look into the issue and fix it. 

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes, and then include what you changed.

## License

This project is open-source, and available for anyone to copy as long as you credit me.
