import unittest
from backend.algorithms.knapsack import recursive_knapsack, memo_knapsack, tab_knapsack



# Helper Function

def run_functions(capacity, items, weights):
    
    num_items = len(items)
    return {
        "recursive" : recursive_knapsack(capacity, items, weights, num_items),
        "memoization" : memo_knapsack(capacity, items, weights, num_items),
        "tabulation" : tab_knapsack(capacity, items, weights, num_items)
    }

class fibonacciTest(unittest.TestCase):
    
    
    ''' Tests for Zero/One Knapsack implementation, each test goes over the recursive, memoisation and tabulation
    versions for the following cases:
    1. Expected Values
    2. Base case Value (1 item)
    4. Large Capacity
    5. No Items
    6. No Capacity'''
    
    def setUp(self):
        self.capacity = 7
        self.weights = [1, 3, 4, 5]
        self.items = [1, 4, 5, 7]
        
    
    def test_expected_value_input(self):
        self.output = run_functions(self.capacity, self.items, self.weights)

        self.assertEqual(self.output["recursive"], 9)
        self.assertEqual(self.output["memoization"], 9)
        self.assertEqual(self.output["tabulation"], 9)
    
    def test_one_item_input(self):
        self.items = [4]
        self.weights = [1]
        self.output = run_functions(self.capacity, self.items, self.weights)

        self.assertEqual(self.output["recursive"], 4)
        self.assertEqual(self.output["memoization"], 4)
        self.assertEqual(self.output["tabulation"], 4)
        
    def test_no_item_input(self):
        self.items = []
        self.weights = []
        self.output = run_functions(self.capacity, self.items, self.weights)

        self.assertEqual(self.output["recursive"], 0)
        self.assertEqual(self.output["memoization"], 0)
        self.assertEqual(self.output["tabulation"], 0)
        
    def test_no_capacity_input(self):
        self.capacity = 0
        self.output = run_functions(self.capacity, self.items, self.weights)

        self.assertEqual(self.output["recursive"], 0)
        self.assertEqual(self.output["memoization"], 0)
        self.assertEqual(self.output["tabulation"], 0)
        
    def test_no_capacity_input(self):
        self.capacity = 500
        self.output = run_functions(self.capacity, self.items, self.weights)

        self.assertEqual(self.output["recursive"], 17)
        self.assertEqual(self.output["memoization"], 17)
        self.assertEqual(self.output["tabulation"], 17)
    