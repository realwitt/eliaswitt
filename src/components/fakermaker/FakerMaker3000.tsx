import {Header} from "./Header.tsx"
import {Fakers} from "./Fakers.tsx"
import {MakersAvailable} from "./MakersAvailable.tsx"
import type {Schema} from "./types/Schema"
import {useState} from "react"
import type {Maker_Name} from "./types/MakerName"
import type {Maker_Price} from "./types/MakerPrice"
import type {Maker_Date} from "./types/MakerDate"
import type {MakerTypesEnum} from "./enums/MakerTypesEnum";
import {MakersSelected} from "./MakersSelected.tsx";
import type {Maker} from "./types/Maker";


// set default begin date to 100 years ago
// set default end date to today
function dateFormatter(defaultType: string) {
    let date = defaultType === 'defaultBegin' ? (new Date(new Date().getFullYear() - 100)) : new Date()
    let year = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date)
    let month = new Intl.DateTimeFormat('en', {month: 'short'}).format(date).toUpperCase()
    let day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date)
    return ` ${day}-${month}-${year}`
}

type FakerMaker3000Props = {
    availableSchemaOptionsFromServer: Schema
}

export function FakerMaker3000({availableSchemaOptionsFromServer}: FakerMaker3000Props) {
    const [schema, setSchema] = useState<Schema>({...availableSchemaOptionsFromServer})

    // bc we use the name as a key to remove makers, they need to be unique
    function getUniqueNickName(type: MakerTypesEnum) {
        let count = 1
        if (schema.availableMakers) {
            for (let maker of schema?.availableMakers) {
                if (maker.type === type) {
                    count = maker.count ?? 1
                }
            }
        }
        return nickNameFinder4000(type, count)
    }

    function nickNameFinder4000(type: string, count: number) {
        let localCount = count
        if (schema.selectedMakers) {
            for (let maker of schema?.selectedMakers) {
                if (maker.nickName === `${type.toLowerCase()}-${count}`) {
                    nickNameFinder4000(type, localCount+=1)
                }
            }
        }
        return `${type.toLowerCase()}-${localCount}`
    }

    function createAndAddSelectedMaker(makerIndex: number) {
        if (schema.availableMakers) {
            const selectedMaker = schema.availableMakers[makerIndex]
            let maker: Maker_Date | Maker_Price | Maker_Name | Maker = {
                type: selectedMaker.type,
                nickName: getUniqueNickName(selectedMaker.type),
                nullable: true,
                count: 0,
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

            setSchema(prevSchema => {
                const newSchema = {
                    ...prevSchema,
                    selectedMakers: [
                        ...(prevSchema.selectedMakers ?? []),
                        maker
                    ]
                };
                console.log("Updated schema in createAndAddSelectedMaker:", newSchema);
                return newSchema;
            })
            // setSchema({
            //     ...schema,
            //     selectedMakers: [
            //         ...schema.selectedMakers ?? [],
            //         maker
            //     ]
            // })
            // console.log("Updated schema in createAndAddSelectedMaker:", newSchema);
        }
    }

    // function incrementAvailableMaker(index: number) {
    //     if (schema?.availableMakers) {
    //         if (schema?.availableMakers[index]) {
    //             const updatedMaker = {
    //                 ...schema.availableMakers[index],
    //                 count: (schema.availableMakers[index].count || 0) + 1
    //             };
    //
    //             setSchema({
    //                 ...schema,
    //                 availableMakers: [
    //                     ...schema.availableMakers.slice(0, index),
    //                     updatedMaker,
    //                     ...schema.availableMakers.slice(index + 1)
    //                 ]
    //             });
    //         }
    //     }
    // }
    function incrementAvailableMaker(index: number) {
        setSchema(prevSchema => {
            if (prevSchema?.availableMakers?.[index]) {
                const updatedMakers = [...prevSchema.availableMakers];
                updatedMakers[index] = {
                    ...updatedMakers[index],
                    count: (updatedMakers[index].count || 0) + 1
                };
                const newSchema = {
                    ...prevSchema,
                    availableMakers: updatedMakers
                };
                console.log("Updated schema in incrementAvailableMaker:", newSchema);
                return newSchema;
            }
            return prevSchema;
        });
    }

    function decrementAvailableMaker(index: number) {
        if (schema?.availableMakers) {
            if (schema.availableMakers[index]) {
                const updatedMaker = {
                    ...schema.availableMakers[index],
                    count: (schema.availableMakers[index].count || 0) - 1
                };

                setSchema({
                    ...schema,
                    availableMakers: [
                        ...schema.availableMakers.slice(0, index),
                        updatedMaker,
                        ...schema.availableMakers.slice(index + 1)
                    ]
                });
            }
        }
    }

    function deleteSelectedMaker(index: number) { if (schema.selectedMakers) {
            console.log("before: " + schema.selectedMakers)
            setSchema({...schema, selectedMakers: [...schema.selectedMakers.filter((_, i) => i !== index)]})
        }
    }

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ return portion ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (schema) {
        return (
            <div className="w-full mt-5 mb-14 max-w-[1440px] mx-auto">

                <Header title="save or restore session"/>
                {/* todo */}

                <Header title="available fakers"/>
                <div className="px-5 md:px-10 max-w-[1300px] mx-auto">
                    <Fakers availableFakers={schema?.fakers}
                            updatedFakerIndex={(i) => {
                                console.log("faker index: " + i)
                            }}/>

                </div>

                <Header title="available makers"/>
                <div className="px-5 md:px-10 max-w-[1300px] mx-auto">
                    <MakersAvailable availableMakers={schema?.availableMakers}
                                     updatedMakerIndex={(index) => {
                                         createAndAddSelectedMaker(index);
                                         incrementAvailableMaker(index)
                                     }}/>
                </div>

                <Header title="selected makers"/>
                <div className="px-5 md:px-10 max-w-[1300px] mx-auto">
                    <MakersSelected selectedMakers={schema?.selectedMakers} deleteSelectedMaker={(i) => {
                        deleteSelectedMaker(i)
                        decrementAvailableMaker(i)
                    }}/>
                </div>

                <Header title="data"/>
                <div className="px-5 md:px-10 max-w-[1300px] mx-auto">
                    {/*todo*/}
                </div>

            </div>
        )
    }
}