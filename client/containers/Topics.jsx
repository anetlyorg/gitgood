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
  topicsOrder.forEach((topic_id, index) => {
    // for (const topic_id in topics) {
    topicsFeed.push(
      <Draggable draggableId={topic_id} index={index}>
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
    // }
  });
  

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
    const { destination, source, draggableId, type } = result;
    source.index = Number(source.index);
    destination.index = Number(destination.index);

    if (!destination) return;

    if (destination.droppableId === source.droppableId 
      && destination.index === source.index) return;

    if (type === 'column') {
      console.log('column drop', source, destination, draggableId);
      const newTopicsOrder = topicsOrder.slice();
      newTopicsOrder.splice(source.index, 1);
      newTopicsOrder.splice(destination.index, 0, draggableId);
      console.log('new topics order', newTopicsOrder);
      setTopicsOrder(newTopicsOrder);
      
      fetch(`http://localhost:3000/api/topic/newOrder/${JSON.stringify(newTopicsOrder)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((data) => {
        console.log(data);
      });
      return;
    }

    const start = topics[source.droppableId];
    const finish = topics[destination.droppableId];

    if (start === finish) {
      const newSubtopicsOrder = start.subtopics_order.slice();
      newSubtopicsOrder.splice(source.index, 1);
      newSubtopicsOrder.splice(destination.index, 0, draggableId);

      const newTopic = {
        ...start,
        subtopics_order: newSubtopicsOrder
      };

      const newTopics = {
        ...topics,
        [newTopic._id]: newTopic
      };

      setTopics(newTopics);

      fetch(`http://localhost:3000/api/subtopic/newOrderOne/${newTopic._id}/${JSON.stringify(newSubtopicsOrder)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((data) => {
        console.log(data);
      });
      return;
    }

    const startSubtopicsOrder = start.subtopics_order.slice();
    startSubtopicsOrder.splice(source.index, 1);
    const newStartTopic = {
      ...start,
      subtopics_order: startSubtopicsOrder
    };

    fetch(`http://localhost:3000/api/subtopic/newOrderOne/${newStartTopic._id}/${JSON.stringify(startSubtopicsOrder)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((data) => {
      console.log(data);
    });

    const finishSubtopicsOrder = finish.subtopics_order.slice();
    finishSubtopicsOrder.splice(destination.index, 0, draggableId);
    const newFinishTopic = {
      ...finish,
      subtopics_order: finishSubtopicsOrder
    };

    fetch(`http://localhost:3000/api/subtopic/newOrderOne/${newFinishTopic._id}/${JSON.stringify(finishSubtopicsOrder)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((data) => {
      console.log(data);
    });

    const newTopics = {
      ...topics,
      [newStartTopic._id]: newStartTopic,
      [newFinishTopic._id]: newFinishTopic
    };

    setTopics(newTopics);
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
        <Droppable 
          droppableId='all-topics'
          direction='horizontal'
          type='column'>
          {(provided) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps} 
              className='topicsContainer'>
              {/* {topicsFeed} */}
              {topicsOrder.map((topic_id, index) => (
                <Draggable draggableId={topic_id.toString()} index={index} key={topic_id}>
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
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Topics;
