// ========================================================
// Problem: Majority Element-I
// Link: https://takeuforward.org/practice/dsa/majority-element-i
// Date: 2026-09-22
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int n=nums.size()/2;
        unordered_map<int,int>freq;
        for(int i:nums){
            freq[i]++;
        }
        int a=-1;
        for(auto x:freq){
            if(x.second>n){
                a=x.first;
            }
        }
        return a;
        
    }
};