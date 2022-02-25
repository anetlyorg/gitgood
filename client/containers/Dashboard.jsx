import React, { useContext } from 'react';
import Topics from './Topics.jsx';
import Subtopics from './Subtopics.jsx';
import GithubLogin from '../components/GithubLogin';
import { TopicContext } from '../App.jsx';
import { AppBar, Typography, Button, Box } from '@mui/material';


function Dashboard() {
  return (
    <div className="Dashboard">
      {/* <header>
        <h1 id="mainTitle" className="GitGoodTitle">
          🤖GitGood
        </h1>
        <p id="subTitle" className="Tagline">
          Organize your coding resources ✅
        </p>
        <GithubLogin />
      </header> */}
      <AppBar sx={{backgroundColor: '#9e9e9e'}} position='static'>
        <Typography variant='h1' color='primary'>🤖GitGood</Typography>
        <Typography variant='h2' color='primary'>Organize your coding resources ✅</Typography>
        <GithubLogin />
      </AppBar>
      <Box>
        <div className="containers">
          <Topics />
          {/* <Subtopics /> */}
        </div>
      </Box>
    </div>
  );
}

export default Dashboard;
