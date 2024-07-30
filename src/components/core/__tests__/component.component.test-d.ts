import { expectAssignable } from "jest-tsd";
import { BodyMutable, Component, Point } from "../../../types";
import { component } from "../component.component";

type Props = {
  abc?: boolean;
};
type Mutable = {
  shazam: () => boolean;
};
type Data = {
  aha: string;
};

const emptyComponent: Component<Props, Mutable, Data> = () => {
  const $container = component<Props, Mutable, Data>({
    label: "adada",
  });
  return $container.getComponent(emptyComponent, {
    shazam: () => false,
  });
};

const $empty = emptyComponent({ abc: false });

test("expect mutable from empty", async () => {
  expectAssignable<Function>($empty.setLabel);
  expectAssignable<Function>($empty.setBody);
  expectAssignable<Function>($empty.setPosition);

  expectAssignable<() => string>($empty.getId);
  expectAssignable<() => string>($empty.getLabel);
  expectAssignable<Function>($empty.getFather);
  expectAssignable<() => BodyMutable>($empty.getBody);
  expectAssignable<() => Point>($empty.getPosition);

  expectAssignable<Function>($empty.$getRaw);

  expectAssignable<Function>($empty.getProps);
});

test("expect custom mutable from empty", () => {
  expectAssignable<() => boolean>($empty.shazam);
});

test("expect custom props from empty", () => {
  expectAssignable<Partial<{ abc: boolean }>>($empty.getProps());
});
