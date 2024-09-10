import type {Maker} from "./Maker";

export interface Maker_Price extends Maker  {
    range: Array<number, 2>
}