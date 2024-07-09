import { WorldProps } from "../types";

export const WORLD_DEFAULT_PROPS: WorldProps<any> = {
  props: {
    physics: {
      gravity: { x: 0, y: 9.8 },
      velocity: 1,
    },
  },
};
