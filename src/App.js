import './App.css';
import { Routes, Route } from 'react-router-dom';
import React, { Component } from 'react';
import Iframe from './iframe.js';

class App extends Component {
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
    const hardcodedPassword = 'hardcoded'; // Replace with your hardcoded password
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
        ) : (
          <div className="iframe-container">
            <Iframe
              url="https://cdn.jwplayer.com/players/k4g6nHV1-PzqYXf16.html"
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

export default App;
