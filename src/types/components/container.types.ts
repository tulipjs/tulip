import {
  AsyncDisplayObjectComponent,
  DisplayObjectMutable,
  DisplayObjectProps,
} from "./display-object.types";
import { Container, DisplayObject } from "../pixi.types";

export type PartialContainerProps<Props = {}> = {} & Props;

export type PartialContainerMutable<Mutable = {}> = {
  add: (
    ...displayObjectsMutable: DisplayObjectMutable<
      DisplayObject,
      unknown,
      unknown,
      unknown
    >[]
  ) => void;
  remove: (
    ...displayObjectsMutable: DisplayObjectMutable<
      DisplayObject,
      unknown,
      unknown,
      unknown
    >[]
  ) => void;
  getChildren: () => DisplayObjectMutable<DisplayObject>[];
} & Mutable;

////////////////////////////
export type ContainerProps<Props = {}, Data = {}> = DisplayObjectProps<
  PartialContainerProps<Props>,
  Data
>;

export type ContainerMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = DisplayObjectMutable<
  Container,
  ContainerProps<Props, Data>,
  PartialContainerMutable<Mutable>,
  Data
>;

////////////////////////////
export type ContainerComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncDisplayObjectComponent<
  Container,
  ContainerProps<Props, Data>,
  ContainerMutable<Props, Mutable, Data>,
  Data
>;
