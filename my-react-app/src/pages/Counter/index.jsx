import React from "react";

function Counter() {
    const [state, setState] = React.useState(0);
    return <>
        <div style={{
            color: state > 0 ? 'green' : state < 0 ? 'blue' : 'gray',
            width: '100px',
            height: '100px'
        }}></div>
        <p>{state > 0 ? 'duong' : state < 0 ? 'am' : 'bang 0'}</p>
        <p>{state}</p>
        <button onClick={() => setState(state + 1)}>increase</button>
        <button onClick={() => setState(state - 1)}>decrease</button>
        <button onClick={() => setState(0)}>reset</button>
    </>
}

export default Counter;