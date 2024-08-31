import {
  container,
  ContainerComponent,
  Cursor,
  draggableContainer,
  Env,
  Event,
  EventMode,
  global,
  graphics,
  GraphicType,
  text,
} from "@tulib/tulip";

type Props = {};
type Mutable = {};

export const dragComponent: ContainerComponent<Props, Mutable> = () => {
  const $container = container();

  const dc = draggableContainer({
    grabCursor: Cursor.GRAB,
    grabbingCursor: Cursor.GRABBING,
    // size: {
    //   width: 300,
    //   height: 300,
    // },
  });
  $container.add(dc);

  const modalContainer = container({ position: { x: 50, y: 50 } });
  const modalContainer2 = container();
  const bg = graphics({
    type: GraphicType.RECTANGLE,
    width: 200,
    height: 200,
    tint: 0xff00ff,
  });
  const drag = graphics({
    type: GraphicType.RECTANGLE,
    width: 200,
    height: 50,
    tint: 0x00ff00,
    eventMode: EventMode.STATIC,
    metadata: "draggable",
  });
  const drag2 = graphics({
    type: GraphicType.RECTANGLE,
    width: 50,
    height: 50,
    tint: 0x0000ff,
    eventMode: EventMode.STATIC,
    metadata: "draggable",
    position: {
      x: 100,
      y: 100,
    },
  });
  modalContainer.add(bg, drag, drag2);

  const drag3 = graphics({
    type: GraphicType.RECTANGLE,
    width: 50,
    height: 50,
    tint: 0xff0000,
    eventMode: EventMode.STATIC,
    metadata: "draggable",
    position: {
      x: 0,
      y: 0,
    },
  });
  modalContainer2.add(drag3);
  dc.add(modalContainer2, modalContainer);

  // setTimeout(() => {
  //   dc.setSize({ width: 250, height: 250 });
  // }, 3_000);

  const aaa = text({
    text: `${global.envs.get(Env.SAFE_AREA_INSET_BOTTOM)} bottom`,
    font: "Pixel",
    color: 0xeb34a8,
    size: 20,
    position: {
      x: 50,
      y: 50,
    },
  });
  global.events.on(Event.SAFE_AREA_INSET_BOTTOM, ({ value }) => {
    aaa.setText(`${value} bottom`);
  });
  $container.add(aaa);

  return $container.getComponent(dragComponent);
};
