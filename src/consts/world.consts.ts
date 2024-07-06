import { PartialWorldProps } from "../types";

export const WORLD_DEFAULT_PROPS: PartialWorldProps = {
  props: {
    physics: {
      gravity: { x: 0, y: 9.8 },
      velocity: 1,
    },
  },
};
