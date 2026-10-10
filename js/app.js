/**
 * ==========================================================
 * Virtual Genetics Lab
 * ----------------------------------------------------------
 * File: app.js
 * Version: 0.1.0
 * License: MIT
 * ==========================================================
 */

"use strict";

const App = {
    traits: [],
    currentTrait: null,
    currentDihybridTrait1: null,
    currentDihybridTrait2: null,

    initialize() {
        try {
            UI.initialize();
            this.loadTraits();

            UI.populateTraitSelect(this.traits);
            UI.populateDihybridTraitSelects(this.traits);

            // Αρχική λειτουργία: Μονοϋβριδισμός
            UI.setMode("monohybrid");

            this.registerEvents();

        } catch (error) {
            console.error(error);
            UI.showError(error.message);
        }
    },

    loadTraits() {
        this.traits = TRAITS;
    },

    registerEvents() {

        // -----------------------------------------
        // MODE TOGGLE
        // -----------------------------------------

        UI.elements.modeMonohybridButton.addEventListener(
            "click",
            () => {
                UI.setMode("monohybrid");
            }
        );

        UI.elements.modeDihybridButton.addEventListener(
            "click",
            () => {
                UI.setMode("dihybrid");
            }
        );


        // -----------------------------------------
        // MONOHYBRIDISM
        // -----------------------------------------

        UI.elements.traitSelect.addEventListener(
            "change",
            () => this.onTraitChanged()
        );

        UI.elements.crossButton.addEventListener(
            "click",
            () => this.performCross()
        );


        // -----------------------------------------
        // DIHYBRIDISM
        // -----------------------------------------

        UI.elements.dihybridTrait1.addEventListener(
            "change",
            () => this.onDihybridTrait1Changed()
        );

        UI.elements.dihybridTrait2.addEventListener(
            "change",
            () => this.onDihybridTrait2Changed()
        );

        UI.elements.dihybridCrossButton.addEventListener(
            "click",
            () => this.performDihybridCross()
        );
    },


    // =====================================================
    // MONOHYBRIDISM
    // =====================================================

    onTraitChanged() {

        const id = UI.elements.traitSelect.value;

        UI.clearResults();

        this.currentTrait = this.traits.find(
            trait => trait.id === id
        );

        if (!this.currentTrait) {
            return;
        }

        UI.renderTraitInfo(this.currentTrait);

        UI.populateGenotypeSelects(
            this.currentTrait
        );


        // -----------------------------------------
        // X-LINKED TRAITS
        // -----------------------------------------

        if (
            UI.elements.parent1Sex &&
            UI.elements.parent2Sex
        ) {

            if (
                Genetics.isXLinkedTrait(
                    this.currentTrait
                )
            ) {

                UI.elements.parent1Sex.disabled = false;
                UI.elements.parent2Sex.disabled = false;

            } else {

                UI.elements.parent1Sex.value = "";
                UI.elements.parent2Sex.value = "";

                UI.elements.parent1Sex.disabled = true;
                UI.elements.parent2Sex.disabled = true;
            }
        }
    },


    performCross() {

        if (!this.currentTrait) {

            UI.showError(
                "Δεν έχει επιλεγεί χαρακτηριστικό."
            );

            return;
        }


        try {

            const parent1Genotype =
                UI.elements.fatherGenotype.value;

            const parent2Genotype =
                UI.elements.motherGenotype.value;


            // -----------------------------------------
            // X-LINKED CROSS
            // -----------------------------------------

            if (
                Genetics.isXLinkedTrait(
                    this.currentTrait
                )
            ) {

                UI.validateParentSexes(
                    this.currentTrait
                );

                const parent1Sex =
                    UI.elements.parent1Sex.value;

                const parent2Sex =
                    UI.elements.parent2Sex.value;


                const result =
                    Genetics.performXLinkedCross(
                        this.currentTrait,
                        parent1Genotype,
                        parent2Genotype,
                        parent1Sex,
                        parent2Sex
                    );


                // Εμφάνιση αποτελεσμάτων
                UI.showResultsPanel(
                    "monohybrid"
                );

                UI.renderGametes(
                    result.fatherGametes,
                    result.motherGametes
                );

                UI.renderPunnettSquare(
                    result
                );

                UI.renderGenotypeTable(
                    result
                );

                UI.renderPhenotypeTable(
                    result
                );

                UI.renderSummary(
                    result
                );

                return;
            }


            // -----------------------------------------
            // AUTOSOMAL CROSS
            // -----------------------------------------

            const result =
                Genetics.performCross(
                    this.currentTrait,
                    parent1Genotype,
                    parent2Genotype
                );


            // Εμφάνιση αποτελεσμάτων
            UI.showResultsPanel(
                "monohybrid"
            );

            UI.renderGametes(
                result.fatherGametes,
                result.motherGametes
            );

            UI.renderPunnettSquare(
                result
            );

            UI.renderGenotypeTable(
                result
            );

            UI.renderPhenotypeTable(
                result
            );

            UI.renderSummary(
                result
            );

        } catch (error) {

            console.error(error);

            UI.showError(
                error.message
            );
        }
    },


    // =====================================================
    // DIHYBRIDISM
    // =====================================================

    onDihybridTrait1Changed() {

        const id =
            UI.elements.dihybridTrait1.value;

        UI.clearDihybridResults();


        this.currentDihybridTrait1 =
            this.traits.find(
                trait => trait.id === id
            );


        if (!this.currentDihybridTrait1) {

            UI.populateDihybridGenotypeSelectsTrait1(
                null
            );

            return;
        }


        // -----------------------------------------
        // CHECK FOR SAME TRAIT
        // -----------------------------------------

        if (
            this.currentDihybridTrait2 &&
            this.currentDihybridTrait1.id ===
                this.currentDihybridTrait2.id
        ) {

            UI.showError(
                "Τα δύο traits πρέπει να είναι διαφορετικά."
            );

            UI.elements.dihybridTrait1.value = "";

            this.currentDihybridTrait1 = null;

            UI.populateDihybridGenotypeSelectsTrait1(
                null
            );

            return;
        }


        UI.populateDihybridGenotypeSelectsTrait1(
            this.currentDihybridTrait1
        );
    },


    onDihybridTrait2Changed() {

        const id =
            UI.elements.dihybridTrait2.value;

        UI.clearDihybridResults();


        this.currentDihybridTrait2 =
            this.traits.find(
                trait => trait.id === id
            );


        if (!this.currentDihybridTrait2) {

            UI.populateDihybridGenotypeSelectsTrait2(
                null
            );

            return;
        }


        // -----------------------------------------
        // CHECK FOR SAME TRAIT
        // -----------------------------------------

        if (
            this.currentDihybridTrait1 &&
            this.currentDihybridTrait1.id ===
                this.currentDihybridTrait2.id
        ) {

            UI.showError(
                "Τα δύο traits πρέπει να είναι διαφορετικά."
            );

            UI.elements.dihybridTrait2.value = "";

            this.currentDihybridTrait2 = null;

            UI.populateDihybridGenotypeSelectsTrait2(
                null
            );

            return;
        }


        UI.populateDihybridGenotypeSelectsTrait2(
            this.currentDihybridTrait2
        );
    },


    // -----------------------------------------
    // PERFORM DIHYBRID CROSS
    // -----------------------------------------

    performDihybridCross() {

        try {

            UI.validateDihybridTraits(
                this.currentDihybridTrait1,
                this.currentDihybridTrait2
            );

            const parent1Genotype1 =
                UI.elements.parent1DihybridGenotype1.value;

            const parent1Genotype2 =
                UI.elements.parent1DihybridGenotype2.value;

            const parent2Genotype1 =
                UI.elements.parent2DihybridGenotype1.value;

            const parent2Genotype2 =
                UI.elements.parent2DihybridGenotype2.value;

            const result =
                Genetics.performDihybridCross(
                    this.currentDihybridTrait1,
                    parent1Genotype1,
                    parent1Genotype2,
                    this.currentDihybridTrait2,
                    parent2Genotype1,
                    parent2Genotype2
                );

            // Εμφάνιση αποτελεσμάτων
            UI.showResultsPanel(
                "dihybrid"
            );

            UI.renderDihybridResults(
                result
            );

        } catch (error) {

            console.error(error);

            UI.showError(
                error.message
            );
        }
    }
};


// =====================================================
// START APPLICATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => App.initialize()
);