import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    nwinner: ''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const nwinner = '';
    this.setState({manager,players,balance,nwinner});
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    this.setState({message: 'waiting'});

    //below line - jhony
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'Entered!'});
  };

  onClick =async () => {
    const accounts = await web3.eth.getAccounts();
    //const winner = await lottery.methods.lsWinner().call();
    this.setState({message: 'waiting'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]

    });

    this.setState({message: 'Winner is picked'});
    this.setState({nwinner: await lottery.methods.lsWinner().call()});
  };


  render() {
    return (
      <div>
      <h2>Lottery contract</h2>
      <p>this contract is managed by {this.state.manager}</p>
      There are currently {this.state.players.length} people entered competing to
      win {web3.utils.fromWei(this.state.balance, 'ether')} ether.

      <hr />
      <form onSubmit={this.onSubmit}>
        <h4>want to try your luck ?</h4>
        <div>
          <label>Amount of ether to enter </label>
          <input
            value={this.state.value}
            onChange = {event => this.setState({ value: event.target.value})}
          />
          </div>
          <button>Enter</button>
      </form>
      <hr />
        <h4>Ready to pick a winner</h4>
        <button onClick={this.onClick}>PickWinner</button>
      <hr />
      <h1>{this.state.message}{this.state.nwinner} </h1>
      </div>
    );
  }
}

export default App;
