import unittest
from backend.algorithms.fibonacci import fibonacci_recursive_trace, fibonacci_memo_trace, fibonacci_tab_trace


FIBONACCI_TEST_CASES = [
    (0 , 0),
    (1, 1),
    (2, 1),
    (5, 5),
    (8, 21),
    (10, 55),
]


class fibonacciTest(unittest.TestCase):
    
    
    ''' Tests for Fibonacci implementation each test goes over the recursive, memoisation and tabulation versions'''
    
    def test_fibonacci_tab_zero_case(self):
        trace = fibonacci_tab_trace(0)
        self.assertEqual(len(trace), 1)
        self.assertEqual(trace[0]['type'], 'final_result')
        self.assertEqual(trace[0]['result'], 0)
        
        
    def test_fibonacci_recursive(self):
       for n, expected_result in FIBONACCI_TEST_CASES:
           with self.subTest(n=n):
               trace = fibonacci_recursive_trace(n)
               self.assertEqual(trace[-1]['result'], expected_result)
               self.assertIsInstance(trace, list)
               self.assertTrue(all(isinstance(item, dict) for item in trace))
       
    def test_fibonacci_memo(self):
       for n, expected_result in FIBONACCI_TEST_CASES:
           with self.subTest(n=n):
               trace = fibonacci_memo_trace(n)
               self.assertEqual(trace[-1]['result'], expected_result)
               self.assertIsInstance(trace, list)
               self.assertTrue(all(isinstance(item, dict) for item in trace))
    
    
    def test_fibonacci_tabulation(self):
       for n, expected_result in FIBONACCI_TEST_CASES:
           with self.subTest(n=n):
               trace = fibonacci_tab_trace(n)
               self.assertEqual(trace[-1]['result'], expected_result)
               self.assertIsInstance(trace, list)
               self.assertTrue(all(isinstance(item, dict) for item in trace))