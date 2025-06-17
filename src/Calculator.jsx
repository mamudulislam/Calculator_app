import React, { useState } from "react";

export default function Calculator() {
    const [display, setDisplay] = useState("0");
    const [firstOperand, setFirstOperand] = useState(null);
    const [operator, setOperator] = useState(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [expression, setExpression] = useState("");

    const buttons = [
        ["C", "+/-", "%", "÷"],
        ["7", "8", "9", "×"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
        ["0", ".", "="],
    ];

    const inputDigit = (digit) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === "0" ? digit : display + digit);
        }
    };

    const inputDot = () => {
        if (waitingForOperand) {
            setDisplay("0.");
            setWaitingForOperand(false);
        } else if (!display.includes(".")) {
            setDisplay(display + ".");
        }
    };

    const clearAll = () => {
        setDisplay("0");
        setFirstOperand(null);
        setOperator(null);
        setWaitingForOperand(false);
        setExpression("");
    };

    const toggleSign = () => {
        setDisplay((prev) =>
            prev.charAt(0) === "-" ? prev.slice(1) : prev !== "0" ? "-" + prev : prev
        );
    };

    const inputPercent = () => {
        setDisplay((prev) => (parseFloat(prev) / 100).toString());
    };

    const performOperation = (nextOperator) => {
        const inputValue = parseFloat(display);

        if (operator && waitingForOperand) {
            setOperator(nextOperator);
            setExpression(`${firstOperand} ${nextOperator}`);
            return;
        }

        if (firstOperand == null) {
            setFirstOperand(inputValue);
            setExpression(`${inputValue} ${nextOperator}`);
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            setDisplay(result.toString());
            setFirstOperand(result);
            setExpression(`${result} ${nextOperator}`);
        }

        setOperator(nextOperator);
        setWaitingForOperand(true);
    };

    const calculate = (first, second, operator) => {
        switch (operator) {
            case "+":
                return first + second;
            case "-":
                return first - second;
            case "×":
                return first * second;
            case "÷":
                return second === 0 ? "Error" : first / second;
            default:
                return second;
        }
    };

    const handleClick = (btn) => {
        if (!isNaN(btn)) {
            inputDigit(btn);
        } else if (btn === ".") {
            inputDot();
        } else if (btn === "C") {
            clearAll();
        } else if (btn === "+/-") {
            toggleSign();
        } else if (btn === "%") {
            inputPercent();
        } else if (["+", "-", "×", "÷"].includes(btn)) {
            performOperation(btn);
        } else if (btn === "=") {
            if (operator && firstOperand != null && !waitingForOperand) {
                const result = calculate(firstOperand, parseFloat(display), operator);
                setDisplay(result.toString());
                setFirstOperand(null);
                setOperator(null);
                setWaitingForOperand(true);
                setExpression(""); // Clear the expression
            }
        }
    };

    return (
        <div className="w-[444px] bg-black rounded-3xl p-4 shadow-2xs">
            <div className="text-white text-right text-xl font-light h-6 flex items-end justify-end px-3">
                {expression}
            </div>
            <div className="text-white text-right text-5xl font-light h-24 flex items-end justify-end px-3 mb-4">
                {display}
            </div>
            <div className="grid grid-cols-4 gap-3">
                {buttons.flat().map((btn, i) => {
                    const isOperator = ["÷", "×", "-", "+", "="].includes(btn);
                    const isZero = btn === "0";
                    return (
                        <button
                            key={i}
                            onClick={() => handleClick(btn)}
                            className={`
                                ${isZero ? "col-span-2" : "col-span-1"}
                                text-white text-2xl h-16 rounded-full
                                ${isOperator ? "bg-orange-500"
                                    : btn === "C" || btn === "+/-" || btn === "%"
                                        ? "bg-gray-400 text-black"
                                        : "bg-gray-700"}
                            `}
                        >
                            {btn}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}