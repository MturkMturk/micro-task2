import React, { Component } from 'react';
import './App.css';

class Three extends Component {
  state = {
    isAuthenticated: false,
    enteredPassword: '',
    isFullscreen: false, // new state
  };

  videoRef = React.createRef();

  // ===== CONFIG =====
  IDLE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes after pause/end

  // ===== INTERNAL FLAGS =====
  isVideoPlaying = false;
  idleTimer = null;

  // ===== AUTH =====
  handleChange = (e) => {
    this.setState({ enteredPassword: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.enteredPassword === 'mturk') {
      this.setState({ isAuthenticated: true });
    } else {
      alert('Incorrect password');
    }
  };

  // ===== LOGGING =====
  logEvent = (eventType) => {
    const v = this.videoRef.current;
    fetch('https://myprojectbot.com/api/vlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        videoTime: v ? v.currentTime : null,
        date: new Date().toISOString().split('T')[0],
        vid: '3',
      }),
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

  startIdleTimer = () => {
    if (!this.state.isAuthenticated || this.isVideoPlaying) return;
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(this.lockSession, this.IDLE_TIMEOUT_MS);
  };

  lockSession = () => {
    if (this.videoRef.current) this.videoRef.current.pause();
    window.location.reload();
  };

  handleVisibilityChange = () => {
    if (document.hidden && this.state.isAuthenticated) this.lockSession();
  };

  handlePageHide = () => {
    if (this.state.isAuthenticated) this.lockSession();
  };

  componentDidMount() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('pagehide', this.handlePageHide);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isAuthenticated && !prevState.isAuthenticated) {
      const v = this.videoRef.current;
      if (!v) return;

      v.addEventListener('play', this.handlePlay);
      v.addEventListener('pause', this.handlePause);
      v.addEventListener('ended', this.handleEnded);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.idleTimer);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('pagehide', this.handlePageHide);
  }

  // ===== CUSTOM FULLSCREEN TOGGLE =====
  toggleFullscreen = () => {
    this.setState((prev) => ({ isFullscreen: !prev.isFullscreen }));
  };

  render() {
    const { isAuthenticated, isFullscreen } = this.state;

    const videoStyle = isFullscreen
      ? {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          backgroundColor: 'black',
        }
      : {
          width: '100%',
          height: 'auto',
        };

    return (
      <div className="App">
        {!isAuthenticated ? (
          <form onSubmit={this.handleSubmit}>
            <input
              type="password"
              placeholder="Enter password"
              onChange={this.handleChange}
            />
            <button type="submit">Submit</button>
          </form>
        ) : (
          <div>
            <div style={{ position: 'relative' }}>
              <video
                ref={this.videoRef}
                controls
                style={videoStyle}
                playsInline
                disablePictureInPicture
              >
                <source
                  src="https://myprojectbot.com/video/sample3.mp4"
                  type="video/mp4"
                />
              </video>
              <button
                onClick={this.toggleFullscreen}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 10000,
                  padding: '8px 12px',
                }}
              >
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Three;
