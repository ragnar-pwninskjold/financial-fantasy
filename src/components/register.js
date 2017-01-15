import React, { Component } from 'react';  
import { connect } from 'react-redux';  
import { Field, reduxForm } from 'redux-form';  
import { registerUser } from '../actions/actioncreators';
import { browserHistory } from 'react-router';


const form = reduxForm({  
  form: 'register',
  validate
});

const renderField = field => (  
    <div>
      <input className="form-control" {...field.input}/>
      {field.touched && field.error && <div className="error">{field.error}</div>}
    </div>
);

function validate(formProps) {  
  const errors = {};

  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }

  if (!formProps.password) {
    errors.password = 'Please enter a password';
  }
  if (!formProps.username) {
    errors.username = 'Please enter a username';
  }

  return errors;
}

class Register extends Component {  
  handleFormSubmit(formProps) {
    this.props.registerUser(formProps);
  }

  handleClick(e) {
    browserHistory.push('/login');
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

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="main-register-div">
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
      {this.renderAlert()}
        <div className="row">
          <div className="col-md-12" className="auth-div">
            <label className="auth-labels">Email <br></br></label>
            <Field name="email" className="form-control" component={renderField} type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12" className="auth-div">
            <label className="auth-labels">Username <br></br></label>
            <Field name="username" className="form-control" component={renderField} type="text" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12" className="auth-div">
            <label className="auth-labels">Password <br></br></label>
            <Field name="password" className="form-control" component={renderField} type="password" />
          </div>
        </div>
        <div className="button-container">
        <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
      <h5 className="register-redirect" onClick={this.handleClick.bind(this)}>Have an account? Click here to login</h5>
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

export default connect(mapStateToProps, { registerUser })(form(Register)); 