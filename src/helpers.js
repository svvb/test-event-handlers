import {get} from 'lodash';

export const getWindow = (iframeRef) => {
    const iframe = iframeRef && iframeRef.current;
    return get(iframe, 'contentWindow');
};

export const getDocument = (iframeRef) => {
    const iframe = iframeRef && iframeRef.current;
    return get(iframe, 'contentWindow.document');
};

export const getDocumentBody = (iframeRef) => {
    const iframe = iframeRef && iframeRef.current;
    return get(iframe, 'contentWindow.document.body');
};

export const getDocumentBodyInnerHTML = (iframeRef) => {
    const iframe = iframeRef && iframeRef.current;
    return get(iframe, 'contentWindow.document.body.innerHTML', '');
};
