import { container, ContainerComponent } from "@tulib/tulip";
import { inputsComponent } from "inputs.component";

type Props = {};
type Mutable = {};

export const appComponent: ContainerComponent<Props, Mutable> = () => {
  const $container = container({ label: "app" });

  $container.add(inputsComponent());

  return $container.getComponent(appComponent);
};
