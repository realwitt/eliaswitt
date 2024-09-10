import {Button} from "./Button.tsx";

type FakerProps = {
    availableFakers: Array<string> | undefined
    updatedFakerIndex(index: number): void
}

export function Fakers({availableFakers, updatedFakerIndex}: FakerProps) {
    const fakers = []
    if (availableFakers) {
        for (let i = 0; i < availableFakers?.length; i++) {
            fakers.push(
                <Button
                    key={i}
                    title={availableFakers[i]
                        .toLowerCase()
                        .split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join(' ')} clicked={() => updatedFakerIndex(i)}/>
            )
        }
        return fakers
    }
}