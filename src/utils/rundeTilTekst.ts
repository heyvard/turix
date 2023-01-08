export function rundeTilTekst(runde: string) {
    switch (runde) {
        case '4': {
            return 'Åttendedelsfinale'
        }
        case '5': {
            return 'Kvartfinale'
        }
        case '6': {
            return 'Semifinale'
        }
        case '7': {
            return 'Bronsefinale'
        }
        case '8': {
            return 'Finale'
        }
    }
    return 'Gruppespill'
}
