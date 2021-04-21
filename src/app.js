import React, { Component, useEffect, useState, useRef, createRef } from "react";

const EditableField = () => {
    const [a, setA] = useState(1)
    const textareaRef = useRef(null);

    const eventHandler = (e) => {
        console.log(`CHANGE FIRING, a is:`, a);
        setA(a + 1);
        // либо можно через updateA попробовать, но тоже не работает
        // updateA();
    };

    const updateA = () => {
        console.log(`UPDATE_FUNC (broken), a is:`, a)
        setA(a + 1);
    }

    // рабочий вариант обновления стейта
    const updateA_v2 = () => {
        console.log(`UPDATE_FUNC WORKING, a is:`, a)
        setA(prevA => prevA + 1);
    }

    useEffect(() => {
        console.log(`a in useEffect, just monitoring:`, a);
    }, [a])

    useEffect(() => {
        textareaRef.current.addEventListener("keyup", eventHandler);
        return () => {
            textareaRef.current.removeEventListener("keyup", eventHandler);
        }
    }, [])

    return (
        <div
            ref={textareaRef}
            contentEditable
            style={{
                width: '500px',
                height: '250px',
                border: '1px solid red',
            }}
            // Вот так можно повесить работающий ивен...но это не очень актуально для iframe
            // onKeyUp={eventHandler}
        />
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
        const {a} = this.state;
        console.log(`CHANGE FIRING in class component, a is:`, a);
        this.setState({a: a + 1})
    };



    render() {
        return (
            <div
                ref={this.textareaRef}
                contentEditable
                style={{
                    width: '500px',
                    height: '250px',
                    border: '1px solid red',
                }}
            />
        )
    }
}

export default props => {
    return (
        <>
            <EditableField />
            <br/>
            {'Ниже рабочий вариант с обычным компонентом'}
            <NewComp />
        </>
    );
}
