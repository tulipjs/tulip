import { ContainerMutable } from "../../../types";
import { player2D } from "../player-2d.component";

const mockOnTick = jest.fn();

describe("components", () => {
  describe("prefabs", () => {
    describe("player-2d", () => {
      let $player2d: ContainerMutable;

      beforeAll(() => {
        $player2d = player2D({
          onTick: mockOnTick,
        });
      });
      $player2d;

      test("player2d", () => {
        //TODO Mock global events... and emit to keyDown
      });
    });
  });
});
