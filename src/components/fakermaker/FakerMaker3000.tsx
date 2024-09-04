import {Header} from "./Header.tsx"
import {Fakers} from "./Fakers.tsx"
import {Makers} from "./Makers.tsx"
import type {AvailableSchemaOptions} from "./types/AvailableSchemaOptions"
import type {Schema} from "./types/Schema"
import {useState} from "react"
import type {Maker_Generic} from "./types/MakerBaseType"
import type {Maker_Name} from "./types/MakerName"
import type {Maker_Price} from "./types/MakerPrice"
import type {Maker_Date} from "./types/MakerDate"
import type {MakerTypesEnum} from "./enums/MakerTypesEnum";

type FakerMaker3000Props = {
    availableSchemaOptions: AvailableSchemaOptions
}

// set default begin date to 100 years ago
// set default end date to today
function dateFormatter(defaultType: string) {
    let date = defaultType === 'defaultBegin' ? (new Date(new Date().getFullYear() - 100)) : new Date()
    let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date)
    let month = new Intl.DateTimeFormat('en', {month: 'short'}).format(date).toUpperCase()
    let day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date)
    return ` ${day}-${month}-${year}`
}

export function FakerMaker3000({availableSchemaOptions}: FakerMaker3000Props) {
    const [schema, setSchema] = useState<Schema>({})

    // bc we use the name as a key to remove makers, they need to be unique
    function getUniqueNickName(type: MakerTypesEnum) {
        let count = 0
        if (schema?.makers) {
            for (let maker of schema?.makers) {
                if (maker?.type === type) {
                    count += 1
                }
            }
        }
        return `${count > 0 ? `${type}-${count}` : `${type}`}`
    }

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

    function addMaker(makerIndex: number) {
        const selectedMaker = availableSchemaOptions.makers[makerIndex]
        let maker: Maker_Date | Maker_Price | Maker_Name | Maker_Generic = {
            type: selectedMaker.type,
            nickName: getUniqueNickName(selectedMaker.type),
            nullable: true,
        }
        switch (selectedMaker.type) {
            case 'NAME':
                maker = {
                    ...maker,
                    nameType: 'FIRST'
                }
                break
            case 'DATE':
                maker = {
                    ...maker,
                    range: [
                        dateFormatter('defaultBegin'),
                        dateFormatter('defaultEnd')
                    ]
                }
                break
            case 'PRICE':
                maker = {
                    ...maker,
                    range: [
                        0,
                        100,
                    ]
                }
                break
            default:
                break
        }
        setSchema({...schema, makers: [...(schema.makers ?? []), maker]})
    }

    if (availableSchemaOptions) {
        return (
            <div className="w-full mt-5 mb-14 max-w-[1300px] mx-auto px-5 md:px-10">

                <Header title="save or restore session"/>
                {/* todo */}

                <Header title="fakers"/>
                <Fakers availableFakers={availableSchemaOptions?.fakers}
                        updatedFakerIndex={(i) => {
                            console.log("faker index: " + i)
                        }}/>

                <Header title="makers"/>
                <Makers availableMakers={availableSchemaOptions?.makers}
                        updatedMakerIndex={(index) => {addMaker(index); console.log(schema)}}/>

                <Header title="active"/>
                {/* <active /> */}

                <Header title="data"/>
                {/*todo*/}

            </div>
        )
    }
}