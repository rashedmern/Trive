#pragma once

#include "types.hpp"
#include <vector>
#include <queue>
#include <unordered_map>
#include <optional>

namespace Trive {

class CourierRadialDispatcher {
public:
    CourierRadialDispatcher(int totalNodes);
    void addStreetEdge(int u, int v, double weightMiles);
    void registerActiveCourier(const ActiveCourier& courier);

    // BFS search from pickup origin node outwards in concentric hops
    std::optional<CourierDispatchResult> dispatchNearestCourier(int pickupOriginNode, int maxHops = 8);

private:
    int nodeCount;
    std::vector<std::vector<std::pair<int, double>>> adjList;
    std::unordered_map<int, std::vector<ActiveCourier>> couriersByNode;
};

} // namespace Trive
