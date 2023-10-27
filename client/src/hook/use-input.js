import { useState } from "react";

const useInput = (resolveData) => {
  const [enteredInput, setEnteredInput] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [valueErrorInput, setValueErrorInput] = useState("");

  const validInput = resolveData(enteredInput);
  const errorInput = isTouched && !validInput;

  const eventChangeInput = (e) => {
    setEnteredInput(e.target.value);
    setValueErrorInput("");
  };

  const eventTouchInput = () => {
    setIsTouched(true);
  };

  const resetInput = () => {
    setEnteredInput("");
    setIsTouched(false);
  };

  const onSetValueErrorInput = (msg) => {
    setValueErrorInput(msg);
  };

  const onSetFirstValueInput = (value) => {
    setEnteredInput(value);
  };

  return {
    valueInput: enteredInput,
    validInput,
    errorInput,
    valueErrorInput,
    eventChangeInput,
    eventTouchInput,
    resetInput,
    onSetFirstValueInput,
    onSetValueErrorInput,
  };
};
export default useInput;
