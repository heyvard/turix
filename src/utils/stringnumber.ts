export const stringTilNumber = (prop: string | null): number | null => {
    if (prop == '') {
        return null
    }
    if (!prop) {
        return null
    }
    return Number(prop!)
}
