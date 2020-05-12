import React, { Component } from 'react';

//My Components
import { getFromStorage , setInStorage } from '../utile/storage';

class signUp extends Component {
  constructor(props){
    super(props);
    this.state={
      isLoading:true,
      token:'',
      signInError:'',
      signUpError:'',
      signInEmail:'',
      signInPassword:'',
      signUpName:'',
      signUpEmail:'',
      signUpPassword:'',
    };

    this.onChangeSignInEmail =this.onChangeSignInEmail.bind(this);
    this.onChangeSignInPassword =this.onChangeSignInPassword.bind(this);
    this.onChangeSignUpName =this.onChangeSignUpName.bind(this);
    this.onChangeSignUpEmail =this.onChangeSignUpEmail.bind(this);
    this.onChangeSignUpPassword =this.onChangeSignUpPassword.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
  }

  componentDidMount(){
    const token = getFromStorage('Log');
    if(token){
         fetch('http://localhost:619/user/verify?token='+ token.token)
                .then(res =>res.json())
                .then(json => {
                  if(json.success){
                    this.setState({
                      token,
                      isLoading : false,
                    })
                  }else{
                      this.setState({isLoading:false});
                    }
                });
      }else{
        this.setState({isLoading:false});
      }
  }

  onChangeSignInEmail(event){
    this.setState({signInEmail : event.target.value})
  };

  onChangeSignInPassword(event){
    this.setState({signInPassword : event.target.value})
  };

  onChangeSignUpName(event){
    this.setState({signUpName : event.target.value})
  };

  onChangeSignUpEmail(event){
    this.setState({signUpEmail : event.target.value})
  };

  onChangeSignUpPassword(event){
    this.setState({signUpPassword : event.target.value})
  };
  
  onSignIn(){
    //set data value 
    const {
      signInEmail,
      signInPassword
    }= this.state;
    
    
    this.setState({isLoading:true});
    // post request to backend 
    fetch('http://localhost:619/user/signIn',{
          method:'POST',
          headers:{
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({
            email:signInEmail,
            password : signInPassword
          }),
        })
          .then(res => res.json())
          .then( json =>{
            if(json.success){
              setInStorage('Log', { token: json.token })
              this.setState({
                signInError:json.message,
                isLoading:false ,
                signInEmail:'',
                signInPassword:'',
                token:json.token,
              });
              
            } else {
            
                this.setState({
                  signInError:json.message,
                  isLoading:false ,
                });
            }

          } )

  };

  onSignUp(){
     //set data value 
     const {
      signUpName,
      signUpEmail,
      signUpPassword
    }= this.state;
    
    this.setState({isLoading:true});
    // post request to backend 
    fetch('http://localhost:619/user/signUp',{
          method:'POST',
          headers:{
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({
            name:signUpName,
            email:signUpEmail,
            password : signUpPassword
          }),
        })
          .then(res => res.json())
          .then( json =>{
            if(json.success){
              setInStorage('Log', { token: json.token })
              this.setState({
                signUpError:json.message,
                isLoading:false ,
                signUpName:'',
                signUpEmail:'',
                signUpPassword:'',
                token:json.token,
              });
              
            } else {
                this.setState({
                  signUpError:json.message,
                  isLoading:false ,
                });
            }
          } )
  };

  onLogOut(){
    // this.setState({isLoading : true}); **
    const token = getFromStorage("Log");
    if(token){
      fetch('http://localhost:619/user/logout?token='+ token.token)
            .then(res => res.json())
            .then(json =>{
              if(json.success){
                localStorage.removeItem("Log");
              }
            })       
      }
     

  };

  render() {
    const {
      token,
      isLoading,
      signInError,
      signInEmail,
      signInPassword,
      signUpError,
      signUpName,
      signUpEmail,
      signUpPassword
    }=this.state;

    if(isLoading){
      return (<h1> Loading ...</h1>);
    }

    if(!token){
      return(
        <>
          {signInError}
          <h1>SignIn<br/></h1>
            <input value = { signInEmail } onChange={ this.onChangeSignInEmail  }  type='email' placeholder='Email'/><br/>
            <input value = { signInPassword }  onChange={ this.onChangeSignInPassword} type='password' placeholder ='Password'/><br/><br/>
            <button onClick = { this.onSignIn} >Sing In</button><br/>
          
          {signUpError} 
          <h1><br/>SignUp</h1>
            <input value = { signUpName }  onChange={ this.onChangeSignUpName } type ='text' placeholder='User Name'/><br/>
            <input value = { signUpEmail}  onChange={ this.onChangeSignUpEmail } type='email' placeholder='Email'/><br/>
            <input value = { signUpPassword}  onChange={ this.onChangeSignUpPassword } type='password' placeholder ='Password'/><br/><br/>
            <button onClick = { this.onSignUp}>Sing Up</button><br/>
        </>
        )
    }
    
    return (
      <>
        <h1>Account</h1>
        <button onClick={this.onLogOut }>log out</button>
      </>
    );
  }
}

export default signUp;