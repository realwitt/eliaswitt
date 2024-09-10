import type {Maker} from "./Maker";

type DateRange = [
    begin: string,   // "JAN-01-2024",
    end: string     // "FEB-01-2024"
]

export interface Maker_Date extends Maker {
    range: DateRange
}