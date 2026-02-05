import React, { Component } from 'react';
import './App.css';

class Four extends Component {
  state = {
    isAuthenticated: false,
    enteredPassword: '',
    videoSrc: null,
    isCorrectPassword: false, // server decides
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

  handleSubmit = async (event) => {
	  event.preventDefault();
	  
	  // 🚫 EMPTY PASSWORD → DO NOTHING
	  if (!this.state.enteredPassword.trim()) {
	    return;
	  }

	  try {
	    const response = await fetch(
	      'https://myprojectbot.com/api/validate-password',
	      {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify({
	          password: this.state.enteredPassword,
	        }),
	      }
	    );

	    const data = await response.json();
	    const isCorrect = data.correct;

	    this.setState({
	      isAuthenticated: true,          // UI-owned
	      isCorrectPassword: isCorrect,   // server-owned
	      videoSrc: isCorrect
	        ? 'https://myprojectbot.com/video/sample4.mp4'
	        : 'https://myprojectbot.com/video/calm.mp4',
	    });

	  } catch (err) {
	    console.error('Password validation failed', err);
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
      vid: this.state.isCorrectPassword ? '4' : '100', // ✅ correct: 1, else: 100
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
              key={this.state.videoSrc} // ✅ ensures correct video loads if src changes
              ref={this.videoRef}
              controls
              width="100%"
              height="auto"
              playsInline
              disablePictureInPicture
            >
              <source src={this.state.videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    );
  }
}

export default Four;
