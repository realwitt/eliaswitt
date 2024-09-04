import type {Maker_Date} from "./MakerDate";
import type {Maker_Price} from "./MakerPrice";
import type {Maker_Name} from "./MakerName";
import type {Maker_Generic} from "./MakerBaseType";

export type Schema = {
    sessionID?: string
    fakers?: Array<string>
    makers?: Array<Maker_Date | Maker_Price | Maker_Name | Maker_Generic>
}