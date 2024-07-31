import { container, ContainerComponent, text, textSprite } from "@tulib/tulip";

type Props = {};
type Mutable = {};

export const appComponent: ContainerComponent<Props, Mutable> = () => {
  const $container = container({ label: "app" });

  const $tulip = text({
    text: `🌷 tulip 🌷`,
    font: "Pixel",
    color: 0xeb34a8,
    size: 20,
    position: {
      x: 15,
      y: 90,
    },
    pivot: {
      x: 0,
      y: 50,
    },
  });

  $tulip.setSkew({ x: 0.2, y: 0 });

  $container.add($tulip);

  const abc = "a b c d e f g h i j k l m n ñ o p q r s t u v w x y z";
  const ABC = abc
    .split(" ")
    .map((c) => c.toUpperCase())
    .join(" ");

  const $defaultMinus = textSprite({
    spriteSheets: {
      default: "fonts/default-font.json",
      bold: "fonts/bold-font.json",
    },
    spriteSheet: "default",
    text: abc,
    position: {
      x: 100,
      y: 100,
    },
  });

  const $defaultMayus = textSprite({
    spriteSheets: {
      default: "fonts/default-font.json",
      bold: "fonts/bold-font.json",
    },
    spriteSheet: "default",
    text: ABC,
    position: {
      x: 100,
      y: 120,
    },
  });

  const $boldMinus = textSprite({
    spriteSheets: {
      default: "fonts/default-font.json",
      bold: "fonts/bold-font.json",
    },
    spriteSheet: "bold",
    text: abc,
    position: {
      x: 100,
      y: 140,
    },
  });

  const $boldMayus = textSprite({
    spriteSheets: {
      default: "fonts/default-font.json",
      bold: "fonts/bold-font.json",
    },
    spriteSheet: "bold",
    text: ABC,
    position: {
      x: 100,
      y: 160,
    },
  });

  $container.add($defaultMinus, $defaultMayus, $boldMinus, $boldMayus);

  return $container.getComponent(appComponent);
};
