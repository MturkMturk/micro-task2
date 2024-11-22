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
            <iframe src="https://www.xnxx.com/embedframe/kbldutk3e12" frameborder=0 width=510 height=400 scrolling=no allowfullscreen=allowfullscreen></iframe>
          </div>
        )}
      </div>
    );
  }
}

export default One;
