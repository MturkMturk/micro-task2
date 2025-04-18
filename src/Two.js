import React, { Component } from 'react';

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

  handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;

    // Only generate and show the number once, between 5 to 8 minutes (300 to 480 seconds)
    if (currentTime >= 5 && currentTime < 25 && !this.state.flashedOnce) {
      const randomNumber = Math.floor(Math.random() * 90) + 10; // Generate a two-digit number (10-99)
      this.setState({
        showNumber: true,
        number: randomNumber,
        flashedOnce: true, // Ensure the number is only flashed once
      });

      // Send the generated number to the backend
      this.logEvent('number-flash', randomNumber);

      // Hide the number after 2-3 seconds
      setTimeout(() => {
        this.setState({ showNumber: false });
      }, 3000);
    }
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
              onTimeUpdate={this.handleTimeUpdate} // Track time for flashing the number
            >
              <source src="https://myprojectbot.com/video/sample2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {this.state.showNumber && (
              <div className="flashing-number">
                {this.state.number}
              </div>
            )}
          </div>
        )}

        <style>
          {`
            .flashing-number {
		  position: fixed; /* Default for desktop */
		  top: 50%;
		  left: 50%;
		  transform: translate(-50%, -50%);
		  font-size: 50px; /* Font size for desktop */
		  color: white;
		  font-weight: bold;
		  background-color: rgba(0, 0, 0, 0.8); /* Background for contrast */
		  padding: 20px;
		  border-radius: 5px;
		  z-index: 99999; /* Higher z-index to ensure visibility */
		  animation: flash 1s ease-in-out infinite;
		}

		@keyframes flash {
		  0% {
		    opacity: 1;
		  }
		  50% {
		    opacity: 0;
		  }
		  100% {
		    opacity: 1;
		  }
		}

		/* Adjust the font size and position for mobile */
		@media (max-width: 768px) {
		  .flashing-number {
		    font-size: 30px; /* Smaller font size for mobile */
		    position: absolute; /* Change to absolute for mobile devices */
		    top: 45%; /* Fine-tune position */
		    left: 50%;
		    transform: translateX(-50%); /* Center horizontally */
		  }
		}
          `}
        </style>
      </div>
    );
  }
}

export default Two;
