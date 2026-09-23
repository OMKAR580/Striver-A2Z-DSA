// ========================================================
// Problem: Rearrange array elements by sign
// Link: https://takeuforward.org/practice/dsa/rearrange-array-elements-by-sign
// Date: 2026-09-23
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    vector<int> rearrangeArray(vector<int>& nums) {
        int b=nums.size();
        vector<int>anu(b);
        int p=0;
        int n=1;
        for(int i=0;i<nums.size();i++){
            if(nums[i]>0){
                anu[p]=nums[i];
                p=p+2;
            }
            else{
                anu[n]=nums[i];
                n=n+2;
            }
        }
        return anu;
        
    }
};