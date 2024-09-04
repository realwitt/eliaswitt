import type {Schema} from "./types/Schema";
import type {Maker_Date} from "./types/MakerDate";
import type {Maker_Price} from "./types/MakerPrice";
import type {Maker_Name} from "./types/MakerName";
import type {Maker_Generic} from "./types/MakerBaseType";

type ActiveProps = {
    schema: Schema
}

export function MakersActive({schema} : ActiveProps) {
    const activeMakers: any = []

    function isNameUnique(name: string): boolean {
        if (schema?.makers) {
            for (let maker of schema?.makers) {
                if (maker?.nickName === name) {
                    return false
                }
            }
        }
        return true
    }

    if (schema.makers) {
        for (let i = 0; i < schema.makers.length; i++) {
            activeMakers.push(
                <div className={`group inline-block cursor-pointer bg-accent_pink border-2 border-transparent  active:bg-subtle_blue relative text-sm font-semibold transition duration-150 
                text-nowrap mr-7 mb-5 px-[18px] pt-0.5 pb-[2.5px] rounded-lg md:hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] md:hover:shadow-accent_pink`}>
                    {schema.makers[i].nickName.toLowerCase()}
                </div>
            )
        }
    }

    return ( activeMakers )
}