// ========================================================
// Problem: Pascal's Triangle III
// Link: https://takeuforward.org/practice/dsa/pascals-triangle-iii
// Date: 2026-10-05
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    vector<vector<int>> pascalTriangleIII(int n) {
        vector<vector<int>>anu;
        for(int i=1;i<=n;i++){
            anu.push_back(rowgen(i));
        }
        return anu;

    }
     vector<int> rowgen(int r) {
        vector<int>anu;
        long long ans=1;
        anu.push_back(1);
        for(int i=1;i<r;i++){
            ans=ans*(r-i);
            ans=ans/i;
            anu.push_back((int)ans);
        }
        return anu;

    }
};