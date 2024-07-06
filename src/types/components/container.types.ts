import {
  AsyncDisplayObjectComponent,
  InternalDisplayObjectMutable,
  DisplayObjectMutable,
} from "../display-object.types";
import { Container, DisplayObject } from "../pixi.types";

export type PartialContainerProps = {};

export type PartialContainerMutable = {
  add: (
    ...displayObjectsMutable: InternalDisplayObjectMutable<
      DisplayObject,
      any,
      any,
      any
    >[]
  ) => void;
  remove: (
    ...displayObjectsMutable: InternalDisplayObjectMutable<
      DisplayObject,
      any,
      any,
      any
    >[]
  ) => void;
  getChildren: () => DisplayObjectMutable<DisplayObject>[];
};

export type ContainerMutable = DisplayObjectMutable<Container> &
  PartialContainerMutable;

////////////////////////////
export type InternalAsyncContainerMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = Promise<InternalContainerMutable<Props, Mutable, Data>>;
export type InternalContainerMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = InternalDisplayObjectMutable<
  Container,
  PartialContainerProps & Props,
  PartialContainerMutable & Mutable,
  Data
>;

////////////////////////////
export type ContainerComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncDisplayObjectComponent<
  Container,
  PartialContainerProps & Props,
  PartialContainerMutable & Mutable,
  Data
>;
