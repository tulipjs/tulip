import { ContainerMutable, ContainerProps } from "./container.types";
import { Cursor } from "../../enums";
import { Size } from "../size.types";

export type PartialDraggableProps = {
  size?: Size;
  grabCursor?: Cursor;
  grabbingCursor?: Cursor;
};

export type DraggableProps<Data = {}> = PartialDraggableProps &
  ContainerProps<Data>;

export type PartialDraggableMutable = {
  setSize: (size?: Size) => void;
};

export type DraggableMutable = PartialDraggableMutable & ContainerMutable;
