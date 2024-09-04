import type {MakerTypesEnum} from "../enums/MakerTypesEnum.d.ts";

export type Maker = {
    type: MakerTypesEnum
    options?: Array<string>
}

