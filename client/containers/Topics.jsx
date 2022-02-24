import React, { useEffect, useState } from 'react';
import Topic from '../components/Topic.jsx';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Topics() {
  //1) Get topics
  const [topics, setTopics] = useState({});
  const [topicsOrder, setTopicsOrder] = useState([]);
  const [subtopics, setSubtopics] = useState({});

  useEffect(() => {
    getTopics();
  }, []);

  function getTopics() {
    const url = 'http://localhost:3000/api/topic';
    fetch(url)
      .then((topicsJSON) => {
        return topicsJSON.json();
      })
      .then((result) => {
        setTopics(result.topics);
        setTopicsOrder(result.topicsOrder);
        setSubtopics(result.subtopics);
        console.log('topics', result.topics, 'order', result.topicsOrder, 'subtopics', result.subtopics);
      })
      .catch((err) => console.log('err', err));
  }

  const topicsFeed = [];
  for (const topic_id in topics) {
    topicsFeed.push(
      <Draggable draggableId={topic_id} index={Number(topic_id)}>
        {(provided) => (
          <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <Topic
              key={topic_id}
              topic_id={topic_id}
              topic={topics[topic_id].topic_name}
              setTopics={setTopics}
              topics={topics}
              topicsOrder={topicsOrder}
              setTopicsOrder={setTopicsOrder}
              subtopics={subtopics}
              subtopicsOrder={topics[topic_id].subtopics_order}
            />
          </div>
        )}
      </Draggable>
      
    );
  }

  //2) Handle new topic
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/topic', {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic_name: input,
      }),
    })
      .then((newTopicJSON) => newTopicJSON.json())
      .then((newTopic) => {
        setTopics({ ...topics, [newTopic._id]: newTopic.topic_name });
        setTopicsOrder([...topicsOrder, newTopic._id]);
        setInput('');
      });
  };

  const onDragEnd = (result) => {

  };

  return (
    <div className="CardContainer">
      <h2>Topics</h2>
      <form action="" onSubmit={handleSubmit}>
        <TextField
          sx={{ m: 0.5 }}
          size="small"
          type="text"
          className="entryForm"
          placeholder="Add Topic..."
          onChange={handleChange}
          value={input}
        />
        <Button
          sx={{ m: 0.5 }}
          variant="contained"
          size="small"
          type="submit"
          className="submitButtons"
        >
          Submit
        </Button>
      </form>
      <br></br>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='all-topics'>
          {(provided) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps} 
              direction='horizontal'
              type='column'
              className='topicsContainer'>
              {topicsFeed}
              {/* {topicsOrder.map((topic_id) => (
        <Topic
          key={topic_id}
          topic_id={topic_id}
          topic={topics[topic_id]}
          setTopics={setTopics}
          topics={topics}
          topicsOrder={topicsOrder}
        />
      ))} */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Topics;
