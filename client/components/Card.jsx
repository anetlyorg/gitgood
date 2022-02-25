import React, { useState, useEffect } from 'react';
import { Button, Typography, Card as MuiCard, IconButton, Grid, Box, CardActions, CardContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Draggable } from 'react-beautiful-dnd';

function Card({ card, setCurrentCard, index, subtopics, setSubtopics, currSubtopicsOrder, setCurrSubtopicsOrder }) {
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
    const newSubtopicsOrder = currSubtopicsOrder.slice();
    newSubtopicsOrder.splice(currSubtopicsOrder.indexOf(Number(card_id)), 1);
    console.log('new order', newSubtopicsOrder);
    
    fetch(`http://localhost:3000/api/subtopic/${card_id}/${JSON.stringify(newSubtopicsOrder)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      // .then((data) => data.json())
      .then((data) => {
        console.log('delete subtopic data', data);
        const subtopicsCopy = {...subtopics};
        delete subtopicsCopy[Number(card_id)];
        console.log('before set', subtopics, subtopicsCopy);
        setSubtopics(subtopicsCopy);
        setCurrSubtopicsOrder(newSubtopicsOrder);
        // let index;
        // cardsCopy.forEach((cur, i) => {
        //   if (cur._id === card_id) index = i;
        // });
        // cardsCopy.splice(index, 1);
        // setCards(cardsCopy);
      });
  };

  return (
    <>
      {card && <div className="waiting">
        <Draggable draggableId={card._id.toString()} index={index}>
          {(provided, snapshot) => (
            <MuiCard
              sx={{ width: 1, zIndex: 99, border: '1px solid black', backgroundColor: '#b3e5fc' }}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <CardContent align='center'>
                <Typography variant='h4' sx={{ mb: 1.5 }} color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="body2">
                  {card.emoji + ' ' + card.text}
                </Typography>
              </CardContent>
              <Box>
                <CardActions>
                  {/* <Button size="small">Learn More</Button> */}
                  <Box sx={{display: 'flex', justifyContent:'center', width: 1}}>
                    <IconButton
                      className="cardButton"
                      variant="text"
                      size="small"
                      onClick={() => deleteCard(card._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Box>
            </MuiCard>
          // <muiCard 
          //   className='draggableCard'
          // {...provided.draggableProps}
          // {...provided.dragHandleProps}
          // ref={provided.innerRef}>
          //   <Typography variant='h4' onClick={handleClick} style={{ cursor: 'pointer' }}>
          //     {card.title}
          //   </Typography>
          //   <p>{card.emoji + ' ' + card.text}</p>
          // </muiCard>
          )}

        </Draggable>
        {/* </div> */}
      </div> }
    </>
  );
}

export default Card;
