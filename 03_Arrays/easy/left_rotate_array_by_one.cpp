// ========================================================
// Problem: Left Rotate Array by One
// Link: https://takeuforward.org/plus/dsa/problems/left-rotate-array-by-one?source=strivers-a2z-dsa-track
// Date: 2026-09-15
// Striver's A2Z DSA Sheet Solution
// ========================================================

class Solution {
public:
    void rotateArrayByOne(vector<int>& nums) {
        int k=0;
        int a=nums[0];
        for(int i=0;i<nums.size();i++){
            if(i!=nums.size()-1){
                nums[k]=nums[i+1];
                k++;
            }
            else if(i==nums.size()-1){
                nums[k]=a;
            }
        }
    }
};