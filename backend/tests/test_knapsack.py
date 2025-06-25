import unittest
from backend.algorithms.knapsack import knapsack_recursive_trace, knapsack_memo_trace, knapsack_tab_trace


class knapsackTest(unittest.TestCase):
    
    
    def setUp(self):
        self.weights = [10, 20, 30]
        self.values = [60, 100, 120]
        self.capacity = 50
        
        self.expected_max_value = 220
        self.expected_items = [1, 2]
    
    
    ''' Tests for Fibonacci implementation each test goes over the recursive, memoisation and tabulation versions'''
    
    def test_zero_capacity_case(self):
        trace_rec = knapsack_recursive_trace(self.weights, self.values, 0)
        self.assertEqual(trace_rec[-1]['result'], 0)
        
        trace_mem = knapsack_memo_trace(self.weights, self.values, 0)
        self.assertEqual(trace_mem[-1]['result'], 0)
        
        trace_tab = knapsack_tab_trace(self.weights, self.values, 0)
        self.assertEqual(trace_tab[-1]['result'], 0)
        self.assertEqual(trace_tab[-1]['included_items'], [])
        
    
    def test_zero_items_case(self):
        trace_rec = knapsack_recursive_trace([], [], self.capacity)
        self.assertEqual(trace_rec[-1]['result'], 0)
        
        trace_mem = knapsack_memo_trace([], [], self.capacity)
        self.assertEqual(trace_mem[-1]['result'], 0)
        
        trace_tab = knapsack_tab_trace([], [], self.capacity)
        self.assertEqual(trace_tab[-1]['result'], 0)
        self.assertEqual(trace_tab[-1]['included_items'], [])
        
        
        
    def test_knapsack_recursive(self):
       trace = knapsack_recursive_trace(self.weights, self.values, self.capacity)
       self.assertEqual(trace[-1]['result'], self.expected_max_value)
       self.assertIsInstance(trace, list)
       self.assertTrue(all(isinstance(item, dict) for item in trace))
       
    def test_knapsack_memo(self):
       trace = knapsack_memo_trace(self.weights, self.values, self.capacity)
       self.assertEqual(trace[-1]['result'], self.expected_max_value)
       self.assertIsInstance(trace, list)
       self.assertTrue(all(isinstance(item, dict) for item in trace))
    
    
    def test_knapsack_tab(self):
       trace = knapsack_tab_trace(self.weights, self.values, self.capacity)
       self.assertEqual(trace[-1]['result'], self.expected_max_value)
       self.assertEqual(trace[-1]['type'], 'traceback_complete')
       self.assertListEqual(sorted(trace[-1]['included_items']), sorted(self.expected_items))