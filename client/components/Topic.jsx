import React, { useContext, useState, useEffect } from 'react';
import { Button, ButtonGroup, Grid, Typography } from '@mui/material';
import { TopicContext } from '../App';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from '@mui/material';

import { Droppable } from 'react-beautiful-dnd';

import Card from './Card.jsx';
import ExpandedCard from './ExpandedCard.jsx';

function Topic({ topic_id, topic, setTopics, topics, topicsOrder, setTopicsOrder, subtopics, setSubtopics, subtopicsOrder, isDragging }) {
  const { setCurrentTopicId } = useContext(TopicContext);
  
  const [currSubtopicsOrder, setCurrSubtopicsOrder] = useState(subtopicsOrder);

  const [currentCard, setCurrentCard] = useState(null);

  const deleteTopic = (topic_id) => {
    const newTopicsOrder = topicsOrder.slice();
    newTopicsOrder.splice(topicsOrder.indexOf(Number(topic_id)), 1);
    console.log('new order', newTopicsOrder);

    fetch(`http://localhost:3000/api/topic/${topic_id}/${JSON.stringify(newTopicsOrder)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((data) => {
      console.log(data);
      const topicsCopy = { ...topics };
      delete topicsCopy[topic_id];
      setTopics(topicsCopy);
      setTopicsOrder(newTopicsOrder);
    });
  };

  // const cardsFeed = [];
  // currSubtopicsOrder.forEach((sub, index) => {
  //   console.log('card', subtopics[sub]);
  //   cardsFeed.push(
  //     <Card
  //       key={sub}
  //       card={subtopics[sub]}
  //       setCurrentCard={setCurrentCard}
  //       // cards={cards}
  //       // setCards={setCards}
  //       index={index}
  //       subtopics={subtopics}
  //       setSubtopics={setSubtopics}
  //       currSubtopicsOrder={currSubtopicsOrder}
  //       setCurrSubtopicsOrder={setCurrSubtopicsOrder}
  //     />
  //   );
  // }); 
  
  return (
    <div className="Topic" style={{backgroundColor: isDragging ? 'green' : 'white'}}>
      <Grid container direction='column' align='center'>
        <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant='h3' onClick={() => setCurrentTopicId(topic_id)} align='center'>{topic}</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            size="small"
            className="deleteIconButtons"
            onClick={() => deleteTopic(topic_id)}
            sx={{m: 2}}       >
            <DeleteIcon />
            delete topic
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            size="small"
            className="addSubtopic"
            onClick={() => {
              setCurrentCard({});
            }}
          >
            <AddBoxIcon />
             add a subtopic
          </Button>
        </Grid>

      </Grid>
      <div className="subtopicsContainer">
        <Droppable droppableId={topic_id.toString()}>
          {(provided, snapshot) => (
            <div
              className="subtopicsDroppable"
              ref={provided.innerRef}
              {...provided.droppableProps}>
              {currSubtopicsOrder && subtopicsOrder.map((sub, index) => {
                console.log('card', subtopics[sub]);
                return (
                  <div key={sub} className="CardContainer">
                   
                    <Card
                      key={`subtopic ${sub}`}
                      card={subtopics[sub]}
                      setCurrentCard={setCurrentCard}
                      // cards={cards}
                      // setCards={setCards}
                      index={index}
                      subtopics={subtopics}
                      setSubtopics={setSubtopics}
                      currSubtopicsOrder={currSubtopicsOrder}
                      setCurrSubtopicsOrder={setCurrSubtopicsOrder}
                    />
                  </div>
                );
              })}
              {provided.placeholder}
            </div>
          )}
          
        </Droppable>
        
        
        {/* {cardsFeed} */}

        <ExpandedCard
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          currentTopicId={topic_id}
          subtopics={subtopics}
          setSubtopics={setSubtopics}
          currSubtopicsOrder={currSubtopicsOrder}
          setCurrSubtopicsOrder={setCurrSubtopicsOrder}
          // cards={cards}
          // setCards={setCards}
        />
      </div>
    </div>
    
  );
}

export default Topic;
