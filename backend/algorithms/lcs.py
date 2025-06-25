def lcs_recursive_trace(s1, s2):
    '''
    Finds the length of the longest common subsequence using pure recursion and generates an execution trace
    
    Trace events for this function include:
    - 'call' : When the function 'solve(index, capacity)' is called.
    - 'base_case': When a base case (no items or capacity) is reached.
    - 'match' : When characters s1[i] and s2[j] are the same
    - 'mismatch' : When characters do not match, initiated two recursive branches.
    - 'return' : When a function returns a value.
    '''
    
    trace = []
    
    def solve(i, j, parent_id, depth):
        call_id  = len(trace)
        
        # Trace Event: Function Call
        trace.append({
            'type': 'call',
            'id': call_id,
            'parent': parent_id,
            'depth' : depth,
            'i' : i,
            'j' : j,
            'explanation': f"Comparing s1[{i}] with capacity s2[{j}]."
        })
        
        # Base Case
        if i < 0 or j < 0:
            # Trace Event: Base Case
            trace.append({
                'type' : 'base_case',
                'id' : call_id,
                'result' : 0      
            })
            return 0
        
        # Match Case
        if s1[i] == s2[j]:
            # Trace Event: Match
            trace.append({
                'type' : 'match',
                'id' : call_id, 
                'char' : s1[i]
            })
            result = 1 + solve(i - 1, j - 1, call_id, depth + 1)
            
        else:
            # Trace Event: Mismatch
            trace.append({'type' : 'mismatch', 'id' : call_id})
            res1 = solve(i - 1, j, call_id, depth + 1)
            res2 = solve(i, j - 1, call_id, depth + 1)
            result = max(res1, res2)

        trace.append({
            'type' : 'return',
            'id' : call_id,
            'result' : result
        })
        
        return result
    
    solve(len(s1) - 1, len(s2) - 1, parent_id=None, depth=0)
    return trace
    

def lcs_memo_trace(s1, s2):
    '''
    Finds the length of the longest common subsequence using pure recursion and generates an execution trace
    
    Trace events for this function include:
    - 'cache_hit' : When the result for the state (i, j) is found in the cache.
    - 'cache_miss' : When the result for the state (i, j) is not found in the cache.
    - 'store_result' : When a new result is stored in the cache.
    '''
    trace = []
    memo = {}
    
    def solve(i, j, parent_id, depth):
        call_id  = len(trace)
        state = (i, j)
        
        # Trace Event: Function Call
        trace.append({
            'type': 'call',
            'id': call_id,
            'parent': parent_id,
            'depth' : depth,
            'i' : i,
            'j' : j,
            'explanation': f"Comparing s1[{i}] with capacity s2[{j}]. Checking cache."
        })
        
        # Checking Cache
        if state in memo:
        # Trace Event: Function Call
            trace.append({
                'type': 'cache_hit',
                'id': call_id,
                'state': state,
                'result' : memo[state],
                'memo' : {str(k):v for k, v in memo.items()}, # make keys JSON Serializable for frontend
            })
            return memo[state]
        
        # Trace Event: Mismatch
        trace.append({
            'type': 'cache_miss',
            'id': call_id,
            'state' : state,
        })
        
        # Base Case
        if i < 0 or j < 0:
            trace.append({
                'type' : 'base_case',
                'id' : call_id,
                'result' : 0      
            })
            return 0
        
        # Match Case
        if s1[i] == s2[j]:
            trace.append({
                'type' : 'match',
                'id' : call_id, 
                'char' : s1[i]
            })
            result = 1 + solve(i - 1, j - 1, call_id, depth + 1)
            
        else:
            # Trace Event: Mismatch
            trace.append({'type' : 'mismatch', 'id' : call_id})
            res1 = solve(i - 1, j, call_id, depth + 1)
            res2 = solve(i, j - 1, call_id, depth + 1)
            result = max(res1, res2)
            
        

        memo[state] = result
        trace.append({
            'type': 'store_result',
            'id': call_id,
            'state': state,
            'result' : result,
            'memo' : {str(k):v for k, v in memo.items()}
        })
        
        return result
    
    solve(len(s1) - 1, len(s2) - 1, parent_id=None, depth=0)
    return trace


def lcs_tab_trace(s1, s2):
    '''
    Finds the length of the longest common subsequence using tabulation and generates an execution trace
    
    The trace captures the construction of the DP table (in this case a 2D array)
    
    Trace events for this function include:
    - 'init_table' : When the DP table is first created.
    - 'iteration' : Calculating dp[i] for each step of the loop.
    - 'traceback_step' : A step in traceback phase.
    - 'traceback_match' : When a common character is found in traceback.
    - 'traceback_complete' : When the traceback is finished.
    - 'final_result' : The final value extracted from the table.
    '''

    m, n = len(s1), len(s2)
    trace = []
    
    dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]
    
    # Trace Event: Initalize Table
    trace.append({
        'type': 'init_table',
        'table': [row[:] for row in dp], # Deep Copy of table
        'explanation': f"Initialized a {m + 1} x {n + 1} DP table with zeros."
    })
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            s1_char = s1[i - 1]
            s2_char = s2[j - 1]
            
            if s1_char == s2_char:
                dp[i][j] = 1 + dp[i - 1][j - 1]
                explanation = f"Match! s1[{i - 1}] == s2[{j - 1}] ({s1_char}). Value is 1 + dp[{i - 1}][{j - 1}]."
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
                explanation = f"Mismatch. Value is max(dp[{i - 1}][{j}], dp[{i}][{j - 1}])."
                
            # Trace Event: Iteration
            trace.append({
                'type': 'iteration',
                'i' : i,
                'j' : j,
                'table': [row[:] for row in dp],
                'highlight' : {'row' : i, 'col' : j},
                'explanation': explanation   
            })
    
    lcs_len = dp[m][n]
    trace.append({
        'type':  'final_result',
        'result': lcs_len,
        'table': [row[:] for row in dp],
        'explanation' : f"Table complete. LCS length is {lcs_len}. Starting traceback."
    })
    
    lcs_str = []
    i, j = m, n
    
    while i > 0 and j > 0:
        trace.append({
        'type': 'traceback_step',
        'highlight' : {'row' : i, 'col' : j},
        'explanation': f"Tracing back from dp[{i}][{j}]."
        })
        
        if s1[i - 1] == s2[j - 1]:
            lcs_str.append(s1[i - 1])
            trace.append({
            'type': 'traceback_match',
            'char' : s1[i - 1],
            'explanation': f"Found common character {s1[i - 1]}. Moving diagonally up towards the left."
            })
            i -= 1
            j -= 1
        
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        
        else:
            j -= 1
    
    lcs_str.reverse()
    result_str = "".join(lcs_str)
    # Trace Event: Traceback Complete
    trace.append({
        'type': 'traceback_complete',
        'result_length' : lcs_len,
        'result' : result_str,
        'explanation': f"Traceback complete. LCS is '{result_str}'"
    })            
    return trace
         