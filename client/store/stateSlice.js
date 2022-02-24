import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  topics: null,
  currentTopicId: null,
  subtopics: null,
  currentSubtopic: null,
};

export const getTopics = createAsyncThunk("topics/getTopics", async () => {
  const url = "http://localhost:3000/api/topic";
  const topics = await fetch(url).then((data) => {
    return data.json();
  });
  return topics;
});

export const postTopic = createAsyncThunk(
  "topics/postTopic",
  async (topicName) => {
    const url = "http://localhost:3000/api/topic";
    const newTopic = await fetch(url, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic_name: topicName,
      }),
    }).then((data) => data.json());
    return newTopic;
  }
);

export const deleteTopic = createAsyncThunk(
  "topics/deleteTopic",
  async (topicId) => {
    const url = `http://localhost:3000/api/topic/${topicId}`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return topicId;
  }
);

export const getSubtopics = createAsyncThunk(
  "subtopics/getSubtopics",
  async (currentTopicId) => {
    if (!currentTopicId) return;
    const url = `http://localhost:3000/api/subtopic/${currentTopicId}`;
    const subtopics = await fetch(url).then((data) => data.json());
    return subtopics;
  }
);

export const postSubtopic = createAsyncThunk(
  "subtopics/postSubtopic",
  async (payload) => {
    const { currentTopicId, newSubtopic } = payload;
    const { title, emoji, text } = newSubtopic;
    console.log(currentTopicId, title);
    const url = `http://localhost:3000/api/subtopic/`;
    const newSubtopicData = await fetch(url, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic_id: currentTopicId,
        title,
        emoji,
        text,
      }),
    }).then((data) => data.json());
    return newSubtopicData;
  }
);

export const updateSubtopic = createAsyncThunk(
  "subtopics/updateSubtopic",
  async (currentSubtopic) => {
    const { _id, title, emoji, text } = currentSubtopic;
    const url = `http://localhost:3000/api/subtopic/`;
    const updatedCard = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
        title,
        emoji,
        text,
      }),
    }).then((updatedCardJSON) => updatedCardJSON.json());
    console.log("updatedCard=>", updatedCard);
    return updatedCard;
  }
);

export const deleteSubtopic = createAsyncThunk(
  "subtopics/deleteSubtopic",
  async (subtopicId) => {
    const url = `http://localhost:3000/api/subtopic/${subtopicId}`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return subtopicId;
  }
);

export const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    updateCurrentTopicId(state, action) {
      state.currentTopicId = action.payload;
      console.log("state.currentTopicId=>", state.currentTopic);
    },
    updateCurrentSubtopic(state, action) {
      state.currentSubtopic = action.payload;
      console.log("state.currentSubtopic=>", state.currentSubtopic);
    },
  },
  extraReducers(builder) {
    builder.addCase(getTopics.fulfilled, (state, action) => {
      state.topics = action.payload;
      console.log("state.topics=>", state.topics);
    });
    builder.addCase(postTopic.fulfilled, (state, action) => {
      state.topics.push(action.payload);
      console.log("state.topics=>", state.topics);
    });
    builder.addCase(deleteTopic.fulfilled, (state, action) => {
      state.topics = state.topics.filter(
        (topic) => topic._id !== action.payload
      );
      console.log("state.topics=>", state.topics);
    });
    builder.addCase(getSubtopics.fulfilled, (state, action) => {
      state.subtopics = action.payload;
      console.log("state.subtopics=>", state.subtopics);
    });
    builder.addCase(postSubtopic.fulfilled, (state, action) => {
      state.subtopics.push(action.payload);
      console.log("state.subtopics=>", state.subtopics);
    });
    builder.addCase(updateSubtopic.fulfilled, (state, action) => {
      state.subtopics = state.subtopics.filter(
        (subtopic) => subtopic._id !== action.payload._id
      );
      state.subtopics.push(action.payload);
      console.log("state.subtopics=>", state.subtopics);
    });
    builder.addCase(deleteSubtopic.fulfilled, (state, action) => {
      state.subtopics = state.subtopics.filter(
        (subtopic) => subtopic._id !== action.payload
      );
    });
  },
});

export const { updateCurrentTopicId, updateCurrentSubtopic } =
  stateSlice.actions;

export default stateSlice.reducer;
