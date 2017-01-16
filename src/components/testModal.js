import React, {Component} from 'react';
import {modal} from 'react-redux-modal';

class myModalComponent extends Component {
  constructor(props) {
    super(props);
    console.log('## MODAL DATA AND PROPS:', this.props);
  }
 
  removeThisModal() {
    this.props.removeModal();
  }

  submit(e) {
    console.log("would submit here");
  }

    
  render() {
    return (
      <div>
        <form action="/api/contestcreate" method="post" onSubmit={this.submit}>
        <label>
          Contest name: <br></br> <input className="modal-input-contest-name" type="text" name="contestname" />
        </label>
        <br></br>
        <label>
          Buy-In: <br></br>
          <input type="radio" name="buyin" value="1" /> $1 <br></br>
          <input type="radio" name="buyin" value="5" /> $5 <br></br>
          <input type="radio" name="buyin" value="10" /> $10 <br></br>
          <input type="radio" name="buyin" value="20" /> $20
        </label>
        <br></br>
        <label>
          Contest Size: <br></br>
          <input type="radio" name="size" value="2" /> 2 contestants <br></br>
          <input type="radio" name="size" value="5" /> 5 contestants <br></br>
          <input type="radio" name="size" value="10" /> 10 contestants <br></br>
        </label>
        <br></br>       
        <br></br>
        <input type="submit" value="Submit" className="submitButton"></input>
        </form>
        <button
          className="close-modal-button"
          type="button"
          onClick={this.removeThisModal.bind(this)}>
          Close
        </button>
      </div>
    );
  }
}

export default class CreateContestModal extends Component {
  constructor(props) {
      super(props);
  }
 
  addModal() {
    modal.add(myModalComponent, {
      title: 'Create A Contest',
      size: 'medium', // large, medium or small,
      closeOnOutsideClick: false, // (optional) Switch to true if you want to close the modal by clicking outside of it,
      hideTitleBar: false, // (optional) Switch to true if do not want the default title bar and close button,
      hideCloseButton: false, // (optional) if you don't wanna show the top right close button
      //.. all what you put in here you will get access in the modal props ;)
    });
  }
  
  render() {
    return <button className="create-contest-button" onClick={this.addModal.bind(this)}>Create A Contest</button>;
  }
}