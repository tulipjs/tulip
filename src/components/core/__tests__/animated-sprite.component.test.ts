import { AnimatedSpriteMutable } from "../../../types";
import { animatedSprite } from "../animated-sprite.component";
import { PlayStatus } from "../../../enums";
import { expect } from "@jest/globals";

jest.mock("pixi.js", () => {
  const originalModule = jest.requireActual("pixi.js");

  return {
    ...originalModule,
    AnimatedSprite: jest.fn(() => ({
      gotoAndStop: (frame) => mockGotoAndStop(frame),
      gotoAndPlay: (frame) => mockGotoAndPlay(frame),
      stop: mockStop,
      play: mockPlay,
      emit: jest.fn(),
      on: jest.fn(),
      loop: jest.fn(),
    })),
    Assets: {
      load: (args) => mockAssetsLoad(args),
    },
  };
});

const mockGotoAndStop = jest.fn();
const mockGotoAndPlay = jest.fn();
const mockStop = jest.fn();
const mockPlay = jest.fn();
const mockAssetsLoad = jest.fn(async (args) => ({
  id: args,
  animations: {
    "animation-name": ["texture1"],
    "animation-name-2": ["texture2"],
  },
}));

describe("components", () => {
  describe("core", () => {
    describe("animated-sprite", () => {
      let $animatedSprite: AnimatedSpriteMutable;

      beforeEach(() => {
        mockGotoAndStop.mockClear();
        mockGotoAndPlay.mockClear();
        mockStop.mockClear();
        mockPlay.mockClear();

        mockAssetsLoad.mockClear();
      });
      beforeAll(async () => {
        $animatedSprite = await animatedSprite({
          label: "animated-sprite-label",
          spriteSheet: "something.json",
          animation: "animation-name",
          frame: 1,
          playStatus: PlayStatus.STOP,
        });
      });

      test("getId() check that empty is being called", () => {
        expect($animatedSprite.getId()).toMatch(
          /animated-sprite-label_([0-9]{0,5})/,
        );
      });
      test("getLabel() check that initDisplayObjectMutable(...) is being called", () => {
        expect(
          $animatedSprite.getDisplayObject({ __preventWarning: true }).label,
        ).toStrictEqual("animated-sprite-label");
        expect($animatedSprite.getLabel()).toStrictEqual(
          "animated-sprite-label",
        );
      });
      test("setSpriteSheet(...) loads the spritesheet and changes textures with animation", () => {
        $animatedSprite.setSpriteSheet("testing.json");
        expect($animatedSprite.getSpriteSheet()).toStrictEqual("testing.json");
        expect(mockAssetsLoad).toHaveBeenCalledWith("testing.json");
      });
      test("setAnimation(...) changes the animation", () => {
        expect($animatedSprite.getAnimation()).toStrictEqual("animation-name");
        $animatedSprite.setAnimation("animation-name-2");
        expect($animatedSprite.getAnimation()).toStrictEqual(
          "animation-name-2",
        );
      });
      test("setFrame(...) sets the frame of the animation", () => {
        expect($animatedSprite.getFrame()).toStrictEqual(1);
        $animatedSprite.setFrame(3);
        expect($animatedSprite.getFrame()).toStrictEqual(3);
        expect(mockGotoAndStop).toHaveBeenCalledWith(3);
        expect(mockGotoAndPlay).not.toHaveBeenCalled();
      });
      test("setPlayStatus(...) sets the sate of the current animation", () => {
        expect($animatedSprite.getPlayStatus()).toStrictEqual(PlayStatus.STOP);
        $animatedSprite.setPlayStatus(PlayStatus.PLAY);
        expect($animatedSprite.getPlayStatus()).toStrictEqual(PlayStatus.PLAY);
        expect(mockPlay).toHaveBeenCalled();
        expect(mockStop).not.toHaveBeenCalled();
        expect(
          $animatedSprite.getDisplayObject({ __preventWarning: true }).loop,
        ).toStrictEqual(true);

        mockPlay.mockClear();
        mockStop.mockClear();

        $animatedSprite.setPlayStatus(PlayStatus.STOP);
        expect($animatedSprite.getPlayStatus()).toStrictEqual(PlayStatus.STOP);
        expect(mockPlay).not.toHaveBeenCalled();
        expect(mockStop).toHaveBeenCalled();

        mockPlay.mockClear();
        mockStop.mockClear();

        $animatedSprite.setPlayStatus(PlayStatus.PLAY_AND_STOP);
        expect($animatedSprite.getPlayStatus()).toStrictEqual(
          PlayStatus.PLAY_AND_STOP,
        );
        expect(mockPlay).toHaveBeenCalled();
        expect(mockStop).not.toHaveBeenCalled();
        expect(
          $animatedSprite.getDisplayObject({ __preventWarning: true }).loop,
        ).toStrictEqual(false);
      });
      test("getProps() returns all the original properties", () => {
        expect($animatedSprite.getProps()).toEqual({
          animation: "animation-name",
          frame: 1,
          label: "animated-sprite-label",
          playStatus: 1,
          spriteSheet: "something.json",
        });
      });
      test("$getRaw() returns everything needed to hot reload", () => {
        expect($animatedSprite.$getRaw()).toEqual({
          alpha: undefined,
          angle: 0,
          animation: "animation-name-2",
          eventMode: undefined,
          frame: 3,
          id: $animatedSprite.getId(),
          initialData: {},
          label: "animated-sprite-label",
          pivot: { x: 0, y: 0 },
          playStatus: 2,
          position: { x: 0, y: 0 },
          spriteSheet: "testing.json",
          visible: undefined,
          zIndex: undefined,
          focused: false,
          hitArea: [],
          withContext: false,
        });
      });
      test.todo("$destroy() destroys everything");
    });
  });
});
