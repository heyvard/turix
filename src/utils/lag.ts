interface Lag {
    engelsk: string
    norsk: string
    flagg: string
}

export const alleLag: Lag[] = [
    { engelsk: 'Argentina', norsk: 'Argentina', flagg: '🇦🇷' },
    {
        engelsk: 'Australia',
        norsk: 'Australia',
        flagg: '🇦🇺',
    },
    { engelsk: 'Belgium', norsk: 'Belgia', flagg: '🇧🇪' },
    {
        engelsk: 'Brazil',
        norsk: 'Brasil',
        flagg: '🇧🇷',
    },
    { engelsk: 'Cameroon', norsk: 'Kamerun', flagg: '🇨🇲' },
    {
        engelsk: 'Canada',
        norsk: 'Canada',
        flagg: '🇨🇦',
    },
    { engelsk: 'Costa Rica', norsk: 'Costa Rica', flagg: '🇨🇷' },
    {
        engelsk: 'Croatia',
        norsk: 'Kroatia',
        flagg: '🇭🇷',
    },
    { engelsk: 'Denmark', norsk: 'Danmark', flagg: '🇩🇰' },
    {
        engelsk: 'Ecuador',
        norsk: 'Equador',
        flagg: '🇪🇨',
    },
    { engelsk: 'England', norsk: 'England', flagg: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    {
        engelsk: 'France',
        norsk: 'Frankrike',
        flagg: '🇫🇷',
    },
    { engelsk: 'Germany', norsk: 'Tyskland', flagg: '🇩🇪' },
    {
        engelsk: 'Ghana',
        norsk: 'Ghana',
        flagg: '🇬🇭',
    },
    { engelsk: 'Iran', norsk: 'Iran', flagg: '🇮🇷' },
    {
        engelsk: 'Japan',
        norsk: 'Japan',
        flagg: '🇯🇵',
    },
    { engelsk: 'Korea Republic', norsk: 'Sør Korea', flagg: '🇰🇷' },
    {
        engelsk: 'Mexico',
        norsk: 'Mexico',
        flagg: '🇲🇽',
    },
    { engelsk: 'Morocco', norsk: 'Marokko', flagg: '🇲🇦' },
    {
        engelsk: 'Netherlands',
        norsk: 'Nederland',
        flagg: '🇳🇱',
    },
    { engelsk: 'Poland', norsk: 'Polen', flagg: '🇵🇱' },
    {
        engelsk: 'Portugal',
        norsk: 'Portugal',
        flagg: '🇵🇹',
    },
    { engelsk: 'Qatar', norsk: 'Qatar', flagg: '🇶🇦' },
    {
        engelsk: 'Saudi Arabia',
        norsk: 'Saudi Arabia',
        flagg: '🇸🇦',
    },
    { engelsk: 'Senegal', norsk: 'Senegal', flagg: '🇸🇳' },
    {
        engelsk: 'Serbia',
        norsk: 'Serbia',
        flagg: '🇷🇸',
    },
    { engelsk: 'Spain', norsk: 'Spania', flagg: '🇪🇸' },
    {
        engelsk: 'Switzerland',
        norsk: 'Sveits',
        flagg: '🇨🇭',
    },
    {
        engelsk: 'Tunisia',
        norsk: 'Tunisia',
        flagg: '🇹🇳',
    },
    { engelsk: 'Uruguay', norsk: 'Uruguay', flagg: '🇺🇾' },
    {
        engelsk: 'USA',
        norsk: 'USA',
        flagg: '🇺🇸',
    },
    { engelsk: 'Wales', norsk: 'Wales', flagg: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
]

const engelskMap = new Map<string, Lag>()
const norsk = new Map<string, Lag>()

alleLag.forEach((l) => {
    engelskMap.set(l.engelsk, l)
    norsk.set(l.norsk, l)
})

export function hentFlag(engelskLag: string) {
    return engelskMap.get(engelskLag)?.flagg || '🤔'
}

export function hentNorsk(engelskLag: string) {
    return engelskMap.get(engelskLag)?.norsk || '🤔'
}

export const alleLagSortert = alleLag.sort((a, b) => a.norsk.localeCompare(b.norsk))
