export function NumericalAbbr(n: number | undefined, decimals: number = 1): string{
    if(n === undefined) return "0";

    const abbr = ['', 'K', 'M', 'B', 'T', 'Q', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']
    let suffix = 0

    while(n >= 1000){
        n/=1000
        suffix++
    }

    n = (n == Math.round(n)) ? n : Number(n.toFixed(decimals))
    return n+abbr[suffix]
}