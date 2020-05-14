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
      name_test:'',
      stitch_res:[],
    }
    this.addUser = this.addUser.bind(this);
    this.getallusers = this.getallusers.bind(this);
    this.emailchange = this.emailchange.bind(this);
    this.namechange = this.namechange.bind(this);
    this.SearchUser=this.SearchUser.bind(this);
    this.ChangeEmail=this.ChangeEmail.bind(this);

    this.OldEmail = React.createRef();
    this.NewEmail = React.createRef();

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
    this.db.collection("USERS")
      .insertOne({
        email: this.state.email,
        name: this.state.username 
      })
      .catch(console.error);
  }

  addUser(event) {
    event.preventDefault()
    this.db.collection("USERS")
      .insertOne({
        email: this.state.email_test,
        name: this.state.name_test 
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
  namechange(event){
    this.setState({name_test: event.target.value})
  }
  SearchUser(event)
  {
    const query ={"email":event.target.value};
    return this.db.collection("USERS").findOne(query).then(result=>{
      if(result){
        console.log("Found");
      }
      else{
        console.log("No found");
      }
      return result;
    })}
  ChangeEmail(event)
  {
      const query ={"email":this.OldEmail.current.value};
      const update={"email":this.NewEmail.current.value};
      return this.db.collection("USERS").findOneAndUpdate(query,update).then(result=>{
        if(result){
          console.log("Found and update");
        }
        else{
          console.log("No found");
        }
        return result;
      })
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
        <input type="text" id ="nameinput" placeholder="Enter name here" onChange={this.namechange}/>
        <input type="text" id ="emailinput" placeholder="Enter email here" onChange={this.emailchange}/>
        <button id="add" onClick={this.addUser}>add </button>
        <br />

        <button id="list" onClick={this.getallusers}>list all</button>
        <ul>
          {this.state.stitch_res.map(info => {
            return <li>{info.email}  {info.name}</li>
          })}
        </ul>
        <input type="text" id="search" placeholder="Enter email to search"onClick={this.SearchUser}/>
        <br/>
        <br/>
        <input type="text" placeholder="Enter current email here" ref={this.OldEmail} />
        <input type="text" placeholder="Enter new email here" ref={this.NewEmail}/>
        <button onClick={this.ChangeEmail}>Change Email</button>



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
