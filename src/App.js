import React, { Component } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import AppBar from 'material-ui/AppBar';

import './App.css';


const CRYPTOCOMPARE_API_URI = 'https://www.cryptocompare.com/api/data/coinlist/';
const COINMARKETCAP_API_URI = 'https://api.coinmarketcap.com/v1/ticker/?limit=10';

const TitleBar = (props) => (
  <AppBar
    title="Crypto Compare"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
    onClick={props.onClick}
  />
)

const SiteInfo = (props) => {
  if (!props.siteInfoShown) return <span></span>;
  return (
    <div className="App-explanation">
      <p className="App-text">
        Compare cryptocurrency performance and rank of the top 10 cryptocurrencies by market cap
      </p>
    </div>
  )
}

export default class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        coins: [],
        coinData: {},
        cryptoCompareOk: false,
        siteInfoShown: true,
      };
      this.loadData = this.loadData.bind(this);
      this.handleTitleClick = this.handleTitleClick.bind(this);
    }

    loadData() {
      axios.get(COINMARKETCAP_API_URI).then((coins) => {
        console.log(`Coins: ${JSON.stringify(coins)}`);
        this.setState({
          coins: coins.data,
        });
      }).catch((err) => console.log(`Error fetching coins ${err}`));
      
      axios({
        url: CRYPTOCOMPARE_API_URI,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
      }).then((coinData) => {
        console.log(`Coin Data: ${JSON.stringify(coinData)}`);
        this.setState({
          coinData: coinData.data.Data,
          cryptoCompareOk: true,
        });
      }).catch((err) => console.log(`Error fetching coinData ${err}`));
    }

    componentDidMount() {
      this.loadData();
      setInterval(this.loadData, 600000);
    }

    getCoinImage(symbol) {
      if (!this.state.cryptoCompareOk) return "";
      return CRYPTOCOMPARE_API_URI + this.state.coinData[symbol].ImageUrl;
    }

    handleTitleClick() {
      this.setState({
        siteInfoShown: !this.state.siteInfoShown,
      })
    }

    render() {
      const siteInfoShown = this.state.siteInfoShown;
      const coinRows = this.state.coins.map((coin, index) => {
        return (
          <TableRow key={index}>
            <TableRowColumn>{coin.rank}</TableRowColumn>
            <TableRowColumn><img src={this.getCoinImage(coin.symbol)} alt=""></img>{coin.name}</TableRowColumn>
            <TableRowColumn>{coin.symbol}</TableRowColumn>
            <TableRowColumn>{coin.price_usd}</TableRowColumn>
            <TableRowColumn>{coin.percent_change_1h}</TableRowColumn>
            <TableRowColumn>{coin.percent_change_24h}</TableRowColumn>
            <TableRowColumn>{coin.percent_change_7d}</TableRowColumn>
            <TableRowColumn>{coin.market_cap_usd}</TableRowColumn>
          </TableRow>
        ) 
      });
      return (
        <div className="App">
            <TitleBar onClick={this.handleTitleClick}/>
            <SiteInfo siteInfoShown={siteInfoShown} />
            <div className="App-table">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderColumn>Rank</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Symbol</TableHeaderColumn>
                    <TableHeaderColumn>Price (USD)</TableHeaderColumn>
                    <TableHeaderColumn>1H</TableHeaderColumn>
                    <TableHeaderColumn>1D</TableHeaderColumn>
                    <TableHeaderColumn>1W</TableHeaderColumn>
                    <TableHeaderColumn>Market Cap (USD)</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coinRows}
                </TableBody>  
              </Table>
            </div>
        </div>
      );
    }
}
