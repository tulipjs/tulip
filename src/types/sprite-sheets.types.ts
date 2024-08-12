export type SpriteSheetsLoadProps = {
  spriteSheet: string[];
  onLoad?: (name: string) => Promise<void>;
};
