import unittest
from backend.algorithms.lcs import lcs_recursive_trace, lcs_memo_trace, lcs_tab_trace


class LCSTest(unittest.TestCase):
    
    
    def setUp(self):
        self.s1 = "AGGTAB"
        self.s2 = "GXTXAYB"
        
        
        self.expected_lcs_len = 4
        self.expected_lcs = "GTAB"
    
    
    ''' Tests for LCS implementation each test goes over the recursive, memoisation and tabulation versions'''
    
    def test_empty_strings(self):
                
        # test with one empty string
        trace_rec = lcs_recursive_trace("", self.s2)
        self.assertEqual(trace_rec[-1]['result'], 0)
        
        trace_memo = lcs_memo_trace("", self.s2)
        self.assertEqual(trace_memo[-1]['result'], 0)
        
        trace_tab = lcs_tab_trace("", self.s2)
        self.assertEqual(trace_tab[-1]['result_length'], 0)
        
        
        # test with both empty string
        trace_rec = lcs_recursive_trace("", "")
        self.assertEqual(trace_rec[-1]['result'], 0)
        
        trace_memo = lcs_memo_trace("", "")
        self.assertEqual(trace_memo[-1]['result'], 0)
        
        trace_tab = lcs_tab_trace("", "")
        self.assertEqual(trace_tab[-1]['result_length'], 0)
        
    
    def test_no_common_subsequence(self):
        
        s1 = "ABC"
        s2 = "DEF"
        
        trace_rec = lcs_recursive_trace(s1, s2)
        self.assertEqual(trace_rec[-1]['result'], 0)
        
        trace_memo = lcs_memo_trace(s1, s2)
        self.assertEqual(trace_memo[-1]['result'], 0)
        
        trace_tab = lcs_tab_trace(s1, s2)
        self.assertEqual(trace_tab[-1]['result_length'], 0)
        
        
        
    def test_lcs_recursive(self):
       trace = lcs_recursive_trace(self.s1, self.s2)
       
       self.assertEqual(trace[-1]['result'], self.expected_lcs_len)
       self.assertIsInstance(trace, list)
       self.assertTrue(all(isinstance(item, dict) for item in trace))
       
    def test_lcs_memo(self):
       trace = lcs_memo_trace(self.s1, self.s2)
       
       self.assertEqual(trace[-1]['result'], self.expected_lcs_len)
       self.assertIsInstance(trace, list)
       self.assertTrue(all(isinstance(item, dict) for item in trace))
    
    
    def test_lcs_tab(self):
       trace = lcs_tab_trace(self.s1, self.s2)
       
       self.assertEqual(trace[-1]['type'], 'traceback_complete')
       self.assertEqual(trace[-1]['result_length'], self.expected_lcs_len)
       self.assertEqual(trace[-1]['result'], self.expected_lcs)
       
       self.assertIsInstance(trace, list)
       self.assertTrue(all(isinstance(item, dict) for item in trace))