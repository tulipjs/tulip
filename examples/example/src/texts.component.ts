import { container, ContainerComponent, textSprite } from "@tu/tulip";

type Props = {};
type Mutable = {};

export const textsComponent: ContainerComponent<Props, Mutable> = () => {
  const $container = container();

  // const $tulip = text({
  //   text: `🌷 tulip 🌷`,
  //   font: "Pixel",
  //   color: 0xeb34a8,
  //   size: 20,
  //   position: {
  //     x: 15,
  //     y: 90,
  //   },
  //   pivot: {
  //     x: 0,
  //     y: 50,
  //   },
  // });
  //
  // $tulip.setSkew({ x: 0.2, y: 0 });
  //
  // $container.add($tulip);

  // const abc = "a b c d e f g h i j k l m n ñ o p q r s t u v w x y z";
  // const ABC = abc
  //   .split(" ")
  //   .map((c) => c.toUpperCase())
  //   .join(" ");

  // const $defaultMinus = textSprite({
  //   spriteSheet: "fonts/default-font.json",
  //   text: abc,
  //   position: {
  //     x: 100,
  //     y: 100,
  //   },
  // });
  //
  // const $defaultMayus = textSprite({
  //   spriteSheet: "fonts/default-font-bold.json",
  //   text: ABC,
  //   position: {
  //     x: 100,
  //     y: 120,
  //   },
  // });
  //
  // const $boldMinus = textSprite({
  //   spriteSheet: "fonts/default-font-bold.json",
  //   text: abc,
  //   position: {
  //     x: 100,
  //     y: 140,
  //   },
  // });
  //
  // const $boldMayus = textSprite({
  //   spriteSheet: "fonts/default-font.json",
  //   text: ABC,
  //   position: {
  //     x: 100,
  //     y: 160,
  //   },
  // });

  const $test = textSprite({
    spriteSheet: "fonts/default-font.json",
    text: "helló there, how are you and the other one?",
    position: {
      x: 10,
      y: 50,
    },
    size: {
      width: 86,
      height: 40,
    },
    backgroundColor: 0xff00ff,
    accentYCorrection: -1,
    lineHeight: 1,
  });

  $container.add($test);

  return $container.getComponent(textsComponent);
};
