/**
 * ==========================================================
 * Virtual Genetics Lab
 * ----------------------------------------------------------
 * File: traits.js
 * Version: 0.1.0
 * License: MIT
 *
 * Βιολογική βάση γνώσης της εφαρμογής.
 * Περιλαμβάνει χαρακτηριστικά ανθρώπων, φυτών και
 * γενετικές ασθένειες που χρησιμοποιούνται στη διδασκαλία
 * της Γενετικής.
 * ==========================================================
 */

"use strict";

/*
==========================================================
Κατηγορίες χαρακτηριστικών

human_trait
plant_trait
animal_trait
disease
blood_group
chromosomal
==========================================================
*/

/*
==========================================================
Τύποι κληρονόμησης

autosomal
sex_linked
mitochondrial
chromosomal
==========================================================
*/

/*
==========================================================
Τύποι επικράτησης

complete
incomplete
codominance
multiple_alleles
==========================================================
*/

const TRAITS = [

/* =========================================================
   ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΑΝΘΡΩΠΟΥ
   ========================================================= */

{
    id: "earlobe",

    name: "Σχήμα λοβού αυτιού",

    category: "human_trait",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Κλασικό παράδειγμα αυτοσωμικού χαρακτήρα με πλήρη επικράτηση.",

    inheritance: "autosomal",

    dominance: "complete",

    hypothesis: {

        dominantAllele: "A",

        recessiveAllele: "a"

    },

    alleles: [

        {

            symbol: "A",

            label: "Ελεύθερος λοβός"

        },

        {

            symbol: "a",

            label: "Προσκολλημένος λοβός"

        }

    ],

    genotypeDefinitions: [

        {

            genotype: "AA",

            phenotype: "Ελεύθερος λοβός"

        },

        {

            genotype: "Aa",

            phenotype: "Ελεύθερος λοβός"

        },

        {

            genotype: "aa",

            phenotype: "Προσκολλημένος λοβός"

        }

    ]

},

/* =========================================================
   ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ΜΠΙΖΕΛΙΑΣ (Mendel)
   ========================================================= */

{
    id: "plant_height",

    name: "Ύψος φυτού",

    category: "plant_trait",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Χαρακτήρας που μελέτησε ο Gregor Mendel στη μπιζελιά.",

    inheritance: "autosomal",

    dominance: "complete",

    hypothesis: {

        dominantAllele: "T",

        recessiveAllele: "t"

    },

    alleles: [

        {
            symbol: "T",
            label: "Ψηλό φυτό"
        },

        {
            symbol: "t",
            label: "Κοντό φυτό"
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "TT",
            phenotype: "Ψηλό φυτό"
        },

        {
            genotype: "Tt",
            phenotype: "Ψηλό φυτό"
        },

        {
            genotype: "tt",
            phenotype: "Κοντό φυτό"
        }

    ]

},

{
    id: "flower_color",

    name: "Χρώμα άνθους",

    category: "plant_trait",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Ιώδες και λευκό άνθος στη μπιζελιά.",

    inheritance: "autosomal",

    dominance: "complete",

    hypothesis: {

        dominantAllele: "P",

        recessiveAllele: "p"

    },

    alleles: [

        {
            symbol: "P",
            label: "Ιώδες άνθος"
        },

        {
            symbol: "p",
            label: "Λευκό άνθος"
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "PP",
            phenotype: "Ιώδες άνθος"
        },

        {
            genotype: "Pp",
            phenotype: "Ιώδες άνθος"
        },

        {
            genotype: "pp",
            phenotype: "Λευκό άνθος"
        }

    ]

},

{
    id: "seed_shape",

    name: "Σχήμα σπόρου",

    category: "plant_trait",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Λείος και ρυτιδωμένος σπόρος.",

    inheritance: "autosomal",

    dominance: "complete",

    hypothesis: {

        dominantAllele: "R",

        recessiveAllele: "r"

    },

    alleles: [

        {
            symbol: "R",
            label: "Λείος σπόρος"
        },

        {
            symbol: "r",
            label: "Ρυτιδωμένος σπόρος"
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "RR",
            phenotype: "Λείος σπόρος"
        },

        {
            genotype: "Rr",
            phenotype: "Λείος σπόρος"
        },

        {
            genotype: "rr",
            phenotype: "Ρυτιδωμένος σπόρος"
        }

    ]

},

{
    id: "seed_color",

    name: "Χρώμα σπόρου",

    category: "plant_trait",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Κίτρινος και πράσινος σπόρος.",

    inheritance: "autosomal",

    dominance: "complete",

    hypothesis: {

        dominantAllele: "Y",

        recessiveAllele: "y"

    },

    alleles: [

        {
            symbol: "Y",
            label: "Κίτρινος σπόρος"
        },

        {
            symbol: "y",
            label: "Πράσινος σπόρος"
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "YY",
            phenotype: "Κίτρινος σπόρος"
        },

        {
            genotype: "Yy",
            phenotype: "Κίτρινος σπόρος"
        },

        {
            genotype: "yy",
            phenotype: "Πράσινος σπόρος"
        }

    ]

},

/* =========================================================
   ΓΕΝΕΤΙΚΕΣ ΑΣΘΕΝΕΙΕΣ
   ========================================================= */

{
    id: "cystic_fibrosis",

    name: "Κυστική Ίνωση",

    category: "disease",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Αυτοσωμική υπολειπόμενη μονογονιδιακή ασθένεια.",

    inheritance: "autosomal",

    dominance: "complete",

    hypothesis: {

        dominantAllele: "A",

        recessiveAllele: "a"

    },

    alleles: [

        {
            symbol: "A",
            label: "Φυσιολογικό αλληλόμορφο"
        },

        {
            symbol: "a",
            label: "Μεταλλαγμένο αλληλόμορφο"
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "AA",
            phenotype: "Υγιής"
        },

        {
            genotype: "Aa",
            phenotype: "Φορέας"
        },

        {
            genotype: "aa",
            phenotype: "Πάσχων"
        }

    ]

},

{
    id: "phenylketonuria",

    name: "Φαινυλκετονουρία",

    category: "disease",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Αυτοσωμική υπολειπόμενη μονογονιδιακή ασθένεια.",

    inheritance: "autosomal",

    dominance: "complete",

    hypothesis: {

        dominantAllele: "A",

        recessiveAllele: "a"

    },

    alleles: [

        {
            symbol: "A",
            label: "Φυσιολογικό αλληλόμορφο"
        },

        {
            symbol: "a",
            label: "Μεταλλαγμένο αλληλόμορφο"
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "AA",
            phenotype: "Υγιής"
        },

        {
            genotype: "Aa",
            phenotype: "Φορέας"
        },

        {
            genotype: "aa",
            phenotype: "Πάσχων"
        }

    ]

},

{
    id: "sickle_cell",

    name: "Δρεπανοκυτταρική Αναιμία",

    category: "disease",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Αυτοσωμική υπολειπόμενη μονογονιδιακή ασθένεια.",

    inheritance: "autosomal",

    dominance: "complete",

    hypothesis: {

        dominantAllele: "A",

        recessiveAllele: "a"

    },

    alleles: [

        {
            symbol: "A",
            label: "Φυσιολογική β-αλυσίδα αιμοσφαιρίνης"
        },

        {
            symbol: "a",
            label: "Μεταλλαγμένη β-αλυσίδα αιμοσφαιρίνης"
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "AA",
            phenotype: "Υγιής"
        },

        {
            genotype: "Aa",
            phenotype: "Φορέας"
        },

        {
            genotype: "aa",
            phenotype: "Πάσχων"
        }

    ]

},

{
    id: "beta_thalassemia",

    name: "Β-Θαλασσαιμία",

    category: "disease",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Αυτοσωμική υπολειπόμενη μονογονιδιακή ασθένεια.",

    inheritance: "autosomal",

    dominance: "complete",

    hypothesis: {

        dominantAllele: "A",

        recessiveAllele: "a"

    },

    alleles: [

        {
            symbol: "A",
            label: "Φυσιολογικό γονίδιο β-σφαιρίνης"
        },

        {
            symbol: "a",
            label: "Μεταλλαγμένο γονίδιο β-σφαιρίνης"
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "AA",
            phenotype: "Υγιής"
        },

        {
            genotype: "Aa",
            phenotype: "Φορέας"
        },

        {
            genotype: "aa",
            phenotype: "Πάσχων"
        }

    ]

},

{
    id: "familial_hypercholesterolemia",

    name: "Οικογενής Υπερχοληστερολαιμία",

    category: "disease",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Αυτοσωμική επικρατής μονογονιδιακή ασθένεια.",

    inheritance: "autosomal",

    dominance: "complete",

    hypothesis: {

        dominantAllele: "H",

        recessiveAllele: "h"

    },

    alleles: [

        {
            symbol: "H",
            label: "Μεταλλαγμένο επικρατές αλληλόμορφο"
        },

        {
            symbol: "h",
            label: "Φυσιολογικό αλληλόμορφο"
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "HH",
            phenotype: "Σοβαρή οικογενής υπερχοληστερολαιμία"
        },

        {
            genotype: "Hh",
            phenotype: "Οικογενής υπερχοληστερολαιμία"
        },

        {
            genotype: "hh",
            phenotype: "Υγιής"
        }

    ]

},

{
    id: "red-green color blindness",

    name: "Αχρωματοψία κόκκινου–πράσινου",

    category: "disease",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Φυλοσύνδετη υπολειπόμενη κληρονομική διαταραχή της αντίληψης των χρωμάτων.",

    inheritance: "x-linked",

    dominance: "recessive",

    alleles: [

        {
            symbol: "XA",
            label: "Φυσιολογικό αλληλόμορφο",
            chromosome: "X",
            order: 1
        },

        {
            symbol: "Xa",
            label: "Αλληλόμορφο για αχρωματοψία",
            chromosome: "X",
            order: 2
        },

        {
            symbol: "Y",
            label: "Χρωμόσωμα Y",
            chromosome: "Y",
            order: 3
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "XAXA",
            phenotype: "Φυσιολογική όραση",
            status: "healthy"
        },

        {
            genotype: "XAXa",
            phenotype: "Φυσιολογική όραση – φορέας",
            status: "carrier"
        },

        {
            genotype: "XaXa",
            phenotype: "Αχρωματοψία",
            status: "affected"
        },

        {
            genotype: "XAY",
            phenotype: "Φυσιολογική όραση",
            status: "healthy"
        },

        {
            genotype: "XaY",
            phenotype: "Αχρωματοψία",
            status: "affected"
        }

    ]

},

{
    id: "hemophilia-a",

    name: "Αιμορροφιλία Α",

    category: "disease",

    source: "Βιολογία Γ΄ Λυκείου",

    investigation: true,

    description:
        "Φυλοσύνδετη υπολειπόμενη κληρονομική διαταραχή της πήξης του αίματος.",

    inheritance: "x-linked",

    dominance: "recessive",

    alleles: [

        {
            symbol: "XA",
            label: "Φυσιολογικό αλληλόμορφο",
            chromosome: "X",
            order: 1
        },

        {
            symbol: "Xa",
            label: "Αλληλόμορφο για αιμορροφιλία Α",
            chromosome: "X",
            order: 2
        },

        {
            symbol: "Y",
            label: "Χρωμόσωμα Y",
            chromosome: "Y",
            order: 3
        }

    ],

    genotypeDefinitions: [

        {
            genotype: "XAXA",
            phenotype: "Φυσιολογική πήξη",
            status: "healthy"
        },

        {
            genotype: "XAXa",
            phenotype: "Φυσιολογική πήξη – φορέας",
            status: "carrier"
        },

        {
            genotype: "XaXa",
            phenotype: "Αιμορροφιλία Α",
            status: "affected"
        },

        {
            genotype: "XAY",
            phenotype: "Φυσιολογική πήξη",
            status: "healthy"
        },

        {
            genotype: "XaY",
            phenotype: "Αιμορροφιλία Α",
            status: "affected"
        }

    ]

}

];


/* ==========================================================
   Βάση γνώσης (Metadata)
   ========================================================== */

const TRAITS_METADATA = {

    application: "Virtual Genetics Lab",

    version: "0.1.0",

    language: "el",

    educationalLevel: "Γενικό Λύκειο",

    curriculum: "Βιολογία Γ΄ Λυκείου",

    license: "MIT",

    oer: true,

    author: "Virtual Genetics Lab Project",

    supportedInheritance: [

        "autosomal"

    ],

    supportedDominance: [

        "complete"

    ],

    futureExtensions: [

        "dihybrid_cross",

        "codominance",

        "multiple_alleles",

        "sex_linked",

        "mitochondrial",

        "chromosomal"

    ]

};