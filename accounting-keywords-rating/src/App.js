import React from 'react';
import {Button,Alert,Container,Row,Col} from 'react-bootstrap';
import Histogram from 'react-chart-histogram';
import axios from 'axios';
import './App.css';
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      file:null,
      getfile:false,
      data:null,
    }
  }
  handleChange=event=>{
    this.setState({
      file: event.target.files[0],
    })
  }
  onClickHandler = () => {
    console.log(this.state.file)
    var config = { headers: {  
      'content-type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*'}
  }
  const data = new FormData();
  data.append('postFile',this.state.file);
  var self = this;
  axios.post("http://140.112.29.204:48764/weshare/insert", data, config)
  //axios.post("http://140.112.29.204:5000/regtech1.0.0/kaleidoscope",data,config)
    .then(function (response) {
      self.setState({
        getfile:true,
        data: response.data['data'],
        });
      })
    .catch(function (error) {
      console.log(error);
      });
  }
  render(){
    const labels = ['財務(0.2)', '股權變動及投資(0.5)', '法律事件(-0.5)','生產及營運(-0.5)','人員異動(-0.2)','股利分派及股東會事宜(0.2)','其他/CSR(0.0)'];
    const data = this.state.data;
    const options = { fillColor: ['#FFE153','#73BF00','#0072E3','#EA0000','#46A3FF','#5B00AE','#8E8E8E'], strokeColor: ['#FFE153','#73BF00','#0072E3','#EA0000','#46A3FF','#5B00AE','#8E8E8E'] };
    console.log(data);
    let his;
    let pred;
    if(this.state.getfile){
      his =
      <div>
      <Histogram
          xLabels={labels}
          yValues={data}
          width='730px'
          height='500px'
          options={options}
      />
    </div>
    let score = {data}['data'][0] * 0.2 + {data}['data'][1] * 0.5 + {data}['data'][2] * -0.5 + {data}['data'][3] * -0.5 + {data}['data'][4] * -0.2 + {data}['data'][5] * 0.2 + {data}['data'][6] * 0.0;
    score = score.toFixed(2);
    pred = <p>Score: {score}</p>;
    }
    return (
    <Container>
    <Row></Row>
    <Row>
    <Col></Col>
    <Col xs={6} md={8}>
      <Alert variant='dark'>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <Button variant="info" onClick={this.onClickHandler}>上傳</Button>
        </div>
        <div class="custom-file">
          <input type="file" class="custom-file-input" id="inputGroupFile01" onChange={this.handleChange}/>
          <label class="custom-file-label" for="inputGroupFile01" data-browse="瀏覽" >選擇檔案</label>
        </div>
      </div>
      </Alert>
      {his}
      {pred}
      
    
    </Col>
    <Col></Col>
    </Row>
    
  </Container>
  );
}
}
export default App;
