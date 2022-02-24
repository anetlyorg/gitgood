import React, { useContext } from "react";
import { Button } from "@mui/material";
import { TopicContext } from "../App";
import { updateCurrentTopicId } from "../store/stateSlice";
import { useDispatch } from "react-redux";
import { deleteTopic } from "../store/stateSlice";

function Topic({ topic }) {
  const dispatch = useDispatch();

  const { _id, topic_name } = topic;

  return (
    <div className="Topic">
      <h3 style={{ cursor: "pointer" }}>
        <span
          onClick={() => {
            dispatch(updateCurrentTopicId(_id));
          }}
        >
          {topic_name}
        </span>
        <Button
          variant="text"
          size="small"
          className="deleteButtons"
          onClick={() => dispatch(deleteTopic(_id))}
        >
          X
        </Button>
      </h3>
    </div>
  );
}

export default Topic;
