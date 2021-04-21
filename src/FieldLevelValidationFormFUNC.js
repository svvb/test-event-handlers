import React, { Component, useEffect, useState, useRef, createRef, useContext } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, change, getFormValues, Form } from "redux-form";

import { getDocument, getDocumentBody } from "./helpers";
import {editorProvider, EditorContext} from './form-provider';

// const required = (value) => {
//     console.log("REQUIRED VALIDATION VALUE", value);
//     return value ? undefined : "Required";
// };
// const maxLength = (max) => (value) =>
//     value && value.length > max ? `Must be ${max} characters or less` : undefined;
// const maxLength15 = maxLength(15);

let funcRef = null;

const EditableField = props => {
// export default props => {
    const {input} = props;
    const [a, setA] = useState(1)
    const textareaRef = useRef(null);
    // const {
    //     textareaRef,
    //     updateWindow,
    //     checkWindow,
    //     // EditorWindow,
    //     val,
    //     setVal
    // } = useContext(EditorContext);
    // console.log(`val in COMPONENT`, val)
    // console.log('&&&&&&&&&&&&&&&&&', funcRef === checkWindow);
    // funcRef = checkWindow

    // console.log(`======== bbbbbbbbb`, props.b);
    const eventHandler = (e) => {
        const value = e.target.innerHTML;
        // input && input.onChange(value);
        console.log(`CHANGE FIRING`, {a});
        // setA(a + 1);
        updateA();
        // props.updateB()
        // console.log(`bbbbbbbbb`, props.b);
        // props.setB(props.b + 1)
        // checkWindow();
        // console.log(`------- EditorWindow`, EditorWindow);
    };

    // const updateA = () => {
    //     console.log(`%%%%%%%% a`, a)
    //     setA(a + 1);
    // }
    const updateA = () => {
        console.log(`%%%%%%%%`, a)
        setA(prevA => prevA + 1);
    }

    useEffect(() => {
        // checkWindow();
        console.log(`a`, a);
        // setVal(val + 1);
    }, [a])

    // useEffect(() => {
    //     textareaRef.current.addEventListener("keyup", eventHandler);

    //     return () => {
    //         console.log(`UNMOUNTING`);
    //         textareaRef.current.removeEventListener("keyup", eventHandler);
    //     }
    // }, [])

    useEffect(() => {
        textareaRef.current.addEventListener("keyup", eventHandler);
        return () => {
            textareaRef.current.removeEventListener("keyup", eventHandler);
        }
    }, [])

    // const onFrameLoad = () => {
    //     const editorDocument = getDocument(textareaRef);
    //     const editorBody = getDocumentBody(textareaRef);
    //     if (textareaRef) {
    //         editorDocument.designMode = "on";
    //         editorBody.addEventListener("keyup", eventHandler);
    //     }

    //     // updateWindow();
    // }

    return (
        <div>
            {/* <iframe
                ref={textareaRef}
                onLoad={onFrameLoad}
                id="iframe"
                src="javascript:''"
            /> */}
            <div
                ref={textareaRef}
                contentEditable
                style={{
                    width: '500px',
                    height: '250px',
                    border: '1px solid red',
                }}
                // onKeyUp={eventHandler}
            />
        </div>
    )
}

class NewComp extends Component {
    constructor(props) {
        super(props)
        this.textareaRef = createRef(null);
        this.state = {
            a: 1
        }
    }

    componentDidMount() {
        this.textareaRef.current.addEventListener("keyup", this.eventHandler);
    }

    componentWillUnmount() {
        console.log(`UNMOUNTING`);
        this.textareaRef.current.removeEventListener("keyup", this.eventHandler);
    }

    eventHandler = (e) => {
        const value = e.target.innerHTML;
        const {a} = this.state;
        // input && input.onChange(value);
        console.log(`CHANGE FIRING 222222`, {a});
        // setA(a + 1);
        this.setState({a: a + 1})
        // checkWindow();
        // console.log(`------- EditorWindow`, EditorWindow);
    };



    render() {
        return (
            <div>
                {/* <iframe
                    ref={textareaRef}
                    onLoad={onFrameLoad}
                    id="iframe"
                    src="javascript:''"
                /> */}
                <div
                    ref={this.textareaRef}
                    contentEditable
                    style={{
                        width: '500px',
                        height: '250px',
                        border: '1px solid red',
                    }}
                />
            </div>
        )
    }
}

// export default NewComp;


export default props => {
// const FieldLevelValidationForm = props => {
    const { handleSubmit } = props
    const [b, setB] = useState(10);

    const updateB = () => {
        setB(b + 1);
    };

    console.log(`@@@@@@@@@@`, b);
    return (
        // <Form onSubmit={handleSubmit}>
        //     <Field
        //         name="username"
        //         component={EditableField}
        //         label="Username"
        //     />
        // </Form>
        <EditableField setB={setB} b={b} updateB={updateB} />
    );
}

// const FieldLevelValidationFormWrapper = (props) => editorProvider(props)(FieldLevelValidationForm)
// export default (props) => editorProvider(props)(FieldLevelValidationForm)

// export default reduxForm({
//     form: "fieldLevelValidation"
// })(FieldLevelValidationFormWrapper);
