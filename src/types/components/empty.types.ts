import {
  AsyncComponent,
  Component,
  ComponentMutable,
  ComponentProps,
  InternalMutable,
} from "../component.types";

export type PartialEmptyProps<Data = {}> = {
  initialData?: Data;
};

export type EmptyProps<Data = {}> = ComponentProps & PartialEmptyProps<Data>;

////////////////////////////
export type InternalEmptyMutable<
  Props = {},
  Mutable = {},
  Data = {},
> = InternalMutable<
  PartialEmptyProps<Data> & Props,
  ComponentMutable<PartialEmptyProps<Data> & Props, Mutable, Data>,
  Data,
  false
>;

export type EmptyMutable<Props = {}, Mutable = {}, Data = {}> = InternalMutable<
  PartialEmptyProps<Data> & Props,
  ComponentMutable<PartialEmptyProps<Data> & Props, Mutable, Data>,
  Data,
  true
>;

////////////////////////////
export type EmptyComponent<Props = {}, Mutable = {}, Data = {}> = Component<
  PartialEmptyProps<Data> & Props,
  EmptyMutable<PartialEmptyProps<Data> & Props, Mutable, Data>,
  Data
>;

export type AsyncEmptyComponent<
  Props = {},
  Mutable = {},
  Data = {},
> = AsyncComponent<
  Props,
  EmptyMutable<PartialEmptyProps<Data> & Props, Mutable, Data>,
  Data
>;
