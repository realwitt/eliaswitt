import {Header} from "./Header.tsx";
import {Fakers} from "./Fakers.tsx";
import {Makers} from "./Makers.tsx";
import type {AvailableSchemaOptions} from "./types/AvailableSchemaOptions";

type FakerMaker3000Props = {
    availableSchemaOptions: AvailableSchemaOptions
}

export function FakerMaker3000({availableSchemaOptions}: FakerMaker3000Props) {

    if (availableSchemaOptions) {
        return (
            <div className="w-full mt-5 mb-14 max-w-[1300px] mx-auto px-5 md:px-10">

                <Header title="save or restore session"/>
                {/* todo */}

                <Header title="fakers"/>
                <Fakers availableFakers={availableSchemaOptions?.fakers}
                        updatedFakerIndex={(i) => { console.log("faker index: " + i)
                        }}/>

                <Header title="makers"/>
                <Makers availableMakers={availableSchemaOptions?.makers}
                        updatedMakerIndex={(i) => console.log("maker index is: " + i)}/>

                <Header title="active"/>
                {/* <active /> */}

                <Header title="data"/>
                {/*todo*/}

            </div>
        )
    }
}