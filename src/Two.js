import React, { Component } from 'react';
import './App.css';

class Two extends Component {
  state = {
    isAuthenticated: false,
    enteredPassword: '',
  };

  videoRef = React.createRef();

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

  formatTimeAMPM = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  logEvent = (eventType) => {
    const video = this.videoRef.current;
    const videoTime = video ? video.currentTime : null;
    const now = new Date();
    const timestamp = this.formatTimeAMPM(now);
    const date = now.toISOString().split('T')[0]; // e.g., "2025-04-21"

    const eventPayload = {
      eventType,
      timestamp,
      date,
      videoTime,
      vid: "2" // Hardcoded constant session ID
    };

    fetch('https://myprojectbot.com/api/vlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    }).catch((error) => {
      console.error('Error sending event log:', error);
    });
  };

  handlePlay = () => this.logEvent('play');
  handlePause = () => this.logEvent('pause');
  handleEnded = () => this.logEvent('ended');
  handleSeeked = () => this.logEvent('seeked');
  handleSeeking = () => this.logEvent('seeking');
  handleVolumeChange = () => this.logEvent('volumechange');

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isAuthenticated && prevState.isAuthenticated !== this.state.isAuthenticated) {
      const videoElement = this.videoRef.current;
      if (videoElement) {
        videoElement.addEventListener('play', this.handlePlay);
        videoElement.addEventListener('pause', this.handlePause);
        videoElement.addEventListener('ended', this.handleEnded);
        videoElement.addEventListener('seeked', this.handleSeeked);
        videoElement.addEventListener('seeking', this.handleSeeking);
        videoElement.addEventListener('volumechange', this.handleVolumeChange);
      }
    }
  }

  componentWillUnmount() {
    const videoElement = this.videoRef.current;
    if (videoElement) {
      videoElement.removeEventListener('play', this.handlePlay);
      videoElement.removeEventListener('pause', this.handlePause);
      videoElement.removeEventListener('ended', this.handleEnded);
      videoElement.removeEventListener('seeked', this.handleSeeked);
      videoElement.removeEventListener('seeking', this.handleSeeking);
      videoElement.removeEventListener('volumechange', this.handleVolumeChange);
    }
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
              ref={this.videoRef}
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
