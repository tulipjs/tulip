import { ContainerMutable, ContainerProps } from "./container.types";
import { Size } from "../size.types";

export type PartialScrollableProps = {
  size: Size;
  jump: number;
  horizontalScroll?: boolean;
  verticalScroll?: boolean;
  components?: ContainerMutable[];
};

export type ScrollableProps<Data = {}> = PartialScrollableProps &
  ContainerProps<Data>;

export type PartialScrollableMutable = {};

export type ScrollableMutable = PartialScrollableMutable & ContainerMutable;
