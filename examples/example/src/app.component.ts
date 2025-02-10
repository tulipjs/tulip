import { container, ContainerComponent } from "@tu/tulip";
import { dataComponent } from "data.component";
// import { testComponent } from "test.component";
// import { textsComponent } from "texts.component";
// import {inputsComponent} from "inputs.component";
// import { playerComponent } from "player.component";
// import { dragComponent } from "drag.component";
import { scrollablesComponent } from "./scrollables.component";
// import { testComponent } from "./test.component";

type Props = {};
type Mutable = {};

export const appComponent: ContainerComponent<Props, Mutable> = () => {
  const $container = container({ label: "app" });

  // $container.add(textsComponent());
  // $container.add(playerComponent());
  // $container.add(inputsComponent());
  // $container.add(dragComponent());
  $container.add(scrollablesComponent());
  // $container.add(testComponent());

  const a = dataComponent({ test: "Abc12312311333" });

  $container.add(a);

  setTimeout(() => {
    a.test("testing 2!");
  }, 2000);

  return $container.getComponent(appComponent);
};
