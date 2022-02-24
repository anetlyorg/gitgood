import React, { useContext, useEffect, useState } from "react";
import Subtopic from "../components/Subtopic.jsx";
import ExpandedCard from "../components/ExpandedCard.jsx";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getSubtopics, updateCurrentSubtopic } from "../store/stateSlice";

function Subtopics() {
  // get subtopics
  const dispatch = useDispatch();
  const { currentTopicId, currentSubtopic, subtopics } = useSelector(
    (state) => state.app
  );
  useEffect(async () => {
    await dispatch(getSubtopics(currentTopicId));
  }, [currentTopicId]);

  return (
    currentTopicId && (
      <div className="CardContainer">
        <Button
          variant="contained"
          size="small"
          className="addSubtopic"
          onClick={async () => {
            await dispatch(updateCurrentSubtopic({}));
          }}
        >
          Add Subtopic
        </Button>

        <div className="subtopicsContainer">
          {subtopics &&
            subtopics.map((subtopic) => (
              <Subtopic key={subtopic._id} subtopic={subtopic}></Subtopic>
            ))}

          {currentSubtopic && <ExpandedCard />}
        </div>
      </div>
    )
  );
}

export default Subtopics;
