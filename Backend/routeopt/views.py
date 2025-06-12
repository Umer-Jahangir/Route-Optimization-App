from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

import openrouteservice

@api_view(['POST'])
def optimize_route(request):
    data = request.data
    locations = data.get('locations', [])
    drivers = data.get('drivers', 1)

    if not locations or len(locations) < 2:
        return Response({"error": "Need at least two locations"}, status=status.HTTP_400_BAD_REQUEST)

    # Step 1: Prepare coordinates for ORS
    coordinates = [[loc['lng'], loc['lat']] for loc in locations]  

    # Step 2: Call ORS distance matrix
    try:
        client = openrouteservice.Client(key='5b3ce3597851110001cf6248a086ba3ec9a14dd8a00e0842381c8f97')  
        matrix = client.distance_matrix(
            locations=coordinates,
            profile='driving-car',
            metrics=['distance', 'duration'],
            units='m'
        )
        distance_matrix = matrix['distances']
        duration_matrix = matrix['durations'] 
    except Exception as e:
        return Response({"error": f"Distance matrix API failed: {str(e)}"}, status=500)

    # Step 3: Setup OR-Tools
    n = len(locations)
    drivers = min(drivers, n)
    depot = 0
    manager = pywrapcp.RoutingIndexManager(n, drivers, depot)
    routing = pywrapcp.RoutingModel(manager)

    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return int(distance_matrix[from_node][to_node])

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    max_distance = 200000 # 200 km splits between all drivers
    routing.AddDimension(
        transit_callback_index,
        0,  
        max_distance,  
        True,  
        'Distance'
    )
    distance_dimension = routing.GetDimensionOrDie('Distance')
    distance_dimension.SetGlobalSpanCostCoefficient(100)  

    # Search parameters
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC

    solution = routing.SolveWithParameters(search_parameters)

    if not solution:
        return Response({"error": "No solution found"}, status=400)

    routes = []
    distances = []
    durations = [] 

    for vehicle_id in range(drivers):
        index = routing.Start(vehicle_id)
        route = []
        route_distance = 0
        route_duration = 0 
        if routing.IsEnd(solution.Value(routing.NextVar(index))):
            routes.append([])
            distances.append(0)
            durations.append(0)
            continue

        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            loc = locations[node_index]
            route.append([loc['lat'], loc['lng']])
            index = solution.Value(routing.NextVar(index))
            next_node_index = manager.IndexToNode(index)

            route_distance += distance_matrix[node_index][next_node_index]
            route_duration += duration_matrix[node_index][next_node_index]

        
        end_node_index = manager.IndexToNode(index)
        loc = locations[end_node_index]
        route.append([loc['lat'], loc['lng']])

        # Step 4: Use ORS directions to get road path
        try:
            ors_coords = [[lng, lat] for lat, lng in route]
            directions = client.directions(
                coordinates=ors_coords,
                profile='driving-car',
                format='geojson'
            )
            geometry = directions['features'][0]['geometry']['coordinates']
            road_path = [[lat, lng] for lng, lat in geometry]  

            routes.append(road_path)
            distances.append(round(route_distance, 2))  
            durations.append(round(route_duration, 2)) 
        except Exception as e:
            return Response({"error": f"Route path fetch failed: {str(e)}"}, status=500)

    return Response({
        "routes": routes,
        "distances": distances,
        "durations_seconds": durations
    })
