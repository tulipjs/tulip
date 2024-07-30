import { expect, test } from "@jest/globals";
import { TextMutable } from "../../../types";
import { text } from "../text.component";

describe("components", () => {
  describe("core", () => {
    describe("text", () => {
      let $text: TextMutable;

      test("getProps() returns all the original properties", () => {
        $text = text({
          text: "test",
          color: 0xffffff,
          size: 25,
        });

        expect($text.getProps()).toEqual({
          color: 0xffffff,
          size: 25,
          text: "test",
        });
      });

      test("setText(...) change text", () => {
        $text = text({
          text: "test",
          color: 0xffffff,
          size: 25,
        });
        $text.setText("test 2");

        expect($text.$getText().text).toEqual("test 2");
      });

      test("setSkew(...) change text skew", () => {
        $text = text({
          text: "test",
          color: 0xffffff,
          size: 25,
        });
        $text.setSkew({ x: 1, y: -0.3 });

        const { x, y } = $text.$getText().skew;
        expect({ x, y }).toEqual({ x: 1, y: -0.3 });
      });
    });
  });
});
