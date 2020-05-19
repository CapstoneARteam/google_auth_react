import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import GoogleLogin from 'react-google-login'
//import logo from './logo.svg';
//import './App.css';

import {Stitch, AnonymousCredential, RemoteMongoClient, GoogleRedirectCredential} from "mongodb-stitch-browser-sdk"


export default class App extends Component{
  constructor(){
    super()
    this.state = {
      username : '',
      email: '',
      userId:'',
      profileimg: '',
      email_test:'',
      name_test:'',
      account_type_test: 'user',
      stitch_res:[],
    }
    this.addUser = this.addUser.bind(this);
    this.getallusers = this.getallusers.bind(this);
    this.emailchange = this.emailchange.bind(this);
    this.namechange = this.namechange.bind(this);
    this.SearchUser=this.SearchUser.bind(this);
    this.ChangeEmail=this.ChangeEmail.bind(this);
    this.acctypechange=this.acctypechange.bind(this);
    this.login = this.login.bind(this);
    this.OldEmail = React.createRef();
    this.NewEmail = React.createRef();

  }

  componentDidMount(){
    this.client = Stitch.initializeDefaultAppClient("capstonear_app-xkqng")
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "mongodb-atlas"
    );
    this.db = mongodb.db("APP");
    

  }


  async login() {
    //copy the name of your google-auth enabled stitch application here
    //the name of the app will typically be the stitch application name
    //with a "-"" + random string appended
    
  
    // Get a client for your Stitch app, or instantiate a new one
  
    //manage user authentication state
    
    // Check if this user has already authenticated and we're here
    // from the redirect. If so, process the redirect to finish login.
    if (this.client.auth.hasRedirectResult()) {
      await this.client.auth.handleRedirectResult().then(
        this.setState(
          {
            username : this.client.auth.authInfo.userProfile.data.first_name,
            email: this.client.auth.authInfo.userProfile.data.email,
            userId: this.client.auth.authInfo.userID,
          }
        )
      );
      console.log("Processed redirect result.")
    }
  
    if (this.client.auth.isLoggedIn) {
      // The user is logged in. Add their user object to component state.
      const currentUser = this.client.auth.user;
      this.setState({ currentUser });
      
      this.setState(
        {
          username : this.client.auth.authInfo.userProfile.data.first_name,
          email: this.client.auth.authInfo.userProfile.data.email,
          userId: this.client.auth.authInfo.userId,
        }
      )
      console.log(this.state)
    } else {
      // The user has not yet authenticated. Begin the Google login flow.
      const credential = new GoogleRedirectCredential();
      this.client.auth.loginWithRedirect(credential);
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
    this.db.collection("USERS")
      .insertOne({
        email: this.state.email,
        name: this.state.username,
        account_type: this.state.account_type_test
      })
      .catch(console.error);
  }

  addUser() {
    this.db.collection("USERS")
      .insertOne({
        userID: this.state.userId,
        email: this.state.email_test,
        name: this.state.name_test,
        account_type: this.state.account_type_test,
      })
      .catch(console.error);
  }


  getallusers() {
    this.db.collection("USERS").find({})
    .asArray()
    .then((stitch_res) => {this.setState({stitch_res})
      console.log(this.state.stitch_res[0])
    }
    )
    
  }
  
  emailchange(event){
    this.setState({email_test: event.target.value})
  }
  namechange(event){
    this.setState({name_test: event.target.value})
  }
  acctypechange(event){
    this.setState({account_type_test: event.target.value})
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
        <button onClick={this.login}>abcd test</button>
        <br />
        <br />
        <input type="text" id ="nameinput" placeholder="Enter name here" onChange={this.namechange}/>
        <input type="text" id ="emailinput" placeholder="Enter email here" onChange={this.emailchange}/>
        <select id="account type" onChange={this.acctypechange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button id="add" onClick={this.addUser}>add </button>
        <br />

        <button id="list" onClick={this.getallusers}>list all</button>
        <ul>
          {this.state.stitch_res.map((info,idx) => {
            return <li key={idx}>{info.email} / {info.name} / {info.account_type}</li>
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
