import React, { useState } from "react";

export default function Calculator() {
    const [display, setDisplay] = useState("0");

    const buttons = [
        ["C", "+/-", "%", "÷"],
        ["7", "8", "9", "×"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
        ["0", ".", "="],
    ];

    return (
        <div className="w-[444px] bg-black rounded-3xl p-4 shadow-2xs">
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
                            className={`${isZero ? "col-span-2" : "col-span-1"
                                } text-white text-2xl h-16 rounded-full ${isOperator
                                    ? "bg-orange-500"
                                    : btn === "C" || btn === "+/-" || btn === "%"
                                        ? "bg-gray-400 text-black"
                                        : "bg-gray-700"
                                }`}
                        >
                            {btn}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
