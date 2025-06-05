import unittest
from backend.algorithms.lcs import recursive_lcs, memo_lcs, tab_lcs

class lcsTest(unittest.TestCase):
    
    ''' Tests for Longest Common Subsequence implementation each test goes over the recursive, memoisation and tabulation
    versions for the following cases:
    1. Expected values
    2. Empty String
    3. No common subsequence
    4. Single character handling
    5. Identical string handling '''
    
    def test_correct_value_returned(self):
        s1 = "ABCBDAB"
        s2 = "BDCAB"
        self.assertEqual(recursive_lcs(s1, s2), 4)
        self.assertEqual(memo_lcs(s1, s2), 4)
        self.assertEqual(tab_lcs(s1, s2), 4)
        

    def test_empty_strings(self):
        self.assertEqual(recursive_lcs("", ""), 0)
        self.assertEqual(recursive_lcs("ABC", ""), 0)
        self.assertEqual(recursive_lcs("", "BAC"), 0)
        
        self.assertEqual(memo_lcs("", ""), 0)
        self.assertEqual(memo_lcs("ABC", ""), 0)
        self.assertEqual(memo_lcs("", "BAC"), 0)
        
        self.assertEqual(tab_lcs("", ""), 0)
        self.assertEqual(tab_lcs("ABC", ""), 0)
        self.assertEqual(tab_lcs("", "BAC"), 0)
    
    def test_no_common_subsequence(self):
        s1 = "ABCDAB"
        s2 = "XYZ"
        self.assertEqual(recursive_lcs(s1, s2), 0)
        self.assertEqual(memo_lcs(s1, s2), 0)
        self.assertEqual(tab_lcs(s1, s2), 0)
        
    def test_identical_strings(self):
        s = "ABCDAB"
        self.assertEqual(recursive_lcs(s, s), len(s))
        self.assertEqual(memo_lcs(s, s), len(s))
        self.assertEqual(tab_lcs(s, s), len(s))
    
    def test_single_matching_character_handling(self):
        self.assertEqual(recursive_lcs("A", "A"), 1)
        self.assertEqual(recursive_lcs("A", "B"), 0)
        
        self.assertEqual(memo_lcs("A", "A"), 1)
        self.assertEqual(memo_lcs("A", "B"), 0)
        
        self.assertEqual(tab_lcs("A", "A"), 1)
        self.assertEqual(tab_lcs("A", "B"), 0)
    
    def test_single_mismatching_character_handling(self):
        self.assertEqual(recursive_lcs("A", "B"), 0)
        self.assertEqual(memo_lcs("A", "B"), 0)
        self.assertEqual(tab_lcs("A", "B"), 0)
   
    
   