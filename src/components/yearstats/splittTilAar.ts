import dayjs, { Dayjs } from 'dayjs'

import { SimpleActivity } from '../../types/db'

export interface Aar {
    distance: number
    antall: number
    start: Dayjs
    slutt: Dayjs
    movingTime: bigint
    elapsedTime: bigint
    lengsteTur: SimpleActivity
    aktiviteter: SimpleActivity[]
    total: boolean
}

export function splittTilAar(activities: SimpleActivity[], aktivitet: string): { aar: Aar[]; total: Aar } {
    const filtrerteAktiviteter = activities.filter((a) => aktivitet.includes(a.type1))

    const baseAarStart = aktivitet.includes('NordicSki') ? dayjs('1998-07-01') : dayjs('1998-01-01')

    const aarene = [] as Aar[]
    let aarStart = baseAarStart
    do {
        const nesteAar = aarStart.add(1, 'year')

        const aktiviter = filtrerteAktiviteter.filter((a) => {
            const date = dayjs(a.start_date)
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
                slutt: nesteAar,
                start: aarStart,
                elapsedTime: totalElapsedTid,
                movingTime: totalMovingTid,
                lengsteTur,
                aktiviteter: aktiviter.reverse(),
                total: false,
            }

            aarene.push(aaret)
        }
        aarStart = nesteAar
    } while (aarStart.year() <= dayjs().year())

    const skapTotal = () => {
        const totalElapsedTid = filtrerteAktiviteter
            .map((a) => BigInt(a.elapsed_time ?? 0))
            .reduce((partialSum, a) => partialSum + a, BigInt(0))

        const totalMovingTid = filtrerteAktiviteter
            .map((a) => BigInt(a.moving_time ?? 0))
            .reduce((partialSum, a) => partialSum + a, BigInt(0))

        const sortert = filtrerteAktiviteter.sort((a, b) => a.distance - b.distance) // b - a for reverse sort
        const lengsteTur = sortert[filtrerteAktiviteter.length - 1]

        return {
            total: true,
            start: aarene[0].start,
            slutt: aarene[aarene.length - 1].start,
            distance: aarene.reduce((acc, a) => acc + a.distance, 0),
            movingTime: totalMovingTid,
            elapsedTime: totalElapsedTid,
            antall: aarene.reduce((acc, a) => acc + a.antall, 0),
            lengsteTur: lengsteTur,
            aktiviteter: filtrerteAktiviteter.filter((a) => aktivitet.includes(a.type1)),
        }
    }
    return {
        aar: aarene,
        total: skapTotal(),
    }
}
