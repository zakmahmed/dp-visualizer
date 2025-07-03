import React from 'react'
import { Children } from 'react';

//Wrapper component for consistent code styling
const CodeBlock = ({ children }) => (
    <pre className='text-sm bg-gray-900 text-left p-4 rounded-md overflow-x-auto h-full text-gray-300'>
        <code>{String(children).trim()}</code>
    </pre>
);

//Fibonacci components
export const FibRecursive = () => <CodeBlock> {`
def fib(k):
    if k <= 1:
        return k
    return fib(k - 1) + fib(k - 2)
`}
</CodeBlock>;

export const FibMemo = () => <CodeBlock> {`
memo = {}
def fib(k):
    if k in memo:
        return memo[k]
    if k <= 1:
        return k
    result = fib(k - 1) + fib(k - 2)
    memo[k] = result
    return result
`}
</CodeBlock>;

export const FibTabCode = () => <CodeBlock> {`
def fib(n):
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
return dp[n]
`}
</CodeBlock>;

//Knapsack Components
export const KnapRecursive = () => <CodeBlock>{`
def knapsack(n, capacity):
    if n <= 0 or capacity <= 0:
        return 0
    if weights[n] > capacity:
        return knapsack(n - 1, capacity)
    return max(knapsack (n - 1, capacity - weights[n]))
`}</CodeBlock>

export const KnapMemo = () => <CodeBlock>{`
def knapsack_memoization(i, capacity):
    if memo[n][capacity] is not None:
        return memo[n][capacity]
    
    if i <= 0 or capacity == 0:
        result = 0
    elif weights[n-1] > capacity:
        result = knapsack_memoization(capacity, n-1)
    else:
        include_item = values[n-1] + knapsack_memoization(capacity-weights[n-1], n-1)
        exclude_item = knapsack_memoization(n-1, capacity)
        result = max(include_item, exclude_item)

    memo[n][capacity] = result
    return result
`}</CodeBlock>

export const KnapTab = () => <CodeBlock>{`
def knapsack(weights, values, capacity)
    n = len(values)
    tab = [[0]*(capacity + 1) for y in range(n + 1)]

    for i in range(1, n+1):
        for w in range(1, capacity+1):
            if weights[i-1] <= w:
                include_item = values[i-1] + tab[i-1][w-weights[i-1]]
                exclude_item = tab[i-1][w]
                tab[i][w] = max(include_item, exclude_item)
            else:
                tab[i][w] = tab[i-1][w]

    return tab[n][capacity]
`}</CodeBlock>

// LCS Components

export const LCSRecursive = () => <CodeBlock>{`
def lcs(s1, s2, m, n):

    if m == 0 or n == 0:
       return 0;
    elif s1[m-1] == s2[n-1]:
       return 1 + lcs(X, Y, m-1, n-1);
    else:
       return max(lcs(X, Y, m, n-1), lcs(X, Y, m-1, n));


`}</CodeBlock>

export const LCSMemo = () => <CodeBlock>{`
def lcs(s1, s2, m, n, memo={}):
    state = (m, n)
    if state in memo:
        return memo[state]
    if m == 0 or n == 0:
       return 0;
    elif s1[m-1] == s2[n-1]:
       result = 1 + lcs(X, Y, m-1, n-1);
    else:
       result = max(lcs(X, Y, m, n-1, memo), lcs(X, Y, m-1, n, memo));
    
    memo[state] = result
    return result

`}</CodeBlock>

export const LCSTab = () => <CodeBlock>{`
def lcs(s1, s2):
    m, n = len(s1, s2)
    dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
`}</CodeBlock>