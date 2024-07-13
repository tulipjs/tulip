import { SoundMutable } from "../../../types";

describe("sub-components", () => {
  describe("core", () => {
    describe("sound", () => {
      let $sound: SoundMutable;

      //TODO Mock Howler
      // beforeAll(async () => {
      //   $sound = await sound({
      //     id: "sound-id",
      //     sources: ["source1.ogg", "source2.mp3"],
      //   });
      // });
      //
      test.skip("getId()", () => {
        expect($sound.getId()).toEqual("sound-id");
      });
    });
  });
});
