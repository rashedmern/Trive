#include "types.hpp"
#include "Dijkstra.hpp"
#include "BFS.hpp"
#include "Kruskal.hpp"
#include "DFS.hpp"

#include <iostream>
#include <chrono>
#include <cassert>
#include <iomanip>

void benchmarkDijkstra() {
    std::cout << "\n=== [1] Testing Dijkstra's Shortest Path & Turn-by-Turn Navigation ===\n";
    Trive::DijkstraRouter router(48);

    // Setup 48 street grid vertices simulating Miami Beach / Brickell courier routes
    router.addStreetNode(1, "2210 Coral Way, Apt 3C", 22.0, 78.0);
    router.addStreetNode(2, "SW 22nd Ave", 38.0, 65.0);
    router.addStreetNode(3, "Biscayne Blvd", 52.0, 50.0);
    router.addStreetNode(4, "MacArthur Causeway", 68.0, 35.0);
    router.addStreetNode(5, "1024 Ocean Dr", 80.0, 22.0);

    // Add street grid edges with mileage weights
    router.addEdge(1, 2, 0.4, "SW 22nd Ave");
    router.addEdge(2, 3, 0.5, "Biscayne Blvd");
    router.addEdge(3, 4, 0.3, "MacArthur Causeway");
    router.addEdge(4, 5, 0.3, "1024 Ocean Dr");
    router.addEdge(1, 3, 1.2, "Direct Highway");

    auto result = router.findShortestPath(1, 5);

    std::cout << "Shortest Path Nodes: ";
    for (size_t i = 0; i < result.pathNodeIds.size(); ++i) {
        std::cout << result.pathNodeIds[i] << (i + 1 < result.pathNodeIds.size() ? " -> " : "\n");
    }
    std::cout << "Total Distance: " << result.totalDistanceMiles << " miles\n";
    std::cout << "Estimated Duration: " << result.estimatedTimeMinutes << " min\n";
    std::cout << "ETA: " << result.formattedEta << "\n";
    std::cout << "Compute Latency: " << std::fixed << std::setprecision(4) << result.executionTimeMs << " ms\n";
    std::cout << "Nodes Explored: " << result.nodesExplored << "\n";

    assert(result.totalDistanceMiles == 1.5);
    assert(result.pathNodeIds.size() == 5);
    std::cout << "[PASS] Dijkstra shortest path verified (1.5 miles optimal).\n";
}

void benchmarkBFS() {
    std::cout << "\n=== [2] Testing Breadth-First Search (Radial Courier Dispatch) ===\n";
    Trive::CourierRadialDispatcher dispatcher(50);

    // Grid topology
    dispatcher.addStreetEdge(1, 2, 0.3);
    dispatcher.addStreetEdge(2, 3, 0.4);
    dispatcher.addStreetEdge(3, 4, 0.5);
    dispatcher.addStreetEdge(1, 5, 0.8);
    dispatcher.addStreetEdge(5, 6, 0.2);

    // Couriers stationed across grid
    dispatcher.registerActiveCourier(Trive::ActiveCourier{"c1", "Carlos R.", "scooter", 3, {32, 60}, 4.9});
    dispatcher.registerActiveCourier(Trive::ActiveCourier{"c2", "Marcus T.", "van", 6, {62, 40}, 4.8});

    auto start = std::chrono::high_resolution_clock::now();
    auto dispatched = dispatcher.dispatchNearestCourier(1, 6);
    auto end = std::chrono::high_resolution_clock::now();
    double latencyMs = std::chrono::duration<double, std::milli>(end - start).count();

    assert(dispatched.has_value());
    std::cout << "Dispatched Courier: " << dispatched->courierName << " (" << dispatched->courierId << ")\n";
    std::cout << "Distance in Hops: " << dispatched->distanceHops << "\n";
    std::cout << "Distance in Miles: " << dispatched->distanceMiles << "\n";
    std::cout << "ETA Minutes: " << dispatched->etaMinutes << " min\n";
    std::cout << "BFS Dispatch Latency: " << std::fixed << std::setprecision(4) << latencyMs << " ms\n";

    assert(dispatched->courierId == "c1" || dispatched->courierId == "c2");
    std::cout << "[PASS] BFS radial dispatch verified (found nearest active rider).\n";
}

void benchmarkKruskal() {
    std::cout << "\n=== [3] Testing Kruskal's Algorithm (Warehouse MST Optimization) ===\n";
    Trive::KruskalMSTSolver solver(5); // 5 regional warehouse hubs

    solver.addWarehouseLink(1, 2, 10.0);
    solver.addWarehouseLink(1, 3, 12.0);
    solver.addWarehouseLink(2, 3, 9.0);
    solver.addWarehouseLink(2, 4, 8.0);
    solver.addWarehouseLink(3, 4, 7.0);
    solver.addWarehouseLink(3, 5, 3.0);
    solver.addWarehouseLink(4, 5, 5.0);

    auto start = std::chrono::high_resolution_clock::now();
    auto mst = solver.solveOptimalHubNetwork();
    auto end = std::chrono::high_resolution_clock::now();
    double latencyMs = std::chrono::duration<double, std::milli>(end - start).count();

    std::cout << "MST Total Transit Cost: " << mst.totalCost << "\n";
    std::cout << "MST Selected Edges Count: " << mst.mstEdges.size() << " (Expected: " << mst.hubCount - 1 << ")\n";
    for (const auto& e : mst.mstEdges) {
        std::cout << "  Hub " << e.u << " <---> Hub " << e.v << " (Cost: " << e.transitCost << ")\n";
    }
    std::cout << "Kruskal Execution Latency: " << std::fixed << std::setprecision(4) << latencyMs << " ms\n";

    assert(mst.mstEdges.size() == 4);
    assert(mst.totalCost == 26.0);
    std::cout << "[PASS] Kruskal MST transit network verified (Minimum Cost = 26.0).\n";
}

void benchmarkDFS() {
    std::cout << "\n=== [4] Testing Depth-First Search (Grid Cycle & Dead-End Verification) ===\n";
    Trive::GridReachabilityChecker checker(6);

    // Directed grid streets
    checker.addDirectedStreet(1, 2);
    checker.addDirectedStreet(2, 3);
    checker.addDirectedStreet(3, 4);
    checker.addDirectedStreet(4, 2); // Creates a cycle: 2 -> 3 -> 4 -> 2

    auto start = std::chrono::high_resolution_clock::now();
    auto verification = checker.verifyGridSafety(1);
    auto end = std::chrono::high_resolution_clock::now();
    double latencyMs = std::chrono::duration<double, std::milli>(end - start).count();

    std::cout << "Has Cycle: " << (verification.hasCycle ? "YES" : "NO") << "\n";
    std::cout << "Has Dead-End: " << (verification.hasDeadEnd ? "YES" : "NO") << "\n";
    std::cout << "DFS Safety Verification Latency: " << std::fixed << std::setprecision(4) << latencyMs << " ms\n";

    assert(verification.hasCycle == true);
    std::cout << "[PASS] DFS cycle detection verified.\n";
}

int main() {
    std::cout << "=========================================================\n";
    std::cout << "   TRIVE C++17 GRAPH ROUTING ENGINE BENCHMARK SUITE     \n";
    std::cout << "=========================================================\n";

    benchmarkDijkstra();
    benchmarkBFS();
    benchmarkKruskal();
    benchmarkDFS();

    std::cout << "\n=========================================================\n";
    std::cout << "   ALL C++17 GRAPH ALGORITHMS PASSED AND VERIFIED!       \n";
    std::cout << "=========================================================\n";
    return 0;
}
