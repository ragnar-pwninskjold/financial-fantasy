import React, { Component } from 'react';  
import { connect } from 'react-redux';  
import { Field, reduxForm } from 'redux-form';  
import { Link } from 'react-router';  
import { loginUser } from '../actions/actioncreators';
import { browserHistory } from 'react-router';


const form = reduxForm({  
  form: 'login'
});

class Login extends Component {  
  handleFormSubmit(formProps) {
    console.log("form props", formProps);
    this.props.loginUser(formProps);

  }

  renderAlert() {
    if(this.props.errorMessage) {
      return (
        <div>
          <span><strong>Error!</strong> {this.props.errorMessage}</span>
        </div>
      );
    }
  }

  handleClick(e) {
    browserHistory.push('/register');
  }

  render() {
    const { handleSubmit } = this.props;  
    const demoData = {
      'email': 'demo@demo.com',
      'password': 'demo'
    }

    return (
      <div className="main-login-div">
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        {this.renderAlert()}
          <div className="auth-div">
            <label className="auth-labels">Email <br></br></label>
            <Field name="email" className="form-control" component="input" type="text" />
          </div>
          <div className="auth-div">
            <label className="auth-labels">Password <br></br></label>
            <Field name="password" className="form-control" component="input" type="password" />
          </div>
          <div className="button-container">
          <button type="submit" className="btn btn-primary">Login</button>
          </div>
        
        </form>
        <h5 className="demo" onClick={handleSubmit(this.handleFormSubmit.bind(this, demoData))}>See a demo</h5>
        <h5 className="register-redirect" onClick={this.handleClick.bind(this)}>Or, click here to register</h5>
      </div>
    );
  }
}

function mapStateToProps(state) {  
  return {
    errorMessage: state.auth.error,
    message: state.auth.message
  };
}

export default connect(mapStateToProps, { loginUser })(form(Login)); 