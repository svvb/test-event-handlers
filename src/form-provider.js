import {useCallback, createContext, useRef, useState, Component, createRef} from 'react';
import {noop} from 'lodash';
import { getWindow } from './helpers';

export const EditorContext = createContext({
    EditorWindow: null,
    textareaRef: null,
    updateWindow: noop,
    checkWindow: noop
})

// export const editorProvider = props => WrappedComponent => {
//     return class A extends Component {
//         constructor(props) {
//             super(props);
//             this.textareaRef = createRef(null);

//             this.state = {
//                 EditorWindow,
//             }
//         }

//         checkWindow = () => {
//             console.log(`EditorWindow`, this.state.EditorWindow);
//         }

//         setWindow = () => {
//             this.setState()
//         }
//     // const textareaRef = useRef(null);
//     // const [EditorWindow, setWindow] = useState(null);

//     // const checkWindow = () => {
//     //     console.log(`EditorWindow`, EditorWindow);
//     // }


//         render() {
//             return (
//                 <EditorContext.Provider
//                     value={{
//                         EditorWindow,
//                         textareaRef,
//                         setWindow,
//                         checkWindow
//                     }}
//                 >
//                     <Component {...props} />
//                 </EditorContext.Provider>
//             )
//         }
//     }
// }

export const editorProvider = props => WrappedComponent => {
    const textareaRef = useRef(null);
    // const [EditorWindow, setWindow] = useState(null);
    const [val, setVal] = useState(null);

    const updateWindow = () => {
        // console.log(`getWindow(textareaRef)`, getWindow(textareaRef));
        // setWindow(getWindow(textareaRef));
        setVal(123);
    }

    const checkWindow = useCallback(() => {
        // console.log(`********** EditorWindow`, EditorWindow);
        console.log(`********** val`, val);
    }, [val])
    // const checkWindow = () => {
    //     // console.log(`********** EditorWindow`, EditorWindow);
    //     console.log(`********** val`, val);
    // }

    // console.log(`------ val`, val)
    return (
        <EditorContext.Provider
            value={{
                // EditorWindow,
                textareaRef,
                updateWindow,
                checkWindow,
                val,
                setVal
            }}
        >
            <WrappedComponent {...props} />
        </EditorContext.Provider>
    )
}
