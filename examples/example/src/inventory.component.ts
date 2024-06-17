import { empty, Component } from "@tulib/tulip";

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

  const equipHoe = () => {
    const goldenHoe = $inventory.getData((data) => data.backpack[0]);
    $inventory.setData((data) => ({
      ...data,
      backpack: [],
      right: goldenHoe,
    }));
  };

  return {
    equipHoe,

    $mutable: true,
  };
};
