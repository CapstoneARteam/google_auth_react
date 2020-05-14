import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import GoogleLogin from 'react-google-login'
//import logo from './logo.svg';
//import './App.css';

import {Stitch, AnonymousCredential, RemoteMongoClient} from "mongodb-stitch-browser-sdk"


export default class App extends Component{
  constructor(){
    super()
    this.state = {
      SignedIn : false,
      username : '',
      email: '',
      profileimg: '',
      email_test:'',
      stitch_res:[],
    }
    this.addUser = this.addUser.bind(this);
    this.getallusers = this.getallusers.bind(this);
    this.emailchange = this.emailchange.bind(this);
  }

  componentDidMount(){
    this.client = Stitch.initializeDefaultAppClient("capstonear_app-xkqng")
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    this.db = mongodb.db("ACCOUNTS");
    this.client.auth.loginWithCredential(new AnonymousCredential()).then(
      console.log(this.db.collection("USERS").find({}, {limit: 50}).asArray())
    ).catch(console.error)
  }

  responseGoogle = (response) => {
    console.log(response);
    this.setState(
      {
        username : response.profileObj.name,
        email: response.profileObj.email,
        profileimg: response.profileObj.imageUrl,
      }
    )
    console.log(this.state)
  }

  addUser(event) {
    event.preventDefault()
    this.db.collection("USERS")
      .insertOne({
        email: this.state.email_test,
        name:"hello world" 
      })
      .catch(console.error);
  }


  getallusers() {
    this.db.collection("USERS").find({})
    .asArray()
    .then(stitch_res => this.setState({stitch_res}))
    console.log(this.state.stitch_res)
  }
  
  emailchange(event){
    this.setState({email_test: event.target.value})
  }

  render(){
    return (
      <div className="App">
        <p id="Name">Name: {this.state.username}</p>
        <p id="Email">Email: {this.state.email}</p>
        <br/>
        <img id="profileimg" src={this.state.profileimg}></img>
        <br/>
        <br/>

        {this.G_login()}
        
        <br />
        <br />
        <input type="text" id ="emailinput" onChange={this.emailchange} />
        <button id="add" onClick={this.addUser}>add </button>
        <br />

        <button id="list" onClick={this.getallusers}>list all</button>
        <ul>
          {this.state.stitch_res.map(info => {
            return <li>{info.email} </li>
          })}

        </ul>


      </div>
    );
  }

  G_login(){
    if(this.state.SignedIn){
      return(
      <div><p>Already Signed In</p></div>
      )
    }
    else{
      return(
        <GoogleLogin
          clientId ="985223166095-8i4k79t4c9uqlq5sbe1sljmvq1cefn5r.apps.googleusercontent.com"
          buttonText = "Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy={'single_host_origin'}
        ></GoogleLogin>
        
      )
    }

  }
}
