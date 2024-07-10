jest.mock("pixi.js", () => {
  const originalModule = jest.requireActual("pixi.js");

  return {
    ...originalModule,
    Assets: {
      load: (args) => mockAssetsLoad(args),
    },
  };
});

const mockAssetsLoad = jest.fn(async (args) => ({
  id: args,
  textures: {
    a: {},
    b: {},
    c: {},
  },
}));

describe("components", () => {
  describe("core", () => {
    describe("input-text-sprite", () => {
      beforeEach(() => {
        mockAssetsLoad.mockClear();
      });

      // let $input: InputTextSpriteMutable;
      beforeAll(async () => {
        // $input = await inputTextSprite({
        //   color: 0xff00ff,
        //   spriteSheet: "font.json",
        //   editable: true,
        // });
      });

      test.todo("getProps() returns initial custom and core props");
      test.todo("should handle key down and key up events");
      test.todo("should handle cursor visibility correctly");
    });
  });
});
