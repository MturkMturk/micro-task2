import React, { Component } from 'react';
import './App.css';

class Two extends Component {
  state = {
    isAuthenticated: false,
    enteredPassword: '',
    pauseCount: 0, // Track the number of pauses
    seekCount: 0,  // Track the number of seeks
    volume: 1,     // Default volume level (max 1)
  };

  handleChange = (event) => {
    this.setState({ enteredPassword: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const hardcodedPassword = 'mturk';
    if (this.state.enteredPassword === hardcodedPassword) {
      this.setState({ isAuthenticated: true });
    } else {
      alert('Incorrect password');
    }
  };

  logEvent = (type, pauseCount = null, seekCount = null, volume = null) => {
    const eventPayload = {
      eventType: type,
      timestamp: new Date().toISOString(),
    };

    if (pauseCount !== null) {
      eventPayload.pauseCount = pauseCount; // Send pause count to the backend
    }

    if (seekCount !== null) {
      eventPayload.seekCount = seekCount; // Send seek count to the backend
    }

    if (volume !== null) {
      eventPayload.volume = volume; // Send volume level to the backend
    }

    fetch('https://myprojectbot.com/api/vlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    });
  };

  handlePause = () => {
    // Increment pause count every time the video is paused
    const newPauseCount = this.state.pauseCount + 1;
    this.setState({ pauseCount: newPauseCount });

    // Log the pause event with updated pause count
    console.log('Video is paused!', newPauseCount);
    this.logEvent('pause', newPauseCount); // Send pause count to backend
  };

  handlePlay = () => {
    console.log('Video is playing!');
    this.logEvent('play'); // Log play event
  };

  handleEnded = () => {
    console.log('Video ended!');
    this.logEvent('ended'); // Log ended event
  };

  handleSeeked = () => {
    // Increment seek count every time the video is seeked
    const newSeekCount = this.state.seekCount + 1;
    this.setState({ seekCount: newSeekCount });

    console.log('Video was seeked!', newSeekCount);
    this.logEvent('seeked', null, newSeekCount); // Send seek count to backend
  };

  handleSeeking = () => {
    console.log('Video is seeking!');
    this.logEvent('seeking'); // Log seeking event
  };

  handleVolumeChange = (e) => {
    const volume = e.target.volume; // Get the current volume
    this.setState({ volume });
    console.log(`Volume changed to: ${volume}`);
    this.logEvent('volumechange', null, null, volume); // Send volume change to the backend
  };

  componentDidMount() {
    // Get video element
    const videoElement = document.getElementById('videoElement');

    // Event listeners for play, pause, ended, seeked, seeking, volumechange
    videoElement.addEventListener('play', this.handlePlay);
    videoElement.addEventListener('pause', this.handlePause);
    videoElement.addEventListener('ended', this.handleEnded);
    videoElement.addEventListener('seeked', this.handleSeeked); // Listen for seeked
    videoElement.addEventListener('seeking', this.handleSeeking);
    videoElement.addEventListener('volumechange', this.handleVolumeChange);
  }

  componentWillUnmount() {
    // Cleanup event listeners when component unmounts
    const videoElement = document.getElementById('videoElement');
    videoElement.removeEventListener('play', this.handlePlay);
    videoElement.removeEventListener('pause', this.handlePause);
    videoElement.removeEventListener('ended', this.handleEnded);
    videoElement.removeEventListener('seeked', this.handleSeeked);
    videoElement.removeEventListener('seeking', this.handleSeeking);
    videoElement.removeEventListener('volumechange', this.handleVolumeChange);
  }

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
              id="videoElement" // Ensure the video element has the correct ID
              controls
              width="100%"
              height="auto"
            >
              <source src="https://myprojectbot.com/video/sample2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    );
  }
}

export default Two;
