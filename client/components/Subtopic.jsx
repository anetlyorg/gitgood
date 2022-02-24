import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { deleteSubtopic, updateCurrentSubtopic } from "../store/stateSlice";
import { useDispatch } from "react-redux";

function Subtopic({ subtopic }) {
  const dispatch = useDispatch();

  //Update subtopic
  function handleClick() {
    dispatch(
      updateCurrentSubtopic({
        _id: subtopic._id,
        emoji: subtopic.emoji,
        title: subtopic.title,
        text: subtopic.text,
      })
    );
  }

  //Delete subtopic
  const deleteCard = async (subtopicId) => {
    await dispatch(deleteSubtopic(subtopicId));
  };

  return (
    <div className="Card">
      <h3 onClick={handleClick} style={{ cursor: "pointer" }}>
        {subtopic.title}
      </h3>
      <p>{subtopic.emoji + " " + subtopic.text}</p>
      <Button
        className="cardButton"
        variant="text"
        size="small"
        onClick={() => deleteCard(subtopic._id)}
      >
        X
      </Button>
    </div>
  );
}

export default Subtopic;
