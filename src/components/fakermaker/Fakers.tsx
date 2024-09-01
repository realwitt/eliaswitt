import type {AvailableSchemaOptions} from "./types/AvailableSchemaOptions";
import {Button} from "./Button.tsx";

type FakerProps = {
    availableSchemaOptions: AvailableSchemaOptions
}

export function Fakers({availableSchemaOptions} : FakerProps) {
    const fakers = []
    for (let i = 0; i < availableSchemaOptions.fakers.length; i++) {
        fakers.push(
            <div>
                <Button title={availableSchemaOptions.fakers[i]} clicked={() => console.log('testing onclick')} />
            </div>
        )
    }
    return fakers
}