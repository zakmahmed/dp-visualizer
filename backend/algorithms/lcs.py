#Returns length of lowest common subsequence between two strings:
#string1 of length length_s1
#string2 of length length_s2

#Implementation of lowest common subsequence function using recursion
def recursive_lcs(string1, string2, length_s1 = None, length_s2 = None):
    #if lengths are not provided find the values from the strings provided
    if length_s1 is None:
        length_s1 = len(string1)
        
    if length_s2 is None:
        length_s2 = len(string2)
    
    #Base case: If either string is empty return 0
    if length_s1 == 0 or length_s2 == 0:
        return 0
    
    #If the last characters of both substrings match add it into the longest common substring and recur
    if string1[length_s1 - 1] == string2[length_s2 - 1]:
        return 1 + recursive_lcs(string1, string2, length_s1 - 1, length_s2 - 1)
    
    #if they do not match recur and take the maximum for the cases:
    # when the last character of string1 is excluded and 
    # when the last character of string2 is excluded
    else:
        return max(recursive_lcs(string1, string2, length_s1, length_s2 - 1), recursive_lcs(string1, string2, length_s1 - 1, length_s2))
    

#Implementation of lowest common subsequence function using memoisation
def memo_lcs(string1, string2, length_s1 = None, length_s2 = None, memo = None):
    #if lengths are not provided find the values from the strings provided
    if length_s1 is None:
        length_s1 = len(string1)
        
    if length_s2 is None:
        length_s2 = len(string2)
        
    #if memoization table is None create one
    if memo is None:
        memo = [[-1 for _ in range(length_s2 + 1)] for _ in range(length_s1 + 1)]
    
    #Base case: If either string is empty return 0
    if length_s1 == 0 or length_s2 == 0:
        return 0
    
    #if it already exists in the memoization table return it
    if memo[length_s1][length_s2] != -1:
        return memo[length_s1][length_s2]
    
    #If the last characters of both substrings match add it into the longest common substring and recur
    if string1[length_s1 - 1] == string2[length_s2 - 1]:
        memo[length_s1][length_s2] =  1 + memo_lcs(string1, string2, length_s1 - 1, length_s2 - 1)
        return memo[length_s1][length_s2]
    
    #if they do not match recur and take the maximum for the cases:
    # when the last character of string1 is excluded and 
    # when the last character of string2 is excluded
    else:
        memo[length_s1][length_s2] = max(memo_lcs(string1, string2, length_s1, length_s2 - 1), memo_lcs(string1, string2, length_s1 - 1, length_s2))
    
    return memo[length_s1][length_s2]

#Implementation of lowest common subsequence function using space optimized tabulation
def tab_lcs(string1, string2, length_s1 = None, length_s2 = None, memo = None):
    #if lengths are not provided find the values from the strings provided
    if length_s1 is None:
        length_s1 = len(string1)
        
    if length_s2 is None:
        length_s2 = len(string2)
        
    #Base case: If either string is empty return 0
    if length_s1 == 0 or length_s2 == 0:
        return 0
        
    #Initialize prev and current
    prev = [0] * (length_s1 + 1)
    current = [0] * (length_s1 + 1)
    
    #Loop through the characters of both strings to compute Lowest Common Subsequence
    for i in range(1, length_s1 + 1):
        for j in range(1, length_s2 + 1):
            if string1[i - 1] == string2[j - 1]:
                #if characters match increment lowest common subsequence by 1
                current[j] = 1 + prev[j - 1]
            else:
                #if the characters don't match take the maximum of lowest common subsequence by excluding one
                #character from string1 or string2
                current[j] = max(prev[j], current[j - 1])
                
        #update prev to be the same as current
        prev = current[:]
        
    return prev[length_s2]