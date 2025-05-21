import Roman from "../images/Roman.png";
import Joey from "../images/Joey.png";
import Jake from "../images/Jake.jpg";
import Yara from "../images/Yara.png";
import Pau from "../images/Pau.png";
import Fem from "../images/Fem.png";
import Pedro from "../images/Pedro.jpg";
import Ben from "../images/Ben.png";
import Hank from "../images/Hank.jpg";
import Pattycakes from "../images/Pattycakes.png";
import {useTranslate} from "i18n"

export function useDevelopers() {
    const t = useTranslate();

    return [
        {
            src: Jake,
            name: "Jake Foley",
            role: t`Project Manager & Full-Time SWE`,
            quote: t`Success is not final, failure is not fatal: It is the courage to continue that counts." - Winston Churchill`,
        },
        {
            src: Roman,
            name: "Roman Florintsev",
            role: t`Lead Developer`,
            quote: t`"You must go on. I can't go on. I'll go on." - Samuel Beckett`,
        },
        {
            src: Yara,
            name: "Yara Nabih",
            role: t`Full-Time Assistant Lead Developer`,
            quote: t`“I’ve come to love myself for who I am, who I was, and who I hope to become.” - Namjoon Kim`,
        },
        {
            src: Joey,
            name: "William Hanlon",
            role: t`Full-Time Assistant Lead Developer`,
            quote: t`“The computing scientist’s main challenge is not to get confused by the complexities of his own making.” - Edsger Dijkstra`,
        },
        {
            src: Pau,
            name: "Pau Alcolea",
            role: t`Scrum Master & Full-Time SWE`,
            quote: t`"It takes love over gold and mind over matter to do what you do that you must." - Dire Straits`,
        },
        {
            src: Fem,
            name: "Femke Jansen",
            role: t`Product Owner & Full-Time SWE`,
            quote: t`"It's not the size of the dog in the fight, it's the size of the fight in the dog." - Mark Twain`,
        },
        {
            src: Pattycakes,
            name: "Patrick Tirch",
            role: t`Visual Editing & Full-Time SWE`,
            quote: t`"I look like a casual, laid-back guy, but it's like a circus in my head." - Steven Wright`,
        },
        {
            src: Hank,
            name: "Henry Pharris",
            role: t`Full-Time SWE`,
            quote: t`"Life should not be a journey to the grave with the intention of arriving safely in a pretty and well-preserved body, but rather to skid in broadside in a cloud of smoke, thoroughly used up, totally worn out, and loudly proclaiming 'Wow! What a Ride!'" - Hunter S Thompson`,
        },
        {
            src: Pedro,
            name: "Pedro Nogueira",
            role: t`Full-Time SWE`,
            quote: t`"The mystery of life isn't a problem to solve, but a reality to experience." - Frank Herbert`,
        },
        {
            src: Ben,
            name: "Ben Kharfen",
            role: t`Full-Time SWE`,
            quote: t`"Dream On" - Aerosmith`,
        },
    ];
}
