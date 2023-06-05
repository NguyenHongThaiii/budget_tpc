import {
  calculateBudgetByCategory,
  calculateTotalBudget,
  findIndexByCategoryAndAction,
  data,
  QUANTITY_ITEM_SHOW,
} from "./model.js";

export const handleFillDataToModal = (textEl) => {
  const modalTopic = document.querySelector(".modal-body__topic");
  if (!modalTopic) return;
  modalTopic.innerHTML = textEl.textContent;
};
export const handleRenderBudget = (data) => {
  const listTemplateIncome = document.querySelector(".bill-template--income");
  const listTemplateCost = document.querySelector(".bill-template--cost");
  const budgetEl = document.querySelector(".header-budget__money");
  if (data.length <= 0) return;
  listTemplateIncome.innerHTML = "";
  listTemplateCost.innerHTML = "";
  const topicIncome = handleCreateElAndAssignClass(
    "div",
    `bill-template__title bill--income`,
    "Income"
  );
  const topicCost = handleCreateElAndAssignClass(
    "div",
    `bill-template__title bill--cost`,
    "Cost"
  );
  listTemplateIncome.appendChild(topicIncome);
  listTemplateCost.appendChild(topicCost);

  data.map((item, index) => {
    const liEl = handleCreateElAndAssignClass("li", "bill-template__box", "");
    const wrapEl = handleCreateElAndAssignClass(
      "div",
      `bill-template__wrap ${
        item?.action == "income" ? "bill--income" : "bill--cost"
      }`,
      ""
    );
    const imgEl = handleCreateElAndAssignClass("img", "bill-template__img", "");
    const contentEl = handleCreateElAndAssignClass(
      "div",
      "bill-template__content",
      ""
    );
    const titleEl = handleCreateElAndAssignClass(
      "p",
      `bill-template__title ${
        item?.action == "income" ? "bill--income" : "bill--cost"
      }`,
      item?.title
    );
    const priceEl = handleCreateElAndAssignClass(
      "p",
      "bill-template__price",
      `$${calculateBudgetByCategory(data, item?.category, item?.action)}`
    );
    const timeEl = handleCreateElAndAssignClass("p", "bill-template__time", "");
    const dateEl = handleCreateElAndAssignClass(
      "span",
      "bill-template__date",
      item?.createdAt
    );

    imgEl.setAttribute("src", `./assets/img/${item?.image}.png`);
    // append child

    contentEl.appendChild(titleEl);
    contentEl.appendChild(priceEl);
    timeEl.textContent = "Created at: ";
    timeEl.appendChild(dateEl);
    contentEl.appendChild(timeEl);
    wrapEl.removeEventListener("click", handleShowAndHideFrame);
    wrapEl.addEventListener("click", handleShowAndHideFrame);
    wrapEl.appendChild(imgEl);

    imgEl.dataset.category = item?.category;
    wrapEl.dataset.category = item?.category;
    imgEl.dataset.action = item?.action;
    wrapEl.dataset.action = item?.action;

    liEl.appendChild(wrapEl);
    liEl.appendChild(contentEl);

    item?.action === "income"
      ? listTemplateIncome.appendChild(liEl)
      : listTemplateCost.appendChild(liEl);
    budgetEl.textContent = "$" + calculateTotalBudget(data);
  });
};
export const handleCreateElAndAssignClass = (
  nameEl,
  className,
  textContent
) => {
  const element = document.createElement(nameEl);
  element.setAttribute("class", className);
  element.textContent = textContent;
  return element;
};
export const handleShowAndHideFrame = (e) => {
  const listBoxEl = document.querySelectorAll(".bill-template__box");
  const frameEl = document.querySelector(".frame");
  const btnCloseEl = frameEl.querySelector(".btn-close");
  if (!listBoxEl || !frameEl) return;
  // hide & show frame
  frameEl.classList.add("show");
  const index = findIndexByCategoryAndAction(
    data,
    e.target.dataset.category,
    e.target.dataset.action
  );
  handleRenderFrameItem(data, index);

  btnCloseEl.onclick = null;
  btnCloseEl.onclick = () => {
    frameEl.classList.remove("show");
  };
};
export const handleRenderFrameItem = (data, indexData) => {
  const listEl = document.querySelector(".frame-body__list");
  const totalEl = document.querySelector(".frame-body__total");
  const headEl = document.querySelector(".frame-body__head");
  listEl.innerHTML = "";
  data[indexData]?.listItem.map((item, index) => {
    if (!listEl || !item) return;

    const liEl = handleCreateElAndAssignClass("li", "frame-body__item", "");
    const calendarEl = handleCreateElAndAssignClass(
      "img",
      "frame-body__calendar",
      ""
    );
    calendarEl.setAttribute("src", "./assets/img/calendar.png");
    const contentEl = handleCreateElAndAssignClass(
      "div",
      "frame-body__content",
      ""
    );
    const titleEl = handleCreateElAndAssignClass(
      "div",
      "frame-body__title",
      `${item?.title}`
    );
    const moneyEl = handleCreateElAndAssignClass(
      "span",
      "frame-body__money",
      `:  $${item?.amount}`
    );
    const descriptionEl = handleCreateElAndAssignClass(
      "div",
      "frame-body__description",
      `${item?.description}`
    );
    const timeEl = handleCreateElAndAssignClass("div", "frame-body__time", "");
    const dateEl = handleCreateElAndAssignClass(
      "span",
      "frame-body__date",
      `${item?.createdAt}`
    );

    titleEl.appendChild(moneyEl);
    timeEl.textContent = "Created at: ";
    timeEl.appendChild(dateEl);

    contentEl.appendChild(titleEl);
    contentEl.appendChild(descriptionEl);
    contentEl.appendChild(timeEl);

    liEl.appendChild(calendarEl);
    liEl.appendChild(contentEl);
    listEl.appendChild(liEl);
    headEl.textContent = `${data[indexData]?.title}`;
    totalEl.textContent = `$${data[indexData]?.listItem?.reduce(
      (acc, o) => acc + o?.amount,
      0
    )}`;
  });
};
// View
(() => {
  const budgetList = Array.from(
    document.querySelectorAll(".category-right__item")
  );
  const btnPrev = document.querySelector(".category-left__prev");
  const btnNext = document.querySelector(".category-left__next");
  let countNext = 0;
  let countPrev;
  if (!budgetList || !btnPrev || !btnNext) return;
  btnNext.addEventListener("click", function () {
    if (countNext >= budgetList.length - QUANTITY_ITEM_SHOW) return;
    countNext += QUANTITY_ITEM_SHOW;
    budgetList.map((item, index) => {
      item.style.transform = "translateX(" + -120 * countNext + "px" + ")";
    });
  });
  btnPrev.addEventListener("click", function () {
    countPrev = countNext;
    if (countPrev == 0) return;
    countPrev -= QUANTITY_ITEM_SHOW;
    countNext -= QUANTITY_ITEM_SHOW;
    budgetList.map((item, index) => {
      item.style.transform = "translateX(" + -120 * countPrev + "px" + ")";
    });
  });
})();
