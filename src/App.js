import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import GoogleLogin from 'react-google-login'
//import logo from './logo.svg';
//import './App.css';


export default class App extends Component{
  constructor(){
    super()
    this.state = {
      SignedIn : false,
      username : '',
      email: '',
      profileimg: '',
    }
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
