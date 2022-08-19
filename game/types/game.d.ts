module 'game' {

    type spriteRenderMethods = 'fill' | 'repeat';

    type Vector2 = [number, number];
    type RenderData = [...Vector2, ...Vector2, ...Vector2, string];
    type EntityRenderData = [...Vector2, ...Vector2, ...Vector2, string, number, number];
    /**
     * interable: [health, maxHealth, energy, maxEnergy, exp, maxExp, level]
     */
    type PlayerGUIData = [number, number, number, number, number, number, number];

    type RenderDataLayer0 = RenderData[];
    type RenderDataLayer1 = EntityRenderData[];
    type RenderDataLayer2 = RenderData[];

    type GameRenderData = [RenderDataLayer0, RenderDataLayer1, RenderDataLayer2];

    type SpriteMethod = (x: number, y: number, w: number, h: number, sx: number, sy: number) => void;
    type getRenderData = () => RenderData;
    type colliding = (x: number, y: number, w: number, h: number) => boolean;

    interface Terrain {
        name: string;
        follors: [...Vector2, ...Vector2, number][];
        background: [...Vector2, ...Vector2, number][];
    }

}