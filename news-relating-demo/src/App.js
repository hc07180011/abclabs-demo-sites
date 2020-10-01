import React from 'react';
import SpriteText from 'three-spritetext';
import ForceGraph3D from 'react-force-graph-3d';
import data from './dataset.json';
import './App.css';

class App extends React.Component {

  constructor() {
    super()
  }
  render () {
    return (
    <div>
    <div className="App">
      <section className="Main">
        <ForceGraph3D 
          graphData={data} 
          nodeAutoColorBy="group" 
          nodeThreeObject={node => {
            const sprite = new SpriteText(node.id);
            sprite.color = node.color;
            sprite.textHeight = 10;
            return sprite;
          }}/>
      </section>
    </div></div>
    )
  }
}

export default App;
