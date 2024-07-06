import { expectAssignable } from "jest-tsd";
import { empty } from "../empty.component";
import { EmptyComponent } from "../../../types";

type Props = {
  abc: boolean;
};
type Mutable = {
  shazam: () => boolean;
};
type Data = {
  aha: number;
};

const comp: EmptyComponent<Props, Mutable, Data> = ({
  angle,
  abc,
  label,
  position,
  id,
}) => {
  const $container = empty();
  return $container.getComponent(comp, {
    shazam: () => {},
  });
};
(async () => {
  const aaa = comp({ abc: false });

  aaa.getProps().initialData;
  aaa.shazam();
  aaa.getProps().abc;
  aaa.getData().aha;
})();

test("test", async () => {
  const test = comp({ abc: false });
  expectAssignable<{ initialData: Data }>(test.getProps());
});
