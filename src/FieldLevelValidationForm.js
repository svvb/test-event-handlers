import React, { Component, useEffect, useRef, createRef } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, change, getFormValues } from "redux-form";

const required = (value) => {
  console.log("REQUIRED VALIDATION VALUE", value);
  return value ? undefined : "Required";
};
const maxLength = (max) => (value) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const maxLength15 = maxLength(15);

// const FieldLevelValidationForm = ({handleSubmit, pristine, reset, submitting, formChange}) => {
class FieldLevelValidationForm extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }
  // const inputRef = useRef(null);

  componentDidMount() {
    const iframe = this.inputRef.current.firstChild;
    iframe.contentDocument.designMode = 'on';
    iframe.contentWindow.document.body.addEventListener("keyup", this.eventHandler);
  }

  eventHandler = (e) => {
    console.log(`e`, e);
    const value = e.target.innerHTML;
    console.log(`value`, value);
    this.props.formChange("fieldLevelValidation", "username", value);
  };

  renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
    console.log(`RERENDERING`);
    return (
    <div>
      <label>{label}</label>
      <div ref={this.inputRef}>
        <iframe
          id="iframe"
        />
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  )};

  // useEffect(() => {
  //   const iframe = inputRef.current.firstChild;
  //   console.log(`iframe`, iframe)
  //   console.log(`iframe`, iframe)
  //   // inputRef.current.firstChild.contentDocument.designMode = "on";
  //   // inputRef.current.firstChild.contentWindow.document.designMode = "on";
  //   setTimeout(() => {
  //     // console.log(`iframe in setTimeout`, iframe)
  //     document.getElementById('iframe').contentDocument.designMode = "on";
  //     // inputRef.current.firstChild.contentWindow.document.body.addEventListener("keyup", eventHandler);
  //     iframe.contentWindow.document.body.addEventListener("keyup", eventHandler);
  //   }, 500)
  //   console.log(`document.getElementById('iframe')`, document.getElementById('iframe'))
  // }, [])

  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="username"
          type="text"
          component={this.renderField}
          label="Username"
          // validate={[required, maxLength15]}
        />
        <div>
          <button type="submit" disabled={submitting}>
            Submit
          </button>
          <button
            type="button"
            disabled={pristine || submitting}
            onClick={reset}
          >
            Clear Values
          </button>
        </div>
      </form>
    );
  }
}

export default connect(
  // (store) => {
  //   return { formValues: getFormValues("fieldLevelValidation")(store) };
  // },
  null,
  {
    formChange: change
  }
)(
  reduxForm({
    form: "fieldLevelValidation" // a unique identifier for this form
  })(FieldLevelValidationForm)
);
