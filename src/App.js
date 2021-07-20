import React, {useState, useEffect, useRef} from "react";
import './App.css';
import 'antd/dist/antd.css';
import {Card, Layout, Input, Tooltip, Button, message} from 'antd';
import {PlusOutlined, MinusOutlined, ClearOutlined} from '@ant-design/icons';

const PLUS = 'PLUS'
const MINUS = 'MINUS'
const MULTIPLY = 'MULTIPLY'
const DIVIDE = 'DIVIDE'
const EQUAL = 'EQUAL'

function App() {
    const inputRef = useRef(null);
    const [valInput, setValInput] = useState('')
    const [resVal, setResVal] = useState(0)
    const [activeType, setActiveType] = useState(PLUS)

    const actionOnClick = (type) => () => {
        if (valInput) {
            switch (activeType) {
                case PLUS: {
                    setResVal(prevState => prevState + Number(valInput))
                    const newValInput = (type === EQUAL ?
                            (resVal + Number(valInput)).toString()
                            : ''
                    )
                    setValInput(newValInput)
                    break
                }
                case MINUS: {
                    setResVal(prevState => prevState - Number(valInput))
                    const newValInput = (type === EQUAL ?
                            (resVal - Number(valInput)).toString()
                            : ''
                    )
                    setValInput(newValInput)
                    break
                }
                case MULTIPLY: {
                    setResVal(prevState => prevState * Number(valInput))
                    const newValInput = (type === EQUAL ?
                            (resVal * Number(valInput)).toString()
                            : ''
                    )
                    setValInput(newValInput)
                    break
                }
                case DIVIDE: {
                    if (Number(valInput) === 0) {
                        message.error('На ноль делить нельзя!')
                        setValInput('')
                        inputRef.current.focus({
                            cursor: 'end',
                        })
                        setActiveType(DIVIDE)
                        return
                    } else {
                        setResVal(prevState => prevState / Number(valInput))
                        const newValInput = (type === EQUAL ?
                                (resVal / Number(valInput)).toString()
                                : ''
                        )
                        setValInput(newValInput)
                    }
                    break
                }
                default: {
                    if (type !== EQUAL) {
                        setValInput('')
                    }
                    break
                }
            }
        } else if (type === EQUAL){
            setValInput(resVal.toString())
        }
        if (type !== EQUAL) {
            inputRef.current.focus({
                cursor: 'end',
            })
        }
        setActiveType(type)

    }

    useEffect(() => {
        console.log(resVal)
    }, [resVal])

    const changeValInput = (e) => {
        const {value} = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            if (activeType !== EQUAL)
                setValInput(value)
        }
    };

    const onBlurHandler = () => {
        let valueTemp = valInput;
        if (valInput.charAt(valInput.length - 1) === '.' || valInput === '-') {
            valueTemp = valInput.slice(0, -1);
        }
        setValInput(valueTemp)
    }


    function formatNumber(value) {
        value += '';
        const list = value.split('.');
        const prefix = list[0].charAt(0) === '-' ? '-' : '';
        let num = prefix ? list[0].slice(1) : list[0];
        let result = '';
        while (num.length > 3) {
            result = ` ${num.slice(-3)}${result}`;
            num = num.slice(0, num.length - 3);
        }
        if (num) {
            result = num + result;
        }
        return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
    }

    const clearCalculator = () => {
        setResVal(0)
        setActiveType(PLUS)
        setValInput('')
    }


    const title = valInput ? (
        <span className="numeric-input-title">{valInput !== '-' ? formatNumber(valInput) : '-'}</span>
    ) : (
        'Введите число'
    );

    return (
        <div className="App">
            <Layout style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Card title="Калькулятор" headStyle={{textAlign: "center"}} className={'card-3 '}
                      style={{maxWidth: 400, width: "100%"}}>
                    <div className={'topCalculator'}>
                        <p>Значение:</p>
                        <Tooltip title="Очистить каклькулятор">
                            <Button onClick={clearCalculator} danger icon={<ClearOutlined/>}/>
                        </Tooltip>
                    </div>

                    <Tooltip
                        trigger={['focus']}
                        title={title}
                        placement="topLeft"
                        overlayClassName="numeric-input"
                    >
                        <Input
                            value={valInput}
                            onChange={changeValInput}
                            onBlur={onBlurHandler}
                            placeholder="Введите число"
                            maxLength={25}
                            ref={inputRef}
                        />
                    </Tooltip>
                    <div className={'actionBtn'}>
                        <Button onClick={actionOnClick(PLUS)} type="primary" icon={<PlusOutlined/>}/>
                        <Button onClick={actionOnClick(MINUS)} type="primary" icon={<MinusOutlined/>}/>
                        <Button onClick={actionOnClick(MULTIPLY)} type="primary">*</Button>
                        <Button onClick={actionOnClick(DIVIDE)} type="primary">/</Button>
                        <Button onClick={actionOnClick(EQUAL)} type="primary">=</Button>
                    </div>
                </Card>
            </Layout>
        </div>
    );
}

export default App;
