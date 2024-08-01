import { container, ContainerComponent } from "@tulib/tulip";
import { inputsComponent } from "inputs.component";
import { playerComponent } from "player.component";

type Props = {};
type Mutable = {};

export const appComponent: ContainerComponent<Props, Mutable> = () => {
  const $container = container({ label: "app" });

  $container.add(inputsComponent());
  $container.add(playerComponent());

  return $container.getComponent(appComponent);
};
