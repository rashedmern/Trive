#pragma once

#include "types.hpp"
#include <vector>

namespace Trive {

class GridReachabilityChecker {
public:
    GridReachabilityChecker(int totalNodes);
    void addDirectedStreet(int from, int to);
    
    // Cycle and dead-end detection
    CycleVerificationResult verifyGridSafety(int startNode);

private:
    int nodeCount;
    std::vector<std::vector<int>> adjList;

    bool dfsCheckCycle(int u, std::vector<int>& color, std::vector<int>& cycleNodes);
};

} // namespace Trive
