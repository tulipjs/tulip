export type TexturesLoadProps = {
  textures: string[];
  onLoad?: (name: string) => Promise<void>;
};
