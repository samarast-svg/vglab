/**
 * ==========================================================
 * Virtual Genetics Lab
 * ----------------------------------------------------------
 * File: ui.js
 * Version: 0.1.0
 * License: MIT
 * ==========================================================
 */
"use strict";

const UI = {

    elements: {},

    initialize() {
        this.elements = {
            modeMonohybridButton: document.getElementById("modeMonohybridButton"),
            modeDihybridButton: document.getElementById("modeDihybridButton"),
            monohybridPanel: document.getElementById("monohybridPanel"),
            dihybridPanel: document.getElementById("dihybridPanel"),
            resultsPanel: document.getElementById("resultsPanel"),
            resultsTitle: document.getElementById("resultsTitle"),
            monohybridResultsPanel: document.getElementById("monohybridResultsPanel"),
            dihybridResultsPanel: document.getElementById("dihybridResultsPanel"),

            // Monohybrid
            traitSelect: document.getElementById("traitSelect"),
            fatherGenotype: document.getElementById("fatherGenotype"),
            motherGenotype: document.getElementById("motherGenotype"),
            parent1Sex: document.getElementById("parent1Sex"),
            parent2Sex: document.getElementById("parent2Sex"),
            crossButton: document.getElementById("crossButton"),
            traitInfo: document.getElementById("traitInfo"),
            fatherGametes: document.getElementById("fatherGametes"),
            motherGametes: document.getElementById("motherGametes"),
            punnettContainer: document.getElementById("punnettContainer"),
            genotypeTable: document.querySelector("#genotypeTable tbody"),
            phenotypeTable: document.querySelector("#phenotypeTable tbody"),
            summary: document.getElementById("summary"),

            // Dihybrid
            dihybridTrait1: document.getElementById("dihybridTrait1"),
            dihybridTrait2: document.getElementById("dihybridTrait2"),
            parent1DihybridGenotype1: document.getElementById("parent1DihybridGenotype1"),
            parent1DihybridGenotype2: document.getElementById("parent1DihybridGenotype2"),
            parent2DihybridGenotype1: document.getElementById("parent2DihybridGenotype1"),
            parent2DihybridGenotype2: document.getElementById("parent2DihybridGenotype2"),
            dihybridCrossButton: document.getElementById("dihybridCrossButton"),
            parent1DihybridGametes: document.getElementById("parent1DihybridGametes"),
            parent2DihybridGametes: document.getElementById("parent2DihybridGametes"),
            dihybridPunnettContainer: document.getElementById("dihybridPunnettContainer"),
            dihybridGenotypeTable: document.querySelector("#dihybridGenotypeTable tbody"),
            dihybridPhenotypeTable: document.querySelector("#dihybridPhenotypeTable tbody"),
            dihybridSummary: document.getElementById("dihybridSummary")
        };
    },

    setMode(mode) {
        const isMonohybrid = mode === "monohybrid";
        const isDihybrid = mode === "dihybrid";

        if (this.elements.monohybridPanel) {
            this.elements.monohybridPanel.style.display = isMonohybrid ? "block" : "none";
        }
        if (this.elements.dihybridPanel) {
            this.elements.dihybridPanel.style.display = isDihybrid ? "block" : "none";
        }

        if (this.elements.modeMonohybridButton) {
            this.elements.modeMonohybridButton.classList.toggle("active", isMonohybrid);
            this.elements.modeMonohybridButton.setAttribute("aria-pressed", isMonohybrid ? "true" : "false");
        }
        if (this.elements.modeDihybridButton) {
            this.elements.modeDihybridButton.classList.toggle("active", isDihybrid);
            this.elements.modeDihybridButton.setAttribute("aria-pressed", isDihybrid ? "true" : "false");
        }

        this.clearResults();
        this.clearDihybridResults();

        if (this.elements.resultsPanel) {
            this.elements.resultsPanel.style.display = "none";
        }
    },

    showResultsPanel(mode) {
        if (!this.elements.resultsPanel) return;

        if (this.elements.resultsTitle) {
            this.elements.resultsTitle.textContent = mode === "dihybrid"
                ? "Αποτελέσματα διϋβριδισμού"
                : "Αποτελέσματα μονοϋβριδισμού";
        }

        if (mode === "dihybrid") {
            if (this.elements.monohybridResultsPanel) this.elements.monohybridResultsPanel.style.display = "none";
            if (this.elements.dihybridResultsPanel) this.elements.dihybridResultsPanel.style.display = "block";
        } else {
            if (this.elements.monohybridResultsPanel) this.elements.monohybridResultsPanel.style.display = "block";
            if (this.elements.dihybridResultsPanel) this.elements.dihybridResultsPanel.style.display = "none";
        }

        this.elements.resultsPanel.style.display = "block";
    },

    populateTraitSelect(traits) {
        const select = this.elements.traitSelect;
        if (!select) return;

        select.innerHTML = "";
        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.textContent = "-- Επιλέξτε trait --";
        select.appendChild(firstOption);

        traits.forEach(trait => {
            const option = document.createElement("option");
            option.value = trait.id;
            option.textContent = trait.name;
            select.appendChild(option);
        });
    },

    populateGenotypeSelects(trait) {
        const parent1 = this.elements.fatherGenotype;
        const parent2 = this.elements.motherGenotype;
        if (!parent1 || !parent2) return;

        parent1.innerHTML = "";
        parent2.innerHTML = "";

        if (!trait || !Array.isArray(trait.genotypeDefinitions)) return;

        trait.genotypeDefinitions.forEach(definition => {
            const option1 = document.createElement("option");
            option1.value = definition.genotype;
            option1.textContent = definition.genotype;
            parent1.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = definition.genotype;
            option2.textContent = definition.genotype;
            parent2.appendChild(option2);
        });
    },

    renderTraitInfo(trait) {
        const container = this.elements.traitInfo;
        if (!container || !trait) return;

        let html = `<h3>${trait.name}</h3>`;
        if (trait.description) html += `<p>${trait.description}</p>`;
        if (trait.inheritance) html += `<p><strong>Τύπος κληρονόμησης:</strong> ${trait.inheritance}</p>`;
        if (trait.dominance) html += `<p><strong>Είδος επικράτησης:</strong> ${trait.dominance}</p>`;

        if (Array.isArray(trait.alleles)) {
            html += "<hr><h4>Αλληλόμορφα</h4><ul>";
            trait.alleles.forEach(allele => {
                html += `<li><strong>${allele.symbol}</strong> - ${allele.label}</li>`;
            });
            html += "</ul>";
        }
        container.innerHTML = html;
    },

    validateParentSexes(trait) {
        if (!trait) throw new Error("Δεν έχει επιλεγεί trait.");
        if (!Genetics.isXLinkedTrait(trait)) return true;

        const parent1Sex = this.elements.parent1Sex ? this.elements.parent1Sex.value : "";
        const parent2Sex = this.elements.parent2Sex ? this.elements.parent2Sex.value : "";

        if (!parent1Sex || !parent2Sex) {
            throw new Error("Για φυλοσύνδετο trait πρέπει να επιλέξετε το φύλο και των δύο γονέων.");
        }
        if (parent1Sex === parent2Sex) {
            throw new Error("Για φυλοσύνδετο trait οι δύο γονείς πρέπει να έχουν διαφορετικό φύλο.");
        }
        return true;
    },

    renderGametes(parent1Gametes, parent2Gametes) {
        if (this.elements.fatherGametes) this.elements.fatherGametes.innerHTML = "";
        if (this.elements.motherGametes) this.elements.motherGametes.innerHTML = "";

        if (Array.isArray(parent1Gametes)) {
            parent1Gametes.forEach(gamete => {
                const p = document.createElement("p");
                p.textContent = `${gamete.alleles.join("")} (${gamete.probability * 100}%)`;
                this.elements.fatherGametes.appendChild(p);
            });
        }
        if (Array.isArray(parent2Gametes)) {
            parent2Gametes.forEach(gamete => {
                const p = document.createElement("p");
                p.textContent = `${gamete.alleles.join("")} (${gamete.probability * 100}%)`;
                this.elements.motherGametes.appendChild(p);
            });
        }
    },

    clearResults() {
        if (this.elements.fatherGametes) this.elements.fatherGametes.innerHTML = "-";
        if (this.elements.motherGametes) this.elements.motherGametes.innerHTML = "-";
        if (this.elements.punnettContainer) this.elements.punnettContainer.innerHTML = "";
        if (this.elements.genotypeTable) this.elements.genotypeTable.innerHTML = "";
        if (this.elements.phenotypeTable) this.elements.phenotypeTable.innerHTML = "";
        if (this.elements.summary) this.elements.summary.innerHTML = "Δεν υπάρχουν ακόμη αποτελέσματα.";
    },

    renderPunnettSquare(result) {
        const container = this.elements.punnettContainer;
        if (!container) return;
        container.innerHTML = "";

        const table = document.createElement("table");
        table.className = "punnett-table";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.appendChild(document.createElement("th"));

        result.fatherGametes.forEach(gamete => {
            const th = document.createElement("th");
            th.textContent = gamete.alleles.join("");
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        result.punnettSquare.forEach((row, rowIndex) => {
            const tr = document.createElement("tr");
            const rowHeader = document.createElement("th");
            rowHeader.textContent = result.motherGametes[rowIndex].alleles.join("");
            tr.appendChild(rowHeader);

            row.forEach(cell => {
                const td = document.createElement("td");
                td.textContent = cell.genotypeString;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    },

    renderGenotypeTable(result) {
        const tbody = this.elements.genotypeTable;
        if (!tbody) return;
        tbody.innerHTML = "";

        for (const genotype in result.genotypeDistribution) {
            const data = result.genotypeDistribution[genotype];
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${genotype}</td>
                <td>${data.count}</td>
                <td>${data.probability}</td>
                <td>${result.genotypePercentages[genotype]}%</td>
            `;
            tbody.appendChild(tr);
        }
    },

    renderPhenotypeTable(result) {
        const tbody = this.elements.phenotypeTable;
        if (!tbody) return;
        tbody.innerHTML = "";

        for (const phenotype in result.phenotypeDistribution) {
            const data = result.phenotypeDistribution[phenotype];
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${phenotype}</td>
                <td>${data.count}</td>
                <td>${data.probability}</td>
                <td>${result.phenotypePercentages[phenotype]}%</td>
            `;
            tbody.appendChild(tr);
        }
    },

    renderSummary(result) {
        if (!this.elements.summary) return;
        const total = result.punnettSquare.flat().length;
        this.elements.summary.innerHTML = `<p>Παρήχθησαν ${total} πιθανοί απόγονοι.</p>`;
    },

    populateDihybridTraitSelects(traits) {
        const select1 = this.elements.dihybridTrait1;
        const select2 = this.elements.dihybridTrait2;
        if (!select1 || !select2) return;

        select1.innerHTML = "";
        select2.innerHTML = "";

        const option1 = document.createElement("option");
        option1.value = "";
        option1.textContent = "-- Επιλέξτε trait 1 --";
        select1.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = "";
        option2.textContent = "-- Επιλέξτε trait 2 --";
        select2.appendChild(option2);

        traits
            .filter(trait => !Genetics.isXLinkedTrait(trait))
            .forEach(trait => {
                const optionA = document.createElement("option");
                optionA.value = trait.id;
                optionA.textContent = trait.name;
                select1.appendChild(optionA);

                const optionB = document.createElement("option");
                optionB.value = trait.id;
                optionB.textContent = trait.name;
                select2.appendChild(optionB);
            });
    },

    populateSingleGenotypeSelect(select, trait) {
        if (!select) return;
        select.innerHTML = "";

        if (!trait || !Array.isArray(trait.genotypeDefinitions)) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "-- Επιλέξτε trait --";
            select.appendChild(option);
            return;
        }

        trait.genotypeDefinitions.forEach(definition => {
            const option = document.createElement("option");
            option.value = definition.genotype;
            option.textContent = definition.genotype;
            select.appendChild(option);
        });
    },

    populateDihybridGenotypeSelectsTrait1(trait) {
        this.populateSingleGenotypeSelect(this.elements.parent1DihybridGenotype1, trait);
        this.populateSingleGenotypeSelect(this.elements.parent2DihybridGenotype1, trait);
    },

    populateDihybridGenotypeSelectsTrait2(trait) {
        this.populateSingleGenotypeSelect(this.elements.parent1DihybridGenotype2, trait);
        this.populateSingleGenotypeSelect(this.elements.parent2DihybridGenotype2, trait);
    },

    validateDihybridTraits(trait1, trait2) {
        if (!trait1) throw new Error("Πρέπει να επιλέξετε το πρώτο trait.");
        if (!trait2) throw new Error("Πρέπει να επιλέξετε το δεύτερο trait.");
        if (trait1.id === trait2.id) throw new Error("Τα δύο traits πρέπει να είναι διαφορετικά.");
        if (Genetics.isXLinkedTrait(trait1) || Genetics.isXLinkedTrait(trait2)) {
            throw new Error("Η παρούσα έκδοση του διϋβριδισμού υποστηρίζει μόνο αυτοσωμικά traits.");
        }
        return true;
    },

    clearDihybridResults() {
        if (this.elements.parent1DihybridGametes) this.elements.parent1DihybridGametes.innerHTML = "-";
        if (this.elements.parent2DihybridGametes) this.elements.parent2DihybridGametes.innerHTML = "-";
        if (this.elements.dihybridPunnettContainer) this.elements.dihybridPunnettContainer.innerHTML = "";
        if (this.elements.dihybridGenotypeTable) this.elements.dihybridGenotypeTable.innerHTML = "";
        if (this.elements.dihybridPhenotypeTable) this.elements.dihybridPhenotypeTable.innerHTML = "";
        if (this.elements.dihybridSummary) this.elements.dihybridSummary.innerHTML = "Δεν υπάρχουν ακόμη αποτελέσματα.";
    },

    renderDihybridGametes(parent1Gametes, parent2Gametes) {
        const container1 = this.elements.parent1DihybridGametes;
        const container2 = this.elements.parent2DihybridGametes;
        if (!container1 || !container2) return;

        container1.innerHTML = "";
        container2.innerHTML = "";

        if (Array.isArray(parent1Gametes)) {
            parent1Gametes.forEach(gamete => {
                const p = document.createElement("p");
                p.textContent = `${gamete.alleles.join("")} (${gamete.probability * 100}%)`;
                container1.appendChild(p);
            });
        }
        if (Array.isArray(parent2Gametes)) {
            parent2Gametes.forEach(gamete => {
                const p = document.createElement("p");
                p.textContent = `${gamete.alleles.join("")} (${gamete.probability * 100}%)`;
                container2.appendChild(p);
            });
        }
    },

    renderDihybridPunnettSquare(result) {
        const container = this.elements.dihybridPunnettContainer;
        if (!container) return;
        container.innerHTML = "";

        const table = document.createElement("table");
        table.className = "punnett-table";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.appendChild(document.createElement("th"));

        result.parent1Gametes.forEach(gamete => {
            const th = document.createElement("th");
            th.textContent = gamete.alleles.join("");
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        result.punnettSquare.forEach((row, rowIndex) => {
            const tr = document.createElement("tr");
            const rowHeader = document.createElement("th");
            rowHeader.textContent = result.parent2Gametes[rowIndex].alleles.join("");
            tr.appendChild(rowHeader);

            row.forEach(cell => {
                const td = document.createElement("td");
                td.textContent = cell.genotypeString;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    },

    renderDihybridGenotypeTable(result) {
        const tbody = this.elements.dihybridGenotypeTable;
        if (!tbody) return;
        tbody.innerHTML = "";

        for (const genotype in result.genotypeDistribution) {
            const data = result.genotypeDistribution[genotype];
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${genotype}</td>
                <td>${data.count}</td>
                <td>${data.probability}</td>
                <td>${result.genotypePercentages[genotype]}%</td>
            `;
            tbody.appendChild(tr);
        }
    },

    renderDihybridPhenotypeTable(result) {
        const tbody = this.elements.dihybridPhenotypeTable;
        if (!tbody) return;
        tbody.innerHTML = "";

        for (const phenotype in result.phenotypeDistribution) {
            const data = result.phenotypeDistribution[phenotype];
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${phenotype}</td>
                <td>${data.count}</td>
                <td>${data.probability}</td>
                <td>${result.phenotypePercentages[phenotype]}%</td>
            `;
            tbody.appendChild(tr);
        }
    },

    renderDihybridSummary(result) {
        if (!this.elements.dihybridSummary) return;
        const total = result.punnettSquare.flat().length;
        this.elements.dihybridSummary.innerHTML = `<p>Παρήχθησαν ${total} πιθανοί συνδυασμοί απογόνων.</p>`;
    },

    renderDihybridResults(result) {
        this.renderDihybridGametes(result.parent1Gametes, result.parent2Gametes);
        this.renderDihybridPunnettSquare(result);
        this.renderDihybridGenotypeTable(result);
        this.renderDihybridPhenotypeTable(result);
        this.renderDihybridSummary(result);
    },

    showError(message) {
        alert(message);
    }
};