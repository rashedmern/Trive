#pragma once

#include "types.hpp"
#include <vector>

namespace Trive {

class DisjointSetUnion {
public:
    DisjointSetUnion(int n);
    int find(int i);
    bool unite(int i, int j);

private:
    std::vector<int> parent;
    std::vector<int> rank;
};

class KruskalMSTSolver {
public:
    KruskalMSTSolver(int totalHubs);
    void addWarehouseLink(int hubA, int hubB, double transitCost);
    MSTResult solveOptimalHubNetwork();

private:
    int hubCount;
    std::vector<WarehouseEdge> edges;
};

} // namespace Trive
