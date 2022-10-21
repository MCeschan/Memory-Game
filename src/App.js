import './App.css'
import { useEffect, useState } from 'react'
import SingleCard from "./components/SingleCard"
import Swal from 'sweetalert2'




const cardImages = [
  { "src": "/img/kingnight.png", matched: false },
  { "src": "/img/jon.png", matched: false },
  { "src": "/img/tyron.png", matched: false },
  { "src": "/img/arya.png", matched: false },
  { "src": "/img/cersei.png", matched: false },
  { "src": "/img/daenerys.png", matched: false }
]

function App() {

  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)


  // 3 cosas: duplicate each card once because we need two of each card (so a user can match them together); it's going to randomize
  // the order of the cards in the array using the sort method; it's going to apply a random id to each of the 12 cards and
  //we'll use the id as a key for react when we're outputting them later in some kind of list.
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
    .sort(() => Math.random() - 0.5)
    .map((card) => ({ ...card, id: Math.random()}))

    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
  }
   
  const handleChoice = (card) =>{
    if(card.id === choiceOne?.id) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }
  
  const handleCheck = (cards) =>{
    if(cards.filter((card) => card.matched === false).length === 2){
      Swal.fire({
        title: 'We have a winner!',
        width: 600,
        confirmButtonText: 'New Game',
        padding: '3em',
        color: '#F0D844',
        imageUrl: 'https://i.gifer.com/6uE2.gif',
        imageWidth: 400,
        imageHeight: 250,
        imageAlt: 'Custom image',
        allowOutsideClick: false,
        background: '#1b1523',
        backdrop: `
          rgba(156,144,61,0.6)
          url("https://i.gifer.com/6mb.gif")
          left bottom
          no-repeat
        `
      })
      shuffleCards()
      setDisabled(false)
    } else{
      resetTurn()
    }
  }
  
//compare 2 selected cards
  useEffect(() =>{
    if (choiceOne && choiceTwo){
      setDisabled(true)
      if(choiceOne.src === choiceTwo.src){
        
        setCards(prevCards =>{
          return prevCards.map(card =>{
            if (card.src === choiceOne.src){
              return {...card, matched: true}
            } else{
              return card
            }
          })
          
        })
        handleCheck(cards)
       
      } else{
        
        setTimeout(() => resetTurn(), 1000)
      }
    }
    

  }, [choiceOne, choiceTwo])


  
// reset choices and increase turn
  const resetTurn = () =>{
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
    if(turns === 11){
      Swal.fire({
        title: 'Well...',
        width: 600,
        confirmButtonText: 'New Game',
        padding: '3em',
        color: '#F0D844',
        imageUrl: 'https://i.gifer.com/1Q1J.gif',
        imageWidth: 400,
        imageHeight: 250,
        imageAlt: 'Custom image',
        allowOutsideClick: false,
        background: '#1b1523',
        backdrop: `
          rgba(156,144,61,0.6)
          url("https://i.gifer.com/7VE.gif")
          left bottom
          no-repeat
        `
      })
      shuffleCards()
     }
  } 
//start a new game automatically
  useEffect(() => {
  shuffleCards()
  }, [])


  
  return (
    <div className="App">
      <h1>Memory Game</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="instructions">
        <p>You only have <br/> 12 turns <br/> to win.<br/>
        Be careful!</p>
      </div>
      <div className="turn">
      <p>Turns: {turns}</p>
      </div>
      
      <div className="card-grid">
        {cards.map(card =>(
          <SingleCard 
          key={card.id} 
          card={card} 
          handleChoice={handleChoice} 
          flipped={card === choiceOne || card === choiceTwo || card.matched}
          disabled={disabled}
          />
        ))}
        
      </div>
      
    </div>
  );
}

export default App