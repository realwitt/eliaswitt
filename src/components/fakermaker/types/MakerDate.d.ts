import type {Maker_Generic} from "./MakerBaseType";

type DateRange = [
    begin: string,   // "JAN-01-2024",
    end: string     // "FEB-01-2024"
]

export interface Maker_Date extends Maker_Generic {
    range: DateRange
}