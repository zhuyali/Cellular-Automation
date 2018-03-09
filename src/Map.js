import React, { Component } from 'react';
import _ from 'lodash';
import './Map.css';

class Map extends Component {
  constructor(props) {
    super(props);
    let map = [];
    for (let i = 0; i < 40; i++) {
      map[i] = Array(40).fill(0);
    }
    this.state = {
      map: map,
      isRunning: false,
      speed: 5
    }
  }

  restart() {
    let tempState = _.cloneDeep(this.state);
    let map = [];
    for (let i = 0; i < 40; i++) {
      map[i] = Array(40).fill(0);
    }
    tempState.map = map;
    tempState.isRunning = false;
    tempState.speed = 5;
    this.setState(tempState);
  }

  toggleState(row, col) {
    let tempState = _.cloneDeep(this.state);
    tempState.map[row][col] = tempState.map[row][col] ? 0 : 1;
    this.setState(tempState);
  }

  handleClick(e) {
    let id = e.target.id;
    let row = parseInt(id.split('-')[1], 10);
    let col = parseInt(id.split('-')[2], 10);
    this.toggleState(row, col);
  }

  nextStep() {
    let tempState = _.cloneDeep(this.state);
    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 40; j++) {
        let count = this.countCell(i, j);
        if (count < 2 && tempState.map[i][j] === 1) {
          tempState.map[i][j] = 0;
        } else if ((count === 3 || count === 2) && tempState.map[i][j] === 1) {
          tempState.map[i][j] = 1;
        } else if (count > 3 && tempState.map[i][j] === 1) {
          tempState.map[i][j] = 0;
        } else if (count === 3 && tempState.map[i][j] === 0) {
          tempState.map[i][j] = 1;
        }
      }
    }
    this.setState(tempState);
  }

  countCell(row, col) {
    let up = row === 0 ? 0 : row - 1;
    let down = row === 39 ? 39 : row + 1;
    let left = col === 0 ? 0 : col - 1;
    let right = col === 39 ? 39 : col + 1;
    let result = 0;
    for (let i = left; i <= right; i++) {
      for (let j = up; j <= down; j++) {
        if (i === col && j === row) {
          continue;
        }
        result += this.state.map[j][i];
      }
    }
    return result;
  }

  handleStartAndPause() {
    let tempState = _.cloneDeep(this.state);
    tempState.isRunning = !tempState.isRunning;
    this.setState(tempState, () => {
      let self = this;
      setTimeout(function func() {
        if (self.state.isRunning) {
          self.nextStep();
          setTimeout(func, self.state.speed * 100)
        }
      }, self.state.speed * 500);
    });
  }

  adjustSpeed(e) {
    let tempState = _.cloneDeep(this.state);
    tempState.speed = e.target.value;
    this.setState(tempState);
  }

  render() {
    return (
      <div>
        <div className="title">Game Of Life</div>
        <div className="map">
          {
            this.state.map.map((row, i) => {
              return row.map((col, j) => {
                return <div className={`rect ${this.state.map[i][j] ? 'cell' : 'nocell'}`} id={`rect-${i}-${j}`} onClick={e => this.handleClick(e)} key={`${i}${j}`}></div>
              })
            })
          }
        </div>
        <div className="bar">
          <button className="button" onClick={() => { this.handleStartAndPause() }}>{this.state.isRunning ? 'Pause' : 'Start'}</button>
          <button className="button" onClick={() => { this.restart() }}>Restart</button>
          <div className="speed">
            <label>Speed:</label>
            <input type="range" min="1" max="10" step="1" value={this.state.speed} onChange={(e) => { this.adjustSpeed(e) }} />
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
