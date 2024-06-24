import {
  DisplayObjectMutable,
  DisplayObjectProps,
} from "../display-object.types";
import { Container } from "../pixi.types";

export type ContainerProps = {} & DisplayObjectProps;

export type ContainerMutable = {
  add: (...displayObjectsMutable: DisplayObjectMutable<any>[]) => void;
  remove: (...displayObjectsMutable: DisplayObjectMutable<any>[]) => void;
} & DisplayObjectMutable<Container>;
