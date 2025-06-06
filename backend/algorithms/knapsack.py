#Returns the largest item that can be put in a knapsack of a given capacity

def recursive_knapsack(capacity, items, weight, num_items):
    
    # Base Case
    if num_items == 0 or capacity == 0:
        return 0
    
    
    
    # Pick the last item if it doesn't exceed the knapsack's capacity if it does set the variable to 0
    if weight[num_items - 1] > capacity:
        return recursive_knapsack(capacity, items, weight, num_items - 1)
    
    # Calculate whether to include or exclude the last item by taking the max of the resulting recursive calls
    include = items[num_items - 1] + recursive_knapsack(capacity - weight[num_items - 1], items, weight, num_items - 1)
    exclude = recursive_knapsack(capacity, items, weight, num_items - 1)
    return max(include, exclude)


def memo_knapsack(capacity, items, weight, num_items, memo=None):
    # Base Case
    if num_items == 0 or capacity == 0:
        return 0
    
    if memo is None:
        memo = [[-1 for _ in range(capacity + 1)] for _ in range(num_items + 1)]
    
    # Check if the subproblem is in the memoization table
    if memo[num_items][capacity] != -1:
        return memo[num_items][capacity]

    
    # Pick the last item if it doesn't exceed the knapsack's capacity if it does set the variable to 0
    if weight[num_items - 1] > capacity:
        return memo_knapsack(capacity, items, weight, num_items - 1, memo)
    
    # Calculate whether to include or exclude the last item by taking the max of the resulting recursive calls
    include = items[num_items - 1] + memo_knapsack(capacity - weight[num_items - 1], items, weight, num_items - 1)
    exclude = memo_knapsack(capacity, items, weight, num_items - 1, memo)
    
    memo[num_items][capacity] = max(include, exclude)
    
    return memo[num_items][capacity]

def tab_knapsack(capacity, items, weight, num_items):
    
    # Initialize dynamic programming list
    dp = [0] * (capacity + 1)
    
    for i in range(1, num_items + 1):
        for j in range(capacity, weight[i - 1] - 1, -1):
            dp[j] = max(dp[j], dp[j - weight[i - 1]] + items[i - 1])
    
    return dp[capacity]