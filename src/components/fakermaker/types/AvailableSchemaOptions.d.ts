type Maker = {
    name: string
    options?: Array<string>
}

export type AvailableSchemaOptions = {
    fakers: Array<string>
    makers: Array<Maker>
}
