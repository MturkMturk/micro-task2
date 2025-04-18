import React, { Component } from 'react';

class Three extends Component {
  state = {
    isAuthenticated: false,
    enteredPassword: '',
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

  logEvent = (type) => {
    fetch('https://myprojectbot.com/api/vlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: type,
        timestamp: new Date().toISOString(),
      }),
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
              width="100%"
              height="auto"
              controls
              onPlay={() => this.logEvent('play')}
              onPause={() => this.logEvent('pause')}
              onEnded={() => this.logEvent('ended')}
              onSeeked={() => this.logEvent('seeked')}
              onSeeking={() => this.logEvent('seeking')}
              onVolumeChange={() => this.logEvent('volumechange')}
            >
              <source src="https://myprojectbot.com/video/sample3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    );
  }
}

export default Three;
