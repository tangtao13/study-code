/*
 * @Author: myname
 * @Date: 2021-03-23 14:17:07
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-23 14:17:10
 */
import {Children, cloneElement, memo, useEffect, useRef} from 'react';
import {useDeepCompareMemo} from 'use-deep-compare';
import omit from 'lodash.omit';

let renderCnt = 0;

export function SkipNotRenderProps({children, skips}) {
    if (!skips) {
        // 默认跳过所有回调函数
        skips = (prop) => prop.startsWith('on');
    }

    const child = Children.only(children);
    const childProps = child.props;
    const propsRef = useRef({});
    const nextSkippedPropsRef = useRef({});
    Object.keys(childProps)
        .filter((it) => skips(it))
        .forEach((key) => {
            // 代理函数只会生成一次，其值始终不变
            nextSkippedPropsRef.current[key] =
                nextSkippedPropsRef.current[key] ||
                function skipNonRenderPropsProxy(...args) {
                    propsRef.current[key].apply(this, args);
                };
        });

    useEffect(() => {
        propsRef.current = childProps;
    });

    // 这里使用 useMemo 优化技巧
    // 除去回调函数，其他属性改变生成新的 React.Element
    return useDeepCompareMemo(() => {
        return cloneElement(child, {
            ...child.props,
            ...nextSkippedPropsRef.current,
        });
    }, [omit(childProps, Object.keys(nextSkippedPropsRef.current))]);
}

// SkipNotRenderPropsComp 组件内容和 Normal 内容一样
export function SkipNotRenderPropsComp({onClick}) {
    return (
        <div className="case">
            <div className="caseHeader">跳过『与 Render 无关的 Props』改变触发的重新 Render</div>
            Render 次数为：
            {++renderCnt}
            <div>
                <button onClick={onClick} style={{color: 'blue'}}>
                    点我回调，回调弹出值为 1000（优化成功）
                </button>
            </div>
        </div>
    );
}

export default SkipNotRenderPropsComp;
