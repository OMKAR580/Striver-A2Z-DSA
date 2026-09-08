// ========================================================
// Problem: Remove duplicates from sorted array
// Link: https://takeuforward.org/plus/dsa/problems/remove-duplicates-from-sorted-array?source=strivers-a2z-dsa-track
// Date: 2026-08-31
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int k=1;
        for(int i=1;i<nums.size();i++){
            if(nums[i]!=nums[i-1]){
                nums[k]=nums[i];
                k++;
            }
        }
        return k;
    }
};