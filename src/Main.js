import React, { Component } from 'react';
import './App.css';

class Main extends Component {
  state = {
    isAuthenticated: false,
    enteredPassword: '',
  };

  videoRef = React.createRef();

  // ===== CONFIG =====
  IDLE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes after pause/end

  // ===== INTERNAL FLAGS =====
  isVideoPlaying = false;
  idleTimer = null;

  // ===== AUTH =====
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

  // ===== TIME FORMAT =====
  formatTimeAMPM = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // ===== LOGGING =====
  logEvent = (eventType) => {
    const video = this.videoRef.current;
    const videoTime = video ? video.currentTime : null;
    const now = new Date();

    const eventPayload = {
      eventType,
      timestamp: this.formatTimeAMPM(now),
      date: now.toISOString().split('T')[0],
      videoTime,
      vid: '0',
    };

    fetch('https://myprojectbot.com/api/vlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    }).catch(() => {});
  };

  // ===== VIDEO HANDLERS =====
  handlePlay = () => {
    this.isVideoPlaying = true;
    clearTimeout(this.idleTimer);
    this.logEvent('play');
  };

  handlePause = () => {
    this.isVideoPlaying = false;
    this.startIdleTimer();
    this.logEvent('pause');
  };

  handleEnded = () => {
    this.isVideoPlaying = false;
    this.startIdleTimer();
    this.logEvent('ended');
  };

  handleSeeked = () => this.logEvent('seeked');
  handleSeeking = () => this.logEvent('seeking');
  handleVolumeChange = () => this.logEvent('volumechange');

  // ===== IDLE TIMER =====
  startIdleTimer = () => {
    if (!this.state.isAuthenticated || this.isVideoPlaying) return;

    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.lockSession();
    }, this.IDLE_TIMEOUT_MS);
  };

  // ===== LOCK =====
  lockSession = () => {
    if (this.videoRef.current) {
      this.videoRef.current.pause();
    }

    // Hard refresh ensures password screen
    window.location.reload();
  };

  // ===== VISIBILITY / BACKGROUND (iOS SAFE) =====
  handleVisibilityChange = () => {
    if (document.hidden && this.state.isAuthenticated) {
      this.lockSession();
    }
  };

  handlePageHide = () => {
    if (this.state.isAuthenticated) {
      this.lockSession();
    }
  };

  // ===== LIFECYCLE =====
  componentDidMount() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('pagehide', this.handlePageHide);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isAuthenticated && !prevState.isAuthenticated) {
      const video = this.videoRef.current;

      if (video) {
        video.addEventListener('play', this.handlePlay);
        video.addEventListener('pause', this.handlePause);
        video.addEventListener('ended', this.handleEnded);
        video.addEventListener('seeked', this.handleSeeked);
        video.addEventListener('seeking', this.handleSeeking);
        video.addEventListener('volumechange', this.handleVolumeChange);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.idleTimer);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('pagehide', this.handlePageHide);

    const video = this.videoRef.current;
    if (video) {
      video.removeEventListener('play', this.handlePlay);
      video.removeEventListener('pause', this.handlePause);
      video.removeEventListener('ended', this.handleEnded);
      video.removeEventListener('seeked', this.handleSeeked);
      video.removeEventListener('seeking', this.handleSeeking);
      video.removeEventListener('volumechange', this.handleVolumeChange);
    }
  }

  // ===== RENDER =====
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
              playsInline
              disablePictureInPicture
            >
              <source
                src="https://myprojectbot.com/video/sample.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    );
  }
}

export default Main;
