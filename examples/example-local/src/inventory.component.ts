import { empty, sound, Component } from "@tulib/tulip";

type Item = {
  id: Number;
  name: String;
  quantity: Number;
};

type Inventory = {
  backpack: Item[];
  left?: Item;
  right?: Item;
};

const INITIAL_INVENTORY: Inventory = {
  backpack: [{ id: 294, name: "Golden Hoe", quantity: 1 }],
};

type InventoryMutable = {
  equipHoe: () => void;
};

export const inventoryComponent: Component<{}, InventoryMutable> = () => {
  const $inventory = empty<Inventory>({
    initialData: INITIAL_INVENTORY,
  });

  const $sound = sound({
    source: "inventory-grab.mp3",
  });

  setTimeout(() => {
    $sound.fade();
  }, 5000);

  const equipHoe = () => {
    const goldenHoe = $inventory.getData((data) => data.backpack[0]);
    $inventory.setData((data) => ({
      ...data,
      backpack: [],
      right: goldenHoe,
    }));

    $sound.play();
  };

  return {
    equipHoe,

    $mutable: true,
  };
};
