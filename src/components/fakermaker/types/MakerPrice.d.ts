import type {Maker_Generic} from "./MakerBaseType";

export interface Maker_Price extends Maker_Generic  {
    range: Array<number, 2>
}