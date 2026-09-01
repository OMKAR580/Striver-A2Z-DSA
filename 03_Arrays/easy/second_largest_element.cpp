// ========================================================
// Problem: Second Largest Element
// Link: https://takeuforward.org/plus/dsa/problems/second-largest-element?source=strivers-a2z-dsa-track
// Date: 2026-09-01
// Striver's A2Z DSA Sheet Solution
// ========================================================

            if(nums[i]<=nums[i+1] && nums[i+1]>=max){
                max=nums[i+1];
            }
        }
        for(int i=0;i<nums.size()-1;i++){
            if(nums[i]>=nums[i+1] && nums[i+1]<max && nums[i+1]>sec_max){
        for(int i=0;i<nums.size()-1;i++){
        int sec_max=-1;
        int max=0;
    int secondLargestElement(vector<int>& nums) {
public:
class Solution {