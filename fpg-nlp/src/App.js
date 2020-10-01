import React from 'react';
import {Button,Alert,Container,Row,Col,InputGroup,FormControl,Table} from 'react-bootstrap';
import axios from 'axios';
import './App.css';
import{FaSearch,FaRegNewspaper} from"react-icons/fa";
import Loader from 'react-loader-spinner';

const abstractStyle = {
  'textOverflow' : 'ellipsis'
};

const LoadingIndicator = props => {
  return (
  <div style={{ width: "100%", height: "100", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Loader type="ThreeDots" color="#bbbbbb" height="100" width="100" />
  </div>
  )
};

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      keyword:null,
      getkey:null,
      data:null,
      rows:null,
      showpage:null,
      nowpage:null,
      nowpage_num:null,
      temp_num:null,
      loading:false,
      takeTime:-1,
    }
  }
  createData=(smi, date, title,category,content, go,score)=>{
    return { smi,date,title,category,content,go,score };
  }
  shownews=(page)=>{
    this.setState({
      nowpage:page,
      showpage:true,
    });
  }
  back=()=>{
    this.setState({
      showpage:false,
    });
    console.log(this.state.nowpage)
  }
  onChange=(event)=>{
    this.setState({
      keyword:event.target.value,
    });
  }
  pagechange=(num)=>{
    let page_num;
    if (num===0){
      num = this.state.temp_num
      this.setState({
        nowpage_num:num
      })
      page_num = num
    }
    else if (num !== null && this.state.nowpage_num + num > 0 && this.state.nowpage_num + num < 100) {
      this.setState({
        nowpage_num:this.state.nowpage_num+num,
        temp_num : null
      })
      page_num = this.state.nowpage_num+num
    }
    else {
        return false
    }
    var config = { headers: {  
      'content-type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*'},
    }
  const data = new FormData();
  data.append('page',page_num);
  data.append('keyword',this.state.keyword);
  console.log(page_num);
  var self = this;
  axios.post("http://140.112.29.41:5000/search",data,config)
    .then(function (response) {
      self.setState({
        data: response.data['data'],
        });
      console.log(self.state.data)
      self.setState({
        rows:[
          self.createData(self.state.data[0][5],self.state.data[0][0],self.state.data[0][1],self.state.data[0][3],self.state.data[0][2],self.state.data[0][4]),
          self.createData(self.state.data[1][5],self.state.data[1][0],self.state.data[1][1],self.state.data[1][3],self.state.data[1][2],self.state.data[1][4]),
          self.createData(self.state.data[2][5],self.state.data[2][0],self.state.data[2][1],self.state.data[2][3],self.state.data[2][2],self.state.data[2][4]),
          self.createData(self.state.data[3][5],self.state.data[3][0],self.state.data[3][1],self.state.data[3][3],self.state.data[3][2],self.state.data[3][4]),
          self.createData(self.state.data[4][5],self.state.data[4][0],self.state.data[4][1],self.state.data[4][3],self.state.data[4][2],self.state.data[4][4]),
          self.createData(self.state.data[5][5],self.state.data[5][0],self.state.data[5][1],self.state.data[5][3],self.state.data[5][2],self.state.data[5][4]),
          self.createData(self.state.data[6][5],self.state.data[6][0],self.state.data[6][1],self.state.data[6][3],self.state.data[6][2],self.state.data[6][4]),
          self.createData(self.state.data[7][5],self.state.data[7][0],self.state.data[7][1],self.state.data[7][3],self.state.data[7][2],self.state.data[7][4]),
          self.createData(self.state.data[8][5],self.state.data[8][0],self.state.data[8][1],self.state.data[8][3],self.state.data[8][2],self.state.data[8][4]),
          self.createData(self.state.data[9][5],self.state.data[9][0],self.state.data[9][1],self.state.data[9][3],self.state.data[9][2],self.state.data[9][4]),
        ],
        getkey:true,
      })
      console.log(self.state.rows)
      })
      
    .catch(function (error) {
      console.log(error);
      });
  }
  pageinputchange=(event)=>{
    this.setState({
      temp_num:parseInt(event.target.value,10),
    });
  }
  onClickHandler = () => {
    if (this.state.keyword === '')
      return window.alert('請輸入關鍵字')
    if (this.state.loading === true)
      return false;
    this.setState({ loading: true, data: null, getkey: false })
    var config = { headers: {  
      'content-type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*'}
  }
  const data = new FormData();
  console.log(this.state.keyword);
  data.append('keyword',this.state.keyword);
  data.append('page',1);
  var self = this;
  axios.post("http://140.112.29.41:5000/search",data,config)
    .then(function (response) {
      self.setState({
        data: response.data['data'],
        nowpage_num:1,
	    loading: false,
        takeTime: response.data['time']
        });
      console.log(self.state.data)
      self.setState({
        rows:[
          self.createData(self.state.data[0][5],self.state.data[0][0],self.state.data[0][1],self.state.data[0][3],self.state.data[0][2],self.state.data[0][4]),
          self.createData(self.state.data[1][5],self.state.data[1][0],self.state.data[1][1],self.state.data[1][3],self.state.data[1][2],self.state.data[1][4]),
          self.createData(self.state.data[2][5],self.state.data[2][0],self.state.data[2][1],self.state.data[2][3],self.state.data[2][2],self.state.data[2][4]),
          self.createData(self.state.data[3][5],self.state.data[3][0],self.state.data[3][1],self.state.data[3][3],self.state.data[3][2],self.state.data[3][4]),
          self.createData(self.state.data[4][5],self.state.data[4][0],self.state.data[4][1],self.state.data[4][3],self.state.data[4][2],self.state.data[4][4]),
          self.createData(self.state.data[5][5],self.state.data[5][0],self.state.data[5][1],self.state.data[5][3],self.state.data[5][2],self.state.data[5][4]),
          self.createData(self.state.data[6][5],self.state.data[6][0],self.state.data[6][1],self.state.data[6][3],self.state.data[6][2],self.state.data[6][4]),
          self.createData(self.state.data[7][5],self.state.data[7][0],self.state.data[7][1],self.state.data[7][3],self.state.data[7][2],self.state.data[7][4]),
          self.createData(self.state.data[8][5],self.state.data[8][0],self.state.data[8][1],self.state.data[8][3],self.state.data[8][2],self.state.data[8][4]),
          self.createData(self.state.data[9][5],self.state.data[9][0],self.state.data[9][1],self.state.data[9][3],self.state.data[9][2],self.state.data[9][4]),
        ],
        getkey:true,
      })
      console.log(self.state.rows)
      })
      
    .catch(function (error) {
      console.log(error);
      });
  }
  render(){
    document.body.style = 'background: 	white	;';
    document.body.classList.add('background-red');
    const pnwords=[
    {p:'零確診',n:'爆炸'},
    {p:'抗體',n:'磐石艦隊'},
    {p:'紓困金',n:'境外移入'},
    {p:'振興金',n:'港版國安法'},
    {p:'解封倒數',n:'大地震'},
    {p:'智慧電網',n:'新冠肺炎'},
    {p:'5G',n:'消費卷'},
    {p:'生技',n:'股東會'},
    {p:'回溫',n:'台資鞋廠'},
    {p:'網路報稅',n:'ZOOM'},
    ];
    const labels = ['財務', '股權變動及投資', '法律事件','生產及營運','人員異動','股東分派及股東會事宜','其他/CSR'];
    const data = this.state.data;
    const options = { fillColor: ['#FFE153','#73BF00','#0072E3','#EA0000','#46A3FF','#5B00AE','#8E8E8E'], strokeColor: ['#FFE153','#73BF00','#0072E3','#EA0000','#46A3FF','#5B00AE','#8E8E8E'] };
    let search_result;
    let pnlist;
    let control;
    var loading_bar = <div></div>;
    if (this.state.loading === true) {
      loading_bar = <LoadingIndicator />
    }
    if(this.state.getkey){
	      search_result=
	      <Table striped bordered hover>
	  <thead>
	    <tr>
	      <th>相似度</th>
	      <th>日期</th>
	      <th>標題</th>
	      <th>類別</th>
	      <th>查看報導</th>
	      <th>原文網站</th>
	    </tr>
	  </thead>
	  <tbody>
	    {this.state.rows.map((row) => (
		<tr key={row.go}>
		<td width={80} align="left">{row.smi}</td>
		<td width={130} align="left">{row.date}</td>
		<td style={abstractStyle} align="left">{row.title}</td>
		<td width={80}align="left">{row.category}</td>
		<td width={100} align="center"><Button size="sm" variant="secondary" onClick={()=>this.shownews(row)} >內文</Button></td>
		<td width={100} align="center"><a href={row.go}><FaRegNewspaper/></a></td>
	      </tr>
	    ))}
	  </tbody>
	</Table>
	    control = <div>
	    <Button onClick={()=>this.pagechange(-1)} size="sm" variant="secondary">上頁</Button>
	    &nbsp;<input size="3" placeholder={this.state.nowpage_num} onChange={this.pageinputchange}></input>
	    &nbsp;<Button onClick={()=>this.pagechange(1)} size="sm" variant="secondary">下頁</Button>
	    &nbsp;<Button onClick={()=>this.pagechange(0)} size="sm" variant="secondary">跳轉</Button>
	    </div>

	    pnlist=<Table striped bordered hover>
	    <thead>
	      <tr>
		<th>正面</th>
		{pnwords.map((pnword) => (
		  <td class='pos' width={85} align="center">{pnword.p}</td>
	      ))}
	      </tr>
	      <tr>
	      <th>負面</th>
		{pnwords.map((pnword) => (
		  <td class='neg' width={85} align="center">{pnword.n}</td>
	      ))}
	      </tr>
	    </thead>
	    <tbody>
	    </tbody>
	    </Table>
    }
    if(!this.state.showpage){
      return (
        <Container>
        <Row></Row>
        <Row>
              <Col></Col>
              <Col xs={6} md={8}>
                <Alert variant='outline-dark'>
                <InputGroup className="mb-3">
                <FormControl
              onChange={this.onChange}
              placeholder="輸入欲搜索關鍵詞或語句"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
        <Button variant="dark" onClick={this.onClickHandler}><FaSearch/></Button>
            </InputGroup.Append>
          </InputGroup>
              </Alert>      
            </Col>
            <Col></Col>
        </Row>
    {(this.state.takeTime === -1 || this.state.loading === true)? "" : "約有 274,973 項結果 (搜尋時間：" + this.state.takeTime.toFixed(4) +  " 秒)"}
	{loading_bar}
        <Row>
          <Col></Col>
        <Col md={10}>{search_result}</Col>
          <Col></Col>
        </Row>
        <Row>
        <Col></Col>
        <Col></Col>
      <Col>{control}</Col>
        </Row>
        <Row>
          <Col></Col>
        <Col md={10}>{pnlist}</Col>
          <Col></Col>
        </Row>
        
        
      </Container>
      
      );
    }
    else {
      return(
      <Container>
        <Row></Row>
        <Row></Row>
        <Row>
        <Col></Col>
        <Col sm={6}>
        <Alert variant="dark">
        <div>{this.state.nowpage['content']}</div>
        </Alert>
        <Button size="sm" variant="secondary" onClick={this.back}>back</Button>
        </Col>
        <Col></Col>
        </Row>
      </Container>
      );
    }
    
  
}
}
export default App;
