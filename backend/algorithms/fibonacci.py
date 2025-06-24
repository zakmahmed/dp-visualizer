
def fibonacci_recursive_trace(n):
    '''
    Computes the nth fibonacci number using pure recursion and generates an execution trace.
    
    The trace captures the call stack, showing how the function calls itself.
    
    Trace events for this function include:
    - 'call' : When a function 'fib(k)' is called.
    - 'base_case': When a base case (n <= 1) is hit.
    - 'return' : When a function returns a value.
    '''
    trace = []
    def fib(k, parent_id, depth):
        #    Create a unique ID for this specific call
        call_id = len(trace)
        
        # Trace Event: Function Call
        trace.append({
            'type': 'call',
            'id': call_id,
            'parent': parent_id,
            'depth' : depth,
            'n' : k,
            'explanation': f"Calling fib({k})."
        })
        
        # Base case
        if k <= 1:
            # Trace Event: Base Case
            trace.append({
            'type': 'base_case',
            'id': call_id,
            'n' : k,
            'result' : k,
            'explanation': f"Base case for fib({k}), returning {k}."
            })
            return k
    
        res1 = fib(k - 1, call_id, depth + 1)
        res2 = fib(k - 2, call_id, depth + 1)
        
        result = res1 + res2
        
        # Trace Event: Return
        trace.append({
            'type': 'return',
            'id': call_id,
            'n' : k,
            'result' : result,
            'explanation': f"fib({k - 1}) + fib({k - 2}) = {res1} + {res2}. Returning {result} for fib({k})."
        })
        return result
    
    fib(n, parent_id=None, depth=0)
    return trace


def fibonacci_memo_trace(n):
    '''
    Computes the nth fibonacci number using memoization and generates an execution trace.
    
    The trace captures the memo cache is used to store and receive the results of sub-problems, avoiding
    redundant computations.
    
    Trace events for this function include:
    - 'call' : When a function 'fib(k)' is called.
    - 'cache-hit' : When the result for 'fib(k)' is found in the cache.
    - 'cache-miss' : When the result for 'fib(k)' is not found in the cache.
    - 'store-result' : When a new result is stored in the cache.
    - 'base_case': When a base case (n <= 1) is hit.
    - 'return' : When a function returns a value.
    '''
    
    trace = []
    memo = {}
    
    def fib(k, parent_id, depth):
        call_id = len(trace)
        
        # Trace Event: Function Call
        trace.append({
            'type': 'call',
            'id': call_id,
            'parent': parent_id,
            'depth' : depth,
            'n' : k,
            'explanation': f"Calling fib({k}). Checking Cache"
        })
        
        # Check Cache
        if k in memo:
            # Trace Event: Function Call
            trace.append({
                'type': 'cache-hit',
                'id': call_id,
                'n': k,
                'result' : memo[k],
                'memo' : memo.copy(),
                'explanation': f"fib({k}) found in cache. Returning {memo[k]}"
            })
            return memo[k]
        
        # Trace Event: Cache Miss
        trace.append({
            'type': 'cache-miss',
            'id': call_id,
            'n' : k,
            'explanation': f"fib({k}) not in cache. Proceeding to compute"
        })
        
        # Base case
        if k <= 1:
            # Trace Event: Base Case
            trace.append({
                'type': 'base_case',
                'id': call_id,
                'n' : k,
                'result' : k,
                'explanation': f"Base case for fib({k}), returning {k}."
            })
            
            # store the result in memo
            memo[k] = k
            trace.append({
                'type': 'store_result',
                'id': call_id,
                'n' : k,
                'result' : k,
                'memo' : memo.copy(),
                'explanation': f"Storing fib({k} = {k} in cache."
            })
            
            return k
        
        res1 = fib(k - 1, call_id, depth + 1)
        res2 = fib(k - 2, call_id, depth + 1)
        result = res1 + res2
        
        memo[k] = result
        trace.append({
            'type': 'store_result',
            'id': call_id,
            'n' : k,
            'result' : result,
            'memo' : memo.copy(),
            'explanation': f"Storing fib({k} = {result} in cache."
        })
        
        # Trace Event: Return
        trace.append({
            'type': 'return',
            'id': call_id,
            'n' : k,
            'result' : result,
            'explanation': f"fib({k - 1}) + fib({k - 2}) = {res1} + {res2}. Returning {result} for fib({k})."
        })
        return result
    
    fib(n, parent_id=None, depth=0)
    return trace

def fibonacci_tab_trace(n):
    '''
    Computes the nth fibonacci number using tabulation and generates an execution trace.
    
    The trace captures the construction of the DP table (in this case an array)
    
    Trace events for this function include:
    - 'init_table' : When the DP table is first created.
    - 'set_base_case': When the initial value 'dp[1] = 1' is set.
    - 'iteration' : Calculating dp[i] for each step of the loop
    - 'final_result' : The final value extracted from the table.
    '''
    
    if n == 0:
        return [{
            'type' : 'final_result',
            'n' : 0,
            'result' : 0,
            'explanation' : 'Input is 0, returning 0 as output.'
        }]
    
    trace = []
    
    # Initialize DP table
    dp = [0] * (n + 1)
    
    # Trace Event: Initalize Table
    trace.append({
        'type': 'init_table',
        'table': list(dp),
        'explanation': f"Initialized a table of size {n + 1} with zeros."
    })
    
    # base case
    if n > 0:
        dp[1] = 1
    
    # Trace Event: Set Base Case
    trace.append({
        'type': 'set_base_case',
        'table': list(dp),
        'explanation': 'Set base case table[1] = 1'    
    })
    
    # Fill the table iteratively
    
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
        # Trace Event: Set Base Case
        trace.append({
            'type': 'iteration',
            'i' : i,
            'table': list(dp),
            'explanation': f'i = {i}: table[{i}] = table[{i - 1}] + table[{i - 2}] = {dp[i -1]} + {dp[i -2]} = dp{[i]}.'    
        })
    
    
    # Trace Event: Final Result
    trace.append({
        'type': 'final_result',
        'table': list(dp),
        'result' : dp[n],
        'explanation': f'Final Result is table[{n}] = {dp[n]}.'    
    })
    
    return trace
    