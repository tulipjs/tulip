import { global } from "../global";
import { isNotNullish } from "./nullish.utils";

export const setCanvasTooltip = (title: string) => {
  const { canvas } = global.getApplication().$getApplication();
  isNotNullish(title)
    ? canvas.setAttribute("title", title)
    : canvas.removeAttribute("title");
};
