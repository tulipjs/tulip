import { expect, test } from "@jest/globals";
import { ContainerMutable } from "../../types";
import { container } from "./container.component";
import { body } from "./body.sub-component";
import { EventMode } from "../../enums";

describe("components", () => {
  describe("core", () => {
    describe("container", () => {
      let $container: ContainerMutable;

      test("getId() return the original id to check that empty is being called", async () => {
        $container = await container({
          label: "container",
          eventMode: EventMode.PASSIVE,
          angle: 45,
          pivot: { x: 23, y: 9 },
          position: { x: 98, y: 1 },
          alpha: 0.3,
          zIndex: 1,
          visible: false,
        });

        expect($container.getId()).toMatch(/container_([0-9]{0,5})/);
      });
      test("getLabel() return the label to check that initDisplayObject is being called", async () => {
        $container.setLabel("This is being called!");
        expect($container.getLabel()).toBe("This is being called!");
      });

      let $childContainer: ContainerMutable;
      test("getFather() check father to be null", async () => {
        $childContainer = await container();

        expect($childContainer.getFather).toBe(null);
      });
      test("add(...) add a display object to the container as a child", async () => {
        $container.add($childContainer);

        expect($container.getDisplayObject().children).toContain(
          $childContainer.getDisplayObject(),
        );
      });
      test("getFather() check that father is the current container", async () => {
        expect($childContainer.getFather()).toBe($container);
        expect($childContainer.getDisplayObject().parent).toEqual(
          $container.getDisplayObject(),
        );
      });
      test("remove(...) remove a display object from other", () => {
        $container.remove($childContainer);
        expect($container.getDisplayObject().children).not.toContain(
          $childContainer.getDisplayObject(),
        );
      });
      test("setBody(...) to add the body", () => {
        let $body = body();
        $container.setBody($body);
        expect($container.getBody()).toBe($body);
      });
      test("getComponent(...) to retrieve the mutable with the component name", () => {
        const ComponentName = () => ({}) as any;
        const $containerMutable = $container.getComponent(ComponentName);
        expect($containerMutable.$getComponentName()).toStrictEqual(
          "ComponentName",
        );
        expect($containerMutable.getLabel()).toStrictEqual(
          "This is being called!",
        );
      });
      test("getProps() to retrieve the current props", () => {
        expect($container.getProps()).toEqual({
          alpha: 0.3,
          angle: 45,
          eventMode: EventMode.PASSIVE,
          label: "container",
          pivot: { x: 23, y: 9 },
          position: { x: 98, y: 1 },
          visible: false,
          zIndex: 1,
        });
      });
      test("$destroy()", () => {
        const displayObject = $container.getDisplayObject();
        const childDisplayObject = $childContainer.getDisplayObject();

        expect(displayObject.destroyed).toBe(false);
        expect(childDisplayObject.destroyed).toBe(false);

        $container.add($childContainer);

        expect(displayObject.children).toContain(childDisplayObject);

        $container.$destroy();

        expect($container.getDisplayObject().children).not.toContain(
          $childContainer.getDisplayObject(),
        );
        expect(displayObject.parent).toEqual(null);
        expect(childDisplayObject.parent).toEqual(null);

        expect(displayObject.destroyed).toBe(true);
        expect(childDisplayObject.destroyed).toBe(true);
      });
    });
  });
});
