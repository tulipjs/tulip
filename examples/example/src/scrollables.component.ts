import {
  container,
  ContainerComponent,
  EventMode,
  scrollableContainer,
  sprite,
  text,
} from "@tu/tulip";

type Props = {
  label: string;
};

export const scrollablesComponent: ContainerComponent<Props> = (props) => {
  const $container = container(props);

  const $tulips1 = [];
  for (let i = 0; i < 4; i++) {
    $tulips1.push(
      text({
        text: `🌷 tulip ${i} 🌷 `,
        font: "Pixel",
        color: 0xeb34a8,
        size: 4,
        position: {
          x: 0,
          y: i * 20,
        },
      }),
    );
  }

  const $tulips2 = [];
  for (let i = 0; i < 20; i++) {
    $tulips2.push(
      text({
        text: `🌷 tulip ${i} 🌷 `,
        font: "Pixel",
        color: 0xeb34a8,
        size: 4,
        position: {
          x: 0,
          y: i * 20,
        },
      }),
    );
  }

  const $scrollable1 = scrollableContainer({
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 50,
      height: 100,
    },
    jump: 3,
    verticalScroll: true,
    horizontalScroll: true,
    components: [
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "A",
        metadata: "scroll-button-top",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "B",
        metadata: "scroll-button-bottom",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "X",
        metadata: "scroll-selector-y",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "A",
        metadata: "scroll-button-left",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "B",
        metadata: "scroll-button-right",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "X",
        metadata: "scroll-selector-x",
      }),
    ],
    eventMode: EventMode.STATIC,
  });

  const $scrollable2 = scrollableContainer({
    position: {
      x: 70,
      y: 0,
    },
    size: {
      width: 50,
      height: 100,
    },
    jump: 3,
    verticalScroll: true,
    horizontalScroll: true,
    components: [
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "A",
        metadata: "scroll-button-top",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "B",
        metadata: "scroll-button-bottom",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "X",
        metadata: "scroll-selector-y",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "A",
        metadata: "scroll-button-left",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "B",
        metadata: "scroll-button-right",
      }),
      sprite({
        spriteSheet: "fonts/default-font-bold.json",
        texture: "X",
        metadata: "scroll-selector-x",
      }),
    ],
    eventMode: EventMode.STATIC,
    draggableContent: true,
  });

  $container.add($scrollable1);
  $container.add($scrollable2);

  $tulips1.forEach(($tulip) => {
    $scrollable1.add($tulip);
  });

  $tulips2.forEach(($tulip) => {
    $scrollable2.add($tulip);
  });

  return $container.getComponent(scrollablesComponent);
};
