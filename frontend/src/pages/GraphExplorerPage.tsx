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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { apiGetGraphData } from '../api';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
      setIsLoading(true);
      try {
        const res = await apiGetGraphData();
        if (!res.ok) {
          throw new Error('Failed to fetch data from server');
        }
        const data = await res.json();
        
        // The backend now sends data in the correct format, so we can use it directly
        setNodes(data.nodes || []);
        setEdges(data.edges || []);

      } catch (error) {
        console.error('Failed to fetch graph data:', error);
        // Set to empty arrays on failure to avoid crashes
        setNodes([]);
        setEdges([]);
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
        style={{ background: '#1A202C' }}
      >
        <MiniMap />
        <Controls />
        <Background color="#4A5568" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default GraphExplorerPage;