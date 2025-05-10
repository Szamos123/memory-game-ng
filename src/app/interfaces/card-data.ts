export interface CardData {
    imageId: string;
    cardState: "default" | "flipped" | "matched";
    imageUrl: string;
    backImageUrl: string;
}
