import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
} from "@tulib/tulip";

export const testComponent: ContainerComponent = () => {
  const $container = container();

  const conA = container();
  conA.on(DisplayObjectEvent.ADDED, () => {
    console.log("ADDED");
  });
  conA.on(DisplayObjectEvent.REMOVED, () => {
    console.log("REMOVED");
  });
  $container.add(conA);
  $container.remove(conA);
  $container.add(conA);

  return $container.getComponent(testComponent);
};
