const getInputElement = (): HTMLInputElement =>
  document.getElementsByTagName("input")[0] || document.createElement("input");

export const openKeyboard = () => {
  const target = getInputElement();
  target.style.position = "absolute";
  target.style.left = "-20px";
  target.style.top = "-20px";
  target.style.zIndex = "-10";
  document.body.append(target);
  target.focus();
  target.click();
  target.value = "";
};

export const closeKeyboard = () => {
  const target = getInputElement();
  target.blur();
  target.value = "";
};
