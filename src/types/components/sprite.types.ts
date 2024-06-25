import {
  DisplayObjectMutable,
  DisplayObjectProps,
} from "../display-object.types";
import { Sprite } from "../pixi.types";

export type SpriteProps = {
  texture: string;
} & DisplayObjectProps;

export type SpriteMutable = {
  setTexture: (texture?: string) => Promise<void>;
} & DisplayObjectMutable<Sprite>;
