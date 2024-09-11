import type {Maker} from "./Maker";
import type {Faker} from "./Faker";

export type Schema = {
    sessionID?: string
    fakers?: Array<Faker>
    availableMakers?: Array<Maker> | []
    selectedMakers?: Array<Maker> | []
}
