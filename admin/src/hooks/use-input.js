import { useState } from "react";

const useInput = (resolveData) => {
  const [valueInput, setValueInput] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [valueErrorInput, setValueErrorInput] = useState("");

  //   kiểm tra dữ liệu search có rỗng không
  const validInput = resolveData(valueInput);
  const errorInput = isTouched && !validInput;

  const eventChangeInput = (e) => {
    if (e.target.files) {
      setValueInput(e.target.files);
    } else {
      setValueInput(e.target.value);
    }
    setValueErrorInput("");
  };

  const eventBlurInput = () => {
    setIsTouched(() => true);
  };

  const onSetFirstValueInput = (value) => {
    setValueInput(value);
  };

  const onSetValueErrorInput = (msg) => {
    setValueErrorInput(msg);
  };

  const resetInput = () => {
    setValueInput("");
    setIsTouched(false);
  };

  return {
    valueInput,
    valueErrorInput,
    errorInput,
    validInput,
    eventBlurInput,
    eventChangeInput,
    onSetFirstValueInput,
    onSetValueErrorInput,
    resetInput,
  };
};
export default useInput;
