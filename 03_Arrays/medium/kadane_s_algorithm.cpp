// ========================================================
// Problem: Kadane's Algorithm
// Link: https://takeuforward.org/practice/dsa/kadane's-algorithm
// Date: 2026-10-23
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        long long sum=0,max=LONG_MIN;
        for(int i=0;i<nums.size();i++){
            sum=sum+nums[i];
            if(sum>max){
                max=sum;
            }
            if(sum<0){
                sum=0;
            }
        }
        return max;
    }
};