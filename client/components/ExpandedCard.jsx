import React, { useState, useEffect, useContext } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { TopicContext } from '../App';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function ExpandedCard({ currentCard, setCurrentCard, setCards, cards }) {
  //1) Configure inputs
  const [inputs, setInputs] = useState(currentCard);
  const { currentTopicId } = useContext(TopicContext);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    // console.log(inputs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentCard.id) {
      updateCard(currentCard.id);
    } else {
      addCard();
    }
    setInputs(null);
    setCurrentCard(null);
  };

  //2) Add a card
  const addCard = () => {
    fetch('http://localhost:3000/api/subtopic/', {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic_id: currentTopicId,
        title: inputs.title,
        emoji: inputs.emoji,
        text: inputs.text,
      }),
    })
      .then((newCardJSON) => newCardJSON.json())
      .then((newCard) => {
        setCards([...cards, newCard]);
      });
  };

  //3) Update a card
  const updateCard = (card_id) => {
    fetch('http://localhost:3000/api/subtopic/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: currentCard.id,
        title: inputs.title,
        emoji: inputs.emoji,
        text: inputs.text,
      }),
    })
      .then((updatedCardJSON) => updatedCardJSON.json())
      .then((updatedCard) => {
        const cardsCopy = [...cards];
        let index;
        cardsCopy.forEach((card, i) => {
          if (card._id === currentCard.id) index = i;
        });
        cardsCopy[index] = updatedCard;
        setCards(cardsCopy);
      });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    currentCard && (
      <div className="ExpandedCard">
        <div className="ExpandedCard-inner">
          <Button className="close-btn" onClick={() => setCurrentCard(null)}>
            close
          </Button>
          <form className="emojiform" action="" onSubmit={handleSubmit} style={{textAlign:'center'}}>
            <select name="emoji" value={inputs?.emoji || ''} onChange={handleChange}>
              <option value="😂">😂</option>
              <option value="🤨">🤨</option>
              <option value="😎">😎</option>
              <option value="❤️‍🔥">❤️‍🔥</option>
              <option value="😞">😞</option>
              <option value="🤬">🤬</option>
            </select>
            <TextField
              size="small"
              sx={{ m: 3 }}
              type="text"
              className="titleBody"
              placeholder="Add subtopic title..."
              name="title"
              onChange={handleChange}
              value={inputs?.title || ''}
            />
            <br></br>
            <textarea
              type="text"
              className="subtopicBody"
              placeholder="Add subtopic body..."
              name="text"
              onChange={handleChange}
              value={inputs?.text || ''}
            />
            <br></br>
            <Button
              variant="contained"
              type="submit"
              className="submitButtons"
              value="Save Subtopic"
            >
              Save Subtopic
            </Button>
          </form>
        </div>
      </div>
    )
  );}

export default ExpandedCard;
