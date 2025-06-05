import unittest
from backend.algorithms.fibonacci import recursive_fibonacci, memo_fibonacci, tab_fibonacci

class fibonacciTest(unittest.TestCase):
    
    
    ''' Tests for Fibonacci implementation each test goes over the recursive, memoisation and tabulation
    versions for the following cases:
    1. Expected Values
    2. Base case Value (1)
    3. Base case Value (2)
    4. Large Expected Value
    5. Zero Value
    6. Negative Value
    7. Empty Input Value'''
    
    def test_fibonacci_zero_case(self):
        with self.assertRaises(ValueError):
            recursive_fibonacci(0)
            memo_fibonacci(0)
            tab_fibonacci(0)
        
        
    def test_fibonacci_base_case_1(self):
        self.assertEqual(recursive_fibonacci(1), 1)
        self.assertEqual(memo_fibonacci(1), 1)
        self.assertEqual(tab_fibonacci(1), 1)
    
    def test_fibonacci_base_case_2(self):
        self.assertEqual(recursive_fibonacci(2), 1)
        self.assertEqual(memo_fibonacci(2), 1)
        self.assertEqual(tab_fibonacci(2), 1)
        
        
    def test_fibonacci_negative_case(self):
        with self.assertRaises(ValueError):
            self.recursive_return = recursive_fibonacci(-400)
            self.memo_return = memo_fibonacci(-400)
            self.tab_return = tab_fibonacci(-400)
        
        
    def test_fibonacci_positive_integer_case(self):
        self.assertEqual(recursive_fibonacci(5), 5)
        self.assertEqual(memo_fibonacci(5), 5)
        self.assertEqual(tab_fibonacci(5), 5)
        
    def test_fibonacci_large_positive_integer_case(self):
       self.assertEqual(recursive_fibonacci(30), 832040)
       self.assertEqual(memo_fibonacci(30), 832040)
       self.assertEqual(tab_fibonacci(30), 832040)
       
    def test_empty_input(self):
         with self.assertRaises(ValueError):
            self.recursive_return = recursive_fibonacci(-400)
            self.memo_return = memo_fibonacci(-400)
            self.tab_return = tab_fibonacci(-400)
    
    
    