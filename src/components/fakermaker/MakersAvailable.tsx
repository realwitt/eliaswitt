import {Button} from "./Button.tsx";
import type {Maker} from "./types/Maker";

type FakerProps = {
    availableMakers: Array<Maker> | undefined
    updatedMakerIndex(index: number): void
}


export function MakersAvailable({availableMakers, updatedMakerIndex} : FakerProps) {
    if (availableMakers) {
        const renderedMakers = []
        for (let i = 0; i < availableMakers?.length; i++) {
            renderedMakers.push(
                <Button key={i} title={availableMakers[i].type.toLowerCase()} clicked={() => updatedMakerIndex(i)} countToShow={availableMakers[i].count} />
            )
        }
        return renderedMakers
    }
}