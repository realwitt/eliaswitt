import type {AvailableSchemaOptions} from "./types/AvailableSchemaOptions";
import {Button} from "./Button.tsx";

type FakerProps = {
    availableFakers: Array<string>
    updatedFakerIndex(index: number): void
}

export function Fakers({availableFakers, updatedFakerIndex} : FakerProps) {
    const fakers = []
    for (let i = 0; i < availableFakers?.length; i++) {
        fakers.push(
            <Button key={i} title={availableFakers[i]} clicked={() => updatedFakerIndex(i)} />
        )
    }
    return fakers
}