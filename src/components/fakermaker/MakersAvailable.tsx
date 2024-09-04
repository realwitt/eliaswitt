import {Button} from "./Button.tsx";
import type {Maker} from "./types/AvailableMakers";

type FakerProps = {
    availableMakers: Array<Maker>
    updatedMakerIndex(index: number): void
}


export function MakersAvailable({availableMakers, updatedMakerIndex} : FakerProps) {
    const renderedMakers = []
    for (let i = 0; i < availableMakers?.length; i++) {
        renderedMakers.push(
            <Button key={i} title={availableMakers[i].type.toLowerCase()} clicked={() => updatedMakerIndex(i)} showCount={true} />
        )
    }
    return renderedMakers
}