export function meterTilKmVisning(meter: number) {
    return `${(meter / 1000).toFixed(2)}km`
}

export function kmhToPace(kmPerHour: number) {
    const secondsPerKm = 3600 / kmPerHour
    const minutes = Math.floor(secondsPerKm / 60)
    const seconds = Math.floor(secondsPerKm % 60)
    const sekunderPaddet = seconds < 10 ? `0${seconds}` : seconds
    return `${minutes}:${sekunderPaddet} /km`
}
