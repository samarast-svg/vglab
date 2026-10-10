/**
 * ==========================================================
 * Virtual Genetics Lab
 * ----------------------------------------------------------
 * File: genetics.js
 * Version: 0.1.0
 * License: MIT
 * ==========================================================
 */

"use strict";

const Genetics = {

    stringToGenotype(genotype, trait) {
        genotype = genotype.replace(/\s+/g, "");
        const symbols = trait.alleles
            .map(a => a.symbol)
            .sort((a, b) => b.length - a.length);

        const result = [];
        let remaining = genotype;

        while (remaining.length > 0) {
            let matched = false;
            for (const symbol of symbols) {
                if (remaining.startsWith(symbol)) {
                    result.push(symbol);
                    remaining = remaining.substring(symbol.length);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                throw new Error(`Μη έγκυρος γονότυπος: ${genotype}`);
            }
        }
        return result;
    },

    genotypeToString(genotypeArray) {
        return genotypeArray.join("");
    },

    normalizeGenotype(genotypeArray, trait) {
        const order = {};
        trait.alleles.forEach((allele, index) => {
            order[allele.symbol] = allele.order ?? index;
        });
        return [...genotypeArray].sort((a, b) => order[a] - order[b]);
    },

    createGametes(genotypeArray) {
        if (genotypeArray.length !== 2) {
            throw new Error("Ο μονοϋβριδισμός απαιτεί δύο αλληλόμορφα.");
        }

        const [a1, a2] = genotypeArray;
        if (a1 === a2) {
            return [{ alleles: [a1], probability: 1 }];
        }

        return [
            { alleles: [a1], probability: 0.5 },
            { alleles: [a2], probability: 0.5 }
        ];
    },

    isXLinkedTrait(trait) {
        return trait && trait.inheritance === "x-linked";
    },

    createXLinkedGametes(genotypeArray, sex, trait) {
        if (!this.isXLinkedTrait(trait)) {
            throw new Error("Το trait δεν έχει δηλωθεί ως φυλοσύνδετο.");
        }

        if (!Array.isArray(genotypeArray) || genotypeArray.length !== 2) {
            throw new Error("Ο φυλοσύνδετος μονοϋβριδισμός απαιτεί δύο χρωμοσώματα.");
        }

        const xAlleles = genotypeArray.filter(allele => this.isXAllele(allele, trait));
        const yAlleles = genotypeArray.filter(allele => this.isYAllele(allele, trait));

        if (sex === "female") {
            if (xAlleles.length !== 2 || yAlleles.length !== 0) {
                throw new Error(`Μη έγκυρος φυλοσύνδετος γονότυπος για θηλυκό: ${this.genotypeToString(genotypeArray)}`);
            }
            const [x1, x2] = xAlleles;
            if (x1 === x2) {
                return [{ alleles: [x1], probability: 1 }];
            }
            return [
                { alleles: [x1], probability: 0.5 },
                { alleles: [x2], probability: 0.5 }
            ];
        }

        if (sex === "male") {
            if (xAlleles.length !== 1 || yAlleles.length !== 1) {
                throw new Error(`Μη έγκυρος φυλοσύνδετος γονότυπος για αρσενικό: ${this.genotypeToString(genotypeArray)}`);
            }
            return [
                { alleles: [xAlleles[0]], probability: 0.5 },
                { alleles: [yAlleles[0]], probability: 0.5 }
            ];
        }

        throw new Error("Το φύλο πρέπει να είναι 'male' ή 'female'.");
    },

    isXAllele(allele, trait) {
        const definition = trait.alleles.find(a => a.symbol === allele);
        if (definition && definition.chromosome) {
            return definition.chromosome === "X";
        }
        return allele.startsWith("X") || allele.startsWith("x");
    },

    isYAllele(allele, trait) {
        const definition = trait.alleles.find(a => a.symbol === allele);
        if (definition && definition.chromosome) {
            return definition.chromosome === "Y";
        }
        return allele === "Y" || allele === "y";
    },

    createPunnettSquare(fatherGametes, motherGametes, trait) {
        const square = [];
        for (const mother of motherGametes) {
            const row = [];
            for (const father of fatherGametes) {
                const genotype = this.normalizeGenotype([...father.alleles, ...mother.alleles], trait);
                row.push({
                    genotype,
                    genotypeString: this.genotypeToString(genotype),
                    probability: father.probability * mother.probability,
                    phenotype: null
                });
            }
            square.push(row);
        }
        return square;
    },

    flattenSquare(square) {
        return square.flat();
    },

    calculateGenotypeDistribution(square) {
        const distribution = {};
        const cells = this.flattenSquare(square);
        for (const cell of cells) {
            const genotype = cell.genotypeString;
            if (!distribution[genotype]) {
                distribution[genotype] = { count: 0, probability: 0 };
            }
            distribution[genotype].count++;
            distribution[genotype].probability += cell.probability;
        }
        return distribution;
    },

    calculatePhenotypeDistribution(genotypeDistribution, trait) {
        const distribution = {};
        for (const genotype in genotypeDistribution) {
            const genotypeInfo = trait.genotypeDefinitions.find(g => g.genotype === genotype);
            if (!genotypeInfo) {
                console.warn(`Δεν βρέθηκε ο γονότυπος ${genotype} στο traits.js`);
                continue;
            }
            const phenotype = genotypeInfo.phenotype;
            if (!distribution[phenotype]) {
                distribution[phenotype] = { count: 0, probability: 0 };
            }
            distribution[phenotype].count += genotypeDistribution[genotype].count;
            distribution[phenotype].probability += genotypeDistribution[genotype].probability;
        }
        return distribution;
    },

    probabilitiesToPercentages(distribution) {
        const percentages = {};
        for (const key in distribution) {
            percentages[key] = Number((distribution[key].probability * 100).toFixed(2));
        }
        return percentages;
    },

    validateTrait(trait) {
        if (!trait) throw new Error("Δεν επιλέχθηκε χαρακτήρας.");
        if (!trait.alleles) throw new Error("Το trait δεν περιέχει αλληλόμορφα.");
        if (!trait.genotypeDefinitions) throw new Error("Το trait δεν περιέχει γονότυπους.");
    },

    validateGenotype(genotype, trait) {
        const possible = trait.genotypeDefinitions.map(g => g.genotype);
        if (!possible.includes(genotype)) {
            throw new Error(`Μη αποδεκτός γονότυπος: ${genotype}`);
        }
    },

    validateXLinkedGenotype(genotype, sex, trait) {
        this.validateGenotype(genotype, trait);
        const genotypeArray = this.stringToGenotype(genotype, trait);
        const xCount = genotypeArray.filter(allele => this.isXAllele(allele, trait)).length;
        const yCount = genotypeArray.filter(allele => this.isYAllele(allele, trait)).length;

        if (sex === "female") {
            if (xCount !== 2 || yCount !== 0) {
                throw new Error(`Ο γονότυπος ${genotype} δεν είναι έγκυρος για θηλυκό άτομο.`);
            }
            return true;
        }

        if (sex === "male") {
            if (xCount !== 1 || yCount !== 1) {
                throw new Error(`Ο γονότυπος ${genotype} δεν είναι έγκυρος για αρσενικό άτομο.`);
            }
            return true;
        }

        throw new Error("Το φύλο πρέπει να είναι 'male' ή 'female'.");
    },

    performCross(trait, fatherGenotype, motherGenotype) {
        this.validateTrait(trait);
        this.validateGenotype(fatherGenotype, trait);
        this.validateGenotype(motherGenotype, trait);

        const fatherAlleles = this.stringToGenotype(fatherGenotype, trait);
        const motherAlleles = this.stringToGenotype(motherGenotype, trait);

        const fatherGametes = this.createGametes(fatherAlleles);
        const motherGametes = this.createGametes(motherAlleles);

        const punnettSquare = this.createPunnettSquare(fatherGametes, motherGametes, trait);
        const genotypeDistribution = this.calculateGenotypeDistribution(punnettSquare);
        const phenotypeDistribution = this.calculatePhenotypeDistribution(genotypeDistribution, trait);

        return {
            trait,
            father: fatherGenotype,
            mother: motherGenotype,
            fatherGametes,
            motherGametes,
            punnettSquare,
            genotypeDistribution,
            phenotypeDistribution,
            genotypePercentages: this.probabilitiesToPercentages(genotypeDistribution),
            phenotypePercentages: this.probabilitiesToPercentages(phenotypeDistribution),
            warnings: [],
            metadata: {
                engine: "Virtual Genetics Lab",
                version: "0.1.0",
                inheritance: trait.inheritance
            }
        };
    },

    performXLinkedCross(trait, parent1Genotype, parent2Genotype, parent1Sex, parent2Sex) {
        this.validateTrait(trait);

        if (!this.isXLinkedTrait(trait)) {
            throw new Error("Το trait δεν είναι φυλοσύνδετο.");
        }

        if (parent1Sex !== "male" && parent1Sex !== "female") {
            throw new Error("Μη έγκυρο φύλο για τον Γονέα 1.");
        }

        if (parent2Sex !== "male" && parent2Sex !== "female") {
            throw new Error("Μη έγκυρο φύλο για τον Γονέα 2.");
        }

        if (parent1Sex === parent2Sex) {
            throw new Error("Για φυλοσύνδετο trait οι δύο γονείς πρέπει να έχουν διαφορετικό φύλο.");
        }

        const maleGenotype = parent1Sex === "male" ? parent1Genotype : parent2Genotype;
        const femaleGenotype = parent1Sex === "female" ? parent1Genotype : parent2Genotype;

        this.validateXLinkedGenotype(maleGenotype, "male", trait);
        this.validateXLinkedGenotype(femaleGenotype, "female", trait);

        const maleAlleles = this.stringToGenotype(maleGenotype, trait);
        const femaleAlleles = this.stringToGenotype(femaleGenotype, trait);

        const maleGametes = this.createXLinkedGametes(maleAlleles, "male", trait);
        const femaleGametes = this.createXLinkedGametes(femaleAlleles, "female", trait);

        const punnettSquare = this.createPunnettSquare(maleGametes, femaleGametes, trait);
        const genotypeDistribution = this.calculateGenotypeDistribution(punnettSquare);
        const phenotypeDistribution = this.calculatePhenotypeDistribution(genotypeDistribution, trait);

        return {
            trait,
            parent1: parent1Genotype,
            parent2: parent2Genotype,
            parent1Sex,
            parent2Sex,
            father: maleGenotype,
            mother: femaleGenotype,
            fatherSex: "male",
            motherSex: "female",
            fatherGametes: maleGametes,
            motherGametes: femaleGametes,
            punnettSquare,
            genotypeDistribution,
            phenotypeDistribution,
            genotypePercentages: this.probabilitiesToPercentages(genotypeDistribution),
            phenotypePercentages: this.probabilitiesToPercentages(phenotypeDistribution),
            warnings: [],
            metadata: {
                engine: "Virtual Genetics Lab",
                version: "0.1.0",
                inheritance: trait.inheritance,
                mode: "x-linked"
            }
        };
    },

    createDihybridGametes(trait1, genotype1, trait2, genotype2) {
        this.validateTrait(trait1);
        this.validateTrait(trait2);
        this.validateGenotype(genotype1, trait1);
        this.validateGenotype(genotype2, trait2);

        const alleles1 = this.stringToGenotype(genotype1, trait1);
        const alleles2 = this.stringToGenotype(genotype2, trait2);

        const gametes = [];
        for (const allele1 of alleles1) {
            for (const allele2 of alleles2) {
                const key = allele1 + allele2;
                const existing = gametes.find(g => g.key === key);
                if (existing) {
                    existing.probability += 0.25;
                } else {
                    gametes.push({
                        key,
                        alleles: [allele1, allele2],
                        probability: 0.25
                    });
                }
            }
        }
        return gametes;
    },

    performDihybridCross(trait1, genotype11, genotype12, trait2, genotype21, genotype22) {
        this.validateTrait(trait1);
        this.validateTrait(trait2);

        if (trait1.id === trait2.id) {

            throw new Error("Στον διϋβριδισμό πρέπει να επιλέξετε δύο διαφορετικά traits.");
        }

        if (this.isXLinkedTrait(trait1) || this.isXLinkedTrait(trait2)) {
            throw new Error("Η παρούσα έκδοση του διϋβριδισμού υποστηρίζει μόνο αυτοσωμικά traits.");
        }

        this.validateGenotype(genotype11, trait1);
        this.validateGenotype(genotype12, trait2);
        this.validateGenotype(genotype21, trait1);
        this.validateGenotype(genotype22, trait2);

        const parent1Gametes = this.createDihybridGametes(trait1, genotype11, trait2, genotype12);
        const parent2Gametes = this.createDihybridGametes(trait1, genotype21, trait2, genotype22);

        const punnettSquare = [];
        for (const parent2Gamete of parent2Gametes) {
            const row = [];
            for (const parent1Gamete of parent1Gametes) {
                const trait1Alleles = [parent1Gamete.alleles[0], parent2Gamete.alleles[0]];
                const trait2Alleles = [parent1Gamete.alleles[1], parent2Gamete.alleles[1]];

                const normalizedTrait1 = this.normalizeGenotype(trait1Alleles, trait1);
                const normalizedTrait2 = this.normalizeGenotype(trait2Alleles, trait2);

                const genotype1 = this.genotypeToString(normalizedTrait1);
                const genotype2 = this.genotypeToString(normalizedTrait2);

                const genotypeString = genotype1 + genotype2;

                row.push({
                    genotype: [normalizedTrait1, normalizedTrait2],
                    genotypeString,
                    probability: parent1Gamete.probability * parent2Gamete.probability,
                    phenotype: null
                });
            }
            punnettSquare.push(row);
        }

        const genotypeDistribution = {};
        const cells = punnettSquare.flat();

        for (const cell of cells) {
            const genotype = cell.genotypeString;
            if (!genotypeDistribution[genotype]) {
                genotypeDistribution[genotype] = { count: 0, probability: 0 };
            }
            genotypeDistribution[genotype].count++;
            genotypeDistribution[genotype].probability += cell.probability;
        }

        const phenotypeDistribution = {};
        for (const genotype in genotypeDistribution) {
            const alleles1 = this.stringToGenotype(genotype.substring(0, 2), trait1);
            const genotype1 = this.genotypeToString(this.normalizeGenotype(alleles1, trait1));

            const alleles2 = this.stringToGenotype(genotype.substring(2), trait2);
            const genotype2 = this.genotypeToString(this.normalizeGenotype(alleles2, trait2));

            const definition1 = trait1.genotypeDefinitions.find(g => g.genotype === genotype1);
            const definition2 = trait2.genotypeDefinitions.find(g => g.genotype === genotype2);

            if (!definition1 || !definition2) {
                console.warn(`Δεν βρέθηκε ο συνδυασμένος γονότυπος ${genotype}.`);
                continue;
            }

            const phenotype = definition1.phenotype + " + " + definition2.phenotype;

            if (!phenotypeDistribution[phenotype]) {
                phenotypeDistribution[phenotype] = { count: 0, probability: 0 };
            }
            phenotypeDistribution[phenotype].count += genotypeDistribution[genotype].count;
            phenotypeDistribution[phenotype].probability += genotypeDistribution[genotype].probability;
        }

        return {
            trait1,
            trait2,
            parent1: { trait1: genotype11, trait2: genotype12 },
            parent2: { trait1: genotype21, trait2: genotype22 },
            parent1Gametes,
            parent2Gametes,
            punnettSquare,
            genotypeDistribution,
            phenotypeDistribution,
            genotypePercentages: this.probabilitiesToPercentages(genotypeDistribution),
            phenotypePercentages: this.probabilitiesToPercentages(phenotypeDistribution),
            warnings: [],
            metadata: {
                engine: "Virtual Genetics Lab",
                version: "0.1.0",
                mode: "dihybrid",
                inheritance: "autosomal"
            }
        };
    }
};