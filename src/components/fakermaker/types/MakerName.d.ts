import type {NameTypeEnum} from "../enums/MakerNameTypeEnum.d.ts";
import type {Maker} from "./Maker";

export interface Maker_Name extends Maker {
    nameType: NameTypeEnum
}