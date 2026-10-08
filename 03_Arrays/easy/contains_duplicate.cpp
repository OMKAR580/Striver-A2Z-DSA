// ========================================================
// Problem: Contains Duplicate
// Link: https://leetcode.com/problems/contains-duplicate/submissions/2166185937/
// Date: 2026-10-08
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        for(int i=1;i<nums.size();i++){
            if(nums[i]==nums[i-1]){
                return true;
            }
        }
        return false;
    }
};