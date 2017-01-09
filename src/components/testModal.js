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
          Contest name: <input className="modal-input-contest-name" type="text" name="contestname" />
        </label>
        <br></br>
        <label>
          Contest buy-in: <input type="number" name="buy-in" />
        </label>
        <br></br>
        <label>
          Contest size: <input type="number" name="contestsize" />
        </label>
        <br></br>
        <label>
          Contest type: 
          <input type="radio" name="contesttype" value="daliy" /> Daily
          <input type="radio" name="contesttype" value="weekly" /> Weekly
        </label>
        <br></br>
        <input type="submit" value="Submit"></input>
        </form>
        <button
          type="button"
          onClick={this.removeThisModal.bind(this)}>
          close
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
    return <button onClick={this.addModal.bind(this)}>Create A Contest</button>;
  }
}