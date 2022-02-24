import React, { useState, useEffect, useContext } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { TopicContext } from "../App";
import {
  postSubtopic,
  updateCurrentSubtopic,
  updateSubtopic,
} from "../store/stateSlice";
import { useDispatch, useSelector } from "react-redux";

function ExpandedCard() {
  const dispatch = useDispatch();
  const { currentTopicId, currentSubtopic, subtopics } = useSelector(
    (state) => state.app
  );

  const [newSubtopic, setNewSubtopic] = useState(currentSubtopic);

  useEffect(() => setNewSubtopic(currentSubtopic), [currentSubtopic]);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewSubtopic((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentSubtopic._id) {
      updateCard();
    } else {
      addCard();
    }
    setNewSubtopic(null);
    dispatch(updateCurrentSubtopic(null));
  };

  //Add a Subtopic
  const addCard = async () => {
    await dispatch(postSubtopic({ currentTopicId, newSubtopic }));
  };

  //Update a Subtopic
  const updateCard = async (card_id) => {
    await dispatch(updateSubtopic(newSubtopic));
  };

  return (
    currentSubtopic && (
      <div className="ExpandedCard">
        <div className="ExpandedCard-inner">
          <Button
            className="close-btn"
            onClick={() => dispatch(updateCurrentSubtopic(null))}
          >
            close
          </Button>
          <form action="" onSubmit={handleSubmit}>
            <TextField
              size="small"
              sx={{ m: 0.1 }}
              type="text"
              className="emojiBody"
              placeholder="Select emoji..."
              name="emoji"
              onChange={handleChange}
              value={newSubtopic?.emoji || ""}
            />{" "}
            <TextField
              size="small"
              sx={{ m: 3 }}
              type="text"
              className="titleBody"
              placeholder="Add subtopic title..."
              name="title"
              onChange={handleChange}
              value={newSubtopic?.title || ""}
            />
            <br></br>
            <textarea
              type="text"
              className="subtopicBody"
              placeholder="Add subtopic body..."
              name="text"
              onChange={handleChange}
              value={newSubtopic?.text || ""}
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
  );
}

export default ExpandedCard;
