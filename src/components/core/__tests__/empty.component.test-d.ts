import { expectAssignable } from "jest-tsd";
import { empty } from "../empty.component";
import { BodyMutable, EmptyComponent, Point } from "../../../types";

type Props = {
  abc?: boolean;
};
type Mutable = {
  shazam: () => boolean;
};
type Data = {
  aha: string;
};

const emptyComponent: EmptyComponent<Props, Mutable, Data> = () => {
  const $container = empty<Props, Mutable, Data>({
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

test("expect custom mutable from empty", async () => {
  expectAssignable<() => boolean>($empty.shazam);
});

test("expect custom props from empty", async () => {
  expectAssignable<Partial<{ abc: boolean }>>($empty.getProps());
});
