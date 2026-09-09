// ========================================================
// Problem: Maximum Consecutive Ones
// Link: https://takeuforward.org/plus/dsa/problems/maximum-consecutive-ones?source=strivers-a2z-dsa-track
// Date: 2026-09-09
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    int findMaxConsecutiveOnes(vector<int>& nums) {
        int maxi=0;
        int count=0;
        for(int i=0;i<nums.size();i++){
            if(nums[i]==1){
                count++;
                maxi=max(maxi,count);
            }
            else{
                count=0;
            }
        }
        return maxi;
    }
};