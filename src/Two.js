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
    const currentTime = e.target.currentTime; // Get current video time
    console.log("Current video time:", currentTime); // Debugging log to see current time

    if (currentTime >= 5 && currentTime < 25 && !this.state.flashedOnce) {
      console.log("Flashing number triggered"); // Log when the number should flash

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
		  position: fixed; /* Use fixed positioning for both mobile and desktop */
		  top: 50%;
		  left: 50%;
		  transform: translate(-50%, -50%); /* Ensure it's centered */
		  font-size: 50px;
		  color: white;
		  font-weight: bold;
		  background-color: rgba(0, 0, 0, 0.8); /* More opaque background for contrast */
		  padding: 20px;
		  border-radius: 5px;
		  z-index: 999999; /* Make sure the number is always on top */
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

		/* Adjust size for mobile screens */
		@media (max-width: 768px) {
		  .flashing-number {
		    font-size: 30px; /* Make the number smaller for mobile */
    		    padding: 10px; /* Reduced padding for smaller screens */
		  }
		}
          `}
        </style>
      </div>
    );
  }
}

export default Two;
