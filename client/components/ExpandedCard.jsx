import React, { useState, useEffect } from 'react';
// import './ExpandedCard.css';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function ExpandedCard(props) {

  const handleSubmit = (e) => {
    e.preventDefault();
    props.setTrigger(false);
    if(props.currentCardId) {
      props.updateCard(props.currentCardId);
    }
    else {
      props.addCard();
    }
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log(event);
    // props.emojiTextEntry()
  };

  const handleClose = (event) => {
    setAnchorEl(null);
    console.log('SET TEXT VALUE HERE');
    console.log(event.target.innerText);
    props.emojiTextEntry(event.target.innerText);
  };

  return (props.trigger) ? (
    <div className="ExpandedCard">
      <div className="ExpandedCard-inner">
        <Button className="close-btn" onClick={() => props.setTrigger(false)}>close</Button>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
        Select Emoji
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleClose}>😂</MenuItem>
          <MenuItem onClick={handleClose}>🤨</MenuItem>
          <MenuItem onClick={handleClose}>😎</MenuItem>
          <MenuItem onClick={handleClose}>❤️‍🔥</MenuItem>
          <MenuItem onClick={handleClose}>😞</MenuItem>
          <MenuItem onClick={handleClose}>🤬</MenuItem>
        </Menu>
        <form action='' onSubmit={handleSubmit}>
          <TextField 
            size='small'
            sx={{ m: 0.1 }} 
            type='text' 
            className='emojiBody'
            placeholder='emoji...' 
            onChange={(e) => props.emojiTextEntry(e)} 
            value={props.emojiText}
          /> 
          <TextField 
            size="small" 
            sx={{ m: 3 }}
            type='text' 
            className='titleBody' 
            placeholder='Add subtopic title...' 
            onChange={(e) => props.cardTextEntry(e)} 
            value={props.cardText}
          />
          <br></br>
          <textarea type='text' className='subtopicBody' placeholder='Add subtopic body...' onChange={(e) => props.bodyTextEntry(e)} value={props.bodyText}/><br></br>
          <Button variant="contained" type='submit' className='submitButtons' value="Save Subtopic">Save Subtopic</Button>
        </form>
      </div>
    </div>
  ) : '';
}
// sx={{ m: 0.5 }}
export default ExpandedCard;