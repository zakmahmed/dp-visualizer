#Implementation of fibonacci function using recursion
def recursive_fibonacci(n):
    if n <= 0 or not isinstance(n, int):
        #Raises a Value error if the value entered is not an integer greater than 0
        raise ValueError("Only positive non-zero integers can be used!") 
    
    if n == 1 or n == 2:
        return 1
    
    
    return recursive_fibonacci(n - 1) + recursive_fibonacci(n - 2)
        
#Implementation of fibonacci function using memoization
def memo_fibonacci(n, memo={}):
    if n <= 0 or not isinstance(n, int):
        #Raises a Value error if the value entered is not an integer greater than 0
        raise ValueError("Only positive non-zero integers can be used!") 
    if n == 1 or n == 2:
        return 1
    
    #If the number is in the memoization table return it
    if n in memo:
        return memo[n]
    
    #If the number is not in the memoization table, calculate it and store it
    memo[n] = memo_fibonacci(n-1, memo) + memo_fibonacci(n-2, memo)
    return memo[n]

#Implementation of fibonacci function using tabulation
def tab_fibonacci(n):
    if n <= 0 or not isinstance(n, int):
        #Raises a Value error if the value entered is not an integer greater than 0
        raise ValueError("Only positive non-zero integers can be used!") 
    
    if n == 1 or n == 2:
        return 1
    
    # Create a table to store Fibonacci numbers up to n
    prev_2, prev = 0, 1
    for _ in range(2, n + 1):
        current = prev + prev_2
        prev_2, prev = prev, current
    
    return current