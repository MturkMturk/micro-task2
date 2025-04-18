import React, { Component } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './App.css';
class Two extends Component {
  state = {
    isAuthenticated: false,
    enteredPassword: '',
    showNumber: false,
    number: null,
    flashedOnce: false,
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

  logEvent = (type, number = null) => {
    const eventPayload = {
      eventType: type,
      timestamp: new Date().toISOString(),
    };

    if (number !== null) {
      eventPayload.number = number;
    }

    fetch('https://myprojectbot.com/api/vlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    });
  };

  handleTimeUpdate = () => {
    const currentTime = this.player.currentTime(); // Get current video time
    console.log("Current video time:", currentTime);

    if (currentTime >= 5 && currentTime < 25 && !this.state.flashedOnce) {
      console.log("Flashing number triggered");

      const randomNumber = Math.floor(Math.random() * 90) + 10; // Generate a two-digit number (10-99)
      this.setState({
        showNumber: true,
        number: randomNumber,
        flashedOnce: true,
      });

      console.log("Generated Number: ", randomNumber); // Log the generated number

      this.logEvent('number-flash', randomNumber); // Send the event to the backend

      setTimeout(() => {
        this.setState({ showNumber: false });
      }, 3000); // Hide the number after 2-3 seconds
    }
  };

  componentDidMount() {
    // Initialize the Video.js player
    this.player = videojs(this.videoNode, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      responsive: true,
      fluid: true,
    });

    // Event listeners for play, pause, timeupdate, etc.
    this.player.on('play', () => {
      console.log('Video is playing!');
      this.logEvent('play');
    });

    this.player.on('pause', () => {
      console.log('Video is paused!');
      this.logEvent('pause');
    });

    this.player.on('ended', () => {
      console.log('Video ended!');
      this.logEvent('ended');
    });

    this.player.on('timeupdate', this.handleTimeUpdate); // Track time for flashing the number
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
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
              ref={(node) => (this.videoNode = node)} // Ref for Video.js initialization
              className="video-js vjs-default-skin"
              data-setup="{}"
            >
              <source src="https://myprojectbot.com/video/sample.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {this.state.showNumber && (
              <div className="flashing-number">
                {this.state.number}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Two;
