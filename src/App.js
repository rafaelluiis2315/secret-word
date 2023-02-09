// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from "react";

// Data
import { wordsList } from "./data/words"

// Componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCantegory, setPickedCantegory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);


  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const cantegory = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    const word = words[cantegory][Math.floor(Math.random() * words[cantegory].length)];

    return { cantegory, word };
  }, [words])

  // Start gamer
  const startGame = useCallback(() => {
    //clear all letter
    clearLetterStates();

    // Pick word and pick cantegory
    const { cantegory, word } = pickWordAndCategory();

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());


    setPickedCantegory(cantegory);
    setPickedWord(word);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
  }, [pickWordAndCategory])
  // Process and verify latter in input
  const verifyLetter = (letter) => {
    
    const normalizedLetter =  letter.toLowerCase();
    
    // verify if letter has already been  utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return
    }

    // push guessed letter or remove a guess
    if(letters.includes(normalizedLetter)){
      setGuessedLetters( (actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ])
    } else{
      setWrongLetters( (actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])
      setGuesses((actualGuesses) => actualGuesses - 1);
    }

  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if(guesses <= 0){
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() =>{
    const uniqueLetter = [...new Set(letters)];

    if(guessedLetters.length === uniqueLetter.length){
      // add score
      setScore((actualScore) => actualScore += 100);

      // restart game with new word
      startGame();
    }

  },[guessedLetters, letters, startGame])

  // Retry gamer
  const retry = () => {
    setScore(0)
    setGuesses(3)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCantegory={pickedCantegory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score} />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
