import type {NameTypeEnum} from "../enums/MakerNameTypeEnum.d.ts";
import type {Maker_Generic} from "./MakerBaseType";

export interface Maker_Name extends Maker_Generic {
    nameType: NameTypeEnum
}