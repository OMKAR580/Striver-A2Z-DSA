// ========================================================
// Problem: Largest Element
// Link: https://takeuforward.org/plus/dsa/problems/largest-element?source=strivers-a2z-dsa-track
// Date: 2026-09-01
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    int largestElement(vector<int>& nums) {
        int max=0;
        for(int i=0;i<nums.size()-1;i++){
            if(nums[i]<=nums[i+1] && nums[i+1]>=max){
                max=nums[i+1];
            }
        }
        return max;
    }
};