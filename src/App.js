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
      <div>
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
          <Iframe
            url="https://cdn.jwplayer.com/players/HXtdRpnG-PzqYXf16.html"
            width="450px"
            height="450px"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            allowFullScreen
          />
        )}
      </div>
    );
  }
}

export default App;
