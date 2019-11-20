import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import GraphAnimate from './GraphAnimate';

class GraphArea extends Component{
  constructor(props){  
    super(props)
    this.state = {  
      data: [],  
      topics: this.props.topics,
      value: ['Completely  agree','Somewhat agree','Neither agree or disagree','Somewhat disagree','Completely  disagree'],
      sectors: [],
      sectorLength:0,

    }  
    this.updateAPIData = this.updateAPIData.bind(this);  
  } 
  componentDidMount(){
    this.updateAPIData()
    setInterval(() => {this.updateAPIData()}, 60000);
  }
  updateAPIData(){
    axios.get('/typeform_response',{ headers: { Authorization: 'Bearer Hr3EEcXr52zkTRHrS4N2mTRk4SAZLAd3VwUnsoNbDCK9', "Access-Control-Allow-Origin": "*"} }).then(d => {
      let dat = d.data.items    
      let ans = dat.map((d,i) => {
        let answer = d.answers;
        let ansObj = {}
        for (let k  = 4; k < 9; k++){
          ansObj[this.props.topics[k-4]] = answer[k].number
        }
        ansObj['Sector'] = answer[3].text
        return ansObj
      })
      let freqData = {}
      let dataBySector = d3.nest()
        .key(function(d) { return d.Sector; })
        .entries(ans);
      let sectorAvg ={}
      let sect = ['All']
      dataBySector.forEach((el,i) => {
        sect.push(el.key)
        sectorAvg[el.key] = {'avg':{},data:el.values}
        this.state.topics.forEach((d, i) => {
          let landAvg = d3.mean(el.values, function(k) { return k[d]; });
          sectorAvg[el.key]['avg'][d] = landAvg
        })
      })
      sectorAvg['All'] = {'data':[],'avg':0}
      sectorAvg['All']['data'] = ans 
      let avg = {}
      this.state.topics.forEach((d, i) => {
        freqData[d] = {
          '1':0,
          '2':0,
          '3':0,
          '4':0,
          '5':0
        }
        let landAvg = d3.mean(ans, function(el) { return el[d]; });
        avg[d] = landAvg
      })
      sectorAvg['All']['avg'] = avg 
      sect.forEach((d,i) => {
        let frequency = {};
        this.state.topics.forEach((d1,i) => {
          freqData[d1] = {
            '1':0,
            '2':0,
            '3':0,
            '4':0,
            '5':0
          }
          var expensesCount = d3.nest()
            .key(function(k) { return k[d1]; })
            .rollup(function(v) { return v.length; })
            .entries(sectorAvg[d]['data']);
          let val = [
            { key: "1", value: 0 },
            { key: "2", value: 0 },
            { key: "3", value: 0 },
            { key: "4", value: 0 },
            { key: "5", value: 0 }
          ]
          expensesCount.forEach((element, l) => {
            val[parseInt(element.key, 10) - 1].value = element.value
          })
            frequency[d1] = val
        })
        sectorAvg[d]['frequency'] = frequency
      })
      this.setState({
        data:sectorAvg,
        sectors:sect,
        sectorLength: sect.length,
      })
    })
  }
  render(){ 
    if(this.state.data.length === 0)
      return <div />
    else {
      return (
        <div className='svgContainer'>
          <GraphAnimate 
            data = {this.state.data}
            sectors = {this.state.sectors}
            topics = {this.state.topics}
            sectorLength={this.state.sectorLength}
            />
        </div>
      )
    }
  }  
}

export default GraphArea;