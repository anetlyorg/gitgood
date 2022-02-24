import React, { useEffect, useState } from "react";
import Topic from "../components/Topic.jsx";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getTopics, postTopic } from "../store/stateSlice";

function Topics() {
  //get topics
  const topics = useSelector((state) => state.app.topics);
  const dispatch = useDispatch();
  useEffect(async () => {
    await dispatch(getTopics());
  }, []);

  //handle input
  const [input, setInput] = useState("");
  const handleChange = (e) => {
    setInput(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(postTopic(input));
    setInput("");
  };

  return (
    <div className="Nav">
      <button
        onClick={() => {
          dispatch(getTopics());
        }}
      ></button>
      <h2>Topics</h2>
      <form onSubmit={handleSubmit}>
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
      {topics &&
        topics.map((topic) => (
          <Topic key={topic.topic_id} topic={topic}></Topic>
        ))}
    </div>
  );
}

export default Topics;
