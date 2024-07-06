import { empty, AsyncEmptyComponent } from "@tulib/tulip";

type Props = {
  abc: boolean;
};

const comp: AsyncEmptyComponent<
  Props,
  {
    shazam: () => void;
  },
  {}
> = async () => {
  const $container = empty();
  return $container.getComponent(comp);
};

const test = await comp({ abc: false });

test.getProps().initialData;
test.shazam();
test.getProps().abc;
