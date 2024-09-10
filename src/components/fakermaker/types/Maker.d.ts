import type {MakerTypesEnum} from "../enums/MakerTypesEnum.d.ts";

export type Maker = {
    nickName?: string,
    type: MakerTypesEnum
    options?: Array<string>
    count?: number // number of times this maker has been selected
    nullable?: boolean
}
