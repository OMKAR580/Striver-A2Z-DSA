// ========================================================
// Problem: Set Matrix Zeroes
// Link: https://takeuforward.org/practice/dsa/set-matrix-zeroes
// Date: 2026-10-19
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m=matrix.size();//outer vector row ka size..
        int n=matrix[0].size();//inner matrix ke column ka size..
        vector<int>row(m,0);
        vector<int>col(n,0);
        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                if(matrix[i][j]==0){
                    row[i]=1;
                    col[j]=1;
                }
            }
        }
        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                if(row[i]==1 || col[j]==1){
                    matrix[i][j]=0;
                }
            }
        }
    }
};