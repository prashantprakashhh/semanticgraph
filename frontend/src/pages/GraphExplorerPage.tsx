import { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css'; // Import the new styles
import { apiGetGraphData } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const nodeTypeColors: { [key: string]: string } = {
  Person: '#4A90E2',
  Organization: '#50E3C2',
  default: '#E350D3',
};

const GraphExplorerPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiGetGraphData();
        const data = await res.json();
        
        const flowNodes: Node[] = data.nodes.map((node: any) => ({
          id: node.id,
          data: { label: node.data.label },
          position: { x: Math.random() * 400, y: Math.random() * 400 },
          style: { 
              background: nodeTypeColors[node.type] || nodeTypeColors.default, 
              color: 'white',
              border: '1px solid #222',
              width: 150,
          },
        }));

        const flowEdges: Edge[] = data.edges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          arrowHeadType: 'arrowclosed',
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (error) {
        console.error('Failed to fetch graph data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default GraphExplorerPage;