export const data = [];
export const QUANTITY_ITEM_SHOW = 5;

// be able move to other file (ex: util.js)

/* Theo em biết thì những cái logic này nên để ở controller nhưng mà em vẫn thấy một số người họ để những hàm xử lí chính ở 
model (để kế thừa) or service còn ở controller chỉ các xử lí bên ngoài sau đó gọi trực tiếp đến là được nên em áp dụng thử.
*/
export const calculateBudgetByCategory = (data, category, action) => {
  if (!data || !category || !action) return 0;
  const index = findIndexByCategoryAndAction(data, category, action);
  if (index < 0) return 0;
  return data[index]?.listItem?.reduce((acc, item) => acc + item.amount, 0);
};
export const handleShowModal = (modalEl) => {
  modalEl.classList.add("show");
};
export const handleHideModal = (modalEl) => {
  modalEl.classList.remove("show");
};
export const calculateTotalBudget = (data) => {
  if (!data) return 0;
  let total = 0;
  data.forEach((item) => {
    total += item.listItem.reduce(
      (acc, next) =>
        next.action === "income" ? acc + next.amount : acc - next.amount,
      0
    );
  });
  return total;
};
export const checkCategoryIsExists = (data, category, action) => {
  if (!data) return;
  return data.some((item) => {
    return item.category === category && item.action === action;
  });
};
export const findIndexByCategoryAndAction = (data, category, action) => {
  return data.findIndex(
    (item) => item.category === category && item.action === action
  );
};
