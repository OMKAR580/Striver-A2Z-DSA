// ========================================================
// Problem: Rotate matrix by 90 degrees
// Link: https://takeuforward.org/practice/dsa/rotate-matrix-by-90-degrees?sidebar=0
// Date: 2026-10-19
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    void rotateMatrix(vector<vector<int>>& matrix) {
       int n=matrix.size();
       //transpose...
       for(int i=0;i<n;i++){
        for(int j=i+1;j<n;j++){
            swap(matrix[i][j],matrix[j][i]);
        }
       }
       //reverse...
       for(int i=0;i<n;i++){
        reverse(matrix[i].begin(),matrix[i].end());
       }

    }
};