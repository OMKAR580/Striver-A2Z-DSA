// ========================================================
// Problem: Print the matrix in spiral manner
// Link: https://takeuforward.org/practice/dsa/print-the-matrix-in-spiral-manner
// Date: 2026-10-03
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        int n=matrix.size();
        int m=matrix[0].size();
        int top=0,bottom=n-1,left=0,right=m-1;
        vector<int>anu;
        while(top<=bottom && left<=right){
        //right
        for(int i=left;i<=right;i++){
            anu.push_back(matrix[top][i]);
        }
        top++;
        //bottom
        for(int i=top;i<=bottom;i++){
            anu.push_back(matrix[i][right]);
        }
        right--;
        if(top<=bottom){
            //left
            for(int i=right;i>=left;i--){
                anu.push_back(matrix[bottom][i]);
            }
            bottom--;
        }
        if(left<=right){
            //top
            for(int i=bottom;i>=top;i--){
                anu.push_back(matrix[i][left]);
            }
            left++;
        }
    }
    return anu;
    }
};