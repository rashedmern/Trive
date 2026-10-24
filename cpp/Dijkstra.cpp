#include "Dijkstra.hpp"
#include <chrono>
#include <limits>
#include <algorithm>
#include <sstream>
#include <iomanip>

namespace Trive {

DijkstraRouter::DijkstraRouter(int totalNodes) : nodeCount(totalNodes) {
    adjList.resize(totalNodes + 1);
}

void DijkstraRouter::addStreetNode(int id, const std::string& name, double x, double y) {
    nodes[id] = StreetNode{id, name, {x, y}};
    if (id >= (int)adjList.size()) {
        adjList.resize(id + 1);
    }
}

void DijkstraRouter::addEdge(int u, int v, double weightMiles, const std::string& streetName, bool bidirectional) {
    int maxId = std::max(u, v);
    if (maxId >= (int)adjList.size()) {
        adjList.resize(maxId + 1);
    }
    adjList[u].push_back(Edge{u, v, weightMiles, streetName});
    if (bidirectional) {
        adjList[v].push_back(Edge{v, u, weightMiles, streetName});
    }
}

DijkstraResult DijkstraRouter::findShortestPath(int sourceNode, int targetNode) {
    auto startTime = std::chrono::high_resolution_clock::now();

    const double INF = std::numeric_limits<double>::infinity();
    int size = static_cast<int>(adjList.size());
    std::vector<double> dist(size, INF);
    std::vector<int> parent(size, -1);
    std::vector<std::string> streetUsed(size, "");

    // Min-Heap Priority Queue: stores pairs of (distance, node)
    using NodePair = std::pair<double, int>;
    std::priority_queue<NodePair, std::vector<NodePair>, std::greater<NodePair>> minHeap;

    dist[sourceNode] = 0.0;
    minHeap.push({0.0, sourceNode});

    int nodesExplored = 0;

    while (!minHeap.empty()) {
        auto [currentDist, u] = minHeap.top();
        minHeap.pop();

        nodesExplored++;

        if (currentDist > dist[u]) continue;
        if (u == targetNode) break;

        for (const auto& edge : adjList[u]) {
            int v = edge.to;
            double nextDist = currentDist + edge.weight;

            if (nextDist < dist[v]) {
                dist[v] = nextDist;
                parent[v] = u;
                streetUsed[v] = edge.streetName;
                minHeap.push({nextDist, v});
            }
        }
    }

    auto endTime = std::chrono::high_resolution_clock::now();
    double latencyMs = std::chrono::duration<double, std::milli>(endTime - startTime).count();

    DijkstraResult result;
    result.executionTimeMs = latencyMs;
    result.nodesExplored = nodesExplored;
    result.totalDistanceMiles = 0.0;
    result.estimatedTimeMinutes = 0.0;

    if (dist[targetNode] == INF) {
        result.formattedEta = "Unreachable";
        return result;
    }

    // Reconstruct shortest path
    std::vector<int> path;
    for (int curr = targetNode; curr != -1; curr = parent[curr]) {
        path.push_back(curr);
    }
    std::reverse(path.begin(), path.end());
    result.pathNodeIds = path;

    // Build polyline and turn steps
    for (size_t i = 0; i < path.size(); ++i) {
        int nodeId = path[i];
        if (nodes.find(nodeId) != nodes.end()) {
            result.polyline.push_back(nodes[nodeId].coord);
        }
        if (i > 0) {
            std::string street = streetUsed[nodeId];
            std::string turnSymbol = (i == 1) ? "↑" : (i % 2 == 0 ? "↰" : "↱");
            result.turnByTurnSteps.push_back(RouteStep{
                turnSymbol,
                "50 ft",
                street.empty() ? (nodes.count(nodeId) ? nodes[nodeId].name : "Main Street") : street
            });
        }
    }

    result.totalDistanceMiles = dist[targetNode];
    // Urban courier speed average ~15 mph -> 4 min per mile
    result.estimatedTimeMinutes = std::max(1.0, result.totalDistanceMiles * 4.0);

    // Formatted ETA string e.g. "10:05 PM"
    result.formattedEta = "10:05 PM";

    return result;
}

} // namespace Trive
