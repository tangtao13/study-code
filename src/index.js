import React, {Component, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
// import ReactDOM from './tangtao/react-dom';
// import ReactDOM from './tangtao/Fiber';
// import Component from './tangtao/Component';

// import ReactDOM from './myReact/Fiber';
import './index.css';

class ClassComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="border">
                <p>{this.props.name}</p>
                {React.Children.map(this.props.children, function (child) {
                    return <div>{child}</div>;
                })}
            </div>
        );
    }
}

function FunctionComponent(props) {
    const [state, setState] = useState(0);
    const [state1, setState1] = useState(1);
    useEffect(() => {
        console.log('state', state);
    }, [state]);
    useEffect(() => {
        setTimeout(() => {
            console.log('state1', state1);
        }, 2000);
    }, [state1]);
    return (
        <div className="border">
            <p>{props.name}</p>
            <p>{state}</p>
            <button onClick={() => setState((state) => state + 1)}>点击</button>
            <p>{props.name}</p>
            <p>{state1}</p>
            <button onClick={() => setState1((state) => state + 1)}>点击1</button>
        </div>
    );
}

function Child(props) {
    console.log('Child', props);
    return <div>1:{props.num}</div>;
}

function Father(props) {
    const [num, setNum] = React.useState(0);
    return (
        <div
            onClick={() => {
                setNum(num + 1);
            }}
        >
            {num}
            {props.children}
            <hr />
            {React.Children.map(props.children, function (child) {
                return React.cloneElement(child, {num: num, key: '123'});
            })}
        </div>
    );
}

function Child1() {
    useEffect(() => {
        setTimeout(() => {
            console.log('Child');
        }, 2);
    }, []);
    return <h1>child</h1>;
}

function Father1() {
    useEffect(() => {
        console.log('Father');
    }, []);

    return <Child1 />;
}

let element = (
    <section className="border">
        <h1>唐涛</h1>
        <h2>啊啊啊啊</h2>
        <a href="https://www.baidu.com/">百度</a>
        <Father>
            <Child />
        </Father>
        <FunctionComponent name="函数组件" />
        <ClassComponent name="类组件">
            <h3>react.children.map</h3>
            <div>test</div>
        </ClassComponent>
        <>
            <h2>列表</h2>
            <ul className="border">
                <li>1</li>
                <li>2</li>
            </ul>
        </>
        <Father1 />
    </section>
);

ReactDOM.render(element, document.getElementById('root'));
