export interface LineSymbol {
    id: string;
    name: string;
    icons: (offset: number, scale: number) => {
        icon: google.maps.Symbol;
        offset: string;
        repeat: string;
    }[];
}

function closedArrowSymbol(): google.maps.Symbol  {
    return {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3,
        strokeColor: '#003a96',
        fillColor: '#003a96',
        fillOpacity: 1,
    }
}

const dashSymbol: google.maps.Symbol = {
    path: 'M 0, -.65, 0, .65',
    strokeOpacity: 1,
    strokeWeight: 3,
    strokeColor: '#cce5ff'
}


export const lineSymbols: LineSymbol[] = [
    {
        id: 'dashed',
        name: 'Dashed Line',
        icons: (offset, scale) => [
            {
                icon: dashSymbol,
                offset: offset + 'px',
                repeat: '20px',
            }
        ],
    },
    {
        id: 'dashed-arrow',
        name: 'Dashed Arrow',
        icons: (offset, scale) => [
            { icon: dashSymbol, offset: offset + 'px', repeat: '10px'},
            { icon: closedArrowSymbol(), offset: offset + 'px', repeat: '75px'},
        ]
    }
];