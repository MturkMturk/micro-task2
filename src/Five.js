import React, { Component } from 'react';
import './App.css';

class Five extends Component {
  state = {
    isAuthenticated: false,
    enteredPassword: '',
    pauseCount: 0,
    seekCount: 0,
    volume: 1,
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

  logEvent = (type, pauseCount = null, seekCount = null, volume = null) => {
    const currentDate = new Date().toISOString().split('T')[0];

    const eventPayload = {
      eventType: type,
      timestamp: new Date().toISOString(),
      date: currentDate,
    };

    if (pauseCount !== null) eventPayload.pauseCount = pauseCount;
    if (seekCount !== null) eventPayload.seekCount = seekCount;
    if (volume !== null) eventPayload.volume = volume;

    fetch('https://myprojectbot.com/api/vlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    }).catch(() => {
      // silently fail or add error handling logic if needed
    });
  };

  handlePause = () => {
    const newPauseCount = this.state.pauseCount + 1;
    this.setState({ pauseCount: newPauseCount });
    this.logEvent('pause', newPauseCount);
  };

  handlePlay = () => {
    this.logEvent('play');
  };

  handleEnded = () => {
    this.logEvent('ended');
  };

  handleSeeked = () => {
    const newSeekCount = this.state.seekCount + 1;
    this.setState({ seekCount: newSeekCount });
    this.logEvent('seeked', null, newSeekCount);
  };

  handleSeeking = () => {
    this.logEvent('seeking');
  };

  handleVolumeChange = (e) => {
    const volume = e.target.volume;
    this.setState({ volume });
    this.logEvent('volumechange', null, null, volume);
  };

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
              <source src="https://myprojectbot.com/video/sample5.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    );
  }
}

export default Five;
