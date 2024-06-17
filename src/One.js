import './App.css';
import React, { Component } from 'react';
import Iframe from './iframe.js';

class One extends Component {
  state = {
    password: '',
    isAuthenticated: false,
    enteredPassword: '',
  };

  handleChange = (event) => {
    this.setState({ enteredPassword: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const hardcodedPassword = 'mturk'; // Replace with your hardcoded password
    if (this.state.enteredPassword === hardcodedPassword) {
      this.setState({ isAuthenticated: true });
    } else {
      alert('Incorrect password');
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
          <div className="iframe-container">
            <Iframe
              url="https://cdn.jwplayer.com/players/vi3G4qQT-PzqYXf16.html"
              width="100%"
              height="100%"
              id="myId"
              className="myClassname"
              display="initial"
              position="relative"
              allowFullScreen
            />
          </div>
        )}
      </div>
    );
  }
}

export default One;
