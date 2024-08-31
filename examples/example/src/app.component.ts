import { container, ContainerComponent } from "@tulib/tulip";
import { testComponent } from "test.component";
// import { inputsComponent } from "inputs.component";
// import { playerComponent } from "player.component";
// import { dragComponent } from "drag.component";

type Props = {};
type Mutable = {};

export const appComponent: ContainerComponent<Props, Mutable> = () => {
  const $container = container({ label: "app" });

  $container.add(testComponent());
  // $container.add(playerComponent());
  // $container.add(inputsComponent());
  // $container.add(dragComponent());

  return $container.getComponent(appComponent);
};
