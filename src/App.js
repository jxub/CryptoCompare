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

function SiteInfo(props) {
  if (!props.siteInfoShown) return <span></span>;
  return (
    <div className="info-tab">
      <p>
        Compare cryptocurrency performance and rank of the top 10 cryptocurrencies by market cap
      </p>
    </div>
  )
}

export default class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        coinsData: [],
        coinsMetaData: {},
        cryptoCompareOk: false, // the cryptocompare API may deny requests due to CORS
        siteInfoShown: true,
      };
      this.loadData = this.loadData.bind(this);
      this.handleTitleClick = this.handleTitleClick.bind(this);
    }

    async loadData() {
      const coinsData = await axios.get(COINMARKETCAP_API_URI);
      this.setState({
        coinsData: coinsData.data,
      });

      const coinsMetaData = await axios.get(CRYPTOCOMPARE_API_URI);
      this.setState({
        coinsMetaData: coinsMetaData.data.Data,
        cryptoCompareOk: true,
      });
    }
    
    async componentDidMount() {
      await this.loadData();
      setInterval(this.loadData, 4000);
    }

    getCoinImage(symbol) {
      if (!this.state.cryptoCompareOk) return "";
      return CRYPTOCOMPARE_API_URI + this.state.coinsMetaData[symbol].ImageUrl;
    }

    handleTitleClick() {
      this.setState({
        siteInfoShown: !this.state.siteInfoShown,
      })
    }

    render() {
      const siteInfoShown = this.state.siteInfoShown;
      const coinRows = this.state.coinsData.map((coin, index) => {
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
            <div className="crypto-table">
              <Table>
                <TableHeader className="info-animation">
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
