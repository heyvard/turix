import { SimpleActivity } from '../../types/db'
import dayjs, { Dayjs } from 'dayjs'

export interface Aar {
    distance: number
    antall: number
    aarStart: Dayjs
    aarSlutt: Dayjs
    movingTime: BigInt
    elapsedTime: BigInt
    lengsteTur: SimpleActivity
    aktiviteter: SimpleActivity[]
}

export function splittTilAar(activities: SimpleActivity[], aktivitet: string): Aar[] {
    const langrenn = activities.filter((a) => aktivitet.includes(a.type1))

    const baseAarStart = aktivitet.includes('NordicSki') ? dayjs('1998-07-01') : dayjs('1998-01-01')

    const aarene = [] as Aar[]
    var aarStart = baseAarStart
    do {
        const nesteAar = aarStart.add(1, 'year')

        const aktiviter = langrenn.filter((a) => {
            let date = dayjs(a.start_date)
            return date.isAfter(aarStart) && date.isBefore(nesteAar)
        })
        if (aktiviter.length > 0) {
            const antall = aktiviter.length
            const totalDistanse = aktiviter.map((a) => a.distance).reduce((partialSum, a) => partialSum + a, 0)

            const totalElapsedTid = aktiviter
                .map((a) => BigInt(a.elapsed_time ?? 0))
                .reduce((partialSum, a) => partialSum + a, BigInt(0))

            const totalMovingTid = aktiviter
                .map((a) => BigInt(a.moving_time ?? 0))
                .reduce((partialSum, a) => partialSum + a, BigInt(0))

            const sortert = aktiviter.sort((a, b) => a.distance - b.distance) // b - a for reverse sort
            const lengsteTur = sortert[aktiviter.length - 1]

            const aaret: Aar = {
                antall,
                distance: totalDistanse,
                aarSlutt: nesteAar,
                aarStart: aarStart,
                elapsedTime: totalElapsedTid,
                movingTime: totalMovingTid,
                lengsteTur,
                aktiviteter: aktiviter.reverse(),
            }

            aarene.push(aaret)
        }
        aarStart = nesteAar
    } while (aarStart.year() <= dayjs().year())
    return aarene
}
