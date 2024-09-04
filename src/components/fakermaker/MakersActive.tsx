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
                <>
                    <div className="group inline-block cursor-pointer bg-accent_pink border-2 border-transparent  active:bg-subtle_blue relative text-sm font-semibold transition duration-150
                text-nowrap mr-7 mb-5 px-[18px] pt-0.5 pb-[2.5px] rounded-lg md:hover:shadow-[0_0_12px_0_rgba(0,0,0,0.3)] md:hover:shadow-accent_pink">
                        {schema.makers[i].nickName.toLowerCase()}
                        {/*absolute invisible group-hover:visible*/}
                        <div className={` fill-accent_purple h-1 w-1 top-0 `}>
                            {/* Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
                        </div>
                    </div>
                    <svg className={'fill-accent_purple h-5 w-5 -top-24 left-0 absolute'} xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512">
                        <path
                            d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/>
                    </svg>
                </>
            )
        }
    }

    return (activeMakers)
}