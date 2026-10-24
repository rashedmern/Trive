#include "BFS.hpp"
#include <vector>
#include <queue>
#include <algorithm>

namespace Trive {

CourierRadialDispatcher::CourierRadialDispatcher(int totalNodes) : nodeCount(totalNodes) {
    adjList.resize(totalNodes + 1);
}

void CourierRadialDispatcher::addStreetEdge(int u, int v, double weightMiles) {
    int maxId = std::max(u, v);
    if (maxId >= (int)adjList.size()) {
        adjList.resize(maxId + 1);
    }
    adjList[u].push_back({v, weightMiles});
    adjList[v].push_back({u, weightMiles});
}

void CourierRadialDispatcher::registerActiveCourier(const ActiveCourier& courier) {
    couriersByNode[courier.currentNodeId].push_back(courier);
}

std::optional<CourierDispatchResult> CourierRadialDispatcher::dispatchNearestCourier(int pickupOriginNode, int maxHops) {
    int size = static_cast<int>(adjList.size());
    std::vector<bool> visited(size, false);
    std::vector<double> accumulatedDist(size, 0.0);

    // Queue stores pairs of: {currentNode, hopLevel}
    std::queue<std::pair<int, int>> q;
    
    visited[pickupOriginNode] = true;
    q.push({pickupOriginNode, 0});

    while (!q.empty()) {
        auto [u, hops] = q.front();
        q.pop();

        // Check if there is an active courier stationed at this node
        auto it = couriersByNode.find(u);
        if (it != couriersByNode.end() && !it->second.empty()) {
            const auto& courier = it->second.front();
            double miles = accumulatedDist[u];
            double eta = std::max(1.0, miles * 3.5); // ETA ~3.5 min/mile for rapid courier arrival

            return CourierDispatchResult{
                courier.id,
                courier.name,
                hops,
                miles,
                eta
            };
        }

        if (hops >= maxHops) continue;

        for (const auto& [v, weight] : adjList[u]) {
            if (!visited[v]) {
                visited[v] = true;
                accumulatedDist[v] = accumulatedDist[u] + weight;
                q.push({v, hops + 1});
            }
        }
    }

    return std::nullopt;
}

} // namespace Trive
