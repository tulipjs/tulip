import { ContainerMutable, WorldMutable } from "../../../types";
import { expect } from "@jest/globals";
import * as PIXI from "pixi.js";
import { world } from "../world.component";
import { container } from "../container.component";
import { body } from "../body.sub-component";

jest.mock("pixi.js", () => {
  const originalModule = jest.requireActual("pixi.js");

  //Mock the default export and named export 'foo'
  return {
    ...originalModule,
    Assets: {
      load: (args) => mockAssetsLoad(args),
    },
  };
});

const mockAssetsLoad = jest.fn(async (args) => new PIXI.Texture());

//@ts-ignore
global.console = { warn: jest.fn() };

describe("components", () => {
  describe("core", () => {
    describe("world", () => {
      let $world: WorldMutable;
      let $container: ContainerMutable;

      beforeEach(() => {
        mockAssetsLoad.mockClear();
        //@ts-ignore
        console.warn.mockClear();
      });

      //TODO mock p2 to check if it's being called (step, clear...)

      test("check that p2 world is being created", async () => {
        $world = await world({
          label: "world",
          props: {
            physics: {
              gravity: { x: 3, y: 4 },
            },
          },
        });
        expect($world.$getWorld().gravity[0]).toBe(3);
        expect($world.$getWorld().gravity[1]).toBe(4);
        expect($world.$getWorld().bodies).toEqual([]);
      });
      test("getId() check that container is being called", () => {
        expect($world.getId()).toMatch(/world_([0-9]{0,5})/);
        expect($world.getLabel()).toMatch("world");
      });
      test("setPhysicsEnabled(...) check that can set the physics", () => {
        expect($world.getPhysicsEnabled()).toEqual(true);
        $world.setPhysicsEnabled(false);
        expect($world.getPhysicsEnabled()).toEqual(false);
      });
      test("getProps() returns initial props", () => {
        expect($world.getProps()).toEqual({
          label: "world",
          props: { physics: { gravity: { x: 3, y: 4 } } },
        });
      });
      test("add(...) adds a new element without body", async () => {
        $container = await container();
        $world.add($container);
      });
      test("remove(...) removes an element without body", async () => {
        expect($world.$getWorld().bodies.length).toEqual(0);
        $world.remove($container);
        expect($world.$getWorld().bodies.length).toEqual(0);
      });
      test("add(...) adds a new element with body", async () => {
        await $container.setBody(body({}));
        $world.add($container);
        expect(console.warn).not.toBeCalled();
        expect($world.$getWorld().bodies.length).not.toEqual(0);
      });
      test("remove(...) removes an element with body", async () => {
        $world.remove($container);
        expect($world.$getWorld().bodies.length).toEqual(0);
      });
      test("$destroy() destroys the world and the container", () => {
        $world.add($container);
        expect($world.$getWorld().bodies.length).not.toEqual(0);
        $world.$destroy();
        expect($world.getDisplayObject().destroyed).toEqual(true);
        expect($world.$getWorld().bodies.length).toEqual(0);
      });
    });
  });
});
