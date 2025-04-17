import './App.css';
import React, { Component } from 'react';

class One extends Component {
  state = {
    password: '',
    isAuthenticated: false,
    enteredPassword: '',
  };

  handleChange = (event) => {
    this.setState({ enteredPassword: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const hardcodedPassword = 'mturk'; // Replace with your hardcoded password
    if (this.state.enteredPassword === hardcodedPassword) {
      this.setState({ isAuthenticated: true });
    } else {
      alert('Incorrect password');
    }
  };

  logVideoEvent = (eventType) => {
    fetch('https://myprojectbot.com/api/video-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventType,
        timestamp: new Date().toISOString(),
        video: 'sample.mp4',
      }),
    }).catch((error) => {
      console.error('Error logging video event:', error);
    });
  };

  render() {
    return (
      <div className="App">
        {!this.state.isAuthenticated ? (
          <div className="form-container">
            <form onSubmit={this.handleSubmit}>
              <label>
                Enter Password:
                <input
                  type="password"
                  value={this.state.enteredPassword}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        ) : (
          <div className="video-container">
            <video
              id="myVideo"
              width="100%"
              height="100%"
              controls
              onPlay={() => this.logVideoEvent('play')}
              onPause={() => this.logVideoEvent('pause')}
              onEnded={() => this.logVideoEvent('ended')}
            >
              <source src="https://myprojectbot.com/video/sample.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    );
  }
}

export default One;
