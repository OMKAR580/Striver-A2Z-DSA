// ========================================================
// Problem: Single Number - I
// Link: https://takeuforward.org/plus/dsa/problems/single-number---i?source=strivers-a2z-dsa-track
// Date: 2026-09-09
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution{    
public:    
    int singleNumber(vector<int>& nums){
       int xorr=0;
       for(int i=0;i<nums.size();i++){
        xorr=xorr^nums[i];
       }
       return xorr;
    }
};