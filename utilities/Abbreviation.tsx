export function NumericalAbbr(n: number | undefined): string{
    if(n === undefined) return "0";

    const abbr = ['', 'k', 'M', 'B', 'T', 'Q', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']
    let suffix = 0

    while(n >= 1000){
        n/=1000
        suffix++
    }
    
    return n+abbr[suffix]
}