import {
  DisplayObjectMutable,
  DisplayObjectProps,
} from "../display-object.types";
import { Container } from "../pixi.types";

export type ContainerProps = {} & DisplayObjectProps;

export type ContainerMutable = {
  add: (...displayObjectsMutables: DisplayObjectMutable<any>[]) => void;
  remove: (...displayObjectsMutables: DisplayObjectMutable<any>[]) => void;
} & DisplayObjectMutable<Container>;
