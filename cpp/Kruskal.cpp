#include "Kruskal.hpp"
#include <algorithm>

namespace Trive {

DisjointSetUnion::DisjointSetUnion(int n) {
    parent.resize(n + 1);
    rank.resize(n + 1, 0);
    for (int i = 0; i <= n; ++i) {
        parent[i] = i;
    }
}

int DisjointSetUnion::find(int i) {
    if (parent[i] == i)
        return i;
    return parent[i] = find(parent[i]); // Path compression
}

bool DisjointSetUnion::unite(int i, int j) {
    int rootI = find(i);
    int rootJ = find(j);
    if (rootI == rootJ)
        return false; // Already in same set

    // Union by rank
    if (rank[rootI] < rank[rootJ]) {
        parent[rootI] = rootJ;
    } else if (rank[rootI] > rank[rootJ]) {
        parent[rootJ] = rootI;
    } else {
        parent[rootJ] = rootI;
        rank[rootI]++;
    }
    return true;
}

KruskalMSTSolver::KruskalMSTSolver(int totalHubs) : hubCount(totalHubs) {}

void KruskalMSTSolver::addWarehouseLink(int hubA, int hubB, double transitCost) {
    edges.push_back(WarehouseEdge{hubA, hubB, transitCost});
}

MSTResult KruskalMSTSolver::solveOptimalHubNetwork() {
    // Sort all warehouse links by transit cost ascending
    std::sort(edges.begin(), edges.end(), [](const WarehouseEdge& a, const WarehouseEdge& b) {
        return a.transitCost < b.transitCost;
    });

    DisjointSetUnion dsu(hubCount);
    std::vector<WarehouseEdge> mstEdges;
    double totalCost = 0.0;

    for (const auto& edge : edges) {
        if (dsu.unite(edge.u, edge.v)) {
            mstEdges.push_back(edge);
            totalCost += edge.transitCost;
            if ((int)mstEdges.size() == hubCount - 1) {
                break; // MST contains V - 1 edges
            }
        }
    }

    return MSTResult{mstEdges, totalCost, hubCount};
}

} // namespace Trive
