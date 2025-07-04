import {
    FibRecursive, FibMemo, FibTabCode,
    KnapRecursive, KnapMemo, KnapTab,
    LCSRecursive, LCSMemo, LCSTab
} from '../components/codeSnippets.jsx'


// Main Exported Configuration

export const ALGO_CONFIG = {
    fibonacci : {
        name : 'Fibonacci',
        params : [{name: 'n', type: 'number', defaultValue: 5, min: 0, max: 30}],
        algorithms : ['recursive', 'memoization', 'tabulation'],
        code: {
            recursive : FibRecursive,
            memoization : FibMemo,
            tabulation : FibTabCode
        },
    },

    knapsack : {
        name : '0/1 Knapsack',
        params : [
            {name: 'weights', type: 'text', defaultValue: '10, 20, 30'},
            {name: 'values', type: 'text', defaultValue: '60, 100, 120'},
            {name: 'capacity', type: 'number', defaultValue: '50', min: 0, max: 200}
        ],
        algorithms : ['recursive', 'memoization', 'tabulation'],
        code: {
            recursive : KnapRecursive,
            memoization : KnapMemo,
            tabulation : KnapTab
        },
    },

    lcs : {
        name : 'Lowest Common Subsequence',
        params : [
            {name: 's1', type: 'text', defaultValue: 'AGGTAB'},
            {name: 's2', type: 'text', defaultValue: 'GXTXAYB'},
        ],
        algorithms : ['recursive', 'memoization', 'tabulation'],
        code: {
            recursive : LCSRecursive,
            memoization : LCSMemo,
            tabulation : LCSTab
        },
    },
};
