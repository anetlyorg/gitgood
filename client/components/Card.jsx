import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

function Card({ card, setCurrentCard, index }) {
  //1) Config popup with card data
  function handleClick() {
    setCurrentCard({
      id: card._id,
      emoji: card.emoji,
      title: card.title,
      text: card.text,
    });
  }
  console.log('subtopic card', card, setCurrentCard);
  //2) Delete a card
  const deleteCard = (card_id) => {
    const newSubtopicsOrder = subtopicsOrder.slice();
    newSubtopicsOrder.splice(subtopicsOrder.indexOf(Number(card_id)), 1);
    console.log('new order', newSubtopicsOrder);
    
    fetch(`http://localhost:3000/api/subtopic/${card_id}/${JSON.stringify(newSubtopicsOrder)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => data.json())
      .then((data) => {
        const cardsCopy = [...cards];
        let index;
        cardsCopy.forEach((cur, i) => {
          if (cur._id === card_id) index = i;
        });
        cardsCopy.splice(index, 1);
        setCards(cardsCopy);
      });
  };

  return (
    <div className="Card">
      {card && <div className="waiting">
        <h3 onClick={handleClick} style={{ cursor: 'pointer' }}>
          {card.title}
        </h3>
        <p>{card.emoji + ' ' + card.text}</p>
      </div>}
     
      <Button
        className="cardButton"
        variant="text"
        size="small"
        onClick={() => deleteCard(card._id)}
      >
        X
      </Button>
    </div>
  );
}

export default Card;
