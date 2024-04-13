import {api2HmNodes, getDroppedReasonStr} from "hmcomponent"

function clearErrors() {
    let errorDiv = document.querySelector("#error-div")
    errorDiv.innerHTML = ""
}

function reportError(err) {
    let errorDiv = document.querySelector("#error-div")
    const errNode = document.createElement("div");
    errNode.classList.add("error-message")
    errNode.textContent = err
    errorDiv.appendChild(errNode)
}

window.loadHarrisMatrix = function (jsonDataStr) {
    let jsonData = {}
    try {
        jsonData = JSON.parse(jsonDataStr)
    }catch(e) {
        reportError("The stratigraphic data cannot be parsed. It isn't valid JSON.")
        alert("The stratigraphic data cannot be parsed. It isn't valid JSON.")
        reportError(jsonDataStr)
        return
    }
    clearErrors()
    // reportError("loadHarrisMatrix")
    try {
        if (jsonData.hasOwnProperty("relations") && jsonData.hasOwnProperty("loci")) {
            let hm = document.querySelector("#hmcomponent")
            const droppedRelations = []
            const nodes = [...api2HmNodes(jsonData.relations, jsonData.loci, droppedRelations)]
            if (droppedRelations.length > 0) {
                let errRelations = ""
                for (let r of droppedRelations) {
                    let errType = getDroppedReasonStr(r.reason)
                    errRelations += `\n"${r.locusRelation.arch_context}" ${r.locusRelation.relation_type} "${r.locusRelation.related_arch_context}" (${errType})`
                }
                reportError(`${droppedRelations.length} stratigraphic ${droppedRelations.length > 1 ? "relations have been dropped because they were incomplete." : "relation has been dropped because it was incomplete."}${errRelations}`)
            }
            hm.hmNodes = nodes
        } else {
            reportError("The stratigraphic data is not structured as expected. Matrix can't be rendered.")
        }
    } catch(e) {
        reportError(`Error rendering stratigraphic data: ${e}`)
    }
    // reportError("Done loadHarrisMatrix")
}

if (import.meta.env.VITE_MODE !== "DEVELOPMENT") {
    window.addEventListener("load", () => {
        // reportError("hm component ready")
        setTimeout(() => {
            try {
                FileMaker.PerformScript("hmComponentReady")
            } catch(e) {
                reportError(`Error calling FileMaker: ${e}`)
            }
        },500);
    })
}
