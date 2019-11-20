import React, { Component } from 'react';
import Graph from './Graph';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { message: '' };
  }

  componentDidMount() {
    fetch('./typeform_response')
      .then(response => response.json())
      .then(json => {
        console.log(json)
        this.setState({ message: json.total_items })
      });
  }

  render() {
    let topics = ["Take it personally","Have a clear strategy","Find problems worth solving","Build & participate in ecosystems","Have cross-functional teams"];
    let sectors = ['All','1','2','3','4','5']
  
    return (
      <div className="App">
        <div className='header'>
          <div className="heading">How AI ready is <span className={'sectorName'}>Everybody</span>?</div>
        </div>
        <div>
          <Graph
            topics= {topics}
            sectors={sectors}
          />
        </div>
      </div>
    );
  }
}

export default App;
