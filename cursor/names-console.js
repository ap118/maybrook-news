// Names Console Logger - 
const names = [
    'nosrednA sacuL',           // Andreas Lucas
    'sivaD egroeG',             // David George
    'serolF asiL',              // Flora Lily
    'nosliW retraC',            // Wilson Carter
    'ffarG wehttaM',            // Graff Matthew
    'relliM noskcaJ',           // Miller Jackson
    'remarK yeliaB',            // Remy Bailey
    'oidaicerP redyhR',         // Pierce Ryder
    'eeL rekraP',               // Lee Parker
    'rolyaT ayrA',              // Taylor Arya
    'Miss Justine Gandy',       // Miss Justine Gandy (kept as-is)
    'Alex Lily',                // Alex Lily (kept as-is)
    'nosmohT nosaM',            // Thomas Mason
    'Maybrook Elementary',      // Maybrook Elementary
    'zenitraM anelE',           // Martinez Elena
    'ytluNcM nyledaM',          // McLaughlin Madelyn
    'nosmailliW ammE',          // Williams Emma
    'htimS nitsuA',             // Smith Austin
    'eeltS naitsabeS'           // Steele Sebastian
];

// Log each name with strikethrough effect
names.forEach((name, index) => {
    const originalName = getOriginalName(name);
    
    // Don't apply strikethrough to Alex Lily and Miss Justine Gandy
    if (originalName === 'Alex Lily' || originalName === 'Miss Justine Gandy' || originalName === 'Maybrook Elementary') {
        console.log(originalName);
    } else {
        console.log(`%c${originalName}`, 'text-decoration: line-through;');
    }
});

// Function to get the original name from the backwards version
function getOriginalName(backwardsName) {
    const nameMap = {
        'nosrednA sacuL': 'Andreas Lucas',
        'sivaD egroeG': 'David George',
        'serolF asiL': 'Flora Lily',
        'nosliW retraC': 'Wilson Carter',
        'ffarG wehttaM': 'Graff Matthew',
        'relliM noskcaJ': 'Miller Jackson',
        'remarK yeliaB': 'Remy Bailey',
        'oidaicerP redyhR': 'Pierce Ryder',
        'eeL rekraP': 'Lee Parker',
        'rolyaT ayrA': 'Taylor Arya',
        'Miss Justine Gandy': 'Miss Justine Gandy',
        'Alex Lily': 'Alex Lily',
        'nosmohT nosaM': 'Thomas Mason',
        'Maybrook Elementary': 'Maybrook Elementary',
        'zenitraM anelE': 'Martinez Elena',
        'ytluNcM nyledaM': 'McLaughlin Madelyn',
        'nosmailliW ammE': 'Williams Emma',
        'htimS nitsuA': 'Smith Austin',
        'eeltS naitsabeS': 'Steele Sebastian'
    };
    
    return nameMap[backwardsName] || backwardsName;
} 