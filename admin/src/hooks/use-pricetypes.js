import { useState } from "react";

const usePriceTypes = () => {
  //hàm tạo giá trị tiền có dấu chấm ngăn cách
  const Dot = (value) => {
    // console.log(value);
    const price = value.split("");
    let plus = 0;
    for (let i = price.length; i > 0; i--) {
      plus++;
      if (plus % 3 === 0 && i < price.length && i > 1) {
        price.splice(i - 1, 0, ".");
      }
    }
    return price.join("");
  };
  //hàm tỉnh tổng tiền 1 mảng
  const Total = (array) => {
    let total = 0;
    array.map((item) => (total += Number(item.product.price) * item.quantity));
    return total;
  };

  return {
    Dot,
    Total,
  };
};
export default usePriceTypes;
