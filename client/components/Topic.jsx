import React, { useContext, useState } from 'react';
import { Button } from '@mui/material';
import { TopicContext } from '../App';

import Card from './Card.jsx';
import ExpandedCard from './ExpandedCard.jsx';

function Topic({ topic_id, topic, setTopics, topics, topicsOrder, setTopicsOrder, subtopics, subtopicsOrder }) {
  const { setCurrentTopicId } = useContext(TopicContext);

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
      const topicsCopy = { ...topics };
      delete topicsCopy[topic_id];
      setTopics(topicsCopy);
      setTopicsOrder(newTopicsOrder);
    });
  };

  const cardsFeed = [];
  subtopicsOrder.forEach((sub, index) => {
    console.log('card', subtopics[sub]);
    cardsFeed.push(
      <Card
        key={sub}
        card={subtopics[sub]}
        setCurrentCard={setCurrentCard}
        // cards={cards}
        // setCards={setCards}
        index={index}
      />
    );
  }); 
  

  return (
    <div className="Topic">
      <h3 style={{ cursor: 'pointer' }}>
        <span onClick={() => setCurrentTopicId(topic_id)}>{topic}</span>
        <Button
          variant="text"
          size="small"
          className="deleteButtons"
          onClick={() => deleteTopic(topic_id)}
        >
          X
        </Button>
      </h3>
      <div className="subtopicsContainer">
        {subtopicsOrder && subtopicsOrder.map((sub, index) => {
          console.log('card', subtopics[sub]);
          return (
            <div key={sub} className="CardContainer">
              <Button
                variant="contained"
                size="small"
                className="addSubtopic"
                onClick={() => {
                  setCurrentCard({});
                }}
              >
                Add Subtopic
              </Button>
              <Card
                // key={sub}
                card={subtopics[sub]}
                setCurrentCard={setCurrentCard}
                // cards={cards}
                // setCards={setCards}
                index={index}
              />
            </div>
          );
        })}
        {/* {cardsFeed} */}

        <ExpandedCard
          currentCard={currentCard}
          setCurrentCard={setCurrentCard}
          // cards={cards}
          // setCards={setCards}
        />
      </div>
    </div>
    
  );
}

export default Topic;
