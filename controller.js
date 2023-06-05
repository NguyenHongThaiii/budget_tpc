import { handleFillDataToModal, handleRenderBudget } from "./view.js";
import {
  checkCategoryIsExists,
  data,
  findIndexByCategoryAndAction,
  handleShowModal,
} from "./model.js";

// Controller
(() => {
  const modalEl = document.querySelector(".modal");
  const listCategories = document.querySelectorAll(".category-right__item");
  const modalFormEl = document.querySelector(".modal-body__form");
  const btnCancel = document.querySelector(".btn--cancel");
  const modalError = modalFormEl.querySelector(".modal-error");
  let textEl;

  if (!modalEl || !listCategories) return;
  listCategories.forEach((category, index) => {
    category.addEventListener("click", function () {
      handleShowModal(modalEl);
      textEl = category.querySelector(".category-right__text");
      handleFillDataToModal(textEl);
    });
  });

  modalFormEl.addEventListener("submit", function (e) {
    e.preventDefault();
    const amountEl = modalFormEl.querySelector("input[name='amount']");
    const titleEl = modalFormEl.querySelector("input[name='title']");
    const descEl = modalFormEl.querySelector("textarea[name='description']");
    const actionEl = modalFormEl.querySelector("input[name='action']:checked");
    if (
      amountEl?.value == "" ||
      titleEl?.value == "" ||
      descEl?.value == "" ||
      actionEl?.value == ""
    ) {
      modalError.classList.add("show");
      return;
    }
    const obj = {
      title: textEl?.textContent + ` ${actionEl?.value}`,
      category: textEl?.textContent,
      action: actionEl?.value,
      createdAt: new Date().toString().slice(0, 15),
      image: `${textEl?.textContent}`.toLocaleLowerCase(),
    };
    const objChild = {
      amount: +amountEl?.value,
      title: titleEl.value,
      description: descEl?.value,
      action: actionEl?.value,
      createdAt: new Date().toString().slice(0, 15),
    };
    if (checkCategoryIsExists(data, textEl?.textContent, actionEl?.value)) {
      const index = findIndexByCategoryAndAction(
        data,
        textEl?.textContent,
        actionEl?.value
      );
      data[index]?.listItem.push(objChild);
    } else {
      obj.listItem = [];
      data.push(obj);
      const index = findIndexByCategoryAndAction(
        data,
        textEl?.textContent,
        actionEl?.value
      );
      data[index]?.listItem.push(objChild);
    }
    handleRenderBudget(data);
    modalFormEl.reset();
    modalError.classList.remove("show");
    modalEl.classList.remove("show");
  });

  btnCancel.addEventListener("click", function () {
    modalEl.classList.remove("show");
    modalError.classList.remove("show");
  });

  handleRenderBudget(data);
})();
