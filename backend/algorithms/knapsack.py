
def knapsack_recursive_trace(weights, values, capacity):
    '''
    Computes the 0/1 knapsack problem using pure recursion and generates an execution trace.
    The trace captures the decision tree for each item, whether to include it or not.
    Trace events for this function include:
    - 'call' : When the function 'solve(index, capacity)' is called.
    - 'base_case': When a base case (no items or capacity) is reached.
    - 'decision' : When an item is skipped because its too heavy.
    - 'decision_start' : Marks the beginning of exploring a branch
    - 'decision_end' : Marks the end of exploring a branch.
    - 'return' : When a function returns a value.
    '''
    trace = []
    n = len(weights)
    
    def solve(index, current_capacity, parent_id, depth):
        #    Create a unique ID for this specific call
        call_id = len(trace)
        
        # Trace Event: Function Call
        trace.append({
            'type': 'call',
            'id': call_id,
            'parent': parent_id,
            'depth' : depth,
            'index' : index,
            'capacity' : current_capacity,
            'explanation': f"Considering item {index} with capacity {current_capacity}."
        })
        
        # Base case
        if index < 0 or current_capacity <= 0:
            # Trace Event: Base Case
            trace.append({
            'type': 'base_case',
            'id': call_id,
            'result' : 0,
            'explanation': "Base case reached (no more items or capacity)."
            })
            return 0
        
        # Item too heavy
        if weights[index] > current_capacity:
            # Trace Event: Skip Decision
            trace.append({
            'type': 'decision',
            'id': call_id,
            'decision' : 'skip',
            'explanation': f"Item {index} with weight {weights[index]} is too heavy and therefore skipped."
            })
    
            result = solve(index - 1, current_capacity, call_id, depth + 1)
        else:
            # Don't include the current item
            # Trace Event: Exclude Decision Start
            trace.append({
            'type': 'decision_start',
            'id': call_id,
            'branch' : 'exclude'
            })
            value_without_item = solve(index - 1, current_capacity, call_id, depth + 1)
            # Trace Event: Exclude Decision End
            trace.append({
            'type': 'decision_end',
            'id': call_id,
            'branch' : 'exclude',
            'value' : value_without_item
            })
            
            # Include the current item
            # Trace Event: Exclude Decision Start
            trace.append({
            'type': 'decision_start',
            'id': call_id,
            'branch' : 'exclude'
            })
            value_with_item = values[index] + solve(index - 1, current_capacity - weights[index], call_id, depth + 1)
            # Trace Event: Exclude Decision End
            trace.append({
            'type': 'decision_end',
            'id': call_id,
            'branch' : 'exclude',
            'value' : value_with_item
            })
            
            result = max(value_without_item, value_with_item)
        
        # Trace Event: Return
        trace.append({
            'type': 'return',
            'id': call_id,
            'result' : result,
            'explanation': f"Max Value for item {index} with capacity {current_capacity} is {result}."
        })
        return result
    
    solve(n - 1, capacity,  parent_id=None, depth=0)
    return trace

def knapsack_memo_trace(weights, values, capacity):
    '''
    Computes the 0/1 knapsack problem using pure recursion and generates an execution trace.
    The trace captures the decision tree for each item, whether to include it or not.
    
    Trace events for this function include:
    - 'call' : When a function 'fib(k)' is called.
    - 'cache_hit' : When the result for a state is found in the cache.
    - 'cache_miss' : When the result for a state is not found in the cache.
    - 'store_result' : When a new result is stored in the cache.
    - 'base_case': When a base case is reached.
    - 'return' : When a function returns a value.
    '''
    trace = []
    n = len(weights)
    memo = {}
    
    def solve(index, current_capacity, parent_id, depth):
        #  Create a unique ID for this specific call
        call_id = len(trace)
        state = (index, current_capacity)
        
        # Trace Event: Function Call
        trace.append({
            'type': 'call',
            'id': call_id,
            'parent': parent_id,
            'depth' : depth,
            'index' : index,
            'capacity' : current_capacity,
            'explanation': f"Considering item {index} with capacity {current_capacity}. Checking Cache"
        })
        
        if state in memo:
            # Trace Event: Function Call
            trace.append({
                'type': 'cache_hit',
                'id': call_id,
                'state': state,
                'result' : memo[state],
                'memo' : {str(k):v for k, v in memo.items()}, # make keys JSON Serializable for frontend
                'explanation': f"Result for item {index} with capacity {current_capacity} found in cache."
            })
            return memo[state]
        
        # Trace Event: Cache Miss
        trace.append({
            'type': 'cache_miss',
            'id': call_id,
            'state' : state,
            'explanation': f"Result for item {index} with capacity {current_capacity} not found in cache.. Proceeding to compute"
        })
        
        # Base case
        if index < 0 or current_capacity <= 0:
            # Trace Event: Base Case
            trace.append({
            'type': 'base_case',
            'id': call_id,
            'result' : 0,
            'explanation': "Base case reached (no more items or capacity)."
            })
            return 0
        
        # Item too heavy
        if weights[index] > current_capacity:
            # Trace Event: Skip Decision
            trace.append({
            'type': 'decision',
            'id': call_id,
            'decision' : 'skip',
            'explanation': f"Item {index} with weight {weights[index]} is too heavy and therefore skipped."
            })
    
            result = solve(index - 1, current_capacity, call_id, depth + 1)
        else:
            # Don't include the current item
            # Trace Event: Exclude Decision Start
            trace.append({
            'type': 'decision_start',
            'id': call_id,
            'branch' : 'exclude'
            })
            value_without_item = solve(index - 1, current_capacity, call_id, depth + 1)
            # Trace Event: Exclude Decision End
            trace.append({
            'type': 'decision_end',
            'id': call_id,
            'branch' : 'exclude',
            'value' : value_without_item
            })
            
            # Include the current item
            # Trace Event: Exclude Decision Start
            trace.append({
            'type': 'decision_start',
            'id': call_id,
            'branch' : 'exclude'
            })
            value_with_item = values[index] + solve(index - 1, current_capacity - weights[index], call_id, depth + 1)
            # Trace Event: Exclude Decision End
            trace.append({
            'type': 'decision_end',
            'id': call_id,
            'branch' : 'exclude',
            'value' : value_with_item
            })
            
            result = max(value_without_item, value_with_item)
            memo[state] = result
            trace.append({
            'type': 'store_result',
            'id': call_id,
            'result' : result,
            'memo' : {str(k):v for k, v in memo.items()},
            'explanation': f"Storing result for item {index} with capacity {current_capacity} in cache."
        })
        
        # Trace Event: Return
        trace.append({
            'type': 'return',
            'id': call_id,
            'result' : result,
            'explanation': f"Max Value for item {index} with capacity {current_capacity} is {result}."
        })
        return result
    
    solve(n - 1, capacity,  parent_id=None, depth=0)
    return trace



def knapsack_tab_trace(weights, values, capacity):
    '''
    Computes the 0/1 knapsack problem using tabulation and generates an execution trace.
    
    The trace captures the construction of the DP table (in this case an array)
    
    Trace events for this function include:
    - 'init_table' : When the DP table is first created.
    - 'iteration' : Calculating dp[i] for each step of the loop.
    - 'traceback_step' : A step in traceback phase.
    - 'item_included' : When traceback identifies an item in the optimal set
    - 'traceback_complete' : When the traceback is finished
    - 'final_result' : The final value extracted from the table.
    '''
    
    n = len(weights)
    trace = []
    
    # Initialize DP table
    # dp[i][w] will be the maximum value that can be obtained with the first i items and a knapsack capacity of 'w'.
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]
    
    # Trace Event: Initalize Table
    trace.append({
        'type': 'init_table',
        'table': [row[:] for row in dp], # Deep Copy of table
        'explanation': f"Initialized a {n + 1} x {capacity + 1} DP table with zeros."
    })
    
    # Fill the table
    
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            prev_val = dp[i - 1][w]
            current_item_index = i - 1
            
            if weights[current_item_index] <= w:
                val_with_item = values[current_item_index] + dp[i - 1][w - weights[current_item_index]]
                dp[i][w] = max(prev_val, val_with_item)
            else:
                dp[i][w] = prev_val
            
            # Trace Event: Iteration
            trace.append({
                'type': 'iteration',
                'i' : i,
                'w' : w,
                'table': [row[:] for row in dp],
                'highlight' : {'row' : i, 'col' : w},
                'explanation': f'Calculated dp[{i}][{w}]= {dp[i][w]}.'    
            })
    


    # Trace Event: Final Result
    max_value = dp[n][capacity]
    trace.append({
        'type': 'final_result',
        'table': [row[:] for row in dp],
        'result' : max_value,
        'explanation': f'Table Complete. Max value is {max_value}. Starting Traceback to find included items.'    
    })
    
    included_items = []
    w = capacity
    for i in range(n, 0, -1):
        trace.append({
            'type': 'traceback_step',
            'highlight' : {'row' : i, 'col' : w},
            'explanation': f"Checking if item {i - 1} was included."
        })
        
        if dp[i][w] != dp[i - 1][w]:
            item_index = i - 1
            included_items.append(item_index)
            w -= weights[item_index]
            
            # Trace Event: Item Included
            trace.append({
            'type': 'item_included',
            'item_index' : item_index,
            'explanation': f"Item {item_index} was included. New capacity for traceback {w}"
        })
    
    included_items.reverse()
    
    # Trace Event: Traceback Complete
    trace.append({
            'type': 'traceback_complete',
            'included_items' : included_items,
            'result' : max_value,
            'explanation': f"Traceback complete. Items {included_items} give max value"
        })
    
    return trace
    