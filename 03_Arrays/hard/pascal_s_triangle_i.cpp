// ========================================================
// Problem: Pascal's Triangle I
// Link: https://takeuforward.org/practice/dsa/pascals-triangle-i
// Date: 2026-10-05
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    int pascalTriangleI(int r, int c) {
            long long anu=1;
            int r1=r-1;
            int c1=c-1;
        for(int i=0;i<c1;i++){
            anu=anu*(r1-i);
            anu=anu/(i+1);
        }
        return anu;
        
    }
};