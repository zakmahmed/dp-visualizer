import unittest
from backend.algorithms.fibonacci import recursive_fibonacci, memo_fibonacci, tab_fibonacci

class fibonacciTest(unittest.TestCase):
    def test_recursive_fibonacci_zero_case(self):
        with self.assertRaises(ValueError):
            self.recursive_fib_return = recursive_fibonacci(0)
        
        
    def test_recursive_fibonacci_base_case_1(self):
        self.recursive_fib_return = recursive_fibonacci(1)
        assert self.recursive_fib_return == 1
        
    def test_recursive_fibonacci_negative_case(self):
        with self.assertRaises(ValueError):
            self.recursive_fib_return = recursive_fibonacci(-400)
        
        
    def test_recursive_fibonacci_positive_integer_case(self):
        self.returned_value = recursive_fibonacci(5)
        assert self.returned_value == 5
        
    def test_recursive_fibonacci_large_positive_integer_case(self):
        self.returned_value = recursive_fibonacci(30)
        assert self.returned_value == 832040
    
    
    def test_memo_fibonacci_zero_case(self):
        with self.assertRaises(ValueError):
            self.recursive_fib_return = memo_fibonacci(0)
        
    def test_memo_fibonacci_base_case_1(self):
        self.recursive_fib_return = memo_fibonacci(1)
        assert self.recursive_fib_return == 1
        
    def test_memo_fibonacci_negative_case(self):
        with self.assertRaises(ValueError):
            self.recursive_fib_return = memo_fibonacci(-400)
        
        
    def test_memo_fibonacci_positive_integer_case(self):
        self.returned_value = memo_fibonacci(5)
        assert self.returned_value == 5
        
    def test_memo_fibonacci_large_positive_integer_case(self):
        self.returned_value = memo_fibonacci(30)
        assert self.returned_value == 832040
        
        
    def test_tab_fibonacci_zero_case(self):
        with self.assertRaises(ValueError):
            self.recursive_fib_return = tab_fibonacci(0)
        
    def test_tab_fibonacci_base_case_1(self):
        self.recursive_fib_return = tab_fibonacci(1)
        assert self.recursive_fib_return == 1
        
    def test_tab_fibonacci_negative_case(self):
        with self.assertRaises(ValueError):
            self.recursive_fib_return = tab_fibonacci(-400)
        
        
    def test_tab_fibonacci_positive_integer_case(self):
        self.returned_value = tab_fibonacci(5)
        assert self.returned_value == 5
        
    def test_tab_fibonacci_large_positive_integer_case(self):
        self.returned_value = tab_fibonacci(30)
        assert self.returned_value == 832040