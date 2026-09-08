// ========================================================
// Problem: Check if the Array is Sorted II
// Link: https://takeuforward.org/plus/dsa/problems/check-if-the-array-is-sorted-ii?source=strivers-a2z-dsa-track
// Date: 2026-09-08
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution{ 
    public:
        bool isSorted(vector<int>& nums){
            int flag=0;
            for(int i=0;i<nums.size()-1;i++){
                if(nums[i]<=nums[i+1]){
                    flag++;
                }
            }
            if(flag==nums.size()-1){
                return true;
            }