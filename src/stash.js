/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2020 VTB Group. All rights reserved.
 */

import React, {Component, useState, useEffect, createRef} from 'react';
import {noop, get} from 'lodash';
import {Field, change} from 'redux-form';
import {connect} from 'react-redux';

import {Toolbar} from './components/Toolbar';
import {Editor} from './components/Editor';
import {Counter} from './components/Counter';
import {stripHTML} from './helpers/stripHTML';
import {cleanHTML, getRange, updateRange} from './helpers';
import {
    CONTENT_LENGTH_LIMIT,
    EVENT_TYPE_DROP,
    EVENT_TYPE_PASTE
} from './constants';
import style from './styles/style.scss';
import {ALLOWED_CODES} from './constants';
import {FeatureType} from './types';
import { setWorkingRef } from './helpers/range';
import {
    getDocumentBody,
    getDocumentBodyInnerHTML,
    getDocument,
    getWindow
} from './helpers/getDocumentWindow';
import { render } from 'enzyme';

interface TextEditorProps {
    width: string,
    height: string,
    hideToolbar: boolean,
    hideCounter: boolean,
    initialValue: string,
    onChange: (innerHTML: string) => void,
    textareaRef: React.RefObject<HTMLDivElement>,
    features: FeatureType[],
    contentLengthLimit: number,
    formName: string,
    fieldName: string,
    validate?: (value: string) => void,
    warn?: (value: string) => void,
    value?: string,
    error?: string,
    warning?: string,
    changeField: (formaName: string, fieldName: string, value: string) => void,
    autoExpand?: boolean
}

interface IState {
    contentLength: number,
    editorHeight: number,
    range: RangyRange,
}

// const TextEditorComponent = ({
//     width,
//     height = '113px',
//     hideToolbar,
//     hideCounter,
//     initialValue,
//     onChange = noop,
//     textareaRef,
//     features = [],
//     contentLengthLimit = CONTENT_LENGTH_LIMIT,
//     formName,
//     fieldName,
//     validate,
//     warn,
//     error,
//     warning,
//     changeField,
//     autoExpand,
// }: TextEditorProps): JSX.Element => {
class TextEditorComponent extends Component<TextEditorProps, IState> {
    // const [contentLength, setContentLength] = useState(null);
    // const [editorHeight, setHeight] = useState(0);
    // const [range, setRange] = useState(getRange());
    // const editor = textareaRef || createRef();
    // let dragging: boolean;
    constructor(props: TextEditorProps) {
        super(props)

        this.state = {
            contentLength: null,
            editorHeight: 0,
            range: getRange(),
        }

        this.editor = props.textareaRef || createRef();
    }

    editor: React.RefObject<HTMLDivElement> = null;
    dragging: boolean = false

    componentDidMount() {
        const {initialValue, height} = this.props;
        const editorDocument = getDocument(this.editor);
        console.log(`editorDocument`, editorDocument);
        const contentWindow = getWindow(this.editor);
        const editorBody = getDocumentBody(this.editor);
        // const editorBody = get(this.editor, 'current.firstChild.contentWindow.document.body');
        if (!editorBody) return;
        console.log(`editorBody`, editorBody);

        editorDocument.execCommand('styleWithCSS', false, null);
        editorDocument.execCommand('insertBrOnReturn', false, null);

        setWorkingRef(this.editor);

        console.log(`AFTER`);

        // setTimeout(() => {
            contentWindow.addEventListener('mouseup', this.changeHandler);
            editorBody.addEventListener('mousedown', this.handleMouseDownEvent);
            editorBody.addEventListener('keyup', this.changeHandler);
            editorBody.addEventListener('paste', this.limitAndHandle);
            editorBody.addEventListener('keydown', this.limitAndHandle);
            editorBody.addEventListener('drop', this.limitAndHandle);
        // }, 200);

        editorBody.innerHTML = cleanHTML(initialValue);
        this.setState({contentLength: this.getCurrentContentLength()})
        // setContentLength(getCurrentContentLength());

        // if (height.indexOf('px') > 0) {
        //     editorBody.style.height = +height.split('px')[0] - (hideToolbar ? 0 : 48) - (hideCounter ? 0 : 13);
        // }

        console.log(`ANOTHER AFTER`)

        this.setEditorHeight(height); // TODO: fix

        console.log(`YET ANOTHER AFTER`)
    }

    componentWillUnmount() {
        console.log(`UNMOUNTING`);
        const contentWindow = getWindow(this.editor);
        const editorBody = getDocumentBody(this.editor);
        contentWindow.removeEventListener('mouseup', this.changeHandler);
        editorBody.removeEventListener('mousedown', this.handleMouseDownEvent);
        editorBody.removeEventListener('keyup', this.changeHandler);
        editorBody.removeEventListener('paste', this.limitAndHandle);
        editorBody.removeEventListener('keydown', this.limitAndHandle);
        editorBody.removeEventListener('drop', this.limitAndHandle);
    }

    limitAndHandle = (e: KeyboardEvent): void => {
        this.limiter(e);
        this.changeHandler(e);
    };

    getCurrentContentLength = () => {
        // const editorBody = get(editor, 'current.firstChild.contentWindow.document.body');
        const editorBodyInnerHTML = getDocumentBodyInnerHTML(this.editor);
        const currentContentLength = stripHTML(editorBodyInnerHTML).length;

        return currentContentLength;
    };

    getNextContentLength = (event: Event) => {
        const eventType = event && event.type;
        let eventContentLength = this.getCurrentContentLength();

        switch (eventType) {
            case EVENT_TYPE_DROP: {
                const eventContent = (event as DragEvent).dataTransfer.getData('Text') || '';
                eventContentLength += eventContent.length || 0;
                break;
            }
            case EVENT_TYPE_PASTE: {
                const eventContent = (event as ClipboardEvent).clipboardData.getData('Text') || '';
                eventContentLength += eventContent.length || 0;
                break;
            }
            default:
                eventContentLength += 1;
                break;
        }

        return eventContentLength;
    };

    changeHandler = (e: Event): void | undefined => {
        console.log(`----- CHANGE STARTED`)
        const {formName, fieldName, changeField, onChange, autoExpand} = this.props;
        // setContentLength(getCurrentContentLength());
        this.setState({ contentLength: this.getCurrentContentLength() });
        updateRange();
        // setRange(getRange());
        this.setState({ range: getRange() });
        const innerHTML = getDocumentBodyInnerHTML(this.editor);
        console.log(`formName, fieldName, innerHTML`, formName, fieldName, innerHTML);
        // if (formName && fieldName) {
        //     changeField(formName, fieldName, innerHTML);
        // } else {
        //     onChange && onChange(innerHTML);
        // }
        if (autoExpand) {
            const editorBody = getDocumentBody(this.editor);
            const bodyHeight: number = editorBody && editorBody.offsetHeight;
            console.log(`bodyHeight`, bodyHeight);
            console.log(`editorHeight`, this.state.editorHeight);
            if (bodyHeight !== this.state.editorHeight) {
                this.setEditorHeight(bodyHeight, true)
            }
        }
        if (e.type === 'mouseup' && !this.dragging) {
            return;
        }
        this.dragging = false;
    };

    handleMouseDownEvent = (): void => {
        this.dragging = true;
    };

    limiter = (event: KeyboardEvent) => {
        const { contentLengthLimit } = this.props;
        const currentContentLength = this.getCurrentContentLength();
        const nextContentLength = this.getNextContentLength(event);

        const allowedKeyPressed = ALLOWED_CODES.includes(event.code);

        if (
            (currentContentLength >= contentLengthLimit ||
                nextContentLength > contentLengthLimit) &&
            !allowedKeyPressed
        ) {
            event.preventDefault();
            return false;
        }
        return null;
    };

    getFieldComponent = (fieldProps: any) => {
        const {autoExpand} = this.props;
        const {
            input,
            meta: {
                warning: fieldWarning,
                error: fieldError
            },
        } = fieldProps;

        console.log(`fieldWarning`, fieldWarning)
        console.log(`fieldError`, fieldError)

        return (
            <Editor
                textareaRef={this.editor}
                warning={fieldWarning}
                error={fieldError}
                autoExpand={autoExpand}
            />
        )
    }

    handleValidate = () => {
        const {validate} = this.props;
        const innerHTML = getDocumentBodyInnerHTML(this.editor);
        if (validate) {
            return validate(innerHTML)
        };

        return undefined;
    }

    handleWarn = () => {
        const {warn} = this.props;
        const innerHTML = getDocumentBodyInnerHTML(this.editor);
        if (warn) {
            return warn(innerHTML)
        };

        return undefined;
    }

    setEditorHeight = (heightToSet: string | number, setExact?: boolean) => {
        // const editorBody = get(editor, IFRAME_BODY);
        const {hideToolbar, hideCounter} = this.props;
        const prettifiedHeight = typeof heightToSet === 'string' ? +heightToSet.split('px')[0] : heightToSet;
        // let expectedHeight: string | number = heightToSet;
        // if (height.indexOf('px') > 0) {
        //     expectedHeight = +height.split('px')[0];
        // }
        const expectedHeight = setExact ?
            prettifiedHeight :
            (prettifiedHeight - (hideToolbar ? 0 : 43) - (hideCounter ? 0 : 13));

        console.log(`RESETTING HEIGHT expectedHeight`, expectedHeight);

        this.editor.current.style.height = `${expectedHeight}px`;

        // editorBody.style.height = `${expectedHeight}px`;

        // setHeight(expectedHeight);
        this.setState({ editorHeight: expectedHeight });
    }

    // useEffect(() => {
    //     const editorDocument = getDocument(editor);
    //     console.log(`editorDocument`, editorDocument);
    //     const contentWindow = getWindow(editor);
    //     // const editorBody = getDocumentBody(editor);
    //     const editorBody = get(editor, 'current.firstChild.contentWindow.document.body');
    //     if (!editorBody) return;
    //     console.log(`editorBody`, editorBody);

    //     editorDocument.execCommand('styleWithCSS', false, null);
    //     editorDocument.execCommand('insertBrOnReturn', false, null);

    //     setWorkingRef(editor);

    //     const limitAndHandle = (e: KeyboardEvent): void => {
    //         limiter(e);
    //         changeHandler(e);
    //     };

    //     console.log(`AFTER`);

    //     setTimeout(() => {
    //         contentWindow.addEventListener('mouseup', changeHandler);
    //         editorBody.addEventListener('mousedown', handleMouseDownEvent);
    //         editorBody.addEventListener('keyup', changeHandler);
    //         editorBody.addEventListener('paste', limitAndHandle);
    //         editorBody.addEventListener('keydown', limitAndHandle);
    //         editorBody.addEventListener('drop', limitAndHandle);
    //     }, 200);

    //     editorBody.innerHTML = cleanHTML(initialValue);
    //     setContentLength(getCurrentContentLength());

    //     // if (height.indexOf('px') > 0) {
    //     //     editorBody.style.height = +height.split('px')[0] - (hideToolbar ? 0 : 48) - (hideCounter ? 0 : 13);
    //     // }

    //     console.log(`ANOTHER AFTER`)

    //     setEditorHeight(height); // TODO: fix

    //     console.log(`YET ANOTHER AFTER`)
    //     // const bodyHeight = editorBody.offsetHeight;
    //     // setHeight(bodyHeight);

    //     // eslint-disable-next-line
    //     return function cleanup() {
    //         console.log(`UNMOUNTING`);
    //         contentWindow.removeEventListener('mouseup', changeHandler);
    //         editorBody.removeEventListener('mousedown', handleMouseDownEvent);
    //         editorBody.removeEventListener('keyup', changeHandler);
    //         editorBody.removeEventListener('paste', limitAndHandle);
    //         editorBody.removeEventListener('keydown', limitAndHandle);
    //         editorBody.removeEventListener('drop', limitAndHandle);
    //     };
    // }, []);

    render() {
        const {
            width,
            height = '113px',
            hideToolbar,
            hideCounter,
            initialValue,
            onChange = noop,
            textareaRef,
            features = [],
            contentLengthLimit = CONTENT_LENGTH_LIMIT,
            formName,
            fieldName,
            validate,
            warn,
            error,
            warning,
            changeField,
            autoExpand,
        } = this.props;

        const {range, contentLength} = this.state;
        return (
            <div className={style['text-editor']} style={{width, 'minHeight': height}}>
                {!hideToolbar && (
                    <Toolbar
                        textareaRef={this.editor}
                        features={features}
                        range={range}
                    />
                )}

                {fieldName && formName ? (
                    <Field
                        name={fieldName}
                        component={this.getFieldComponent}
                        validate={this.handleValidate}
                        warn={this.handleWarn}
                    />
                ) : (
                    <Editor
                        textareaRef={this.editor}
                        error={error}
                        warning={warning}
                        autoExpand={autoExpand}
                    />
                )}
                {!hideCounter && (
                    <Counter current={contentLength} limit={contentLengthLimit} />
                )}
            </div>
        );
    }
};

export const TextEditor = connect(
    null,
    {
        changeField: change
    }
)(TextEditorComponent)

export {useEditor} from './hooks';
