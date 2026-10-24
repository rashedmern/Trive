#pragma once

#include "types.hpp"
#include <vector>
#include <queue>
#include <unordered_map>

namespace Trive {

class DijkstraRouter {
public:
    DijkstraRouter(int totalNodes);
    void addStreetNode(int id, const std::string& name, double x, double y);
    void addEdge(int u, int v, double weightMiles, const std::string& streetName, bool bidirectional = true);
    
    DijkstraResult findShortestPath(int sourceNode, int targetNode);

private:
    int nodeCount;
    std::unordered_map<int, StreetNode> nodes;
    std::vector<std::vector<Edge>> adjList;
};

} // namespace Trive
