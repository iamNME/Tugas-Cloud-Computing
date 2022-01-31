import numeral from 'numeral';

//Rupiah format
numeral.register('locale', 'id', {
    delimiters: {
        thousands: ',',
        decimal: ','
    },
    abbreviations: {
        thousand: 'rb',
        million: 'jt',
        billion: 'm',
        trillion: 't'
    },
    currency: {
        symbol: 'Rp'
    }
});

numeral.locale('id');
export const currency = (number) => {
    return numeral(number).format('$0,0');
}
