#include "DFS.hpp"
#include <algorithm>

namespace Trive {

GridReachabilityChecker::GridReachabilityChecker(int totalNodes) : nodeCount(totalNodes) {
    adjList.resize(totalNodes + 1);
}

void GridReachabilityChecker::addDirectedStreet(int from, int to) {
    int maxId = std::max(from, to);
    if (maxId >= (int)adjList.size()) {
        adjList.resize(maxId + 1);
    }
    adjList[from].push_back(to);
}

// 3-color DFS cycle detection: 0 = unvisited, 1 = visiting (in stack), 2 = visited
bool GridReachabilityChecker::dfsCheckCycle(int u, std::vector<int>& color, std::vector<int>& cycleNodes) {
    color[u] = 1; // Mark as visiting

    for (int v : adjList[u]) {
        if (color[v] == 1) {
            // Found a back edge, cycle detected
            cycleNodes.push_back(v);
            cycleNodes.push_back(u);
            return true;
        }
        if (color[v] == 0) {
            if (dfsCheckCycle(v, color, cycleNodes)) {
                cycleNodes.push_back(u);
                return true;
            }
        }
    }

    color[u] = 2; // Mark as fully visited
    return false;
}

CycleVerificationResult GridReachabilityChecker::verifyGridSafety(int startNode) {
    int size = static_cast<int>(adjList.size());
    std::vector<int> color(size, 0);
    std::vector<int> cycleNodes;

    bool hasCycle = dfsCheckCycle(startNode, color, cycleNodes);
    
    // Check for dead-ends (nodes with zero outgoing edges reachable from start)
    bool hasDeadEnd = false;
    for (int i = 1; i < size; ++i) {
        if (color[i] == 2 && adjList[i].empty()) {
            hasDeadEnd = true;
            break;
        }
    }

    std::reverse(cycleNodes.begin(), cycleNodes.end());

    return CycleVerificationResult{
        hasDeadEnd,
        hasCycle,
        cycleNodes
    };
}

} // namespace Trive
