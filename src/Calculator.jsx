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
        const value = parseFloat(display);
        setDisplay((value / 100).toString());
    };

    const performOperation = (nextOperator) => {
        const inputValue = parseFloat(display);

        if (operator && waitingForOperand) {
            setOperator(nextOperator);
            setExpression(expression.slice(0, -1) + nextOperator);
            return;
        }

        if (firstOperand == null) {
            setFirstOperand(inputValue);
            setExpression(`${inputValue} ${nextOperator}`);
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            if (result === "Error") {
                clearAll();
                setDisplay("Error");
                return;
            }
            setDisplay(String(result));
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

    const handleEquals = () => {
        if (operator && firstOperand != null && !waitingForOperand) {
            const result = calculate(firstOperand, parseFloat(display), operator);
            if (result === "Error") {
                clearAll();
                setDisplay("Error");
                return;
            }
            setDisplay(String(result));
            setExpression(`${expression} ${display} =`);
            setFirstOperand(null);
            setOperator(null);
            setWaitingForOperand(true);
        }
    };

    const handleClick = (btn) => {
        if (display === "Error" && btn !== "C") {
            clearAll();
            return;
        }

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
            handleEquals();
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
                    const isSpecial = ["C", "+/-", "%"].includes(btn);

                    return (
                        <button
                            key={i}
                            onClick={() => handleClick(btn)}
                            className={`
                                ${isZero ? "col-span-2" : "col-span-1"}
                                text-white text-2xl h-16 rounded-full
                                ${isOperator ? "bg-orange-500 hover:bg-orange-600"
                                    : isSpecial
                                        ? "bg-gray-400 text-black hover:bg-gray-300"
                                        : "bg-gray-700 hover:bg-gray-600"}
                                transition-colors duration-200
                                focus:outline-none
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