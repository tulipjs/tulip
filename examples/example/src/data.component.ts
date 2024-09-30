import { ContainerComponent, container } from "@tu/tulip";

type Props = {
  test: string;
};
type Mutable = {
  test: (test: string) => void;
};

export const dataComponent: ContainerComponent<Props, Mutable> = (props) => {
  const $container = container<Props, Mutable>(props);

  console.log(
    $container.getProps().test,
    "<<<<<<<<< TEST",
    $container.getScale(),
  );

  return $container.getComponent(dataComponent, {
    test: () => {
      $container.setScaleX(4);
      console.log("<<<");
    },
  });
};
