import type {Maker} from "./Maker";
import type {FakerEnum} from "../enums/FakerNameEnum";

export type Schema = {
    sessionID?: string
    fakers?: Array<FakerEnum>
    availableMakers?: Array<Maker> | []
    selectedMakers?: Array<Maker> | []
}
