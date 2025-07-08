
// // backend/src/routes/graph.ts
// import { Router } from 'express';
// import { config } from '../config';

// const router = Router();
// const SKG = 'http://semantic-knowledge-graph.org/ontology#';

// const parseSparqlResultsForReactFlow = (bindings: any[]) => {
//     const nodes = new Map();
//     const edges = new Map();

//     bindings.forEach(binding => {
//         if (!binding.source || !binding.target || !binding.rel) return;
//         const sourceId = binding.source.value;
//         const targetId = binding.target.value;

//         if (!nodes.has(sourceId)) {
//             nodes.set(sourceId, {
//                 id: sourceId,
//                 data: { label: binding.sourceName.value },
//                 type: 'custom',
//                 position: { x: Math.random() * 500, y: Math.random() * 300 },
//             });
//         }
//         if (!nodes.has(targetId)) {
//             nodes.set(targetId, {
//                 id: targetId,
//                 data: { label: binding.targetName.value },
//                 type: 'custom',
//                 position: { x: Math.random() * 500, y: Math.random() * 300 },
//             });
//         }
        
//         const edgeId = `${sourceId}-${binding.rel.value}-${targetId}`;
//         if (!edges.has(edgeId)) {
//              edges.set(edgeId, {
//                 id: edgeId,
//                 source: sourceId,
//                 target: targetId,
//                 label: binding.rel.value.replace(SKG, ''),
//             });
//         }
//     });
//     return { nodes: Array.from(nodes.values()), edges: Array.from(edges.values()) };
// };


// router.get('/data', async (req, res) => {
//     console.log('[GRAPH] /data endpoint hit');
    
//     const sparqlQuery = `
//       PREFIX skg: <${SKG}>
//       PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
//       SELECT ?source ?sourceName ?sourceType ?rel ?target ?targetName ?targetType
//       WHERE {
//         ?source ?rel ?target .
//         ?source skg:hasName ?sourceName .
//         ?target skg:hasName ?targetName .
//         ?source rdf:type ?sourceType .
//         ?target rdf:type ?targetType .
//         FILTER(?rel != skg:hasName && ?rel != rdf:type)
//       }
//     `;

//     try {
//         const queryParams = new URLSearchParams({ query: sparqlQuery });
//         const requestUrl = `${config.databaseUrl}?${queryParams}`;

//         const response = await fetch(requestUrl, {
//             method: 'GET',
//             headers: { 'Accept': 'application/sparql-results+json' }
//         });

//         if (!response.ok) {
//             const errorBody = await response.text();
//             throw new Error(`Database query failed with status: ${response.status} - ${errorBody}`);
//         }

//         const results = await response.json();
//         console.log(`[GRAPH] Bindings received from DB: ${results.results.bindings.length}`);

//         const graphData = parseSparqlResultsForReactFlow(results.results.bindings);
//         console.log(`[GRAPH] Parsed graph data: nodes=${graphData.nodes.length}, edges=${graphData.edges.length}`);

//         res.json(graphData);

//     } catch (error: any) {
//         console.error('Failed to fetch graph data:', error);
//         res.status(500).json({ message: 'Failed to fetch graph data', error: error.message });
//     }
// });

// export default router;

// backend/src/routes/graph.ts
import { Router } from 'express';
import { config } from '../config';

const router = Router();
const SKG = 'http://semantic-knowledge-graph.org/ontology#';

const parseSparqlResultsForReactFlow = (bindings: any[]) => {
    const nodes = new Map();
    const edges = new Map();

    bindings.forEach(binding => {
        if (!binding.source || !binding.target || !binding.rel) return;
        const sourceId = binding.source.value;
        const targetId = binding.target.value;

        if (!nodes.has(sourceId)) {
            nodes.set(sourceId, {
                id: sourceId,
                data: { label: binding.sourceName.value },
                type: 'custom',
                position: { x: Math.random() * 500, y: Math.random() * 300 },
            });
        }
        if (!nodes.has(targetId)) {
            nodes.set(targetId, {
                id: targetId,
                data: { label: binding.targetName.value },
                type: 'custom',
                position: { x: Math.random() * 500, y: Math.random() * 300 },
            });
        }
        
        const edgeId = `${sourceId}-${binding.rel.value}-${targetId}`;
        if (!edges.has(edgeId)) {
             edges.set(edgeId, {
                id: edgeId,
                source: sourceId,
                target: targetId,
                label: binding.rel.value.replace(SKG, ''),
            });
        }
    });
    return { nodes: Array.from(nodes.values()), edges: Array.from(edges.values()) };
};


router.get('/data', async (req, res) => {
    console.log('[GRAPH] /data endpoint hit');
    
    const sparqlQuery = `
      PREFIX skg: <${SKG}>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      SELECT ?source ?sourceName ?sourceType ?rel ?target ?targetName ?targetType
      WHERE {
        ?source ?rel ?target .
        ?source skg:hasName ?sourceName .
        ?target skg:hasName ?targetName .
        ?source rdf:type ?sourceType .
        ?target rdf:type ?targetType .
        FILTER(?rel != skg:hasName && ?rel != rdf:type)
      }
    `;

    try {
        const queryParams = new URLSearchParams({ query: sparqlQuery });
        const requestUrl = `${config.databaseUrl}?${queryParams}`;

        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/sparql-results+json' }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Database query failed with status: ${response.status} - ${errorBody}`);
        }

        const results = await response.json();
        console.log(`[GRAPH] Bindings received from DB: ${results.results.bindings.length}`);

        const graphData = parseSparqlResultsForReactFlow(results.results.bindings);
        console.log(`[GRAPH] Parsed graph data: nodes=${graphData.nodes.length}, edges=${graphData.edges.length}`);

        res.json(graphData);

    } catch (error: any) {
        console.error('Failed to fetch graph data:', error);
        res.status(500).json({ message: 'Failed to fetch graph data', error: error.message });
    }
});

export default router;