import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
} from "@tulib/tulip";

export const testComponent: ContainerComponent = () => {
  const $container = container();

  const conA = container();
  conA.on(DisplayObjectEvent.VISIBILITY_CHANGE, ({ visible }) => {
    console.log("visible", visible);
  });
  conA.setVisible(false);
  conA.setVisible(true);
  conA.setVisible(false);
  conA.setVisible(true);

  return $container.getComponent(testComponent);
};
