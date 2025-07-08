import { Router } from 'express';
import SparqlClient from 'sparql-http-client';
import { config } from '../config';

const router = Router();
const SKG = 'http://semantic-knowledge-graph.org/ontology#';

const parseSparqlResults = (bindings: any[]) => {
    const nodes = new Map();
    const edges = new Set<string>();
    bindings.forEach(binding => {
        if (!binding.source || !binding.target || !binding.rel) return;
        const sourceUri = binding.source.value;
        const targetUri = binding.target.value;
        const relType = binding.rel.value.replace(SKG, '');
        if (!nodes.has(sourceUri)) {
            nodes.set(sourceUri, {
                id: sourceUri,
                data: { label: binding.sourceName.value },
                type: binding.sourceType.value.replace(SKG, ''),
            });
        }
        if (!nodes.has(targetUri)) {
            nodes.set(targetUri, {
                id: targetUri,
                data: { label: binding.targetName.value },
                type: binding.targetType.value.replace(SKG, ''),
            });
        }
        const edgeId = `${sourceUri}|${relType}|${targetUri}`;
        edges.add(edgeId);
    });
    const edgeArray = Array.from(edges).map(edge => {
        const parts = edge.split('|');
        const source = parts[0];
        const target = parts[parts.length - 1];
        const type = parts.slice(1, -1).join('|');
        return { id: edge, source, target, label: type };
    });
    return { nodes: Array.from(nodes.values()), edges: edgeArray };
};

router.get('/data', async (req, res) => {
    // Create a new client for each request
    const client = new SparqlClient({ endpointUrl: config.fusekiUrl });
    const query = `
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
        const stream = await client.query.select(query);
        const bindings: any[] = [];
        stream.on('data', binding => bindings.push(binding));
        stream.on('end', () => {
            const graphData = parseSparqlResults(bindings);
            res.json(graphData);
        });
    } catch (error) {
        console.error('Failed to fetch graph data:', error);
        res.status(500).json({ message: 'Failed to fetch graph data' });
    }
});

export default router;