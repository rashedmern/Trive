#pragma once

#include <string>
#include <vector>
#include <cstdint>

namespace Trive {

struct Point2D {
    double x;
    double y;
};

struct StreetNode {
    int id;
    std::string name;
    Point2D coord;
};

struct Edge {
    int from;
    int to;
    double weight; // in miles or seconds
    std::string streetName;
};

struct RouteStep {
    std::string symbol;     // e.g. "↰", "↱", "↑"
    std::string distance;   // e.g. "50 ft"
    std::string streetName; // e.g. "1024 Ocean Dr"
};

struct DijkstraResult {
    std::vector<int> pathNodeIds;
    std::vector<Point2D> polyline;
    double totalDistanceMiles;
    double estimatedTimeMinutes;
    std::string formattedEta;
    std::vector<RouteStep> turnByTurnSteps;
    double executionTimeMs;
    int nodesExplored;
};

struct ActiveCourier {
    std::string id;
    std::string name;
    std::string vehicleType; // "scooter" | "van"
    int currentNodeId;
    Point2D coord;
    double rating;
};

struct CourierDispatchResult {
    std::string courierId;
    std::string courierName;
    int distanceHops;
    double distanceMiles;
    double etaMinutes;
};

struct WarehouseEdge {
    int u;
    int v;
    double transitCost;
};

struct MSTResult {
    std::vector<WarehouseEdge> mstEdges;
    double totalCost;
    int hubCount;
};

struct CycleVerificationResult {
    bool hasDeadEnd;
    bool hasCycle;
    std::vector<int> cycleNodes;
};

} // namespace Trive
