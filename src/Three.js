import React, { Component } from 'react';
import './App.css';

class Three extends Component {
  state = {
    isAuthenticated: false,
    enteredPassword: '',
    isFullscreen: false,
  };

  videoRef = React.createRef();
  IDLE_TIMEOUT_MS = 2 * 60 * 1000;
  isVideoPlaying = false;
  idleTimer = null;

  handleChange = (e) => this.setState({ enteredPassword: e.target.value });

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.enteredPassword === 'mturk') {
      this.setState({ isAuthenticated: true });
    } else {
      alert('Incorrect password');
    }
  };

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

    const fullscreenButtonStyle = {
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 10000,
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 12px',
      cursor: 'pointer',
      fontSize: '14px',
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
          <div style={{ position: 'relative' }}>
            <video
              ref={this.videoRef}
              controls
              style={videoStyle}
              playsInline
              disablePictureInPicture
              controlsList="nofullscreen noremoteplayback"
            >
              <source
                src="https://myprojectbot.com/video/sample3.mp4"
                type="video/mp4"
              />
            </video>

            {/* Show custom fullscreen button only when NOT fullscreen */}
            {!isFullscreen && (
              <button style={fullscreenButtonStyle} onClick={this.toggleFullscreen}>
                Fullscreen
              </button>
            )}

            {/* Exit fullscreen button */}
            {isFullscreen && (
              <button
                style={{ ...fullscreenButtonStyle, top: '20px', right: '20px' }}
                onClick={this.toggleFullscreen}
              >
                Exit Fullscreen
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Three;
