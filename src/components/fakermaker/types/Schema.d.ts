import type {Maker} from "./Maker";
import type {Faker} from "./Faker";
import type {Maker_Name} from "./MakerName";
import type {Maker_Price} from "./MakerPrice";
import type {Maker_Date} from "./MakerDate";

export type Schema = {
    sessionID?: string
    fakers?: Array<Faker>
    availableMakers?: Array<Maker_Date | Maker_Price | Maker_Name | Maker> | []
    selectedMakers?: Array<Maker_Date | Maker_Price | Maker_Name | Maker> | []
}
