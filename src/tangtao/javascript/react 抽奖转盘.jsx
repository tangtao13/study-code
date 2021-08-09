import React from 'react';
export default class Lottery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startRotateDeg: 0, // 记录上一次转到的角度
        };
    }

    randomNum = (minNum, maxNum) => {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    };

    handleClick = () => {
        const LOTTERY_AREA_DEG = [
            [1, 59],
            [61, 119],
            [121, 179],
            [181, 239],
            [241, 299],
            [301, 359],
        ];
        const giftIndex = this.randomNum(0, 5);
        // 随机取对应奖品区域中的一个角度
        const targetDegree = this.randomNum(LOTTERY_AREA_DEG[giftIndex][0], LOTTERY_AREA_DEG[giftIndex][1]);
        let rotateDeg = 0;
        // 递归计算下次要转到的度数
        let i = 0;
        const _fn = (n = 0) => {
            if (targetDegree + 360 * n > this.state.startRotateDeg) {
                rotateDeg = targetDegree + 360 * n;
            } else {
                i++;
                _fn(i);
            }
        };
        _fn();
        // 获取转盘实例
        const ele = document.getElementById('turntable');
        // 增加旋转动画
        ele.style.transition = 'all 6500ms';
        ele.style.transform = `rotate(${rotateDeg + 360 * 10}deg)`; // 乘以10是为了转盘转动的效果

        this.setState({
            startRotateDeg: rotateDeg + 360 * 10, // 记录上一次旋转到的角度
        });
    };

    render() {
        return (
            <div>
                {/* 转盘 */}
                <div className="turntable" id="turntable"></div>
                {/* 指针 */}
                <div className="pointer" onClick={this.handleClick}></div>
            </div>
        );
    }
}
